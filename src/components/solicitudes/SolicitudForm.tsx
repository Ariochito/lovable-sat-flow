
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { SolicitudTipo, SolicitudFormato, SolicitudStatus } from '@/types/sat';

interface SolicitudFormProps {
  onSubmit: (data: {
    tipo: SolicitudTipo;
    formato: SolicitudFormato;
    status: SolicitudStatus;
    fechaInicio: Date;
    fechaFin: Date;
  }) => void;
  loading: boolean;
}

export const SolicitudForm: React.FC<SolicitudFormProps> = ({ onSubmit, loading }) => {
  const [tipo, setTipo] = useState<SolicitudTipo>('emitidos');
  const [formato, setFormato] = useState<SolicitudFormato>('xml');
  const [status, setStatus] = useState<SolicitudStatus>('active');
  const [fechaInicio, setFechaInicio] = useState<Date>();
  const [fechaFin, setFechaFin] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) return;
    
    onSubmit({
      tipo,
      formato,
      status,
      fechaInicio,
      fechaFin,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>📋</span>
          <span>Nueva Solicitud</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Tipo
              </label>
              <Select value={tipo} onValueChange={(value: SolicitudTipo) => setTipo(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emitidos">Emitidos</SelectItem>
                  <SelectItem value="recibidos">Recibidos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Formato
              </label>
              <Select value={formato} onValueChange={(value: SolicitudFormato) => setFormato(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xml">XML</SelectItem>
                  <SelectItem value="metadata">Metadata</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Estado
              </label>
              <Select value={status} onValueChange={(value: SolicitudStatus) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activos</SelectItem>
                  <SelectItem value="cancelled">Cancelados</SelectItem>
                  <SelectItem value="undefined">Todos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Fecha Inicio
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaInicio && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaInicio ? format(fechaInicio, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaInicio}
                    onSelect={setFechaInicio}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Fecha Fin
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fechaFin && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fechaFin ? format(fechaFin, "PPP", { locale: es }) : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fechaFin}
                    onSelect={setFechaFin}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || !fechaInicio || !fechaFin}
          >
            {loading ? 'Creando...' : 'Crear Solicitud'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
