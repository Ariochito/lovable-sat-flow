
import React from 'react';
import { SolicitudForm } from '@/components/solicitudes/SolicitudForm';
import { SolicitudesTable } from '@/components/solicitudes/SolicitudesTable';
import { useSolicitudes } from '@/hooks/useSolicitudes';
import { toast } from '@/hooks/use-toast';

const Solicitudes = () => {
  const { solicitudes, loading, crearSolicitud, verificarSolicitud } = useSolicitudes();

  const handleCrearSolicitud = async (data: any) => {
    const success = await crearSolicitud(
      data.tipo,
      data.formato,
      data.status,
      data.fechaInicio,
      data.fechaFin
    );
    
    if (success) {
      console.log('Solicitud creada exitosamente');
    }
  };

  const handleVerificar = async (requestId: string) => {
    await verificarSolicitud(requestId);
    toast({
      title: "Verificación iniciada",
      description: `Verificando estado de ${requestId}`,
    });
  };

  const handleDescargar = (requestId: string) => {
    toast({
      title: "Descarga iniciada",
      description: `Iniciando descarga de paquetes para ${requestId}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Solicitudes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gestione sus solicitudes de comprobantes fiscales
        </p>
      </div>

      {/* Nueva Solicitud */}
      <SolicitudForm 
        onSubmit={handleCrearSolicitud}
        loading={loading}
      />

      {/* Tabla de Solicitudes */}
      <SolicitudesTable
        solicitudes={solicitudes}
        onVerificar={handleVerificar}
        onDescargar={handleDescargar}
        loading={loading}
      />
    </div>
  );
};

export default Solicitudes;
