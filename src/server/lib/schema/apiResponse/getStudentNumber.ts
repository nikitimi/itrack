import specializationEnum from '@/lib/enums/specialization';
import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';

import { z } from 'zod';

export type GetStudentNumberResponse = BaseAPIResponse<
  (GetStudentNumber | string)[]
>;
export type GetStudentNumber = z.infer<typeof getStudentNumberType>;

const getStudentNumberType = z.object({
  studentNumber: z.string(),
  specialization: specializationEnum,
  firstName: z.string(),
  middleInitial: z.string(),
  lastName: z.string(),
});

export default getStudentNumberType;
