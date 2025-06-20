
import type { Solicitud } from '@/types/sat';

export interface ArchivedSolicitud extends Solicitud {
  archivedDate: Date;
  reason: string;
  filesCount: number;
  totalSize: string;
  canRestore: boolean;
}

export type ArchiveReason = 'completed' | 'user_request' | 'error' | 'expired' | 'auto_cleanup';
