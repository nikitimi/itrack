import { z } from 'zod';

import gradeRatingEnum from '@/lib/enums/gradeRating';
import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import serviceManagementProgramJobEnum from '@/lib/enums/jobs/serviceManagementProgram';
import webAndMobileDevelopmentJobEnum from '@/lib/enums/jobs/webAndMobileDevelopment';
import specializationEnum from '@/lib/enums/specialization';
import subjectCodesFor2018CurriculumEnum from '@/lib/enums/subjectCodesFor2018Curriculum';
import academicYearSchema from '@/lib/schema/academicYear';

export type SubjectDetails = z.infer<typeof subjectDetailsSchema>;

const subjectDetailsSchema = z.object({
  job: z.union([
    businessAnalyticJobEnum,
    webAndMobileDevelopmentJobEnum,
    serviceManagementProgramJobEnum,
  ]),
  specialization: specializationEnum,
  gradeRating: gradeRatingEnum,
  academicYear: academicYearSchema,
  subjectCode: subjectCodesFor2018CurriculumEnum,
});

export default subjectDetailsSchema;
