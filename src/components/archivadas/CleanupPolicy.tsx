
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const CleanupPolicy: React.FC = () => {
  return (
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
  );
};
