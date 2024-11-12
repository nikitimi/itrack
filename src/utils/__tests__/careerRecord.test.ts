import careerRecord from '@/utils/careerRecord';

describe("Return careers based on the student's specialization.", () => {
  //   console.log(Object.entries());
  test('Passing BUSINESS_ANALYTICS specialization', () => {
    expect(careerRecord('BUSINESS_ANALYTICS')).toStrictEqual({
      DATA_ENGINEER: undefined,
      DATABASE_DEVELOPER: undefined,
      DATA_ANALYST: undefined,
      BUSINESS_ANALYST: undefined,
      SYSTEMS_ANALYST: undefined,
    });
  });
  test('Passing SERVICE_MANAGEMENT_PROGRAM specialization', () => {
    expect(careerRecord('SERVICE_MANAGEMENT_PROGRAM')).toStrictEqual({
      CLOUD_SERVICE_DELIVERY_MANAGER: undefined,
      ERP_INTEGRATION_MANAGER: undefined,
      HELP_DESK_SUPPORT_MANAGER: undefined,
      SYSTEMS_SECURITY_MANAGER: undefined,
      TECHNICAL_SUPPORT_SPECIALIST: undefined,
    });
  });
  test('Passing WEB_AND_MOBILE_DEVELOPMENT specialization', () => {
    expect(careerRecord('WEB_AND_MOBILE_DEVELOPMENT')).toStrictEqual({
      COMPUTER_PROGRAMMER: undefined,
      DEVELOPMENT_OPERATIONS_ENGINEER: undefined,
      SOFTWARE_ENGINEER: undefined,
      WEB_ADMINISTRATOR: undefined,
      WEB_AND_APPLICATIONS_DEVELOPER: undefined,
    });
  });
});
