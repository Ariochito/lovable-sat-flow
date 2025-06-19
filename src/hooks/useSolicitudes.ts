
import { useState, useEffect } from 'react';
import { Solicitud, SolicitudTipo, SolicitudFormato, SolicitudStatus } from '@/types/sat';
import { useFiel } from '@/contexts/FielContext';
import { toast } from '@/hooks/use-toast';

export const useSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const { config } = useFiel();

  // Datos de ejemplo para demostración
  const solicitudesDemo: Solicitud[] = [
    {
      requestId: 'REQ-2024-001',
      estado: 'listo',
      fechaSolicitud: new Date('2024-01-15'),
      fechaInicio: new Date('2024-01-01'),
      fechaFin: new Date('2024-01-31'),
      formato: 'xml',
      tipo: 'emitidos',
      status: 'active',
      paquetes: ['PKG-001', 'PKG-002'],
      ultimaVerificacion: new Date(),
    },
    {
      requestId: 'REQ-2024-002',
      estado: 'procesando',
      fechaSolicitud: new Date('2024-01-16'),
      fechaInicio: new Date('2024-02-01'),
      fechaFin: new Date('2024-02-28'),
      formato: 'metadata',
      tipo: 'recibidos',
      status: 'active',
      paquetes: [],
      ultimaVerificacion: new Date(),
    },
    {
      requestId: 'REQ-2024-003',
      estado: 'pendiente',
      fechaSolicitud: new Date('2024-01-17'),
      fechaInicio: new Date('2024-03-01'),
      fechaFin: new Date('2024-03-31'),
      formato: 'xml',
      tipo: 'emitidos',
      status: 'active',
      paquetes: [],
    },
  ];

  const crearSolicitud = async (
    tipo: SolicitudTipo,
    formato: SolicitudFormato,
    status: SolicitudStatus,
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    if (!config.isConfigured) {
      toast({
        title: "Error",
        description: "Debe configurar primero su FIEL",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      // Simular llamada al backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const nuevaSolicitud: Solicitud = {
        requestId: `REQ-${Date.now()}`,
        estado: 'pendiente',
        fechaSolicitud: new Date(),
        fechaInicio,
        fechaFin,
        formato,
        tipo,
        status,
        paquetes: [],
      };

      setSolicitudes(prev => [nuevaSolicitud, ...prev]);
      
      toast({
        title: "Solicitud creada",
        description: `Solicitud ${nuevaSolicitud.requestId} creada exitosamente`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la solicitud",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verificarSolicitud = async (requestId: string) => {
    setSolicitudes(prev => prev.map(sol => {
      if (sol.requestId === requestId) {
        // Simular cambio de estado
        const estados: Solicitud['estado'][] = ['procesando', 'listo', 'terminado_sin_datos'];
        const nuevoEstado = estados[Math.floor(Math.random() * estados.length)];
        
        return {
          ...sol,
          estado: nuevoEstado,
          ultimaVerificacion: new Date(),
          paquetes: nuevoEstado === 'listo' ? ['PKG-' + Date.now()] : sol.paquetes,
        };
      }
      return sol;
    }));
  };

  const listarSolicitudes = async () => {
    setLoading(true);
    try {
      // Simular carga desde backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSolicitudes(solicitudesDemo);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al cargar solicitudes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listarSolicitudes();
  }, []);

  return {
    solicitudes,
    loading,
    crearSolicitud,
    verificarSolicitud,
    listarSolicitudes,
  };
};
