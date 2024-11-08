import { z } from 'zod';

import gradeLevel from '@/lib/enums/gradeLevel';
import semester from '@/lib/enums/semester';

const academicYearSchema = z.object({
  gradeLevel: z.union([gradeLevel, z.undefined()]),
  semester,
});

export type AcademicYear = z.infer<typeof academicYearSchema>;
export default academicYearSchema;
