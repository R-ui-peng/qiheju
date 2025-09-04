// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { cn } from '@/lib/utils';
// @ts-ignore;
import { Button } from '@/components/ui';

export function ModuleCard({
  title,
  description,
  icon: Icon,
  count,
  onClick,
  variant = 'default'
}) {
  const variantStyles = {
    default: 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-blue-600',
    primary: 'bg-blue-600 border-blue-600 hover:bg-blue-700 text-white',
    warning: 'bg-orange-100 border-orange-200 text-orange-600 hover:bg-orange-200',
    danger: 'bg-red-100 border-red-200 text-red-600 hover:bg-red-200'
  };
  return <Button variant="ghost" onClick={onClick} className={cn("w-full h-full p-6 text-left border-2 transition-all rounded-lg", variantStyles[variant])}>
      <div className="flex items-start space-x-4">
        {Icon && <div className="p-3 rounded-full bg-white/20">
            <Icon className="w-6 h-6" />
          </div>}
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-sm opacity-80 mb-2">{description}</p>
          {count !== undefined && <span className="inline-block bg-black/10 px-2 py-1 rounded-full text-xs font-medium">
              {count} 项待处理
            </span>}
        </div>
      </div>
    </Button>;
}