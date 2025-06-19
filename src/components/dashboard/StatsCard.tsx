
import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-green-600',
  yellow: 'from-yellow-500 to-yellow-600',
  red: 'from-red-500 to-red-600',
  purple: 'from-purple-500 to-purple-600',
  gray: 'from-gray-500 to-gray-600',
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue' 
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {trend && (
            <div className="flex items-center mt-2 space-x-1">
              <span className={cn(
                "text-sm font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-gray-500">vs mes anterior</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-xl",
          colorClasses[color]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
};
