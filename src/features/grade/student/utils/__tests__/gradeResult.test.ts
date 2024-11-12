import type GradeInfo from '@/utils/types/gradeInfo';

import gradeResult from '@/features/grade/student/utils/gradeResult';

const one: GradeInfo = {
  semester: 'FIRST_SEMESTER',
  studentNumber: '2021201282',
  academicYear: '2021-2022',
  yearLevel: 'FIRST_YEAR',
  subjects: [
    {
      grade: '1.25',
      code: 'IT_102',
    },
    {
      grade: '1.50',
      code: 'IT_103',
    },
    {
      grade: '1.25',
      code: 'IT_104',
    },
    {
      grade: '1.25',
      code: 'RPH_101',
    },
    {
      grade: '1.50',
      code: 'AAP_101',
    },
    {
      grade: '1.75',
      code: 'STS_101',
    },
    {
      grade: '1.00',
      code: 'ARP_101',
    },
    {
      grade: '1.25',
      code: 'PE_10',
    },
    {
      grade: '1.25',
      code: 'NSTP_10',
    },
  ],
};
const two: GradeInfo = {
  semester: 'SECOND_SEMESTER',
  studentNumber: '2021201282',
  academicYear: '2021-2022',
  yearLevel: 'FIRST_YEAR',
  subjects: [
    {
      grade: '1.75',
      code: 'IT_105',
    },
    {
      grade: '1.50',
      code: 'IT_106',
    },
    {
      grade: '1.50',
      code: 'IT_107',
    },
    {
      grade: '1.00',
      code: 'PCM_101',
    },
    {
      grade: '1.00',
      code: 'MMW_101',
    },
    {
      grade: '1.50',
      code: 'UTS_101',
    },
    {
      grade: '1.25',
      code: 'PAL_101',
    },
    {
      grade: '1.00',
      code: 'PE_11',
    },
    {
      grade: '1.00',
      code: 'NSTP_11',
    },
  ],
};
const three: GradeInfo = {
  semester: 'FIRST_SEMESTER',
  studentNumber: '2021201282',
  academicYear: '2022-2023',
  yearLevel: 'SECOND_YEAR',
  subjects: [
    {
      grade: '1.75',
      code: 'IT_201',
    },
    {
      grade: '1.75',
      code: 'IT_202',
    },
    {
      grade: '2.25',
      code: 'IT_203',
    },
    {
      grade: '2.25',
      code: 'IT_204',
    },
    {
      grade: '1.75',
      code: 'IT_205',
    },
    {
      grade: '1.75',
      code: 'AAH_101',
    },
    {
      grade: '1.00',
      code: 'ETH_101',
    },
    {
      grade: '1.25',
      code: 'PE_12',
    },
  ],
};
const four: GradeInfo = {
  semester: 'SECOND_SEMESTER',
  studentNumber: '2021201282',
  academicYear: '2022-2023',
  yearLevel: 'SECOND_YEAR',
  subjects: [
    {
      grade: '1.50',
      code: 'IT_206',
    },
    {
      grade: '1.75',
      code: 'IT_207',
    },
    {
      grade: '1.25',
      code: 'IT_208',
    },
    {
      grade: '1.00',
      code: 'IT_209',
    },
    {
      grade: '1.50',
      code: 'IT_210',
    },
    {
      grade: '1.00',
      code: 'TCW_101',
    },
    {
      grade: '1.75',
      code: 'MST_101',
    },
    {
      grade: '1.25',
      code: 'PE13',
    },
  ],
};
const five: GradeInfo = {
  semester: 'FIRST_SEMESTER',
  studentNumber: '2021201282',
  academicYear: '2023-2024',
  yearLevel: 'THIRD_YEAR',
  subjects: [
    {
      grade: '1.50',
      code: 'IT_301',
    },
    {
      grade: '1.50',
      code: 'IT_302',
    },
    {
      grade: '1.50',
      code: 'IT_303',
    },
    {
      grade: '3.00',
      code: 'IT_304',
    },
    {
      grade: '1.00',
      code: 'IT_305',
    },
    {
      grade: '1.50',
      code: 'IT_306',
    },
    {
      grade: '1.50',
      code: 'IT_307',
    },
    {
      grade: '1.00',
      code: 'FL301',
    },
  ],
};
const six: GradeInfo = {
  semester: 'SECOND_SEMESTER',
  studentNumber: '2021201282',
  academicYear: '2023-2024',
  yearLevel: 'THIRD_YEAR',
  subjects: [
    {
      grade: '2.00',
      code: 'IT_308',
    },
    {
      grade: '1.50',
      code: 'IT_309',
    },
    {
      grade: '1.50',
      code: 'IT_310',
    },
    {
      grade: '1.50',
      code: 'CAP_301',
    },
    {
      grade: '1.50',
      code: 'IT_311',
    },
    {
      grade: '2.25',
      code: 'IT_312',
    },
    {
      grade: '1.00',
      code: 'FL302',
    },
    {
      grade: '1.25',
      code: 'RLW_101',
    },
  ],
};

describe("These will return the career based on the student's grades", () => {
  test('Passing student: 2021201282, grades in each subjects.', () =>
    expect(
      gradeResult({
        grades: [one, two, three, four, five, six],
        specialization: 'BUSINESS_ANALYTICS',
      })
    ).toStrictEqual([
      ['DATA_ENGINEER', 91.78888888888889],
      ['DATABASE_DEVELOPER', 88.07916666666667],
      ['BUSINESS_ANALYST', 83.82166666666666],
      ['DATA_ANALYST', 79.2215873015873],
      ['SYSTEMS_ANALYST', 78.37797619047618],
    ]));
  test('Passing insufficient COGs.', () => {
    expect(
      gradeResult({
        grades: [one, two, three, four, five],
        specialization: 'BUSINESS_ANALYTICS',
      })
    ).toStrictEqual([]);
  });
});
