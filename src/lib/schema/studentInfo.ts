import { z } from 'zod';
import specializationEnum from '@/lib/enums/specialization';

/** Information needed for the students to register. */
export type StudentInfo = z.infer<typeof studentInfoSchema>;
export type StudentPublicMetadata = Pick<
  StudentInfo,
  'studentNumber' | 'middleInitial' | 'specialization'
>;

/** Information needed for the students to register. */
const studentInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleInitial: z.string(),
  userId: z.string(),
  studentNumber: z.string(),
  specialization: specializationEnum,
  createdAt: z.union([z.number(), z.undefined()]),
});

export default studentInfoSchema;
