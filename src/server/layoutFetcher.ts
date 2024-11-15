'server only';

import type { ChartData } from '@/lib/schema/chartData';
import type { StudentInfo } from '@/lib/schema/studentInfo';
import type { MongoExtra } from '@/lib/schema/mongoExtra';
import type { GradeInfo } from '@/lib/schema/gradeInfo';
import type { Certificate } from '@/lib/enums/certificate';
import type { InternshipResult } from '@/utils/types/internshipResult';

// eslint-disable-next-line boundaries/element-types
import certificateResult from '@/features/certificate/student/utils/certificateResult';
// eslint-disable-next-line boundaries/element-types
import gradeResult from '@/features/grade/student/utils/gradeResult';
// eslint-disable-next-line boundaries/element-types
import internshipResult from '@/features/internship/utils/internshipResult';
import getDatabaseInformations from '@/server/utils/getDatabaseInformations';

type LayoutFetcher = {
  grades: (GradeInfo & MongoExtra)[];
  certificate: { name: Certificate; fileKey: string }[];
  internship?: Omit<InternshipResult, 'status'> & MongoExtra;
  chartData: ChartData[];
};

export default async function layoutFetcher(
  props: Pick<StudentInfo, 'specialization' | 'studentNumber' | 'userId'>
): Promise<LayoutFetcher> {
  const { studentNumber, specialization, userId } = props;
  console.log(props, ' server layout fetcher...');

  const result = await getDatabaseInformations(studentNumber, userId);
  let internshipHolder: Record<string, number>[] = [];
  if (result.internship !== undefined) {
    const { ...rest } = result.internship;
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
    chartData,
    grades: result.grades as LayoutFetcher['grades'],
    certificate: result.certificate,
    internship: result.internship as LayoutFetcher['internship'],
  };
}
