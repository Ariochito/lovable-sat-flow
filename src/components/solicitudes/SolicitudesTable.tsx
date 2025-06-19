
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Solicitud } from '@/types/sat';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface SolicitudesTableProps {
  solicitudes: Solicitud[];
  onVerificar: (requestId: string) => void;
  onDescargar: (requestId: string) => void;
  loading: boolean;
}

const getEstadoBadge = (estado: Solicitud['estado']) => {
  const colors = {
    pendiente: 'bg-yellow-500',
    procesando: 'bg-blue-500',
    listo: 'bg-green-500',
    terminado_sin_datos: 'bg-gray-500',
    error: 'bg-red-500',
    rechazado: 'bg-orange-500',
    expirado: 'bg-gray-600',
  };

  return (
    <Badge className={`${colors[estado]} text-white`}>
      {estado.replace('_', ' ').toUpperCase()}
    </Badge>
  );
};

export const SolicitudesTable: React.FC<SolicitudesTableProps> = ({
  solicitudes,
  onVerificar,
  onDescargar,
  loading
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>📋</span>
            <span>Solicitudes</span>
          </div>
          <Badge variant="outline">
            {solicitudes.length} total
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Solicitud</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Formato</TableHead>
                <TableHead>Paquetes</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {solicitudes.map((solicitud) => (
                <TableRow key={solicitud.requestId}>
                  <TableCell className="font-mono text-sm">
                    {solicitud.requestId}
                  </TableCell>
                  <TableCell>
                    {getEstadoBadge(solicitud.estado)}
                  </TableCell>
                  <TableCell>
                    {format(solicitud.fechaSolicitud, "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(solicitud.fechaInicio, "dd/MM", { locale: es })} - {format(solicitud.fechaFin, "dd/MM/yyyy", { locale: es })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {solicitud.formato.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {solicitud.paquetes.length}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onVerificar(solicitud.requestId)}
                        disabled={loading}
                      >
                        🔄
                      </Button>
                      {solicitud.estado === 'listo' && solicitud.paquetes.length > 0 && (
                        <Button
                          size="sm"
                          onClick={() => onDescargar(solicitud.requestId)}
                          disabled={loading}
                        >
                          ⬇️
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {solicitudes.length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">📭</div>
            <p className="text-gray-500 dark:text-gray-400">
              No hay solicitudes disponibles
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
