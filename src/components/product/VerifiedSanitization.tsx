'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';
import VerifiedBadge from '@/components/seller/VerifiedBadge';

// Different sanitization levels
export enum SanitizationLevel {
  STANDARD = 'standard',
  PREMIUM = 'premium',
  MEDICAL = 'medical',
  NONE = 'none',
}

export const SANITIZATION_LEVELS = {
  [SanitizationLevel.STANDARD]: {
    label: 'Standard Cleaning',
    description: 'Thorough cleaning with natural, baby-safe products',
    price: 8.99,
    icon: 'soap',
    benefits: [
      'Surface cleaning and disinfection',
      'Dust and allergen removal',
      'Fabric refreshing where applicable',
    ],
  },
  [SanitizationLevel.PREMIUM]: {
    label: 'Premium Sanitization',
    description: 'Deep cleaning with professional-grade sanitizers',
    price: 14.99,
    icon: 'sparkles',
    benefits: [
      'All Standard cleaning benefits',
      'Deep fabric cleaning for soft items',
      'UV sterilization',
      'Sealed packaging after cleaning',
    ],
  },
  [SanitizationLevel.MEDICAL]: {
    label: 'Medical-Grade Sterilization',
    description: 'Hospital-level sterilization for sensitive items',
    price: 24.99,
    icon: 'shield-check',
    benefits: [
      'All Premium sanitization benefits',
      'Steam sterilization at 250°F',
      'Medical-grade disinfection',
      'Individual sterilization certificate',
      'Ideal for breast pumps, bottles, etc.',
    ],
  },
  [SanitizationLevel.NONE]: {
    label: 'No Sanitization',
    description: 'Item will be shipped as-is',
    price: 0,
    icon: 'x',
    benefits: [],
  },
};

// Recommended sanitization levels by product category
export const RECOMMENDED_SANITIZATION = {
  'feeding-accessories': SanitizationLevel.MEDICAL,
  'breast-pumps': SanitizationLevel.MEDICAL,
  'bottles': SanitizationLevel.MEDICAL,
  'toys': SanitizationLevel.PREMIUM,
  'clothing': SanitizationLevel.STANDARD,
  'strollers': SanitizationLevel.PREMIUM,
  'car-seats': SanitizationLevel.PREMIUM,
  'furniture': SanitizationLevel.STANDARD,
  'books': SanitizationLevel.NONE,
  'other': SanitizationLevel.STANDARD,
};

interface VerifiedSanitizationProps {
  productCategory: string;
  onSelect: (level: SanitizationLevel, price: number) => void;
  initialLevel?: SanitizationLevel;
  showDescription?: boolean;
}

export default function VerifiedSanitization({
  productCategory,
  onSelect,
  initialLevel,
  showDescription = true,
}: VerifiedSanitizationProps) {
  // If initial level is not provided, use recommended level based on category
  const getRecommendedLevel = () => {
    // Get the recommended level for this category or default to STANDARD
    return RECOMMENDED_SANITIZATION[productCategory as keyof typeof RECOMMENDED_SANITIZATION] || SanitizationLevel.STANDARD;
  };
  
  const [selectedLevel, setSelectedLevel] = useState<SanitizationLevel>(
    initialLevel || getRecommendedLevel()
  );
  
  const handleLevelChange = (level: SanitizationLevel) => {
    setSelectedLevel(level);
    onSelect(level, SANITIZATION_LEVELS[level].price);
  };
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          <h3 className="font-medium text-gray-900">Verified Sanitization</h3>
          
          <Tooltip content="All sanitization is performed by certified professionals using baby-safe products">
            <div className="ml-1 text-blue-500 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </Tooltip>
        </div>
        
        {selectedLevel !== SanitizationLevel.NONE && (
          <div className="flex items-center">
            <span className="text-green-700 text-xs font-medium mr-1">Verified</span>
            <div className="text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
        )}
      </div>
      
      {showDescription && (
        <div className="px-4 py-3 border-b border-gray-100 text-sm text-gray-600">
          Professional sanitization ensures your purchased items are thoroughly cleaned, disinfected, and safe for your baby.
        </div>
      )}
      
      <div className="p-4">
        <div className="space-y-2">
          {Object.entries(SANITIZATION_LEVELS).map(([key, level]) => (
            <label 
              key={key}
              className={`flex items-start p-3 rounded-lg border transition-colors ${
                selectedLevel === key
                  ? 'border-blue-300 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              } cursor-pointer`}
            >
              <input
                type="radio"
                name="sanitizationLevel"
                value={key}
                checked={selectedLevel === key}
                onChange={() => handleLevelChange(key as SanitizationLevel)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              
              <div className="ml-3 flex-1">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">
                    {level.label}
                  </span>
                  <span className="font-medium text-gray-900">
                    {level.price > 0 ? `$${level.price.toFixed(2)}` : 'Free'}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {level.description}
                </p>
                
                {selectedLevel === key && level.benefits.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-3"
                  >
                    <ul className="text-xs text-gray-600 space-y-1">
                      {level.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </label>
          ))}
        </div>
        
        {selectedLevel === SanitizationLevel.MEDICAL && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100">
            <h4 className="text-sm font-medium text-green-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Medical-grade sanitization is recommended for this product
            </h4>
            <p className="text-xs text-green-700 mt-1">
              For items that come in contact with food, milk, or a baby's mouth, medical-grade 
              sterilization eliminates 99.99% of bacteria and viruses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 