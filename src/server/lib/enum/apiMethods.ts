import { z } from 'zod';

export type APIMethods = z.infer<typeof apiMethodsEnum>;

const apiMethodsEnum = z.enum(['GET', 'POST']);

export default apiMethodsEnum;
