
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from 'lucide-react';
import type { ArchivedSolicitud } from '@/types/archived';
import { ArchivedStats } from '@/components/archivadas/ArchivedStats';
import { ArchivedFilters } from '@/components/archivadas/ArchivedFilters';
import { ArchivedTable } from '@/components/archivadas/ArchivedTable';
import { CleanupPolicy } from '@/components/archivadas/CleanupPolicy';

const Archivadas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState<string>('all');

  // Datos simulados de solicitudes archivadas
  const [archivedSolicitudes] = useState<ArchivedSolicitud[]>([
    {
      requestId: 'REQ001',
      tipo: 'emitidos',
      formato: 'xml',
      fechaInicio: new Date('2023-11-01'),
      fechaFin: new Date('2023-11-30'),
      fechaSolicitud: new Date('2023-12-01T10:30:00'),
      estado: 'terminado_sin_datos',
      status: 'active',
      mensaje: 'Solicitud completada exitosamente',
      paquetes: ['PKG001', 'PKG002', 'PKG003'],
      archivedDate: new Date('2024-01-01'),
      reason: 'completed',
      filesCount: 5,
      totalSize: '45.2 MB',
      canRestore: true
    },
    {
      requestId: 'REQ002',
      tipo: 'recibidos',
      formato: 'metadata',
      fechaInicio: new Date('2023-10-01'),
      fechaFin: new Date('2023-10-31'),
      fechaSolicitud: new Date('2023-11-15T14:20:00'),
      estado: 'listo',
      status: 'active',
      mensaje: 'Paquetes listos para descarga',
      paquetes: ['PKG004', 'PKG005'],
      archivedDate: new Date('2024-01-05'),
      reason: 'user_request',
      filesCount: 8,
      totalSize: '12.8 MB',
      canRestore: true
    },
    {
      requestId: 'REQ003',
      tipo: 'emitidos',
      formato: 'xml',
      fechaInicio: new Date('2023-09-01'),
      fechaFin: new Date('2023-09-30'),
      fechaSolicitud: new Date('2023-10-10T09:15:00'),
      estado: 'error',
      status: 'cancelled',
      mensaje: 'Error en la solicitud - tiempo de espera agotado',
      paquetes: [],
      archivedDate: new Date('2024-01-10'),
      reason: 'error',
      filesCount: 0,
      totalSize: '0 MB',
      canRestore: false
    },
    {
      requestId: 'REQ004',
      tipo: 'recibidos',
      formato: 'xml',
      fechaInicio: new Date('2023-08-01'),
      fechaFin: new Date('2023-08-31'),
      fechaSolicitud: new Date('2023-09-05T16:45:00'),
      estado: 'expirado',
      status: 'cancelled',
      mensaje: 'Solicitud expirada - no se pudo completar',
      paquetes: [],
      archivedDate: new Date('2024-01-15'),
      reason: 'expired',
      filesCount: 0,
      totalSize: '0 MB',
      canRestore: false
    }
  ]);

  // Filtrar solicitudes archivadas
  const filteredSolicitudes = archivedSolicitudes.filter(solicitud => {
    const matchesSearch = solicitud.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solicitud.mensaje.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReason = filterReason === 'all' || solicitud.reason === filterReason;
    
    return matchesSearch && matchesReason;
  });

  const handleRestore = (requestId: string) => {
    console.log('Restaurando solicitud:', requestId);
    // Aquí iría la lógica para restaurar la solicitud
  };

  const handlePermanentDelete = (requestId: string) => {
    console.log('Eliminando permanentemente:', requestId);
    // Aquí iría la lógica para eliminar permanentemente
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            🗃️ Archivadas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestión de solicitudes archivadas y completadas
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Lista
          </Button>
          <Button variant="outline" className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Limpieza Masiva
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <ArchivedStats archivedSolicitudes={archivedSolicitudes} />

      {/* Filtros */}
      <ArchivedFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterReason={filterReason}
        setFilterReason={setFilterReason}
      />

      {/* Tabla de Solicitudes Archivadas */}
      <ArchivedTable
        filteredSolicitudes={filteredSolicitudes}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
      />

      {/* Información de Limpieza Automática */}
      <CleanupPolicy />
    </div>
  );
};

export default Archivadas;
