'use client';

import { useState } from 'react';
import { Tooltip } from '@/components/ui/Tooltip';

// Categories and their typical resale value percentages of original price
export const RESALE_VALUE_PERCENTAGES = {
  'strollers': 0.65,
  'car-seats': 0.40, // Safety items retain less value due to safety concerns
  'baby-carriers': 0.55,
  'high-chairs': 0.50,
  'cribs': 0.45,
  'bassinets': 0.40,
  'baby-monitors': 0.35, // Electronics depreciate faster
  'toys': 0.30,
  'books': 0.25,
  'clothing': 0.25,
  'feeding-accessories': 0.20,
  'diaper-bags': 0.45,
  'swings-bouncers': 0.40,
  'play-yards': 0.45,
  'bath-accessories': 0.30,
  'safety-gear': 0.25,
  'furniture': 0.50,
  'bedding': 0.30,
  'default': 0.35, // Default for uncategorized items
};

// Brands and their value adjustments
export const BRAND_VALUE_ADJUSTMENTS = {
  'premium': 0.15, // Premium brands retain more value
  'mid-range': 0, // No adjustment
  'budget': -0.10, // Budget brands lose more value
};

// Condition adjustments
export const CONDITION_ADJUSTMENTS = {
  'new-tags': 0.20, // New with tags
  'new-no-tags': 0.15, // New without tags
  'like-new': 0.10, // Like new
  'excellent': 0.05, // Excellent
  'very-good': 0, // Very good
  'good': -0.05, // Good
  'fair': -0.15, // Fair
  'poor': -0.25, // Poor
};

interface ResaleValueEstimatorProps {
  originalPrice: number;
  category: string;
  brandTier?: 'premium' | 'mid-range' | 'budget';
  condition?: keyof typeof CONDITION_ADJUSTMENTS;
  ageInMonths?: number;
  limitedEdition?: boolean;
  showDetails?: boolean;
}

export default function ResaleValueEstimator({
  originalPrice,
  category,
  brandTier = 'mid-range',
  condition = 'very-good',
  ageInMonths = 0,
  limitedEdition = false,
  showDetails = false,
}: ResaleValueEstimatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate estimated resale value
  const calculateResaleValue = () => {
    // Base percentage based on category
    const basePercentage = RESALE_VALUE_PERCENTAGES[category as keyof typeof RESALE_VALUE_PERCENTAGES] || 
                          RESALE_VALUE_PERCENTAGES.default;
    
    // Brand adjustment
    const brandAdjustment = BRAND_VALUE_ADJUSTMENTS[brandTier];
    
    // Condition adjustment
    const conditionAdjustment = CONDITION_ADJUSTMENTS[condition];
    
    // Age adjustment (items lose approximately 5% value every 6 months)
    const ageAdjustment = Math.max(-0.5, -0.05 * Math.floor(ageInMonths / 6)); // Cap at -50%
    
    // Limited edition bonus
    const limitedEditionBonus = limitedEdition ? 0.10 : 0;
    
    // Calculate total percentage (with min/max guards)
    const totalPercentage = Math.min(0.9, Math.max(0.1, 
      basePercentage + brandAdjustment + conditionAdjustment + ageAdjustment + limitedEditionBonus
    ));
    
    return {
      estimatedValue: originalPrice * totalPercentage,
      percentageRetained: totalPercentage * 100,
      breakdown: {
        basePercentage: basePercentage * 100,
        brandAdjustment: brandAdjustment * 100,
        conditionAdjustment: conditionAdjustment * 100,
        ageAdjustment: ageAdjustment * 100,
        limitedEditionBonus: limitedEditionBonus * 100,
      }
    };
  };
  
  const resaleInfo = calculateResaleValue();
  const savings = originalPrice - resaleInfo.estimatedValue;
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="font-medium text-gray-900">Resale Value Estimator</h3>
          
          <Tooltip content="This is an estimate based on market trends and may vary based on actual condition and market demand">
            <div className="ml-1 text-indigo-500 cursor-help">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </Tooltip>
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-500 hover:text-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Original Price:</span>
          <span className="font-medium">${originalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Est. Resale Value:</span>
          <span className="font-medium text-indigo-600">${resaleInfo.estimatedValue.toFixed(2)}</span>
        </div>
        
        <div className="mt-3 bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-indigo-500 h-full rounded-full"
            style={{ width: `${resaleInfo.percentageRetained}%` }}
          ></div>
        </div>
        
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>Retains ~{Math.round(resaleInfo.percentageRetained)}% of value</span>
          <span>100%</span>
        </div>
        
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <h4 className="font-medium text-green-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Effective Cost After Resale
          </h4>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-green-700">Your long-term cost:</span>
            <span className="font-bold text-green-700">${savings.toFixed(2)}</span>
          </div>
          <p className="text-xs text-green-700 mt-2">
            When you're done with this item, sell it and recover approximately ${resaleInfo.estimatedValue.toFixed(2)} 
            of your initial investment.
          </p>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-2">Value Breakdown</h4>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Base resale (category):</span>
                <span>{resaleInfo.breakdown.basePercentage.toFixed(0)}%</span>
              </div>
              
              {resaleInfo.breakdown.brandAdjustment !== 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Brand adjustment:</span>
                  <span className={resaleInfo.breakdown.brandAdjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                    {resaleInfo.breakdown.brandAdjustment > 0 ? '+' : ''}{resaleInfo.breakdown.brandAdjustment.toFixed(0)}%
                  </span>
                </div>
              )}
              
              {resaleInfo.breakdown.conditionAdjustment !== 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Condition adjustment:</span>
                  <span className={resaleInfo.breakdown.conditionAdjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                    {resaleInfo.breakdown.conditionAdjustment > 0 ? '+' : ''}{resaleInfo.breakdown.conditionAdjustment.toFixed(0)}%
                  </span>
                </div>
              )}
              
              {resaleInfo.breakdown.ageAdjustment !== 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Age adjustment:</span>
                  <span className={resaleInfo.breakdown.ageAdjustment > 0 ? 'text-green-600' : 'text-red-600'}>
                    {resaleInfo.breakdown.ageAdjustment > 0 ? '+' : ''}{resaleInfo.breakdown.ageAdjustment.toFixed(0)}%
                  </span>
                </div>
              )}
              
              {limitedEdition && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Limited edition bonus:</span>
                  <span className="text-green-600">+{resaleInfo.breakdown.limitedEditionBonus.toFixed(0)}%</span>
                </div>
              )}
              
              <div className="pt-2 mt-2 border-t border-gray-100 flex items-center justify-between font-medium">
                <span className="text-gray-900">Total estimated:</span>
                <span>{resaleInfo.percentageRetained.toFixed(0)}%</span>
              </div>
            </div>
            
            {showDetails && (
              <div className="mt-4 text-xs text-gray-500">
                <p>
                  Our resale value estimates are based on historical marketplace data for similar items.
                  Actual resale value may vary based on market conditions, item demand, and detailed condition.
                </p>
              </div>
            )}
            
            <div className="mt-4 p-2 bg-indigo-50 rounded-lg text-xs text-indigo-700">
              Did you know? Items in popular categories like strollers, furniture, and carriers tend to hold their value better!
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 