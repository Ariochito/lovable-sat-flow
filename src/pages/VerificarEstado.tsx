
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useSolicitudes } from '@/hooks/useSolicitudes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const VerificarEstado = () => {
  const { solicitudes, verificarSolicitud, loading } = useSolicitudes();
  const [autoVerificacion, setAutoVerificacion] = useState(false);
  const [verificandoTodas, setVerificandoTodas] = useState(false);

  // Auto-verificación cada 5 minutos
  useEffect(() => {
    if (!autoVerificacion) return;

    const interval = setInterval(() => {
      console.log('Auto-verificando solicitudes...');
      solicitudes.forEach(sol => {
        if (sol.estado === 'pendiente' || sol.estado === 'procesando') {
          verificarSolicitud(sol.requestId);
        }
      });
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [autoVerificacion, solicitudes, verificarSolicitud]);

  const handleVerificarTodas = async () => {
    setVerificandoTodas(true);
    const solicitudesPendientes = solicitudes.filter(
      sol => sol.estado === 'pendiente' || sol.estado === 'procesando'
    );

    for (const solicitud of solicitudesPendientes) {
      await verificarSolicitud(solicitud.requestId);
      // Pequeña pausa entre verificaciones
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setVerificandoTodas(false);
  };

  const solicitudesPendientes = solicitudes.filter(
    sol => sol.estado === 'pendiente' || sol.estado === 'procesando'
  );

  const getEstadoColor = (estado: string) => {
    const colors = {
      pendiente: 'bg-yellow-500',
      procesando: 'bg-blue-500',
      listo: 'bg-green-500',
      terminado_sin_datos: 'bg-gray-500',
      error: 'bg-red-500',
      rechazado: 'bg-orange-500',
      expirado: 'bg-gray-600',
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-500';
  };

  const getProgressValue = (estado: string) => {
    const values = {
      pendiente: 25,
      procesando: 75,
      listo: 100,
      terminado_sin_datos: 100,
      error: 0,
      rechazado: 0,
      expirado: 0,
    };
    return values[estado as keyof typeof values] || 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Verificar Estado
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Monitoreo en tiempo real del estado de sus solicitudes
        </p>
      </div>

      {/* Panel de Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>🎛️</span>
            <span>Panel de Control</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Estadísticas */}
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Solicitudes Pendientes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {solicitudesPendientes.length}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Solicitudes
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {solicitudes.length}
                </p>
              </div>
            </div>

            {/* Controles */}
            <div className="space-y-4">
              <Button
                onClick={handleVerificarTodas}
                disabled={verificandoTodas || solicitudesPendientes.length === 0}
                className="w-full"
              >
                {verificandoTodas ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Verificando...
                  </>
                ) : (
                  '🔄 Verificar Todas'
                )}
              </Button>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-verificación
                  </p>
                  <p className="text-xs text-gray-500">
                    Cada 5 minutos
                  </p>
                </div>
                <Switch
                  checked={autoVerificacion}
                  onCheckedChange={setAutoVerificacion}
                />
              </div>
            </div>

            {/* Resumen */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Resumen de Estados
              </h4>
              {['listo', 'procesando', 'pendiente', 'error'].map(estado => {
                const count = solicitudes.filter(s => s.estado === estado).length;
                if (count === 0) return null;
                
                return (
                  <div key={estado} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${getEstadoColor(estado)}`} />
                      <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {estado.replace('_', ' ')}
                      </span>
                    </div>
                    <Badge variant="secondary">
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Solicitudes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {solicitudes.map((solicitud) => (
          <Card key={solicitud.requestId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">
                    {solicitud.requestId}
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {solicitud.formato.toUpperCase()} • {solicitud.tipo}
                  </p>
                </div>
                <Badge className={`${getEstadoColor(solicitud.estado)} text-white`}>
                  {solicitud.estado.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progreso</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {getProgressValue(solicitud.estado)}%
                  </span>
                </div>
                <Progress 
                  value={getProgressValue(solicitud.estado)} 
                  className="h-2"
                />
              </div>

              {/* Información */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Fecha Solicitud</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(solicitud.fechaSolicitud, "dd/MM/yyyy", { locale: es })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Paquetes</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {solicitud.paquetes.length}
                  </p>
                </div>
              </div>

              {/* Última verificación */}
              {solicitud.ultimaVerificacion && (
                <div className="text-xs text-gray-500">
                  Última verificación: {format(solicitud.ultimaVerificacion, "HH:mm", { locale: es })}
                </div>
              )}

              {/* Mensaje */}
              {solicitud.mensaje && (
                <div className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                  {solicitud.mensaje}
                </div>
              )}

              {/* Acciones */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => verificarSolicitud(solicitud.requestId)}
                  disabled={loading}
                  className="flex-1"
                >
                  🔄 Verificar
                </Button>
                
                {solicitud.estado === 'listo' && solicitud.paquetes.length > 0 && (
                  <Button size="sm" className="flex-1">
                    ⬇️ Descargar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {solicitudes.length === 0 && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No hay solicitudes para verificar
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Crear una nueva solicitud para comenzar el monitoreo
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VerificarEstado;
