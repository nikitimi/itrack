import calculateCareerRecord from '@/utils/calculateCareerRecord';

describe('These should return the rankings of careers for the student.', () => {
  test('', () =>
    expect(
      calculateCareerRecord(
        [
          ['DATA_ENGINEER', 91.78888888888889],
          ['DATABASE_DEVELOPER', 88.07916666666667],
          ['BUSINESS_ANALYST', 83.82166666666666],
          ['DATA_ANALYST', 79.2215873015873],
          ['SYSTEMS_ANALYST', 78.37797619047618],
        ],
        'BUSINESS_ANALYTICS'
      )
    ).toStrictEqual({
      BUSINESS_ANALYST: 3,
      DATABASE_DEVELOPER: 4,
      DATA_ANALYST: 2,
      DATA_ENGINEER: 5,
      SYSTEMS_ANALYST: 1,
    }));
});
