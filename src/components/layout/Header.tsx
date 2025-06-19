
import React from 'react';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFiel } from '@/contexts/FielContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onMenuClick: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isDark, onThemeToggle }) => {
  const { config } = useFiel();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Sistema SAT
            </h1>
            {config.rfc && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                RFC: {config.rfc}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* FIEL Status */}
          {config.isConfigured ? (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-700 dark:text-green-300">
                FIEL Configurada
              </span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                FIEL Pendiente
              </span>
            </div>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Theme toggle */}
          <Button variant="ghost" size="sm" onClick={onThemeToggle}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">Usuario</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configuración</DropdownMenuItem>
              <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
