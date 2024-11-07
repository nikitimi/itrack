import type { Specialization } from '@/lib/enums/specialization';
import type { UserRole } from '@/lib/enums/userRole';

export type StudentCreation = {
  role: UserRole;
  firstName: string;
  lastName: string;
  middleInitial: string;
  userId: string;
  studentNumber: string;
  specialization: Specialization;
};

export default StudentCreation;
