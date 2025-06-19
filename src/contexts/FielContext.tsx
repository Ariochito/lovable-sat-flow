
import React, { createContext, useContext, useState, useEffect } from 'react';

interface FielConfig {
  isConfigured: boolean;
  rfc: string | null;
  lastValidation: Date | null;
  cerFile: File | null;
  keyFile: File | null;
  password: string | null;
}

interface FielContextType {
  config: FielConfig;
  setConfig: (config: Partial<FielConfig>) => void;
  isValidated: boolean;
  validateFiel: (cerFile: File, keyFile: File, password: string) => Promise<boolean>;
}

const FielContext = createContext<FielContextType | undefined>(undefined);

export const FielProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfigState] = useState<FielConfig>({
    isConfigured: false,
    rfc: null,
    lastValidation: null,
    cerFile: null,
    keyFile: null,
    password: null,
  });

  const setConfig = (newConfig: Partial<FielConfig>) => {
    setConfigState(prev => ({ ...prev, ...newConfig }));
    localStorage.setItem('fielConfig', JSON.stringify({ ...config, ...newConfig }));
  };

  const validateFiel = async (cerFile: File, keyFile: File, password: string): Promise<boolean> => {
    try {
      // Simulación de validación - aquí iría la llamada real al backend
      console.log('Validando FIEL...', { cerFile: cerFile.name, keyFile: keyFile.name });
      
      // Simular delay de validación
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Extraer RFC del nombre del archivo (simulado)
      const rfcMatch = cerFile.name.match(/([A-Z&Ñ]{3,4}\d{6}[A-Z\d]{3})/);
      const rfc = rfcMatch ? rfcMatch[1] : 'RFC123456789';
      
      setConfig({
        isConfigured: true,
        rfc,
        lastValidation: new Date(),
        cerFile,
        keyFile,
        password,
      });
      
      return true;
    } catch (error) {
      console.error('Error validando FIEL:', error);
      return false;
    }
  };

  useEffect(() => {
    const savedConfig = localStorage.getItem('fielConfig');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.lastValidation) {
          parsed.lastValidation = new Date(parsed.lastValidation);
        }
        setConfigState(parsed);
      } catch (error) {
        console.error('Error loading FIEL config:', error);
      }
    }
  }, []);

  const isValidated = config.isConfigured && config.rfc && config.lastValidation;

  return (
    <FielContext.Provider value={{ config, setConfig, isValidated, validateFiel }}>
      {children}
    </FielContext.Provider>
  );
};

export const useFiel = () => {
  const context = useContext(FielContext);
  if (context === undefined) {
    throw new Error('useFiel must be used within a FielProvider');
  }
  return context;
};
