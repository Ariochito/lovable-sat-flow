
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, Package, Search, Eye, Download, BarChart3, Filter } from 'lucide-react';
import { useFiel } from '@/contexts/FielContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PackageFile {
  id: string;
  requestId: string;
  packageId: string;
  type: 'xml' | 'metadata';
  records: number;
  size: string;
  status: 'available' | 'read' | 'processing';
}

interface MetadataRecord {
  uuid: string;
  fechaEmision: Date;
  rfcEmisor: string;
  nombreEmisor: string;
  rfcReceptor: string;
  nombreReceptor: string;
  pacId: string;
  total: number;
  efectoComprobante: string;
  estatusComprobante: string;
}

interface XMLRecord {
  uuid: string;
  size: string;
  preview: string;
}

const LeerPaquetes = () => {
  const { isValidated } = useFiel();
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [packages] = useState<PackageFile[]>([
    {
      id: '1',
      requestId: 'REQ001',
      packageId: 'PKG123',
      type: 'metadata',
      records: 1250,
      size: '2.8 MB',
      status: 'available'
    },
    {
      id: '2',
      requestId: 'REQ001',
      packageId: 'PKG124',
      type: 'xml',
      records: 1250,
      size: '15.2 MB',
      status: 'read'
    },
    {
      id: '3',
      requestId: 'REQ002',
      packageId: 'PKG125',
      type: 'metadata',
      records: 890,
      size: '1.9 MB',
      status: 'available'
    }
  ]);

  const [metadataRecords] = useState<MetadataRecord[]>([
    {
      uuid: '12345678-1234-1234-1234-123456789012',
      fechaEmision: new Date('2024-01-15'),
      rfcEmisor: 'XAXX010101000',
      nombreEmisor: 'EMPRESA EJEMPLO SA DE CV',
      rfcReceptor: 'XEXX010101000',
      nombreReceptor: 'CLIENTE EJEMPLO SA DE CV',
      pacId: 'PAC001',
      total: 1160.0,
      efectoComprobante: 'I',
      estatusComprobante: 'Vigente'
    },
    {
      uuid: '87654321-4321-4321-4321-210987654321',
      fechaEmision: new Date('2024-01-16'),
      rfcEmisor: 'XAXX010101000',
      nombreEmisor: 'EMPRESA EJEMPLO SA DE CV',
      rfcReceptor: 'XEXX010101000',
      nombreReceptor: 'CLIENTE EJEMPLO SA DE CV',
      pacId: 'PAC001',
      total: 2320.0,
      efectoComprobante: 'I',
      estatusComprobante: 'Vigente'
    }
  ]);

  const [xmlRecords] = useState<XMLRecord[]>([
    {
      uuid: '12345678-1234-1234-1234-123456789012',
      size: '12.4 KB',
      preview: '<cfdi:Comprobante Version="4.0" Fecha="2024-01-15T10:30:00"...'
    },
    {
      uuid: '87654321-4321-4321-4321-210987654321',
      size: '11.8 KB',
      preview: '<cfdi:Comprobante Version="4.0" Fecha="2024-01-16T14:15:00"...'
    }
  ]);

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.packageId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.requestId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || pkg.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleReadPackage = async (packageId: string) => {
    if (!isValidated) {
      alert('Debe configurar su FIEL primero');
      return;
    }

    setLoading(true);
    setSelectedPackage(packageId);

    // Simular lectura de paquete
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge variant="outline">Disponible</Badge>;
      case 'read':
        return <Badge className="bg-green-500">Leído</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500">Procesando</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  if (!isValidated) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Configuración Requerida
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Debe configurar su FIEL antes de poder leer paquetes.
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
            📄 Leer Paquetes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora y analiza el contenido de los paquetes descargados
          </p>
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
                  Paquetes Disponibles
                </p>
                <p className="text-2xl font-bold">{packages.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Paquetes Leídos
                </p>
                <p className="text-2xl font-bold">
                  {packages.filter(p => p.status === 'read').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Registros
                </p>
                <p className="text-2xl font-bold">
                  {packages.reduce((acc, pkg) => acc + pkg.records, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tamaño Total
                </p>
                <p className="text-2xl font-bold">19.9 MB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por Package ID o Request ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="xml">XML</SelectItem>
                <SelectItem value="metadata">Metadata</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Explorador de Paquetes */}
      <Card>
        <CardHeader>
          <CardTitle>Explorador de Paquetes</CardTitle>
          <CardDescription>
            Selecciona un paquete para leer su contenido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package ID</TableHead>
                <TableHead>Request ID</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Tamaño</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell className="font-medium">{pkg.packageId}</TableCell>
                  <TableCell>{pkg.requestId}</TableCell>
                  <TableCell>
                    <Badge variant={pkg.type === 'xml' ? 'default' : 'secondary'}>
                      {pkg.type.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{pkg.records.toLocaleString()}</TableCell>
                  <TableCell>{pkg.size}</TableCell>
                  <TableCell>{getStatusBadge(pkg.status)}</TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => handleReadPackage(pkg.packageId)}
                      disabled={loading && selectedPackage === pkg.packageId}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      {loading && selectedPackage === pkg.packageId ? 'Leyendo...' : 'Leer'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Visualizador de Contenido */}
      {selectedPackage && (
        <Card>
          <CardHeader>
            <CardTitle>Contenido del Paquete {selectedPackage}</CardTitle>
            <CardDescription>
              Exploración detallada del contenido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metadata">
              <TabsList>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="xml">CFDIs XML</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Registros de Metadata</h3>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Exportar CSV
                    </Button>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>UUID</TableHead>
                        <TableHead>Fecha Emisión</TableHead>
                        <TableHead>RFC Emisor</TableHead>
                        <TableHead>RFC Receptor</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {metadataRecords.map((record) => (
                        <TableRow key={record.uuid}>
                          <TableCell className="font-mono text-xs">
                            {record.uuid.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {format(record.fechaEmision, 'dd/MM/yyyy', { locale: es })}
                          </TableCell>
                          <TableCell>{record.rfcEmisor}</TableCell>
                          <TableCell>{record.rfcReceptor}</TableCell>
                          <TableCell className="text-right">
                            ${record.total.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-green-500">{record.estatusComprobante}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="xml" className="mt-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">CFDIs XML</h3>
                    <Badge variant="outline">Limitado a 100 registros</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    {xmlRecords.map((xml) => (
                      <Card key={xml.uuid} className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="font-mono text-sm font-medium">
                              UUID: {xml.uuid.substring(0, 8)}...
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Tamaño: {xml.size}
                            </p>
                            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-xs">
                              {xml.preview}...
                            </div>
                          </div>
                          <div className="ml-4 space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver Completo
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>CFDI XML Completo</DialogTitle>
                                  <DialogDescription>
                                    UUID: {xml.uuid}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <Tabs defaultValue="table">
                                    <TabsList>
                                      <TabsTrigger value="table">Vista Tabla</TabsTrigger>
                                      <TabsTrigger value="xml">Vista XML</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="table" className="mt-4">
                                      <div className="space-y-2">
                                        <h4 className="font-semibold">Datos Extraídos</h4>
                                        <Table>
                                          <TableBody>
                                            <TableRow>
                                              <TableCell className="font-medium">UUID</TableCell>
                                              <TableCell>{xml.uuid}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell className="font-medium">Versión</TableCell>
                                              <TableCell>4.0</TableCell>
                                            </TableRow>
                                            <TableRow>
                                              <TableCell className="font-medium">Fecha</TableCell>
                                              <TableCell>2024-01-15T10:30:00</TableCell>
                                            </TableRow>
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </TabsContent>
                                    <TabsContent value="xml" className="mt-4">
                                      <div className="bg-gray-900 p-4 rounded-lg overflow-x-auto">
                                        <code className="text-green-400 text-sm whitespace-pre">
                                          {`<?xml version="1.0" encoding="UTF-8"?>
<cfdi:Comprobante xmlns:cfdi="http://www.sat.gob.mx/cfd/4"
  Version="4.0"
  Fecha="2024-01-15T10:30:00"
  TipoDeComprobante="I"
  Total="1160.00">
  <!-- Contenido completo del XML aquí -->
</cfdi:Comprobante>`}
                                        </code>
                                      </div>
                                    </TabsContent>
                                  </Tabs>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Descargar
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Estadísticas del Paquete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total de registros:</span>
                          <span className="font-semibold">1,250</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Suma de montos:</span>
                          <span className="font-semibold">$2,890,450.00</span>
                        </div>
                        <div className="flex justify-between">
                          <span>RFCs únicos:</span>
                          <span className="font-semibold">45</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duplicados detectados:</span>
                          <span className="font-semibold text-red-600">0</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución por Mes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Enero 2024</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '70%'}}></div>
                            </div>
                            <span className="text-sm">875</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Febrero 2024</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full" style={{width: '30%'}}></div>
                            </div>
                            <span className="text-sm">375</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeerPaquetes;
