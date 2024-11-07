import type FinalComputation from '@/features/certificate/student/utils/types/finalComputation';
import type { Certificate } from '@/lib/enums/certificate';
import type { GradeRating } from '@/lib/enums/gradeRating';
import type { CertificateResult } from '@/utils/types/certificateResult';
import type PossibleJob from '@/utils/types/possibleJob';

import gradingPoints from '@/features/certificate/student/utils/gradingPoints';
import certificateCalculation from '@/lib/calculations/certificates';
import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import serviceManagementProgramJobEnum from '@/lib/enums/jobs/serviceManagementProgram';
import webAndMobileDevelopmentJobEnum from '@/lib/enums/jobs/webAndMobileDevelopment';

type FilteredCertificateAndJob = Pick<
  (typeof certificateCalculation)[number],
  'certificate' | 'job' | 'gradeRating'
>;

type CertificateAndRating = {
  certificate: Certificate;
  gradeRating: GradeRating;
};

function filterCertificatesByJob(
  jobs: PossibleJob[],
  certificateInfo: FilteredCertificateAndJob[]
) {
  let filteredCertificatesByJob = {} as Record<
    PossibleJob,
    CertificateAndRating[]
  >;
  jobs.forEach((job) => {
    const certificateAndRating = certificateInfo
      .filter((c) => c.job === job)
      .map((c) => ({ certificate: c.certificate, gradeRating: c.gradeRating }));
    filteredCertificatesByJob = {
      ...filteredCertificatesByJob,
      [job]: certificateAndRating,
    };
  });
  return filteredCertificatesByJob;
}

export default function certificateResult(props: CertificateResult) {
  const { certificateList, specialization } = props;

  /** Task requirements to be performed to be in the role. */
  const certificateBasedSpecialization = certificateCalculation
    .filter((c) => c.specialization === specialization)
    .map((c) => ({
      certificate: c.certificate,
      gradeRating: c.gradeRating,
      job: c.job,
    }));
  const recommendedCertificate = certificateBasedSpecialization.filter(
    (c) => c.gradeRating === 'A'
  );
  const restOfCertificates = certificateBasedSpecialization.filter(
    (c) => c.gradeRating !== 'A'
  );

  let jobs: PossibleJob[] = [];
  switch (specialization) {
    case 'BUSINESS_ANALYTICS':
      jobs = businessAnalyticJobEnum.options;
      break;
    case 'WEB_AND_MOBILE_DEVELOPMENT':
      jobs = webAndMobileDevelopmentJobEnum.options;
      break;
    case 'SERVICE_MANAGEMENT_PROGRAM':
      jobs = serviceManagementProgramJobEnum.options;
      break;
  }

  const filteredRecommendedCertificatesByJob = filterCertificatesByJob(
    jobs,
    recommendedCertificate
  );
  const filteredRestCertificatesByJob = filterCertificatesByJob(
    jobs,
    restOfCertificates
  );

  //   console.log({ filteredRecommendedCertificatesByJob });
  //   console.log({ filteredRestCertificatesByJob });

  const certificateByJobArray = [
    filteredRecommendedCertificatesByJob,
    filteredRestCertificatesByJob,
  ].map((certificateByJob, index) => {
    const isARating = index === 0;
    return Object.entries(certificateByJob).map(([jobName, certificates]) => {
      /** Check if the certificates of the student includes the A rating for a specific job-related. */
      const certificateBooleans = certificates.map(({ certificate }) =>
        certificateList.includes(certificate)
      );
      // console.log({
      //   certificateBooleans,
      //   length: certificateBooleans.length,
      //   isARating,
      // });
      /** Number of tooked certificates. */
      const numberOfTrue = certificateBooleans.filter((b) => b === true).length;
      /** Checking of A rating certificates if all are tooked. */
      const certificateFilteredBoolean = Array.from(
        new Set(certificateBooleans)
      );
      /** All certificates are tooked by the student. */
      const isCertificateHomogenousResult =
        certificateFilteredBoolean.length === 1;

      // Handles not A Rating certificates
      if (!isARating) {
        let accumulatedPoints = 0;
        certificates.forEach((c) => {
          if (!certificateList.includes(c.certificate)) return;

          //   console.log(c.certificate);
          accumulatedPoints += gradingPoints[c.gradeRating];
        });
        return { [jobName]: accumulatedPoints };
      }

      /** The student didn't took all the certificate to be recommended to that Job. */
      if (!isCertificateHomogenousResult)
        return {
          //   [jobName]: numberOfTrue * gradingPoints.A,
          [jobName]: numberOfTrue * gradingPoints.A,
        };
      /** The student took all the certificate for the Job. */
      //TODO: Debug this is not working.
      if (certificateFilteredBoolean[0] === true)
        return {
          [jobName]: certificateBooleans.length * gradingPoints.A,
        };
    });
  });

  // The calculation for A rating certificates are null.
  // certificateByJobArray.forEach((certificateByJob, index) => {
  //   const isCertificatesARating = index === 0;
  //   if (certificateByJob.filter((r) => r !== undefined).length === 0) {
  //     return console.log(
  //       isCertificatesARating
  //         ? 'No A rating certificate tooked!'
  //         : 'No certificates tooked!'
  //     );
  //   }
  // });

  const finalComputation = {};
  Object.values(certificateByJobArray[1]).forEach((c, index) => {
    const ARatingResult = certificateByJobArray[0][index];
    if (c === undefined) return console.log('No grades provided');
    const [jobName, points] = Object.entries(c)[0];

    (finalComputation as FinalComputation)[jobName as PossibleJob] =
      ARatingResult ? points + ARatingResult[jobName] : points;
  });

  //   return {
  //     certificateBasedSpecialization,
  //     recommendedCertificate,
  //     filteredRecommendedCertificatesByJob,
  //     finalComputation,
  //   };
  return finalComputation as Record<PossibleJob, number>;
}
