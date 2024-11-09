import { z } from 'zod';

import certificateEnum from '@/lib/enums/certificate';
import specializationEnum from '@/lib//enums/specialization';
import gradeInfoSchema from '@/lib/schema/gradeInfo';
import chartDataSchema from '@/lib/schema/chartData';
import internshipSchema from '@/lib/schema/internship';

export type InitializeApp = z.infer<typeof initializeAppSchema>;

const initializeAppSchema = z.object({
  grades: z.array(gradeInfoSchema),
  certificate: z.array(certificateEnum),
  internship: z.union([internshipSchema, z.undefined()]),
  firstName: z.string(),
  lastName: z.string(),
  specialization: specializationEnum,
  studentNumber: z.string(),
  chartData: z.array(chartDataSchema),
});

export default initializeAppSchema;
