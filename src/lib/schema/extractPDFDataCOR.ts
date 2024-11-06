import { z } from 'zod';

export type ExtractPDFDataCOR = z.infer<typeof extractPDFDataCORSchema>;

const extractPDFDataCORSchema = z.object({
  name: z.string(),
  studentNumber: z.string(),
});

export default extractPDFDataCORSchema;
