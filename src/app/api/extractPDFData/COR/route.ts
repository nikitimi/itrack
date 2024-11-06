import type { ExtractPDFDataCOR } from '@/lib/schema/extractPDFDataCOR';
import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import type { ExtractPDFDataCORResponse } from '@/server/lib/schema/apiResponse/extractPDFDataCOR';

import { EMPTY_STRING } from '@/utils/constants';
import regExp from '@/utils/regex';
import { NextRequest, NextResponse } from 'next/server';
import PDFParser, { type Output } from 'pdf2json';

export async function POST(
  request: NextRequest
): Promise<NextResponse<ExtractPDFDataCORResponse>> {
  const response: BaseAPIResponse<ExtractPDFDataCOR> = {
    data: {
      name: EMPTY_STRING,
      studentNumber: EMPTY_STRING,
    },
    errorMessage: [],
  };
  const formdata = request.formData();
  const file = (await formdata).get('file') as File | null;

  if (file === null) {
    return NextResponse.json(
      { ...response, errorMessage: ['You upload nothing.'] },
      { status: 400 }
    );
  }

  const pdfParser = new PDFParser(true);

  return new Promise((resolve) => {
    pdfParser.on('pdfParser_dataError', (errData) => {
      resolve(
        NextResponse.json(
          {
            ...response,
            errorMessage: [
              errData.parserError.message ?? 'PDF Parser data error.',
            ],
          },
          { status: 500 }
        )
      );
    });

    pdfParser.on('pdfParser_dataReady', (pdfData: Output) => {
      const uriEncodedRegExp = { comma: /%2C/g, colon: /%3A/g };
      const normalEncoding = { comma: ',', colon: ':' };
      let allTextFromPDF = EMPTY_STRING;
      const isValidCORSign =
        'C E R T I F I C A T E  O F  R E G I S T R A T I O N';
      let studentNameCounter = 0;

      pdfData.Pages.forEach((page) => {
        page.Texts.forEach((text) => {
          const decodedText = `${decodeURI(text.R[0].T).replace(
            uriEncodedRegExp.colon,
            normalEncoding.colon
          )}`;
          allTextFromPDF += ` ${decodedText}`;

          if (regExp.studentNumber.test(decodedText)) {
            response.data = { ...response.data, studentNumber: decodedText };
          }

          if (regExp.names.test(decodedText) && studentNameCounter === 0) {
            studentNameCounter += 1;
            const normalizedName = decodedText.replace(
              uriEncodedRegExp.comma,
              normalEncoding.comma
            );
            response.data = { ...response.data, name: normalizedName };
          }
        });
      });

      if (!allTextFromPDF.includes(isValidCORSign)) {
        return resolve(
          NextResponse.json(
            {
              ...response,
              errorMessage: [
                "You've uploaded a invalid COR, please upload the proper document.",
              ],
            },
            { status: 400 }
          )
        );
      }

      for (const keys of Object.values(response.data)) {
        if (keys === EMPTY_STRING) {
          return resolve(
            NextResponse.json(
              {
                ...response,
                errorMessage: ['Error in getting student details.'],
              },
              { status: 400 }
            )
          );
        }
      }

      resolve(NextResponse.json(response));
    });

    file
      .arrayBuffer()
      .then((arrayBuffer) => pdfParser.parseBuffer(Buffer.from(arrayBuffer)));
  });
}
