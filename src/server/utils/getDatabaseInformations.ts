'server only';

import type { MongoExtra } from '@/lib/schema/mongoExtra';
import type { Certificate } from '@/lib/enums/certificate';
import type { BaseAPIResponse } from '@/server/lib/schema/apiResponse';
import type { APIRoutes } from '@/server/lib/enum/apiRoutes';
import type GradeInfo from '@/utils/types/gradeInfo';
import type { InternshipResult } from '@/utils/types/internshipResult';

import fetchHelper from '@/server/utils/fetch';

type InternshipData = Omit<InternshipResult, 'status'>;
type ResponseInArray =
  | ((GradeInfo | Certificate) & MongoExtra)[]
  | (InternshipData & MongoExtra);
type GetDatabaseInformation = {
  grades: (GradeInfo & MongoExtra)[];
  certificate: Certificate[];
  internship?: InternshipData & MongoExtra;
};

async function getDatabaseInformations(studentNumber: string) {
  let grades: GetDatabaseInformation['grades'] = [];
  let certificate: GetDatabaseInformation['certificate'] = [];
  let internship = undefined;

  try {
    const apiRoutes: APIRoutes[] = [
      '/api/mongo/grades',
      '/api/mongo/certificate',
      '/api/mongo/internship',
    ] as const;

    for (const api of apiRoutes) {
      const response = await fetchHelper(api, 'GET', {
        studentNumber,
      });
      const { data, errorMessage } =
        (await response.json()) as BaseAPIResponse<ResponseInArray>;

      if (errorMessage.length > 0) throw new Error(errorMessage[0]);

      switch (true) {
        case api.includes('certificate'):
          console.log({ route: api });
          certificate = Object.entries(
            (data as GetDatabaseInformation['grades'])[0]
          )
            .filter(([key]) => !isNaN(parseInt(key, 10)))
            .map(([, v]) => v as Certificate);
          break;
        case api.includes('grades'):
          console.log({ route: api });
          grades = data as GetDatabaseInformation['grades'];
          break;
        case api.includes('internship'):
          console.log({ route: api });
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
