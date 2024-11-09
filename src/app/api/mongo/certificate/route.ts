import { NextRequest, NextResponse } from 'next/server';

import type { Certificate } from '@/lib/enums/certificate';
import type { MongoExtra } from '@/lib/schema/mongoExtra';

import url from 'url';

import { collection } from '@/server/utils/mongodb';
import { EMPTY_STRING, HEADER_KEY, WRONG_NUMBER } from '@/utils/constants';
import { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import { clerkClient } from '@clerk/nextjs/server';

const certificateCollection = collection('Certificates');
const clerk = await clerkClient();

export async function POST(request: NextRequest) {
  const response: BaseAPIResponse<string> = {
    data: '',
    errorMessage: [],
  };
  try {
    const { certificateList, studentNumber } = (await request.json()) as {
      certificateList: Certificate[];
      studentNumber: string;
    };

    const date = new Date();
    const certificateInsertion = await certificateCollection.insertOne({
      ...certificateList,
      studentNumber,
      dateCreated: date.getTime(),
      dateModified: WRONG_NUMBER,
    });

    return NextResponse.json({
      ...response,
      data: `${certificateInsertion.acknowledged}\n${certificateInsertion.insertedId}`,
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
  const response: BaseAPIResponse<(Certificate & MongoExtra)[]> = {
    data: [],
    errorMessage: [],
  };
  try {
    const uid = request.headers.get(HEADER_KEY.userId) as string | null;
    if (uid === null) throw new Error('Unauthorized.');
    const user = await clerk.users.getUser(uid);
    const isNotUser = user.primaryEmailAddress === null;
    if (isNotUser) throw new Error("User ID doesn't exists.");

    const studentNumber = url.parse(request.url, true).query
      .studentNumber as string;

    if (studentNumber !== user.publicMetadata.studentNumber) {
      throw new Error('No student number given.');
    }

    const certificate = await certificateCollection.findOne({ studentNumber });
    if (certificate === null) throw new Error('There is no certificate.');

    return NextResponse.json({ ...response, data: [certificate] });
  } catch (e) {
    const error = e as Error;
    return NextResponse.json(
      { ...response, errorMessage: [error.message] },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const payload = await request.json();
  const response: BaseAPIResponse<string> = {
    data: EMPTY_STRING,
    errorMessage: [],
  };

  if (payload.studentNumber === undefined) {
    return NextResponse.json({
      ...response,
      errorMessage: ['Student number is undefined.'],
    });
  }

  const date = new Date();
  const result = await certificateCollection.updateOne(
    { studentNumber: payload.studentNumber },
    { $set: { dateModified: date.getTime(), ...payload.certificateList } },
    { upsert: true }
  );

  return NextResponse.json({ ...response, data: JSON.stringify(result) });
}
