import { z } from 'zod';
import semesterEnum from '@/lib/enums/semester';
import gradeLevelEnum from '@/lib/enums/gradeLevel';
import subjectCodesFor2018CurriculumEnum from '../enums/subjectCodesFor2018Curriculum';

export type GradeInfo = z.infer<typeof gradeInfoSchema>;

const gradeInfoSchema = z.object({
  studentNumber: z.string().default('2012345678'),
  academicYear: z.string(),
  semester: semesterEnum,
  yearLevel: gradeLevelEnum,
  subjects: z.array(
    z.object({ code: subjectCodesFor2018CurriculumEnum, grade: z.string() })
  ),
});

export default gradeInfoSchema;
