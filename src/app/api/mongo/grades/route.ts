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
    const studentNumber = url.parse(request.url, true).query
      .studentNumber as string;
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
