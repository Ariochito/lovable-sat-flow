
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFiel } from '@/contexts/FielContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ConfiguracionFiel = () => {
  const { config, validateFiel } = useFiel();
  const [loading, setLoading] = useState(false);
  const [cerFile, setCerFile] = useState<File | null>(null);
  const [keyFile, setKeyFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cerFile || !keyFile || !password) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    if (!cerFile.name.endsWith('.cer') || !keyFile.name.endsWith('.key')) {
      toast({
        title: "Error",
        description: "Verifique las extensiones de archivo (.cer y .key)",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const success = await validateFiel(cerFile, keyFile, password);
      if (success) {
        toast({
          title: "FIEL Configurada",
          description: "Sus certificados han sido validados exitosamente",
        });
        // Limpiar formulario
        setCerFile(null);
        setKeyFile(null);
        setPassword('');
      } else {
        toast({
          title: "Error de validación",
          description: "No se pudieron validar los certificados",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al procesar los certificados",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cer' | 'key') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'cer') {
        setCerFile(file);
      } else {
        setKeyFile(file);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Configuración FIEL
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure sus certificados de Firma Electrónica Avanzada
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estado Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📋</span>
              <span>Estado Actual</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.isConfigured ? (
              <>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-700 dark:text-green-300 font-medium">
                      FIEL Configurada
                    </span>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    Activa
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      RFC Detectado
                    </Label>
                    <p className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                      {config.rfc}
                    </p>
                  </div>

                  {config.lastValidation && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Última Validación
                      </Label>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {format(config.lastValidation, "PPP 'a las' HH:mm", { locale: es })}
                      </p>
                    </div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setCerFile(null);
                    setKeyFile(null);
                    setPassword('');
                  }}
                >
                  🔄 Cambiar Certificados
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">⚠️</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  FIEL No Configurada
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Configure sus certificados para comenzar a usar el sistema
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulario de Configuración */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚙️</span>
              <span>Configurar Certificados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="cerFile">
                  Archivo Certificado (.cer)
                </Label>
                <Input
                  id="cerFile"
                  type="file"
                  accept=".cer"
                  onChange={(e) => handleFileChange(e, 'cer')}
                  className="cursor-pointer"
                />
                {cerFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ {cerFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="keyFile">
                  Archivo Llave Privada (.key)
                </Label>
                <Input
                  id="keyFile"
                  type="file"
                  accept=".key"
                  onChange={(e) => handleFileChange(e, 'key')}
                  className="cursor-pointer"
                />
                {keyFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    ✓ {keyFile.name}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">
                  Contraseña de la Llave Privada
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !cerFile || !keyFile || !password}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Validando FIEL...
                  </>
                ) : (
                  '🔐 Validar y Guardar FIEL'
                )}
              </Button>
            </form>

            {/* Información de seguridad */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-start space-x-3">
                <span className="text-blue-500 text-lg">🔒</span>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Información de Seguridad
                  </h4>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Sus certificatos son procesados de forma segura y solo se almacenan temporalmente para validación.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instrucciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>📖</span>
            <span>Instrucciones</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Requisitos de Archivos
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Archivo .CER válido del SAT</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Archivo .KEY correspondiente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Contraseña de la llave privada</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Certificado vigente (no vencido)</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                Proceso de Validación
              </h4>
              <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-medium">1.</span>
                  <span>Se verifican las extensiones de archivo</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-medium">2.</span>
                  <span>Se valida la contraseña de la llave</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-medium">3.</span>
                  <span>Se extrae el RFC del certificado</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 font-medium">4.</span>
                  <span>Se confirma la vigencia del certificado</span>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConfiguracionFiel;
