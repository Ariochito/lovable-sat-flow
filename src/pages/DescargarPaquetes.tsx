
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Download, FileText, Package, Search, HardDrive, Calendar } from 'lucide-react';
import { useFiel } from '@/contexts/FielContext';
import { useSolicitudes } from '@/hooks/useSolicitudes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface DownloadProgress {
  packageId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'error';
  fileName?: string;
  fileSize?: string;
}

interface DownloadedFile {
  id: string;
  packageId: string;
  requestId: string;
  fileName: string;
  fileSize: string;
  downloadDate: Date;
  type: 'xml' | 'metadata';
}

const DescargarPaquetes = () => {
  const { isValidated } = useFiel();
  const { solicitudes, loading } = useSolicitudes();
  const [searchTerm, setSearchTerm] = useState('');
  const [downloadProgress, setDownloadProgress] = useState<Map<string, DownloadProgress>>(new Map());
  const [downloadedFiles, setDownloadedFiles] = useState<DownloadedFile[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);

  // Filtrar solicitudes listas para descarga
  const readySolicitudes = solicitudes.filter(s => s.estado === 'listo');
  
  // Filtrar por término de búsqueda
  const filteredSolicitudes = readySolicitudes.filter(s => 
    s.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simular datos de archivos descargados
  useEffect(() => {
    const mockFiles: DownloadedFile[] = [
      {
        id: '1',
        packageId: 'PKG123',
        requestId: 'REQ001',
        fileName: 'XAXX010101000_202401_XML.zip',
        fileSize: '15.2 MB',
        downloadDate: new Date('2024-01-15'),
        type: 'xml'
      },
      {
        id: '2',
        packageId: 'PKG124',
        requestId: 'REQ001',
        fileName: 'XAXX010101000_202401_METADATA.zip',
        fileSize: '2.8 MB',
        downloadDate: new Date('2024-01-15'),
        type: 'metadata'
      }
    ];
    setDownloadedFiles(mockFiles);
    setStorageUsed(18.0); // MB
  }, []);

  const handleDownload = async (packageId: string, requestId: string) => {
    if (!isValidated) {
      alert('Debe configurar su FIEL primero');
      return;
    }

    const newProgress: DownloadProgress = {
      packageId,
      progress: 0,
      status: 'downloading'
    };

    setDownloadProgress(prev => new Map(prev.set(packageId, newProgress)));

    // Simular descarga con progreso
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const current = prev.get(packageId);
        if (current && current.progress < 100) {
          const updated = {
            ...current,
            progress: Math.min(current.progress + 10, 100)
          };
          
          if (updated.progress === 100) {
            updated.status = 'completed';
            updated.fileName = `${packageId}_${requestId}.zip`;
            updated.fileSize = '12.5 MB';
            clearInterval(interval);
          }
          
          return new Map(prev.set(packageId, updated));
        }
        return prev;
      });
    }, 500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pendiente</Badge>;
      case 'downloading':
        return <Badge className="bg-blue-500">Descargando</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completado</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  if (!isValidated) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Configuración Requerida
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Debe configurar su FIEL antes de poder descargar paquetes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            ⬇️ Descargar Paquetes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona y descarga los paquetes de comprobantes fiscales
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <HardDrive className="h-4 w-4" />
          <span>Espacio usado: {storageUsed} MB</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Listos para Descarga
                </p>
                <p className="text-2xl font-bold">{readySolicitudes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Archivos Descargados
                </p>
                <p className="text-2xl font-bold">{downloadedFiles.length}</p>
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
                  En Progreso
                </p>
                <p className="text-2xl font-bold">
                  {Array.from(downloadProgress.values()).filter(p => p.status === 'downloading').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <HardDrive className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Espacio Total
                </p>
                <p className="text-2xl font-bold">{storageUsed.toFixed(1)} MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por Request ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Solicitudes Listas para Descarga */}
      <Card>
        <CardHeader>
          <CardTitle>Solicitudes Listas para Descarga</CardTitle>
          <CardDescription>
            Solicitudes con paquetes disponibles para descargar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Cargando solicitudes...</div>
          ) : filteredSolicitudes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay solicitudes listas para descarga
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSolicitudes.map((solicitud) => (
                <Card key={solicitud.requestId} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{solicitud.requestId}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {solicitud.tipo} • {solicitud.formato} • 
                          {format(solicitud.fechaSolicitud, 'dd/MM/yyyy HH:mm', { locale: es })}
                        </p>
                      </div>
                      <Badge className="bg-green-500">Listo</Badge>
                    </div>

                    <div className="space-y-2">
                      {/* Simular paquetes disponibles */}
                      {['PKG123', 'PKG124', 'PKG125'].map((packageId) => {
                        const progress = downloadProgress.get(packageId);
                        return (
                          <div key={packageId} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Package className="h-4 w-4 text-gray-600" />
                              <div>
                                <p className="font-medium">{packageId}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Tamaño estimado: 12.5 MB
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {progress && progress.status === 'downloading' && (
                                <div className="w-32">
                                  <Progress value={progress.progress} className="h-2" />
                                  <p className="text-xs text-gray-600 mt-1">
                                    {progress.progress}%
                                  </p>
                                </div>
                              )}
                              
                              {getStatusBadge(progress?.status || 'pending')}
                              
                              <Button
                                size="sm"
                                onClick={() => handleDownload(packageId, solicitud.requestId)}
                                disabled={progress?.status === 'downloading' || progress?.status === 'completed'}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                {progress?.status === 'completed' ? 'Descargado' : 'Descargar'}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Archivos Descargados */}
      <Card>
        <CardHeader>
          <CardTitle>Archivos Descargados</CardTitle>
          <CardDescription>
            Historial de archivos descargados y almacenados localmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Archivo</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Package ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Fecha Descarga</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {downloadedFiles.map((file) => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">{file.fileName}</TableCell>
                  <TableCell>{file.requestId}</TableCell>
                  <TableCell>{file.packageId}</TableCell>
                  <TableCell>
                    <Badge variant={file.type === 'xml' ? 'default' : 'secondary'}>
                      {file.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{file.fileSize}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">
                        {format(file.downloadDate, 'dd/MM/yyyy HH:mm', { locale: es })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3 mr-1" />
                        Re-descargar
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        Leer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DescargarPaquetes;
