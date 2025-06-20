
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Archive, ArchiveRestore, Search, FileText, Download, Trash2, Calendar, Package, Eye } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Solicitud } from '@/types/sat';

interface ArchivedSolicitud extends Solicitud {
  archivedDate: Date;
  reason: string;
  filesCount: number;
  totalSize: string;
  canRestore: boolean;
}

const Archivadas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState<string>('all');
  const [selectedSolicitud, setSelectedSolicitud] = useState<ArchivedSolicitud | null>(null);

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
      mensaje: 'Solicitud completada exitosamente',
      paquetes: 3,
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
      mensaje: 'Paquetes listos para descarga',
      paquetes: 2,
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
      mensaje: 'Error en la solicitud - tiempo de espera agotado',
      paquetes: 0,
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
      mensaje: 'Solicitud expirada - no se pudo completar',
      paquetes: 0,
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

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'listo':
        return <Badge className="bg-green-500">Listo</Badge>;
      case 'terminado_sin_datos':
        return <Badge className="bg-gray-500">Terminado</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'expirado':
        return <Badge className="bg-gray-600">Expirado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'completed':
        return <Badge className="bg-blue-500">Completada</Badge>;
      case 'user_request':
        return <Badge className="bg-purple-500">Usuario</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'expired':
        return <Badge className="bg-gray-500">Expirada</Badge>;
      case 'auto_cleanup':
        return <Badge className="bg-orange-500">Auto-limpieza</Badge>;
      default:
        return <Badge variant="outline">{reason}</Badge>;
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'completed':
        return 'Solicitud completada exitosamente';
      case 'user_request':
        return 'Archivada por solicitud del usuario';
      case 'error':
        return 'Archivada debido a errores';
      case 'expired':
        return 'Solicitud expirada automáticamente';
      case 'auto_cleanup':
        return 'Limpieza automática del sistema';
      default:
        return 'Motivo desconocido';
    }
  };

  const handleRestore = (requestId: string) => {
    console.log('Restaurando solicitud:', requestId);
    // Aquí iría la lógica para restaurar la solicitud
  };

  const handlePermanentDelete = (requestId: string) => {
    console.log('Eliminando permanentemente:', requestId);
    // Aquí iría la lógica para eliminar permanentemente
  };

  const stats = {
    total: archivedSolicitudes.length,
    canRestore: archivedSolicitudes.filter(s => s.canRestore).length,
    totalSize: archivedSolicitudes.reduce((acc, s) => acc + parseFloat(s.totalSize.replace(' MB', '')), 0),
    withFiles: archivedSolicitudes.filter(s => s.filesCount > 0).length
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Archive className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Archivadas
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArchiveRestore className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Restaurables
                </p>
                <p className="text-2xl font-bold">{stats.canRestore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Con Archivos
                </p>
                <p className="text-2xl font-bold">{stats.withFiles}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Espacio Total
                </p>
                <p className="text-2xl font-bold">{stats.totalSize.toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por Request ID o mensaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterReason} onValueChange={setFilterReason}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Motivo de archivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los motivos</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="user_request">Usuario</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="expired">Expiradas</SelectItem>
                <SelectItem value="auto_cleanup">Auto-limpieza</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Solicitudes Archivadas */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Archivadas</CardTitle>
          <CardDescription>
            Lista de todas las solicitudes archivadas ({filteredSolicitudes.length} elementos)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Tipo/Formato</TableHead>
                <TableHead>Estado Final</TableHead>
                <TableHead>Motivo Archivo</TableHead>
                <TableHead>Fecha Archivo</TableHead>
                <TableHead>Archivos</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSolicitudes.map((solicitud) => (
                <TableRow key={solicitud.requestId}>
                  <TableCell className="font-medium">{solicitud.requestId}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={solicitud.tipo === 'emitidos' ? 'default' : 'secondary'}>
                        {solicitud.tipo}
                      </Badge>
                      <Badge variant="outline" className="ml-1">
                        {solicitud.formato}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(solicitud.estado)}</TableCell>
                  <TableCell>{getReasonBadge(solicitud.reason)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">
                        {format(solicitud.archivedDate, 'dd/MM/yyyy', { locale: es })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <FileText className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">{solicitud.filesCount}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{solicitud.totalSize}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Ver
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalles de Solicitud Archivada</DialogTitle>
                            <DialogDescription>
                              Request ID: {solicitud.requestId}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Tipo de Solicitud
                                </label>
                                <p>{solicitud.tipo} - {solicitud.formato}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Estado Final
                                </label>
                                <div className="mt-1">
                                  {getEstadoBadge(solicitud.estado)}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Período Consultado
                                </label>
                                <p>
                                  {format(solicitud.fechaInicio, 'dd/MM/yyyy', { locale: es })} - {' '}
                                  {format(solicitud.fechaFin, 'dd/MM/yyyy', { locale: es })}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Fecha de Solicitud
                                </label>
                                <p>
                                  {format(solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm', { locale: es })}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Fecha de Archivo
                                </label>
                                <p>
                                  {format(solicitud.archivedDate, 'dd/MM/yyyy HH:mm', { locale: es })}
                                </p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Motivo de Archivo
                                </label>
                                <div className="mt-1">
                                  {getReasonBadge(solicitud.reason)}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {getReasonText(solicitud.reason)}
                                </p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                Último Mensaje
                              </label>
                              <p className="mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                                {solicitud.mensaje}
                              </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Paquetes
                                </label>
                                <p className="text-lg font-semibold">{solicitud.paquetes}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Archivos
                                </label>
                                <p className="text-lg font-semibold">{solicitud.filesCount}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  Tamaño Total
                                </label>
                                <p className="text-lg font-semibold">{solicitud.totalSize}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {solicitud.canRestore && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleRestore(solicitud.requestId)}
                        >
                          <ArchiveRestore className="h-3 w-3 mr-1" />
                          Restaurar
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handlePermanentDelete(solicitud.requestId)}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredSolicitudes.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Archive className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No se encontraron solicitudes archivadas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de Limpieza Automática */}
      <Card>
        <CardHeader>
          <CardTitle>Política de Archivo Automático</CardTitle>
          <CardDescription>
            Configuración del sistema para el archivado automático de solicitudes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Reglas de Archivo</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Solicitudes completadas después de 90 días</li>
                <li>• Solicitudes con error después de 30 días</li>
                <li>• Solicitudes expiradas inmediatamente</li>
                <li>• Archivos sin actividad después de 180 días</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Próxima Limpieza</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Fecha programada:</span>
                  <span className="font-medium">
                    {format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy', { locale: es })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Candidatas a archivo:</span>
                  <span className="font-medium">12 solicitudes</span>
                </div>
                <div className="flex justify-between">
                  <span>Espacio a liberar:</span>
                  <span className="font-medium">156 MB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Archivadas;
