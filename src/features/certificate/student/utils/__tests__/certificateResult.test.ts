import certificateResult from '@/features/certificate/student/utils/certificateResult';
import { Certificate } from '@/lib/enums/certificate';
import { MongoExtra } from '@/lib/schema/mongoExtra';

type CertificateDetails = {
  name: Certificate;
  fileKey: string;
};
type CertificateWrittenInDB = {
  certificateList: CertificateDetails[];
} & Partial<MongoExtra>;

const certificate: CertificateWrittenInDB = {
  _id: '672f784b6572f87055d96cf5',
  certificateList: [
    {
      name: 'CLOUD_COMPUTING_AND_VIRTUALIZATION',
      fileKey: 'CQQLAEGUDWVPLfXxtI4pnXFrhbTfS4RxBl6k2jaQW71ogYct',
    },
    {
      name: 'DATABASE_MANAGEMENT_AND_DATA_WAREHOUSING',
      fileKey: 'CQQLAEGUDWVPsgnsN4F3bE4RSkhdIMzqv1oYlDtTuQ0girZ9',
    },
    {
      name: 'DATA_SCIENCE,_AI,_AND_MACHINE_LEARNING',
      fileKey: 'CQQLAEGUDWVPbQSMMaWbh4zVTLJr8Iyn5B6d3tmF9PaDRsSY',
    },
    {
      name: 'SOFTWARE_TESTING_AND_QUALITY_ASSURANCE',
      fileKey: 'CQQLAEGUDWVP4MqNBuZIiLtau52wzP0XVn3bUdjYlm76pCh4',
    },
    {
      name: 'IT_SUPPORT_AND_SYSTEMS_ADMINISTRATION',
      fileKey: 'CQQLAEGUDWVPeuMnBMRALJQpCoMf129KqFgUHjz6ZE8PBOwS',
    },
    {
      name: 'PROJECT_MANAGEMENT',
      fileKey: 'CQQLAEGUDWVPaxsbur0lqBJpLC5xNPsk0rXSiQvUf79bFwlH',
    },
  ],
  studentNumber: '2021201282',
  dateCreated: 1731164235023,
  dateModified: 1731263433658,
};

describe('These will return the ranking of careers based on the submitted certificates.', () => {
  test("Passing certificateList of BUSINESS_ANALYTICS's student", () => {
    expect(
      certificateResult({
        certificateList: [],
        specialization: 'BUSINESS_ANALYTICS',
      })
    ).toStrictEqual([
      ['DATA_ENGINEER', 0],
      ['DATABASE_DEVELOPER', 0],
      ['DATA_ANALYST', 0],
      ['BUSINESS_ANALYST', 0],
      ['SYSTEMS_ANALYST', 0],
    ]);
  });
  test("Passing certificateList of BUSINESS_ANALYTICS's student", () => {
    expect(
      certificateResult({
        certificateList: certificate.certificateList,
        specialization: 'BUSINESS_ANALYTICS',
      })
    ).toStrictEqual([
      ['DATA_ENGINEER', 2102],
      ['DATABASE_DEVELOPER', 1103],
      ['DATA_ANALYST', 100152],
      ['BUSINESS_ANALYST', 100152],
      ['SYSTEMS_ANALYST', 100250],
    ]);
  });
  test("Passing certificateList of WEB_AND_MOBILE_DEVELOPMENT's student", () => {
    expect(
      certificateResult({
        certificateList: certificate.certificateList,
        specialization: 'WEB_AND_MOBILE_DEVELOPMENT',
      })
    ).toStrictEqual([
      ['WEB_AND_APPLICATIONS_DEVELOPER', 202],
      ['COMPUTER_PROGRAMMER', 202],
      ['WEB_ADMINISTRATOR', 153],
      ['DEVELOPMENT_OPERATIONS_ENGINEER', 1152],
      ['SOFTWARE_ENGINEER', 1103],
    ]);
  });
  test("Passing certificateList of SERVICE_MANAGEMENT_PROGRAM's student", () => {
    expect(
      certificateResult({
        certificateList: certificate.certificateList,
        specialization: 'SERVICE_MANAGEMENT_PROGRAM',
      })
    ).toStrictEqual([
      ['TECHNICAL_SUPPORT_SPECIALIST', 104],
      ['HELP_DESK_SUPPORT_MANAGER', 1103],
      ['SYSTEMS_SECURITY_MANAGER', 202],
      ['ERP_INTEGRATION_MANAGER', 200102],
      ['CLOUD_SERVICE_DELIVERY_MANAGER', 200102],
    ]);
  });
});
