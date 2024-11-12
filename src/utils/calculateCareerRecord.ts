import type PossibleJob from '@/utils/types/possibleJob';
import type { Specialization } from '@/lib/enums/specialization';

import careerRecord from '@/utils/careerRecord';

export default function calculateCareerRecord(
  record: [PossibleJob, number][],
  specialization: Specialization
) {
  let careerHolder = careerRecord(specialization, 0);

  record
    .sort((a, b) => b[1] - a[1])
    .forEach(([career], index) => {
      careerHolder = {
        ...careerHolder,
        [career]: careerHolder[career] + (record.length - index),
      };
    });

  return careerHolder;
}
