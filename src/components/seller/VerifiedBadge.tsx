'use client';

import { Tooltip } from '@/components/ui/Tooltip';
import { HiCheckBadge } from 'react-icons/hi2';

type VerificationType = 'parent' | 'business';

interface VerifiedBadgeProps {
  type: VerificationType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const BadgeConfig = {
  parent: {
    label: 'Verified Parent',
    description: 'This seller has been verified as a parent in our community',
    icon: HiCheckBadge,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  business: {
    label: 'Business Seller',
    description: 'This is a verified business account',
    icon: HiCheckBadge,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
};

export default function VerifiedBadge({ 
  type, 
  size = 'md', 
  showLabel = false,
  className = ''
}: VerifiedBadgeProps) {
  const config = BadgeConfig[type];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  const labelSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };
  
  return (
    <Tooltip content={config.description}>
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <div className={`${config.bgColor} rounded-full p-1`}>
          <Icon className={`${config.color} ${sizeClasses[size]}`} />
        </div>
        
        {showLabel && (
          <span className={`font-medium ${config.color} ${labelSizes[size]}`}>
            {config.label}
          </span>
        )}
      </div>
    </Tooltip>
  );
} 