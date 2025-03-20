'use client';

import { useState } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

export type ConditionRating = 
  | 'new-tags' 
  | 'new-no-tags' 
  | 'like-new' 
  | 'excellent' 
  | 'very-good' 
  | 'good' 
  | 'fair' 
  | 'poor';

const CONDITION_DETAILS = {
  'new-tags': {
    label: 'New with tags',
    description: 'Brand new, unused item with original tags/packaging attached',
    color: 'bg-teal-500',
    value: 100,
  },
  'new-no-tags': {
    label: 'New, no tags',
    description: 'Brand new, unused item without original tags/packaging',
    color: 'bg-emerald-500',
    value: 95,
  },
  'like-new': {
    label: 'Like new',
    description: 'Looks new, may have been worn once or twice with no visible flaws',
    color: 'bg-green-500',
    value: 90,
  },
  'excellent': {
    label: 'Excellent',
    description: 'Minimal signs of wear, no visible flaws or defects',
    color: 'bg-lime-500',
    value: 80,
  },
  'very-good': {
    label: 'Very good',
    description: 'Minor signs of wear, minor flaws that do not affect functionality',
    color: 'bg-yellow-500',
    value: 70,
  },
  'good': {
    label: 'Good',
    description: 'Noticeable signs of wear, may have minor flaws or repairs',
    color: 'bg-amber-500',
    value: 60,
  },
  'fair': {
    label: 'Fair',
    description: 'Significant signs of wear, may have noticeable flaws or repairs',
    color: 'bg-orange-500',
    value: 40,
  },
  'poor': {
    label: 'Poor',
    description: 'Heavy signs of wear, major flaws, sold as-is for parts or DIY',
    color: 'bg-red-500',
    value: 20,
  },
};

interface ConditionRatingDisplayProps {
  condition: ConditionRating;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export default function ConditionRatingDisplay({
  condition,
  showDetails = false,
  size = 'md',
  showTooltip = true,
  className = ''
}: ConditionRatingDisplayProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const details = CONDITION_DETAILS[condition];
  
  const sizeClasses = {
    sm: 'text-xs h-4',
    md: 'text-sm h-5',
    lg: 'text-base h-6',
  };
  
  const barWidth = `${details.value}%`;
  
  const openConditionGuide = () => {
    setIsModalOpen(true);
  };
  
  const renderRatingBar = () => (
    <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
      <div 
        className={`${details.color} rounded-full h-full`} 
        style={{ width: barWidth }}
      ></div>
    </div>
  );
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2">
        {showTooltip ? (
          <Tooltip content={details.description}>
            <div className="flex items-center gap-2">
              <span className={`font-medium ${sizeClasses[size]}`}>{details.label}</span>
              <div className="w-20">{renderRatingBar()}</div>
            </div>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${sizeClasses[size]}`}>{details.label}</span>
            <div className="w-20">{renderRatingBar()}</div>
          </div>
        )}
        
        <button 
          onClick={openConditionGuide}
          className="text-xs text-indigo-500 hover:text-indigo-700 underline"
        >
          Guide
        </button>
      </div>
      
      {showDetails && (
        <p className="mt-1 text-xs text-gray-500">
          {details.description}
        </p>
      )}
      
      {/* Condition Guide Modal */}
      {isModalOpen && (
        <ConditionGuideModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}

// Full Condition Guide Modal
function ConditionGuideModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Condition Rating Guide</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-6">
            <p className="text-gray-600">
              Our detailed condition rating system helps buyers understand exactly what to expect
              from pre-owned items. Select the appropriate condition when listing your items.
            </p>
            
            <div className="space-y-4">
              {(Object.keys(CONDITION_DETAILS) as ConditionRating[]).map((key) => {
                const detail = CONDITION_DETAILS[key];
                return (
                  <div key={key} className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-3 bg-gray-200 rounded-full">
                        <div className={`${detail.color} h-full rounded-full`} style={{ width: `${detail.value}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{detail.label}</h3>
                      <p className="text-sm text-gray-600">{detail.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Transparency Matters</h3>
              <p className="text-sm text-blue-700">
                Always be honest and thorough about the condition of your items. Include clear photos 
                of any flaws or imperfections. This builds trust and leads to happier buyers!
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 