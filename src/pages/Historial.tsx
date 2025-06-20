
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Filter, Search, Clock, Activity, FileText, Package } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface HistoryActivity {
  id: string;
  type: 'solicitud' | 'verificacion' | 'descarga' | 'lectura' | 'configuracion';
  action: string;
  details: string;
  timestamp: Date;
  requestId?: string;
  packageId?: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: string;
}

interface HistoryStats {
  totalActivities: number;
  successRate: number;
  avgProcessingTime: string;
  dataProcessed: string;
}

const Historial = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month'>('day');

  // Datos simulados de historial
  const [activities] = useState<HistoryActivity[]>([
    {
      id: '1',
      type: 'solicitud',
      action: 'Solicitud Creada',
      details: 'Nueva solicitud de CFDIs emitidos para enero 2024',
      timestamp: new Date('2024-01-15T10:30:00'),
      requestId: 'REQ001',
      status: 'success',
      duration: '2.5s'
    },
    {
      id: '2',
      type: 'verificacion',
      action: 'Verificación Automática',
      details: 'Estado verificado: procesando → listo',
      timestamp: new Date('2024-01-15T11:45:00'),
      requestId: 'REQ001',
      status: 'success',
      duration: '1.2s'
    },
    {
      id: '3',
      type: 'descarga',
      action: 'Paquete Descargado',
      details: 'Descarga completada: 1,250 registros (15.2 MB)',
      timestamp: new Date('2024-01-15T12:00:00'),
      requestId: 'REQ001',
      packageId: 'PKG123',
      status: 'success',
      duration: '45.3s'
    },
    {
      id: '4',
      type: 'lectura',
      action: 'Contenido Leído',
      details: 'Análisis de metadata completado',
      timestamp: new Date('2024-01-15T12:15:00'),
      packageId: 'PKG123',
      status: 'success',
      duration: '8.7s'
    },
    {
      id: '5',
      type: 'configuracion',
      action: 'FIEL Actualizada',
      details: 'Certificado validado correctamente',
      timestamp: new Date('2024-01-14T09:00:00'),
      status: 'success',
      duration: '3.1s'
    },
    {
      id: '6',
      type: 'verificacion',
      action: 'Error de Verificación',
      details: 'Tiempo de espera agotado en la consulta',
      timestamp: new Date('2024-01-13T16:30:00'),
      requestId: 'REQ002',
      status: 'error',
      duration: '30.0s'
    }
  ]);

  const stats: HistoryStats = {
    totalActivities: activities.length,
    successRate: (activities.filter(a => a.status === 'success').length / activities.length) * 100,
    avgProcessingTime: '12.3s',
    dataProcessed: '47.8 MB'
  };

  // Filtrar actividades
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.requestId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.packageId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    
    const activityDate = activity.timestamp;
    const matchesDate = activityDate >= dateRange.from && activityDate <= dateRange.to;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  // Agrupar actividades por período
  const groupedActivities = filteredActivities.reduce((groups, activity) => {
    let key: string;
    const date = activity.timestamp;
    
    switch (groupBy) {
      case 'day':
        key = format(date, 'yyyy-MM-dd');
        break;
      case 'week':
        key = format(date, 'yyyy-MM') + '-W' + Math.ceil(date.getDate() / 7);
        break;
      case 'month':
        key = format(date, 'yyyy-MM');
        break;
      default:
        key = format(date, 'yyyy-MM-dd');
    }
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(activity);
    return groups;
  }, {} as Record<string, HistoryActivity[]>);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'solicitud':
        return <FileText className="h-4 w-4" />;
      case 'verificacion':
        return <Clock className="h-4 w-4" />;
      case 'descarga':
        return <Download className="h-4 w-4" />;
      case 'lectura':
        return <Package className="h-4 w-4" />;
      case 'configuracion':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Éxito</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Advertencia</Badge>;
      case 'info':
        return <Badge className="bg-blue-500">Info</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'solicitud':
        return 'border-l-blue-500';
      case 'verificacion':
        return 'border-l-yellow-500';
      case 'descarga':
        return 'border-l-green-500';
      case 'lectura':
        return 'border-l-purple-500';
      case 'configuracion':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📊 Historial
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Registro completo de todas las actividades del sistema
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Historial
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Actividades
                </p>
                <p className="text-2xl font-bold">{stats.totalActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tasa de Éxito
                </p>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Tiempo Promedio
                </p>
                <p className="text-2xl font-bold">{stats.avgProcessingTime}</p>
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
                  Datos Procesados
                </p>
                <p className="text-2xl font-bold">{stats.dataProcessed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar actividades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de actividad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las actividades</SelectItem>
                <SelectItem value="solicitud">Solicitudes</SelectItem>
                <SelectItem value="verificacion">Verificaciones</SelectItem>
                <SelectItem value="descarga">Descargas</SelectItem>
                <SelectItem value="lectura">Lecturas</SelectItem>
                <SelectItem value="configuracion">Configuración</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="success">Éxito</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Advertencia</SelectItem>
                <SelectItem value="info">Información</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "dd/MM/yyyy")} -{" "}
                        {format(dateRange.to, "dd/MM/yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={{
                    from: dateRange?.from,
                    to: dateRange?.to,
                  }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Select value={groupBy} onValueChange={(value) => setGroupBy(value as 'day' | 'week' | 'month')}>
              <SelectTrigger>
                <SelectValue placeholder="Agrupar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Por día</SelectItem>
                <SelectItem value="week">Por semana</SelectItem>
                <SelectItem value="month">Por mes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline de Actividades */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline de Actividades</CardTitle>
          <CardDescription>
            Historial cronológico de todas las operaciones ({filteredActivities.length} actividades)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(groupedActivities)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([period, periodActivities]) => (
                <div key={period}>
                  <h3 className="font-semibold text-lg mb-4 text-gray-900 dark:text-white">
                    {format(new Date(periodActivities[0].timestamp), 
                      groupBy === 'day' ? 'dd \'de\' MMMM \'de\' yyyy' :
                      groupBy === 'week' ? 'MMMM yyyy - Semana' :
                      'MMMM yyyy', 
                      { locale: es }
                    )}
                    <Badge variant="outline" className="ml-2">
                      {periodActivities.length} actividades
                    </Badge>
                  </h3>
                  
                  <div className="space-y-3">
                    {periodActivities
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .map((activity) => (
                        <Card key={activity.id} className={cn("border-l-4", getTypeColor(activity.type))}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-3">
                                <div className="mt-1">
                                  {getActivityIcon(activity.type)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold">{activity.action}</h4>
                                    {getStatusBadge(activity.status)}
                                    {activity.duration && (
                                      <Badge variant="outline" className="text-xs">
                                        {activity.duration}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                    {activity.details}
                                  </p>
                                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-3 w-3" />
                                      <span>
                                        {format(activity.timestamp, 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                                      </span>
                                    </div>
                                    {activity.requestId && (
                                      <div className="flex items-center space-x-1">
                                        <FileText className="h-3 w-3" />
                                        <span>Request: {activity.requestId}</span>
                                      </div>
                                    )}
                                    {activity.packageId && (
                                      <div className="flex items-center space-x-1">
                                        <Package className="h-3 w-3" />
                                        <span>Package: {activity.packageId}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              ))}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No se encontraron actividades con los filtros seleccionados</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Historial;
