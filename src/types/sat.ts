
export type SolicitudTipo = 'emitidos' | 'recibidos';
export type SolicitudFormato = 'xml' | 'metadata';
export type SolicitudStatus = 'active' | 'cancelled' | 'undefined';

export type SolicitudEstado = 
  | 'pendiente'
  | 'procesando' 
  | 'listo'
  | 'terminado_sin_datos'
  | 'error'
  | 'rechazado'
  | 'expirado';

export interface Solicitud {
  requestId: string;
  estado: SolicitudEstado;
  fechaSolicitud: Date;
  fechaInicio: Date;
  fechaFin: Date;
  formato: SolicitudFormato;
  tipo: SolicitudTipo;
  status: SolicitudStatus;
  paquetes: string[];
  ultimaVerificacion?: Date;
  mensaje?: string;
  isFinished?: boolean;
}

export interface PaqueteDescarga {
  packageId: string;
  requestId: string;
  tamaño: number;
  estado: 'pendiente' | 'descargando' | 'completado' | 'error';
  archivo?: string;
  fechaDescarga?: Date;
}

export interface RegistroXML {
  uuid: string;
  fechaEmision: Date;
  rfcEmisor: string;
  nombreEmisor: string;
  rfcReceptor: string;
  nombreReceptor: string;
  pacId: string;
  total: number;
  efectoComprobante: string;
  estatusComprobante: string;
}

export interface ContenidoPaquete {
  packageId: string;
  tipo: SolicitudFormato;
  registros: RegistroXML[];
  totalRegistros: number;
  fechaLectura: Date;
}

export interface EstadisticasDashboard {
  solicitudesActivas: number;
  solicitudesListas: number;
  paquetesDescargados: number;
  registrosProcesados: number;
  erroresRecientes: number;
  espacioUsado: number;
}

export interface ActividadReciente {
  id: string;
  tipo: 'solicitud' | 'verificacion' | 'descarga' | 'lectura';
  descripcion: string;
  timestamp: Date;
  requestId?: string;
  estado?: SolicitudEstado;
}
