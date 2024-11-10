'server only';

import type { Certificate } from '@/lib/enums/certificate';
import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import type { GradeInfo } from '@/lib/schema/gradeInfo';
import type { InternshipResult } from '@/utils/types/internshipResult';

import fetchHelper from '@/utils/fetch';
import { EMPTY_STRING, HEADER_KEY } from '@/utils/constants';
// TODO: FIXED TYPES!,
type InternshipData = Omit<InternshipResult, 'status'>;
type ResponseInArray =
  | GradeInfo[]
  | { name: Certificate; fileKey: string }[]
  | InternshipData;
type GetDatabaseInformation = {
  grades: GradeInfo[];
  certificate: { name: Certificate; fileKey: string }[];
  internship?: InternshipData;
};

async function getDatabaseInformations(studentNumber: string, userId: string) {
  let grades: GetDatabaseInformation['grades'] = [];
  let certificate: GetDatabaseInformation['certificate'] = [];
  let internship = undefined;

  console.log('Get database informations ', { userId });

  try {
    const apiRoutes = [
      '/api/mongo/grades',
      '/api/mongo/certificate',
      '/api/mongo/internship',
    ] as const;

    for (const route of apiRoutes) {
      const response = await fetchHelper({
        route,
        method: 'GET',
        params: {
          studentNumber,
        },
        headers: {
          [HEADER_KEY.userId]: userId ?? EMPTY_STRING,
        },
      });
      const { data, errorMessage } =
        (await response.json()) as BaseAPIResponse<ResponseInArray>;

      if (errorMessage.length > 0) throw new Error(errorMessage[0]);

      switch (true) {
        case route.includes('certificate'):
          certificate = data as GetDatabaseInformation['certificate'];
          break;
        case route.includes('grades'):
          console.log({ route });
          grades = data as GetDatabaseInformation['grades'];
          break;
        case route.includes('internship'):
          console.log({ route });
          internship = data as GetDatabaseInformation['internship'];
          break;
      }
    }
    console.log({ internship });

    return {
      grades,
      certificate,
      internship: internship as GetDatabaseInformation['internship'],
    };
  } catch (e) {
    const error = e as Error;
    console.log({ 'Catched Error': error.message });
    console.log({ internship });
    return {
      certificate,
      grades,
      internship: internship as GetDatabaseInformation['internship'],
    };
  }
}
export default getDatabaseInformations;
