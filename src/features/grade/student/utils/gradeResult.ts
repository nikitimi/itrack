import type { Specialization } from '@/lib/enums/specialization';
import type { GradeInfo } from '@/lib/schema/gradeInfo';
import type { SubjectDetails } from '@/lib/schema/subjectDetails';

import {
  firstYearSubjects,
  secondYearSubjects,
  thirdYearSubjects,
  fourthYearSubjects,
} from '@/lib/calculations/grades';
import { SubjectCodesFor2018CurriculumEnum } from '@/lib/enums/subjectCodesFor2018Curriculum';
import businessAnalyticJobEnum from '@/lib/enums/jobs/businessAnalytics';
import webAndMobileDevelopmentJobEnum from '@/lib/enums/jobs/webAndMobileDevelopment';
import serviceManagementProgramJobEnum from '@/lib/enums/jobs/serviceManagementProgram';
import gradeSystem from './gradeSystem';
import { GradeRating } from '@/lib/enums/gradeRating';
import { NUMBER_OF_SEMESTER } from '@/utils/constants';

type GradeResultProps = {
  grades: GradeInfo[];
  specialization: Specialization;
};

type SubjectReference = {
  code: SubjectCodesFor2018CurriculumEnum;
  grade: string;
};

type PossibleJob = (
  | typeof businessAnalyticJobEnum.options
  | typeof webAndMobileDevelopmentJobEnum.options
  | typeof serviceManagementProgramJobEnum.options
)[number];

type RecordJobs = Record<PossibleJob, number>;

const points = {
  A: 0.5,
  B: 0.3,
  C: 0.2,
};

function checkSubjects(
  subjectsRoot: SubjectDetails[],
  subjectRef: SubjectReference[],
  specialization: Specialization
) {
  const specializationSubjects = subjectsRoot.filter(
    (s) => s.specialization === specialization
  );
  const subjectCodes = subjectRef.flatMap((s) => s.code);
  const subjectGrades = subjectRef.flatMap((s) => s.grade);
  const includedSpecializeSubjects = specializationSubjects.filter((s) =>
    subjectCodes.includes(s.subjectCode)
  );

  // Put in helper.
  let jobs = {};
  switch (specialization) {
    case 'BUSINESS_ANALYTICS':
      businessAnalyticJobEnum.options.forEach((job) => {
        jobs = { ...jobs, [job]: undefined };
      });
      break;
    case 'WEB_AND_MOBILE_DEVELOPMENT':
      webAndMobileDevelopmentJobEnum.options.forEach((job) => {
        jobs = { ...jobs, [job]: undefined };
      });
      break;
    case 'SERVICE_MANAGEMENT_PROGRAM':
      serviceManagementProgramJobEnum.options.forEach((job) => {
        jobs = { ...jobs, [job]: undefined };
      });
      break;
  }

  //   console.log(subjectRef);
  //   console.log(subjectGrades);
  //   console.log(subjectCodes);

  Object.entries(jobs).forEach(([key]) => {
    let allPoints = 0;
    const rawIterationAndPoints: Record<
      GradeRating,
      { items: number; points: number }
    > = {
      A: { items: 0, points: 0 },
      B: { items: 0, points: 0 },
      C: { items: 0, points: 0 },
    };
    const subjectsFilteredByJob = includedSpecializeSubjects.filter(
      (s) => s.job === key
    );
    // console.log('subjectsFilteredByJob', subjectsFilteredByJob.length);
    subjectsFilteredByJob.forEach((s) => {
      const index = subjectCodes.indexOf(s.subjectCode);
      const grade = subjectGrades[index];
      const gradeSystemDetails = gradeSystem.filter((gs) =>
        gs.scale.startsWith(grade)
      );

      if (gradeSystemDetails.length < 0) {
        throw new Error("Grade doesn't exists in the grade system.");
      }

      const gradeInteger = gradeSystemDetails[0].scale2;
      const gradePercentage = points[s.gradeRating];
      const calculatedPercentage = gradeInteger * gradePercentage;
      rawIterationAndPoints[s.gradeRating]['items'] += 1;
      //   console.log(
      //     gradeInteger,
      //     '|',
      //     gradePercentage,
      //     '|',
      //     calculatedPercentage
      //   );
      rawIterationAndPoints[s.gradeRating]['points'] += calculatedPercentage;
    });

    // console.log(key, rawIterationAndPoints);
    // console.log(
    //   'Length of specialized subjects',
    //   includedSpecializeSubjects.length
    // );

    Object.values(rawIterationAndPoints).forEach(({ items, points }) => {
      const calculated = points / items;
      const fallbackNumber = isNaN(calculated) ? 0 : calculated;
      //   console.log({ fallbackNumber });
      allPoints += fallbackNumber;
    });

    (jobs as RecordJobs)[key as PossibleJob] = allPoints;
  });

  return jobs as RecordJobs;
}

export default function gradeResult(props: GradeResultProps) {
  const { grades, specialization } = props;
  try {
    if (grades.length === 0) {
      throw new Error('There are no subjects to compute!');
    }
    if (grades.length < NUMBER_OF_SEMESTER) {
      throw new Error(
        'Insufficient COG!\nPlease upload all COG up to 3rd year 2nd semester.'
      );
    }

    const subjectsArray = grades.flatMap((gradeInfo) => {
      switch (gradeInfo.yearLevel) {
        case 'FIRST_YEAR':
          return checkSubjects(
            firstYearSubjects,
            gradeInfo.subjects,
            specialization
          );

        case 'SECOND_YEAR':
          return checkSubjects(
            secondYearSubjects,
            gradeInfo.subjects,
            specialization
          );

        case 'THIRD_YEAR':
          return checkSubjects(
            thirdYearSubjects,
            gradeInfo.subjects,
            specialization
          );

        case 'FOURTH_YEAR':
          return checkSubjects(
            fourthYearSubjects,
            gradeInfo.subjects,
            specialization
          );
      }
    });

    let finalRecord = {};
    switch (specialization) {
      case 'BUSINESS_ANALYTICS':
        businessAnalyticJobEnum.options.forEach((job) => {
          finalRecord = { ...finalRecord, [job]: 0 };
        });
        break;
      case 'WEB_AND_MOBILE_DEVELOPMENT':
        webAndMobileDevelopmentJobEnum.options.forEach((job) => {
          finalRecord = { ...finalRecord, [job]: 0 };
        });
        break;
      case 'SERVICE_MANAGEMENT_PROGRAM':
        serviceManagementProgramJobEnum.options.forEach((job) => {
          finalRecord = { ...finalRecord, [job]: 0 };
        });
        break;
    }
    subjectsArray.forEach((object) => {
      Object.entries(object).forEach(
        ([key, grade]) =>
          // console.log(key, grade);
          ((finalRecord as RecordJobs)[key as PossibleJob] +=
            grade / NUMBER_OF_SEMESTER)
      );
    });

    const sortedFinalRecord = Object.entries(finalRecord as RecordJobs).sort(
      (a, b) => b[1] - a[1]
    );

    return sortedFinalRecord;
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
  }
}
