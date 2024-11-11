'use client';

import { useAppSelector } from '@/hooks/redux';
import { certificateList } from '@/redux/reducers/certificateReducer';
//eslint-disable-next-line boundaries/element-types
import certificateResult from '@/features/certificate/student/utils/certificateResult';
import { studentInfoSpecialization } from '@/redux/reducers/studentInfoReducer';
import { grades } from '@/redux/reducers/gradeReducer';
//eslint-disable-next-line boundaries/element-types
import gradeResult from '@/features/grade/student/utils/gradeResult';
//eslint-disable-next-line boundaries/element-types
import internshipResult from '@/features/internship/utils/internshipResult';
import reveaAllModuleHelper from '@/utils/reveaAllModuleHelper';

const useRevealAllModulesResult = () => {
  const specialization = studentInfoSpecialization(
    useAppSelector((s) => s.studentInfo)
  );
  const _certificateList = certificateList(
    useAppSelector((s) => s.certificate)
  );
  const _grades = grades(useAppSelector((s) => s.grade));
  const { internshipGrade, internshipTasks, internshipCompanyQuestion } =
    useAppSelector((s) => s.internship);

  const renderGradeResult = gradeResult({ grades: _grades, specialization });
  const renderCertificateResult = certificateResult({
    certificateList: _certificateList,
    specialization,
  });
  const renderInternshipResult = internshipResult({
    internshipResult: {
      grade: internshipGrade === 'initializing' ? '5.00' : internshipGrade,
      tasks: internshipTasks,
      isITCompany:
        typeof internshipCompanyQuestion === 'string'
          ? false
          : internshipCompanyQuestion,
    },
    specialization,
  });
  const internship = renderInternshipResult.taskPerformedCalculations
    .sort((a, b) => b[Object.keys(b)[0]] - a[Object.keys(a)[0]])
    .map((object) => Object.entries(object)[0]);

  return reveaAllModuleHelper(
    renderCertificateResult,
    renderGradeResult,
    internship
  );
};

export default useRevealAllModulesResult;
