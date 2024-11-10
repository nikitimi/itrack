import type { Certificate } from '@/lib/enums/certificate';
import type { Specialization } from '@/lib/enums/specialization';

export type CertificateResult = {
  certificateList: { name: Certificate; fileKey: string }[];
  specialization: Specialization;
};
