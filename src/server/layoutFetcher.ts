'server only';

// eslint-disable-next-line boundaries/element-types
import certificateResult from '@/features/certificate/student/utils/certificateResult';
// eslint-disable-next-line boundaries/element-types
import gradeResult from '@/features/grade/student/utils/gradeResult';
// eslint-disable-next-line boundaries/element-types
import internshipResult from '@/features/internship/utils/internshipResult';
import { Specialization } from '@/lib/enums/specialization';
import { UserRole } from '@/lib/enums/userRole';
import { HEADER_KEY, EMPTY_STRING } from '@/utils/constants';
import { ChartData } from '@/utils/types/chartData';
import { headers } from 'next/headers';
import getDatabaseInformations from './utils/getDatabaseInformations';
import { clerkClient } from '@clerk/nextjs/server';

export default async function layoutFetcher() {
  const headerList = headers();
  const client = await clerkClient();

  // TODO: Move this out to a separate global client component handler to set correct user type.
  const studentNumber =
    headerList.get(HEADER_KEY.studentNumber) ?? EMPTY_STRING;
  const userId = headerList.get(HEADER_KEY.uid) as string;
  const role = (headerList.get(HEADER_KEY.role) as UserRole) || 'anonymous';
  const specialization = headerList.get(
    HEADER_KEY.specialization
  ) as Specialization;

  const { firstName, lastName } = await client.users.getUser(userId);

  const result = await getDatabaseInformations(studentNumber);
  let internshipHolder: Record<string, number>[] = [];
  if (result.internship !== undefined) {
    const { _id, dateCreated, dateModified, ...rest } = result.internship;
    console.log(_id, dateCreated, dateModified);
    const internship = internshipResult({
      internshipResult: rest,
      specialization,
    });
    internshipHolder = internship.taskPerformedCalculations;
  }

  const foo = {
    certificate: Object.entries(
      certificateResult({
        certificateList: result.certificate,
        specialization,
      }) as Record<string, number>
    ),
    grades: gradeResult({ grades: result.grades, specialization }),
    internship: internshipHolder
      .sort((a, b) => b[Object.keys(b)[0]] - a[Object.keys(a)[0]])
      .map((object) => Object.entries(object)[0]),
  };

  let chartData: ChartData[] = [];
  function calculateRecord(
    record: [string, number][],
    type: 'certificate' | 'grades' | 'internship'
  ) {
    record
      .sort((a, b) => b[1] - a[1])
      .forEach(([job], index) => {
        const jobs = chartData.flatMap((v) => v.job);
        const jobIndex = jobs.indexOf(job);
        if (jobIndex === -1) {
          const holder = {
            certificate: 0,
            grades: 0,
            internship: 0,
          };
          return chartData.push({
            job,
            ...holder,
            [type]: 5 - index,
          });
        }
        const removed = chartData.splice(jobIndex, 1)[0];
        chartData = [...chartData, { ...removed, [type]: 5 - index }];
      });
  }

  calculateRecord(
    result.certificate.length === 0 ? [] : foo.certificate,
    'certificate'
  );
  calculateRecord(foo.grades ?? [], 'grades');
  calculateRecord(foo.internship, 'internship');

  return {
    role,
    firstName,
    lastName,
    specialization,
    studentNumber,
    chartData,
    ...result,
  };
}
