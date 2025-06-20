
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Archive, ArchiveRestore, Calendar, FileText, Eye, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { ArchivedSolicitud } from '@/types/archived';

interface ArchivedTableProps {
  filteredSolicitudes: ArchivedSolicitud[];
  onRestore: (requestId: string) => void;
  onPermanentDelete: (requestId: string) => void;
}

export const ArchivedTable: React.FC<ArchivedTableProps> = ({
  filteredSolicitudes,
  onRestore,
  onPermanentDelete
}) => {
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

  return (
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
                              <p className="text-lg font-semibold">{solicitud.paquetes.length}</p>
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
                        onClick={() => onRestore(solicitud.requestId)}
                      >
                        <ArchiveRestore className="h-3 w-3 mr-1" />
                        Restaurar
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => onPermanentDelete(solicitud.requestId)}
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
  );
};
