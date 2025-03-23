'use client';

import { Tooltip } from '@/components/ui/Tooltip';
import { HiCheckBadge } from 'react-icons/hi2';

export type VerificationType = 'parent' | 'business' | 'individual';

interface VerifiedBadgeProps {
  type: VerificationType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
  enrollmentDate?: string;
}

const BadgeConfig: Record<VerificationType, {
  label: string;
  description: string;
  icon: typeof HiCheckBadge;
  color: string;
  bgGradient: string;
  iconBg: string;
}> = {
  business: {
    label: 'Verified Business',
    description: 'This is a verified business account with proper credentials',
    icon: HiCheckBadge,
    color: 'text-blue-600',
    bgGradient: 'bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50',
    iconBg: 'bg-white',
  },
  parent: {
    label: 'Verified Parent',
    description: 'This seller has been verified as a parent in our community',
    icon: HiCheckBadge,
    color: 'text-purple-600',
    bgGradient: 'bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50',
    iconBg: 'bg-white',
  },
  individual: {
    label: 'Individual Seller',
    description: 'This is a verified individual seller',
    icon: HiCheckBadge,
    color: 'text-emerald-600',
    bgGradient: 'bg-gradient-to-r from-emerald-50 via-emerald-100 to-emerald-50',
    iconBg: 'bg-white',
  },
};

function getEnrollmentDuration(enrollmentDate: string): string {
  const enrolledAt = new Date(enrollmentDate);
  const now = new Date();
  const diffInYears = (now.getTime() - enrolledAt.getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  if (diffInYears < 1) {
    return '< 1 year';
  }
  
  return `${Math.floor(diffInYears)} yrs`;
}

export default function VerifiedBadge({ 
  type, 
  size = 'md', 
  showLabel = false,
  className = '',
  enrollmentDate,
}: VerifiedBadgeProps) {
  const config = BadgeConfig[type];
  if (!config) {
    console.error(`Invalid verification type: ${type}`);
    return null;
  }
  
  const Icon = config.icon;
  
  const sizeClasses = {
    xs: {
      container: 'px-1.5 py-0.5 text-[8px]',
      icon: 'w-3 h-3',
      iconWrapper: 'p-0.5 mr-0.5',
    },
    sm: {
      container: 'px-2 py-0.5 text-xs',
      icon: 'w-3.5 h-3.5',
      iconWrapper: 'p-0.5 mr-1',
    },
    md: {
      container: 'px-2.5 py-1 text-xs',
      icon: 'w-4 h-4',
      iconWrapper: 'p-1 mr-1',
    },
    lg: {
      container: 'px-3 py-1.5 text-sm',
      icon: 'w-5 h-5',
      iconWrapper: 'p-1 mr-1.5',
    },
  };
  
  return (
    <Tooltip content={config.description}>
      <div 
        className={`
          inline-flex items-center rounded-full
          ${config.bgGradient} 
          relative overflow-hidden
          before:absolute before:inset-0
          before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_25%,rgba(255,255,255,0.4)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.4)_75%)]
          before:bg-[length:8px_8px]
          before:opacity-30
          before:animate-[gradient-slide_3s_linear_infinite]
          ${sizeClasses[size].container}
          ${className}
        `}
      >
        <span className={`${config.iconBg} rounded-full ${sizeClasses[size].iconWrapper} flex items-center justify-center`}>
          <Icon className={`${config.color} ${sizeClasses[size].icon}`} />
        </span>
        {showLabel && (
          <div className="flex items-center gap-1">
            <span className={`font-medium ${config.color}`}>
              {config.label}
            </span>
            {enrollmentDate && (
              <span className="text-gray-500 font-normal">
                • {getEnrollmentDuration(enrollmentDate)}
              </span>
            )}
          </div>
        )}
      </div>
    </Tooltip>
  );
} 