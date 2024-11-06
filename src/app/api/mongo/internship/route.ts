import type { InternshipResult } from '@/utils/types/internshipResult';

import { NextRequest, NextResponse } from 'next/server';
import url from 'url';

import { MongoExtra } from '@/lib/schema/mongoExtra';
import { collection } from '@/server/utils/mongodb';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { EMPTY_STRING, WRONG_NUMBER } from '@/utils/constants';

type InternshipData = Omit<InternshipResult, 'status'>;

const internshipCollection = collection('Internship');

export async function POST(request: NextRequest) {
  const response: BaseAPIResponse<string> = {
    data: EMPTY_STRING,
    errorMessage: [],
  };
  try {
    const internship = (await request.json()) as InternshipData &
      Pick<MongoExtra, 'studentNumber'>;
    const date = new Date();
    const gradeInsertion = await internshipCollection.insertOne({
      ...internship,
      dateCreated: date.getTime(),
      dateModified: WRONG_NUMBER,
    });

    return NextResponse.json({
      ...response,
      data: `${gradeInsertion.acknowledged}\n${gradeInsertion.insertedId}`,
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const response: BaseAPIResponse<InternshipData & MongoExtra> = {
    data: {
      _id: EMPTY_STRING,
      tasks: [],
      isITCompany: false,
      grade: '5.00',
      studentNumber: EMPTY_STRING,
      dateCreated: WRONG_NUMBER,
      dateModified: WRONG_NUMBER,
    },
    errorMessage: [],
  };
  const parameters = url.parse(request.url, true).query as Record<
    'studentNumber' | 'role',
    string
  >;

  try {
    const studentNumber = parameters.studentNumber;

    if (parameters.role === 'admin') {
      const adminGetGrades = (await internshipCollection
        .find()
        .toArray()) as unknown as (InternshipData & MongoExtra)[];
      const studentNumbers = Array.from(
        new Set(adminGetGrades.flatMap((s) => s.studentNumber))
      );
      const filteredInternshipByStudentNumber = studentNumbers.map((v) => ({
        [v]: adminGetGrades.map(
          ({ _id, dateCreated, dateModified, grade, isITCompany, tasks }) => ({
            _id,
            dateCreated,
            dateModified,
            grade,
            isITCompany,
            tasks,
          })
        ),
      }));
      return NextResponse.json({
        ...response,
        data: filteredInternshipByStudentNumber,
      } as BaseAPIResponse<Record<string, (InternshipData & MongoExtra)[]>[]>);
    }

    if (studentNumber === undefined) {
      throw new Error('No student number given.');
    }

    const internship = await internshipCollection.findOne({ studentNumber });

    if (internship === null)
      throw new Error(
        `Internship document under the student number: ${studentNumber} not found`
      );

    return NextResponse.json({
      ...response,
      data: internship,
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}
