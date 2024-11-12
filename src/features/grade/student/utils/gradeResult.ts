import type { Specialization } from '@/lib/enums/specialization';
import type GradeInfo from '@/utils/types/gradeInfo';
import type { SubjectDetails } from '@/utils/types/gradeInfo';

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
import type { GradeRating } from '@/lib/enums/gradeRating';
import { NUMBER_OF_SEMESTER } from '@/utils/constants';
import type { MongoExtra } from '@/lib/schema/mongoExtra';
import careerRecord from '@/utils/careerRecord';

type GradeResultProps = {
  grades: (GradeInfo & Partial<MongoExtra>)[];
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

  const careers = careerRecord(specialization, 0);
  Object.entries(careers).forEach(([key]) => {
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

    subjectsFilteredByJob.forEach((s) => {
      const index = subjectCodes.indexOf(s.subjectCode);
      const grade = subjectGrades[index];
      const gradeSystemDetails = gradeSystem.filter((gs) =>
        gs.scale.startsWith(grade)
      );
      const gradeInteger = gradeSystemDetails[0].scale2;
      const gradePercentage = points[s.gradeRating];
      const calculatedPercentage = gradeInteger * gradePercentage;
      rawIterationAndPoints[s.gradeRating]['items'] += 1;
      rawIterationAndPoints[s.gradeRating]['points'] += calculatedPercentage;
    });

    Object.values(rawIterationAndPoints).forEach(({ items, points }) => {
      const calculated = points / items;
      const fallbackNumber = isNaN(calculated) ? 0 : calculated;
      allPoints += fallbackNumber;
    });
    careers[key as PossibleJob] = careers[key as PossibleJob] + allPoints;
  });

  return careers;
}

export default function gradeResult(props: GradeResultProps) {
  const { grades, specialization } = props;
  try {
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

    const careers = careerRecord(specialization, 0);
    subjectsArray.forEach((object) => {
      Object.entries(object).forEach(
        ([key, grade]) =>
          (careers[key as PossibleJob] =
            careers[key as PossibleJob] + grade / NUMBER_OF_SEMESTER)
      );
    });
    const sortedFinalRecord = Object.entries(careers).sort(
      (a, b) => b[1] - a[1]
    ) as [PossibleJob, number][];

    return sortedFinalRecord;
  } catch (e) {
    const error = e as Error;
    console.log(error.message);
    return [];
  }
}
