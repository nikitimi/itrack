import { z } from 'zod';

import internshipTaskEnum from '@/lib/enums/internshipTask';
import mongoExtraSchema from '@/lib/schema/mongoExtra';

export type Internship = z.infer<typeof internshipSchema>;

const internshipSchema = z
  .object({
    tasks: z.array(internshipTaskEnum),
    isITCompany: z.boolean(),
    grade: z.string(),
  })
  .and(mongoExtraSchema.partial());

export default internshipSchema;
