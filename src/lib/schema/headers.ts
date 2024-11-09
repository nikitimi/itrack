import { z } from 'zod';
import { HEADER_KEY } from '@/utils/constants';

const {
  firstName,
  lastName,
  middleInitial,
  studentNumber,
  specialization,
  userId,
} = HEADER_KEY;

export type Headers = z.infer<typeof headersSchema>;

const headersSchema = z.object({
  [firstName]: z.string(),
  [lastName]: z.string(),
  [middleInitial]: z.string(),
  [studentNumber]: z.string(),
  [specialization]: z.string(),
  [userId]: z.string(),
});

export default headersSchema;
