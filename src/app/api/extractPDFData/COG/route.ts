import type { ParsingStatus } from '@/lib/enums/parsingStatus';
import type { ExtractPDFDataCOGResponse } from '@/server/lib/schema/apiResponse/extractPDFDataCOG';

import PDFParser, { type Output } from 'pdf2json';

import { EMPTY_STRING } from '@/utils/constants';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request
): Promise<NextResponse<ExtractPDFDataCOGResponse>> {
  let response: ExtractPDFDataCOGResponse = {
    data: {
      body: EMPTY_STRING,
      footer: EMPTY_STRING,
      header: EMPTY_STRING,
    },
    errorMessage: [],
  };

  try {
    const pdfParser = new PDFParser(true);
    const headerTexts: string[] = [];
    const bodyTexts: string[] = [];
    const footerTexts: string[] = [];

    const formdata = await request.formData();
    const documentHolder = formdata.get('file') as File | null;

    if (!documentHolder) {
      response = { ...response, errorMessage: ['No file provided.'] };
      return NextResponse.json(response, {
        status: 411,
      });
    }

    return new Promise((resolve) => {
      pdfParser.on('pdfParser_dataError', (errData) => {
        response = {
          ...response,
          errorMessage: [errData.parserError.message ?? EMPTY_STRING],
        };
        resolve(NextResponse.json(response, { status: 500 }));
      });

      pdfParser.on('pdfParser_dataReady', (pdfData: Output) => {
        const uriEncodedRegExp = { comma: /%2C/g, colon: /%3A/g };
        const normalEncoding = { comma: ',', colon: ':' };
        const endingSigns = { header: 'REMARKS', body: 'nothing follows' };

        pdfData.Pages.forEach((page) => {
          let parsingStatus: ParsingStatus = 'header';
          page.Texts.forEach((text) => {
            const decodedText = `${decodeURI(text.R[0].T).replace(
              uriEncodedRegExp.colon,
              normalEncoding.colon
            )} `;

            if (decodedText.includes(endingSigns.body)) {
              parsingStatus = 'footer';
            }

            switch (parsingStatus) {
              case 'header':
                headerTexts.push(decodedText);
                break;
              case 'body':
                bodyTexts.push(decodedText);
                break;
              case 'footer':
                footerTexts.push(decodedText);
                break;
            }

            if (decodedText.includes(endingSigns.header)) {
              parsingStatus = 'body';
            }
          });
        });

        /** Final result of extracted data from COG PDF. */
        const transactedData = {
          header: headerTexts
            .join(EMPTY_STRING)
            .replace(uriEncodedRegExp.comma, normalEncoding.comma)
            .trimEnd(),
          body: bodyTexts
            .join(EMPTY_STRING)
            .replace(uriEncodedRegExp.comma, normalEncoding.comma)
            .trimEnd(),
          footer: footerTexts
            .join(EMPTY_STRING)
            .replace(uriEncodedRegExp.comma, normalEncoding.comma)
            .trimEnd(),
        };

        response = {
          ...response,
          data: transactedData,
        };

        resolve(NextResponse.json(response));
      });

      documentHolder
        .arrayBuffer()
        .then((arrayBuffer) => pdfParser.parseBuffer(Buffer.from(arrayBuffer)));
    });
  } catch (e) {
    const error = e as Error;
    console.log(error.message);

    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 500 }
    );
  }
}
