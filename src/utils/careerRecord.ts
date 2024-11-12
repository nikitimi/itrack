import type { Specialization } from '@/lib/enums/specialization';
import type PossibleJob from '@/utils/types/possibleJob';

import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import webAndMobileDevelopmentJobEnum from '@/lib/enums/jobs/webAndMobileDevelopment';
import serviceManagementProgramJobEnum from '@/lib/enums/jobs/serviceManagementProgram';

export default function careerRecord<T>(
  specialization: Specialization,
  initialValue?: T
) {
  switch (specialization) {
    case 'BUSINESS_ANALYTICS':
      return businessAnalyticJobEnum.options.reduce(
        (acc, curr) => ({ ...acc, [curr]: initialValue }),
        {} as Record<PossibleJob, T>
      );
    case 'WEB_AND_MOBILE_DEVELOPMENT':
      return webAndMobileDevelopmentJobEnum.options.reduce(
        (acc, curr) => ({ ...acc, [curr]: initialValue }),
        {} as Record<PossibleJob, T>
      );
    case 'SERVICE_MANAGEMENT_PROGRAM':
      return serviceManagementProgramJobEnum.options.reduce(
        (acc, curr) => ({ ...acc, [curr]: initialValue }),
        {} as Record<PossibleJob, T>
      );
  }
}
