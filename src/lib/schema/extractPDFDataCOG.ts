import { z } from 'zod';

export type ExtractPDFDataCOG = z.infer<typeof extractPDFDataCOGSchema>;

const extractPDFDataCOGSchema = z.object({
  body: z.string(),
  footer: z.string(),
  header: z.string(),
});

export default extractPDFDataCOGSchema;
