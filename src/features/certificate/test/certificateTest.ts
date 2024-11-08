import type { Certificate } from '@/lib/enums/certificate';

import certificates from '@/lib/calculations/certificates';
import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import gradingPoints from '@/features/certificate/student/utils/gradingPoints';

type RecordType = Record<string, number>;

export default function certificateTest() {
  const businessAnalytics = certificates.filter(
    (c) => c.specialization === 'BUSINESS_ANALYTICS'
  );
  const testArray: Certificate[] = [
    'PROGRAMMING_AND_DEVELOPMENT',
    'NETWORKING_AND_CYBERSECURITY',
    'CLOUD_COMPUTING_AND_VIRTUALIZATION',
    'DATA_SCIENCE,_AI,_AND_MACHINE_LEARNING',
    'DATABASE_MANAGEMENT_AND_DATA_WAREHOUSING',
    'IT_SUPPORT_AND_SYSTEMS_ADMINISTRATION',
    'SOFTWARE_TESTING_AND_QUALITY_ASSURANCE',
    'PROJECT_MANAGEMENT',
    'UI/UX_DESIGN',
    'EMERGING_TECHNOLOGIES',
  ];

  const test = {};
  businessAnalyticJobEnum.options.sort().forEach((job) => {
    let num = 0;
    businessAnalytics
      .filter((c) => c.job === job)
      .forEach((c) => {
        console.log(job, c.certificate);
        if (testArray.includes(c.certificate))
          num += gradingPoints[c.gradeRating];
      });
    (test as RecordType)[job] = num;
  });

  return Object.keys(test)
    .sort()
    .reduce((obj, key) => {
      (obj as RecordType)[key] = (test as RecordType)[key];
      return obj;
    }, {});
}
