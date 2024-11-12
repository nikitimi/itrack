import type { Specialization } from '@/lib/enums/specialization';
// import PossibleJob from './types/possibleJob';
import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import webAndMobileDevelopmentJobEnum from '@/lib/enums/jobs/webAndMobileDevelopment';
import serviceManagementProgramJobEnum from '@/lib/enums/jobs/serviceManagementProgram';

export default function careerRecord(specialization: Specialization) {
  switch (specialization) {
    case 'BUSINESS_ANALYTICS':
      return businessAnalyticJobEnum.options.reduce(
        (acc, curr) => ({ ...acc, [curr]: undefined }),
        {}
      );
    case 'WEB_AND_MOBILE_DEVELOPMENT':
      return webAndMobileDevelopmentJobEnum.options.reduce(
        (acc, curr) => ({ ...acc, [curr]: undefined }),
        {}
      );
    case 'SERVICE_MANAGEMENT_PROGRAM':
      return serviceManagementProgramJobEnum.options.reduce(
        (acc, curr) => ({ ...acc, [curr]: undefined }),
        {}
      );
  }
}
