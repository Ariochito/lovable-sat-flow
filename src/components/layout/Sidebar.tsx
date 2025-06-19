
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: '🏠' },
  { name: 'Configuración FIEL', href: '/configuracion', icon: '⚙️' },
  { name: 'Solicitudes', href: '/solicitudes', icon: '📋' },
  { name: 'Verificar Estado', href: '/verificar', icon: '🔄' },
  { name: 'Descargar Paquetes', href: '/descargar', icon: '⬇️' },
  { name: 'Leer Paquetes', href: '/leer', icon: '📄' },
  { name: 'Historial', href: '/historial', icon: '📊' },
  { name: 'Archivadas', href: '/archivadas', icon: '🗃️' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:static md:z-auto"
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              Sistema SAT
            </span>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive 
                    ? "bg-primary text-white shadow-md" 
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Sistema SAT v1.0
            <br />
            © 2024 - Gestión Fiscal
          </div>
        </div>
      </div>
    </>
  );
};
