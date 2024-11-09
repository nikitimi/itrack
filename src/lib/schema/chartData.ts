import { z } from 'zod';

export type ChartData = z.infer<typeof chartDataSchema>;

const chartDataSchema = z.object({
  job: z.string(),
  certificate: z.number(),
  grades: z.number(),
  internship: z.number(),
});

export default chartDataSchema;
