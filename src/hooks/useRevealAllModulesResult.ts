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
import calculateCareerRecord from '@/utils/calculateCareerRecord';
import { Certificate } from '@/lib/enums/certificate';

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

  if (
    typeof internshipGrade === 'string' ||
    typeof internshipCompanyQuestion === 'string'
  )
    return;

  const renderGradeResult = gradeResult({ grades: _grades, specialization });
  const renderCertificateResult = certificateResult({
    // TODO: Outdated typing. remove unknown fix reducer structure.
    certificateList: _certificateList as unknown as {
      name: Certificate;
      fileKey: string;
    }[],
    specialization,
  });
  const renderInternshipResult = internshipResult({
    internshipResult: {
      grade: internshipGrade,
      tasks: internshipTasks,
      isITCompany: internshipCompanyQuestion,
    },
    specialization,
  });

  const calculatedCertificate = calculateCareerRecord(
    renderCertificateResult,
    specialization
  );
  const calculatedGrades = calculateCareerRecord(
    renderGradeResult,
    specialization
  );
  const calculatedInternship = calculateCareerRecord(
    renderInternshipResult.taskPerformedCalculations,
    specialization
  );

  return {
    calculatedCertificate,
    calculatedGrades,
    calculatedInternship,
  };
};

export default useRevealAllModulesResult;
