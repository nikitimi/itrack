import PossibleJob from './types/possibleJob';

const reveaAllModuleHelper = (
  certificate: Record<string, number>,
  grades: [string, number][] | undefined,
  internship: [string, number][]
) => {
  const props = {
    certificate: Object.entries(certificate),
    grades: grades,
    internship: internship,
  };

  let jobHolder: Record<PossibleJob, number> = {
    DATA_ENGINEER: 0,
    DATABASE_DEVELOPER: 0,
    DATA_ANALYST: 0,
    BUSINESS_ANALYST: 0,
    SYSTEMS_ANALYST: 0,
    WEB_AND_APPLICATIONS_DEVELOPER: 0,
    COMPUTER_PROGRAMMER: 0,
    WEB_ADMINISTRATOR: 0,
    DEVELOPMENT_OPERATIONS_ENGINEER: 0,
    SOFTWARE_ENGINEER: 0,
    TECHNICAL_SUPPORT_SPECIALIST: 0,
    HELP_DESK_SUPPORT_MANAGER: 0,
    SYSTEMS_SECURITY_MANAGER: 0,
    ERP_INTEGRATION_MANAGER: 0,
    CLOUD_SERVICE_DELIVERY_MANAGER: 0,
  };
  function calculateRecord(record: [string, number][]) {
    record
      .sort((a, b) => b[1] - a[1])
      .forEach(([job], index) => {
        jobHolder = {
          ...jobHolder,
          [job as PossibleJob]:
            jobHolder[job as PossibleJob] + (record.length - index),
        };
      });
  }

  calculateRecord(props.certificate);
  calculateRecord(props.grades ?? []);
  calculateRecord(props.internship);

  const filteredJobHolder = Object.entries(jobHolder)
    .filter(([, value]) => value !== 0)
    .sort((a, b) => b[1] - a[1])
    .reduce(
      (acc, [key, value]) => {
        acc[key as PossibleJob] = value;
        return acc;
      },
      {} as Record<PossibleJob, number>
    );
  return { ...props, jobHolder: filteredJobHolder };
};

export default reveaAllModuleHelper;
