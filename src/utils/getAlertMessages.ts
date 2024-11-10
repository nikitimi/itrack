import type { UserRole } from '@/lib/enums/userRole';
/** Add admin. */
const getAlertMessages = (role: UserRole) => {
  const student = {
    forgotPassword: {
      initiateForgotPasswordError: 'Invalid email.',
    },
    verifyNewPassword: {
      eightCharacters: 'Password needs to be 8 characters long, or stronger.',
    },
    CORExtractor: {
      noFile: 'Please upload your COR file here.',
    },
    verifyEmail: {
      errorVerifying: 'Error in verifying code',
    },
    signUp: {
      cannotFetchStudentNumbers: 'Error in fetching student numbers.',
    },
    signIn: {
      needsFirstFactor:
        'Ongoing password verification failed\nPlease forgot your password again then complete the process.',
      needsIdentifier: "Account doesn't exists.",
      nullStatus: '',
    },
  } as const;

  return role === 'student' ? student : student;
};

export default getAlertMessages;
