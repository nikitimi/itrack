import type { GradeInfo } from '@/lib/schema/gradeInfo';
import type { MongoExtra } from '@/lib/schema/mongoExtra';
import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';

import { NextRequest, NextResponse } from 'next/server';
import url from 'url';

import { collection } from '@/server/utils/mongodb';
import { WRONG_NUMBER } from '@/utils/constants';
import getStudentsPromise from '@/server/utils/promises/getStudents';
import { StudentInfo } from '@/lib/schema/studentInfo';

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

function processSubjects(
  gradeInfo: Omit<GradeInfo & MongoExtra, 'studentNumber'>[]
) {
  const subjectsValidator: string[] = [];

  const holder = gradeInfo.map((s) => {
    const counter = `${s.yearLevel} - ${s.semester}` as const;
    const condition = !subjectsValidator.includes(counter);
    if (condition) {
      // console.log(counter, ' - ', studentNumber);
      subjectsValidator.push(counter);
      return s;
    }
  });
  // console.log('------\n');
  return holder.filter((s) => s !== undefined);
}

export async function GET(request: NextRequest) {
  const response: BaseAPIResponse<{
    grades: Record<string, Omit<GradeInfo & MongoExtra, 'studentNumber'>[]>[];
    filteredStudentInfo: StudentInfo[];
  }> = {
    data: {
      grades: [],
      filteredStudentInfo: [],
    },
    errorMessage: [],
  };
  try {
    const parameters = url.parse(request.url, true).query as Record<
      'studentNumber' | 'role',
      string
    >;

    if (parameters.role === 'admin') {
      const [clerkUsers, studentGrades] = await Promise.all([
        getStudentsPromise,
        gradeCollection.find().toArray() as unknown as Promise<
          (GradeInfo & MongoExtra)[]
        >,
      ]);

      const students = clerkUsers.filter(
        (u) => u.publicMetadata.studentNumber !== undefined
      );
      const filteredStudentInfo = students.map(
        ({ publicMetadata, firstName, lastName, id }) => ({
          studentNumber: publicMetadata.studentNumber as string | undefined,
          specialization: publicMetadata.specialization as string | undefined,
          middleInitial: publicMetadata.middleInitial as string | undefined,
          firstName,
          lastName,
          userId: id,
        })
      );
      const studentNumbers = filteredStudentInfo.map((s) => s.studentNumber);
      const filteredGradesByStudentNumber = studentNumbers
        .filter((v) => v !== undefined)
        .map((v) => ({
          [v]: processSubjects(
            studentGrades
              .filter((g) => g.studentNumber === v)
              .map(
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
              ) as Omit<GradeInfo & MongoExtra, 'studentNumber'>[]
          ),
        }));

      return NextResponse.json({
        ...response,
        data: {
          grades: filteredGradesByStudentNumber,
          filteredStudentInfo,
        },
      });
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
