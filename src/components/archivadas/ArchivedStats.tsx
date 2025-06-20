
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Archive, ArchiveRestore, FileText, Package } from 'lucide-react';
import type { ArchivedSolicitud } from '@/types/archived';

interface ArchivedStatsProps {
  archivedSolicitudes: ArchivedSolicitud[];
}

export const ArchivedStats: React.FC<ArchivedStatsProps> = ({ archivedSolicitudes }) => {
  const stats = {
    total: archivedSolicitudes.length,
    canRestore: archivedSolicitudes.filter(s => s.canRestore).length,
    totalSize: archivedSolicitudes.reduce((acc, s) => acc + parseFloat(s.totalSize.replace(' MB', '')), 0),
    withFiles: archivedSolicitudes.filter(s => s.filesCount > 0).length
  };

  return (
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
  );
};
