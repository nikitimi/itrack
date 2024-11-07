import type GradeInfo from '@/utils/types/gradeInfo';

import { NextRequest, NextResponse } from 'next/server';

import { collection } from '@/server/utils/mongodb';
import { WRONG_NUMBER } from '@/utils/constants';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import url from 'url';
import { MongoExtra } from '@/lib/schema/mongoExtra';

const gradeCollection = collection('Grades');

export async function POST(request: NextRequest) {
  const response: BaseAPIResponse<string> = {
    data: '',
    errorMessage: [],
  };
  try {
    const grades = (await request.json()) as GradeInfo;
    const date = new Date();
    const gradeInsertion = await gradeCollection.insertOne({
      ...grades,
      dateCreated: date.getTime(),
      dateModified: WRONG_NUMBER,
    });

    return NextResponse.json({
      ...response,
      data: `${gradeInsertion.acknowledged}\n${gradeInsertion.insertedId}`,
    });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json({ ...response, errorMessage: [error.message] });
  }
}

export async function GET(request: NextRequest) {
  const response: BaseAPIResponse<(GradeInfo & MongoExtra)[]> = {
    data: [],
    errorMessage: [],
  };
  try {
    const parameters = url.parse(request.url, true).query as Record<
      'studentNumber' | 'role',
      string
    >;
    console.log(parameters.role);

    if (parameters.role === 'admin') {
      const adminGetGrades = (await gradeCollection
        .find()
        .toArray()) as unknown as (GradeInfo & MongoExtra)[];
      const studentNumbers = Array.from(
        new Set(adminGetGrades.flatMap((s) => s.studentNumber))
      );
      const filteredGradesByStudentNumber = studentNumbers.map((v) => ({
        [v]: adminGetGrades.map(
          ({
            _id,
            academicYear,
            dateCreated,
            dateModified,
            semester,
            subjects,
            yearLevel,
          }) => ({
            _id,
            academicYear,
            dateCreated,
            dateModified,
            semester,
            subjects,
            yearLevel,
          })
        ),
      }));
      return NextResponse.json({
        ...response,
        data: filteredGradesByStudentNumber,
      } as BaseAPIResponse<
        Record<string, (Omit<GradeInfo, 'studentNumber'> & MongoExtra)[]>[]
      >);
    }

    const studentNumber = parameters.studentNumber;

    if (studentNumber === undefined) {
      throw new Error('No student number given.');
    }

    const grades = await gradeCollection.find({ studentNumber }).toArray();
    return NextResponse.json({ ...response, data: [...grades] });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}
