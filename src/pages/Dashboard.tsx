
import React, { useState, useEffect } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { EstadisticasDashboard, ActividadReciente } from '@/types/sat';
import { useFiel } from '@/contexts/FielContext';

const Dashboard = () => {
  const { config } = useFiel();
  const [stats, setStats] = useState<EstadisticasDashboard>({
    solicitudesActivas: 3,
    solicitudesListas: 1,
    paquetesDescargados: 12,
    registrosProcesados: 1847,
    erroresRecientes: 0,
    espacioUsado: 245,
  });

  const [activities] = useState<ActividadReciente[]>([
    {
      id: '1',
      tipo: 'solicitud',
      descripcion: 'Nueva solicitud de XMLs emitidos creada',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      requestId: 'REQ-2024-001',
      estado: 'pendiente',
    },
    {
      id: '2',
      tipo: 'verificacion',
      descripcion: 'Verificación completada - solicitud lista',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      requestId: 'REQ-2024-002',
      estado: 'listo',
    },
    {
      id: '3',
      tipo: 'descarga',
      descripcion: 'Paquete PKG-001 descargado exitosamente',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      requestId: 'REQ-2024-003',
    },
    {
      id: '4',
      tipo: 'lectura',
      descripcion: '1,245 registros XML procesados',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      requestId: 'REQ-2024-004',
    },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Resumen general del sistema SAT
        </p>
      </div>

      {/* FIEL Status Alert */}
      {!config.isConfigured && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Configuración FIEL Pendiente
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Debe configurar sus certificados FIEL para comenzar a crear solicitudes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Solicitudes Activas"
          value={stats.solicitudesActivas}
          icon="📋"
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Solicitudes Listas"
          value={stats.solicitudesListas}
          icon="✅"
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Paquetes Descargados"
          value={stats.paquetesDescargados}
          icon="⬇️"
          color="purple"
          trend={{ value: 25, isPositive: true }}
        />
        <StatsCard
          title="Registros Procesados"
          value={stats.registrosProcesados.toLocaleString()}
          icon="📄"
          color="yellow"
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Errores Recientes"
          value={stats.erroresRecientes}
          icon="⚠️"
          color={stats.erroresRecientes > 0 ? "red" : "gray"}
          trend={{ value: 100, isPositive: false }}
        />
        <StatsCard
          title="Espacio Usado"
          value={`${stats.espacioUsado} MB`}
          icon="💾"
          color="gray"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart placeholder */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Actividad por Día
          </h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-500 dark:text-gray-400">
                Gráfico de actividad próximamente
              </p>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <ActivityTimeline activities={activities} />
      </div>

      {/* System Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Estado del Sistema
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${config.isConfigured ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Certificado FIEL
              </p>
              <p className="text-xs text-gray-500">
                {config.isConfigured ? 'Configurado' : 'Pendiente'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Conexión SAT
              </p>
              <p className="text-xs text-gray-500">
                Activa
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Espacio Disco
              </p>
              <p className="text-xs text-gray-500">
                15GB disponibles
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Atención Requerida
              </p>
              <p className="text-xs text-gray-500">
                {stats.solicitudesActivas} solicitudes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
