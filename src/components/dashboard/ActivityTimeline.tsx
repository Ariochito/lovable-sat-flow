
import React from 'react';
import { ActividadReciente } from '@/types/sat';
import { Badge } from '@/components/ui/badge';

interface ActivityTimelineProps {
  activities: ActividadReciente[];
}

const getActivityIcon = (tipo: ActividadReciente['tipo']) => {
  switch (tipo) {
    case 'solicitud': return '📋';
    case 'verificacion': return '🔄';
    case 'descarga': return '⬇️';
    case 'lectura': return '📄';
    default: return '📝';
  }
};

const getActivityColor = (tipo: ActividadReciente['tipo']) => {
  switch (tipo) {
    case 'solicitud': return 'bg-blue-500';
    case 'verificacion': return 'bg-yellow-500';
    case 'descarga': return 'bg-green-500';
    case 'lectura': return 'bg-purple-500';
    default: return 'bg-gray-500';
  }
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actividad Reciente
      </h3>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div className={`w-8 h-8 rounded-full ${getActivityColor(activity.tipo)} flex items-center justify-center flex-shrink-0`}>
              <span className="text-white text-sm">
                {getActivityIcon(activity.tipo)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-white">
                {activity.descripcion}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleString()}
                </span>
                {activity.requestId && (
                  <Badge variant="outline" className="text-xs">
                    {activity.requestId}
                  </Badge>
                )}
                {activity.estado && (
                  <Badge className="text-xs" style={{ backgroundColor: `var(--sat-${activity.estado})` }}>
                    {activity.estado}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-500 dark:text-gray-400">
            No hay actividad reciente
          </p>
        </div>
      )}
    </div>
  );
};
