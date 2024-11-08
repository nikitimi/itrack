import type { Specialization } from '@/lib/enums/specialization';
import type { ChartData } from '@/utils/types/chartData';

import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import serviceManagementProgramJobEnum from '@/lib/enums/jobs/serviceManagementProgram';
import webAndMobileDevelopmentJobEnum from '@/lib/enums/jobs/webAndMobileDevelopment';

const getPossibleJobs = (specialization: Specialization) => {
  const possibleJobs: ChartData[] = [];
  switch (specialization) {
    case 'BUSINESS_ANALYTICS':
      businessAnalyticJobEnum.options.forEach((job) => {
        possibleJobs.push({
          job: job.replace(/_/g, ' ').toLocaleLowerCase(),
          certificate: 0,
          grades: 0,
          internship: 0,
        });
      });
      break;

    case 'WEB_AND_MOBILE_DEVELOPMENT':
      webAndMobileDevelopmentJobEnum.options.forEach((job) => {
        possibleJobs.push({
          job: job.replace(/_/g, ' ').toLocaleLowerCase(),
          certificate: 0,
          grades: 0,
          internship: 0,
        });
      });
      break;
    case 'SERVICE_MANAGEMENT_PROGRAM':
      serviceManagementProgramJobEnum.options.forEach((job) => {
        possibleJobs.push({
          job: job.replace(/_/g, ' ').toLocaleLowerCase(),
          certificate: 0,
          grades: 0,
          internship: 0,
        });
      });
      break;
  }
  return possibleJobs;
};

export default getPossibleJobs;
