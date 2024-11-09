import { z } from 'zod';
import apiRoutesEnum from '@/lib/enums/apiRoutes';
import apiMethodsEnum from '@/lib/enums/apiMethods';
import studentInfoSchema from './studentInfo';
import certificateEnum from '../enums/certificate';
import gradeInfoSchema from './gradeInfo';
import internshipSchema from './internship';

export type FetchHelperProps = z.infer<typeof fetchHelperPropsSchema>;

const fetchHelperPropsSchema = z.union([
  z.object({
    route: apiRoutesEnum.extract(['/api/addUserType']),
    method: apiMethodsEnum.extract(['POST']),
    data: studentInfoSchema,
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/extractExcelData']),
    method: apiMethodsEnum.extract(['POST']),
    data: z.record(z.any()),
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/extractPDFData/COG']),
    method: apiMethodsEnum.extract(['POST']),
    data: z.record(z.any()),
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/extractPDFData/COR']),
    method: apiMethodsEnum.extract(['POST']),
    data: z.record(z.any()),
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/getStudentInformations']),
    method: apiMethodsEnum.extract(['GET']),
    data: z.undefined(),
    params: z.object({ userId: z.string() }),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/getStudentNumber']),
    method: apiMethodsEnum.extract(['GET']),
    data: z.undefined(),
    params: z.object({ userId: z.string() }),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/initializeApp']),
    method: apiMethodsEnum.extract(['GET']),
    data: z.undefined(),
    params: z.object({ userId: z.string() }),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/certificate']),
    method: apiMethodsEnum.extract(['POST']),
    data: z.object({
      certificateList: z.array(certificateEnum),
      studentNumber: z.string(),
    }),
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/certificate']),
    method: apiMethodsEnum.extract(['GET']),
    data: z.undefined(),
    params: z.object({ studentNumber: z.string() }),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/certificate']),
    method: apiMethodsEnum.extract(['PATCH']),
    data: z.object({
      certificateList: z.array(certificateEnum),
      studentNumber: z.string(),
    }),
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/grades']),
    method: apiMethodsEnum.extract(['POST']),
    data: gradeInfoSchema,
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/grades']),
    method: apiMethodsEnum.extract(['GET']),
    data: z.undefined(),
    params: z
      .object({
        studentNumber: z.string(),
        role: z.enum(['admin']),
      })
      .partial(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/internship']),
    method: apiMethodsEnum.extract(['POST']),
    data: internshipSchema,
    params: z.undefined(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/internship']),
    method: apiMethodsEnum.extract(['GET']),
    data: z.undefined(),
    params: z
      .object({
        studentNumber: z.string(),
        role: z.enum(['admin']),
      })
      .partial(),
  }),
  z.object({
    route: apiRoutesEnum.extract(['/api/mongo/internship']),
    method: apiMethodsEnum.extract(['PATCH']),
    data: internshipSchema,
    params: z.undefined(),
  }),
]);

export default fetchHelperPropsSchema;
