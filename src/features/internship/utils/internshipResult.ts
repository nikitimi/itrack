import type { InternshipCalculation } from '@/lib/calculations/types';
import type { InternshipTask } from '@/lib/enums/internshipTask';
import type { Specialization } from '@/lib/enums/specialization';
import type { InternshipResult } from '@/utils/types/internshipResult';

import { gradeDivision } from '@/features/internship/utils/constants';
import internship from '@/lib/calculations/internship';
import businessAnalyticJobEnum, {
  type BusinessAnalyticJob,
} from '@/lib/enums/jobs/businessAnalytics';
import serviceManagementProgramJobEnum, {
  type ServiceManagementProgramJob,
} from '@/lib/enums/jobs/serviceManagementProgram';
import webAndMobileDevelopmentJobEnum, {
  type WebAndMobileDevelopmentJob,
} from '@/lib/enums/jobs/webAndMobileDevelopment';

type PossibleJob =
  | BusinessAnalyticJob
  | WebAndMobileDevelopmentJob
  | ServiceManagementProgramJob;

type RecordPossibleJobAny = Record<PossibleJob, number>;

type RecordOfTasksWithGrades = Record<
  InternshipTask,
  (Pick<InternshipCalculation, 'job'> | 1 | 2 | 3 | 4 | 5)[]
>;

type InternshipResultProps = {
  internshipResult: Omit<InternshipResult, 'status'>;
  specialization: Specialization;
};

function mapGradeAndTaskOnly(calculations: InternshipCalculation[]) {
  let tasks = {};
  calculations.forEach((i) => {
    tasks = {
      ...tasks,
      [i.task]: [i.gradeRating, i.job],
    };
  });
  return tasks as RecordOfTasksWithGrades;
}

function filteredInternshipCalculation(specialization: Specialization) {
  return internship.filter((info) => info.specialization === specialization);
}

// This will return the calculation for the internship result.
export default function internshipResult(props: InternshipResultProps) {
  const { internshipResult, specialization } = props;
  const isITCompanyGrade = internshipResult.isITCompany ? 100 : 50;

  let jobs: PossibleJob[] = [];
  switch (specialization) {
    case 'BUSINESS_ANALYTICS':
      jobs = businessAnalyticJobEnum.options;
      break;
    case 'SERVICE_MANAGEMENT_PROGRAM':
      jobs = serviceManagementProgramJobEnum.options;
      break;
    case 'WEB_AND_MOBILE_DEVELOPMENT':
      jobs = webAndMobileDevelopmentJobEnum.options;
      break;
  }

  /** This will hold all tasks, useful for getting the important tasks. */
  const allTasksHolder: InternshipCalculation[][] = [];
  /** This will only show all task performed, this is useful for getting the score. */
  const allPerformedTasks = jobs.map((job) => {
    const filteredJobs = filteredInternshipCalculation(specialization).filter(
      (i) => i.job === job
    );
    const allTasks = filteredJobs;
    allTasksHolder.push(allTasks);
    const performedTasks = mapGradeAndTaskOnly(
      allTasks.filter((i) => internshipResult.tasks.includes(i.task))
    );

    return performedTasks;
  });

  // Assigning jobs to be performed calculation within.
  let tasksPerformedCalculation = {};
  jobs.forEach((job) => {
    tasksPerformedCalculation = {
      ...tasksPerformedCalculation,
      [job]: 0,
    };
  });

  const booleanSet = new Set(
    Object.values(allPerformedTasks).map((v) => Object.keys(v).length > 0)
  );
  const isStudentPerformedTasks = Array.from(booleanSet)[0];
  const tasksGrade = isStudentPerformedTasks ? 100 : 0;

  let taskPerformedCalculations: [PossibleJob, number][] = [];
  if (isStudentPerformedTasks) {
    allPerformedTasks.forEach((performedTasks) => {
      Object.entries(performedTasks).forEach((performedTask) => {
        const [grade, job] = performedTask[1] as unknown as [
          1 | 2 | 3 | 4 | 5,
          PossibleJob,
        ];
        // Summation of grades.
        (tasksPerformedCalculation as RecordPossibleJobAny)[job] += grade;
      });
    });

    const sortedTaskPerformedCalculation = Object.entries(
      tasksPerformedCalculation
    ) as [PossibleJob, number][];
    taskPerformedCalculations = sortedTaskPerformedCalculation;
  }

  // FINAL CALCULATION HERE...

  const getOneThird = 0.0001;
  const thirtyThreeDecimal = parseInt(gradeDivision, 10) * getOneThird;
  /** Grade whether the company is IT Company or not. */
  const questionGrade = isITCompanyGrade * thirtyThreeDecimal;
  /** Grade given by supervisor. */
  const internGrade = internshipResult.grade * thirtyThreeDecimal;
  /** Grade calculated based on the task performed by the student. */
  const finalTasksGrade = tasksGrade * thirtyThreeDecimal;
  const finalGrade = questionGrade + internGrade + finalTasksGrade;

  return {
    questionGrade,
    internGrade,
    finalTasksGrade,
    finalGrade,
    taskPerformedCalculations,
  };
}
