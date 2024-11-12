import internshipResult from '@/features/internship/utils/internshipResult';

describe("This will display the result of the student's performance based on internship", () => {
  test('BUSINESS_ANALYTICS', () => {
    expect(
      internshipResult({
        internshipResult: {
          tasks: ['API_INTEGRATION'],
          isITCompany: true,
          grade: 90,
        },
        specialization: 'BUSINESS_ANALYTICS',
      }).taskPerformedCalculations
    ).toStrictEqual([
      ['DATA_ENGINEER', 3],
      ['DATABASE_DEVELOPER', 3],
      ['DATA_ANALYST', 2],
      ['BUSINESS_ANALYST', 1],
      ['SYSTEMS_ANALYST', 1],
    ]);
  });
  test('SERVICE_MANAGEMENT_PROGRAM', () => {
    expect(
      internshipResult({
        internshipResult: {
          tasks: ['API_INTEGRATION'],
          isITCompany: true,
          grade: 0,
        },
        specialization: 'SERVICE_MANAGEMENT_PROGRAM',
      }).taskPerformedCalculations
    ).toStrictEqual([
      ['TECHNICAL_SUPPORT_SPECIALIST', 1],
      ['HELP_DESK_SUPPORT_MANAGER', 1],
      ['SYSTEMS_SECURITY_MANAGER', 1],
      ['ERP_INTEGRATION_MANAGER', 1],
      ['CLOUD_SERVICE_DELIVERY_MANAGER', 1],
    ]);
  });
  test('WEB_AND_MOBILE_DEVELOPMENT', () => {
    expect(
      internshipResult({
        internshipResult: {
          tasks: [],
          isITCompany: false,
          grade: 90,
        },
        specialization: 'WEB_AND_MOBILE_DEVELOPMENT',
      }).taskPerformedCalculations
    ).toStrictEqual([]);
  });
});
