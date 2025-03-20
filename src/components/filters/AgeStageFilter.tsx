'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

// Age-stage definitions
export const AGE_STAGES = {
  pregnancy: [
    { id: 'first-trimester', label: 'First Trimester', range: '0-12 weeks' },
    { id: 'second-trimester', label: 'Second Trimester', range: '13-26 weeks' },
    { id: 'third-trimester', label: 'Third Trimester', range: '27-40 weeks' },
  ],
  baby: [
    { id: 'newborn', label: 'Newborn', range: '0-3 months' },
    { id: '3-6m', label: 'Infant', range: '3-6 months' },
    { id: '6-9m', label: 'Crawler', range: '6-9 months' },
    { id: '9-12m', label: 'Early Walker', range: '9-12 months' },
    { id: '12-18m', label: 'Toddler', range: '12-18 months' },
    { id: '18-24m', label: 'Young Toddler', range: '18-24 months' },
    { id: '2-3y', label: 'Toddler', range: '2-3 years' },
    { id: '3-5y', label: 'Preschooler', range: '3-5 years' },
    { id: '5y+', label: 'Child', range: '5+ years' },
  ],
};

interface AgeStageFilterProps {
  onFilterChange: (selectedStages: string[]) => void;
  defaultSelected?: string[];
  compact?: boolean;
}

export default function AgeStageFilter({
  onFilterChange,
  defaultSelected = [],
  compact = false
}: AgeStageFilterProps) {
  const [selectedStages, setSelectedStages] = useState<string[]>(defaultSelected);
  const [activeTab, setActiveTab] = useState<'pregnancy' | 'baby'>('baby');
  
  const handleStageToggle = (stageId: string) => {
    let newSelectedStages: string[];
    
    if (selectedStages.includes(stageId)) {
      newSelectedStages = selectedStages.filter(id => id !== stageId);
    } else {
      newSelectedStages = [...selectedStages, stageId];
    }
    
    setSelectedStages(newSelectedStages);
    onFilterChange(newSelectedStages);
  };
  
  const handleClearAll = () => {
    setSelectedStages([]);
    onFilterChange([]);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-gray-800">Age / Stage</h3>
        {selectedStages.length > 0 && (
          <button 
            onClick={handleClearAll} 
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            Clear all
          </button>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          className={`flex-1 py-2 text-sm font-medium relative ${
            activeTab === 'pregnancy' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('pregnancy')}
        >
          Pregnancy
          {activeTab === 'pregnancy' && (
            <motion.div 
              layoutId="activeFilterTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
            />
          )}
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium relative ${
            activeTab === 'baby' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('baby')}
        >
          Baby / Child
          {activeTab === 'baby' && (
            <motion.div 
              layoutId="activeFilterTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
            />
          )}
        </button>
      </div>
      
      {/* Stage options */}
      <div className="p-4">
        <div className={`grid ${compact ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'} gap-2`}>
          {AGE_STAGES[activeTab].map((stage) => (
            <button
              key={stage.id}
              onClick={() => handleStageToggle(stage.id)}
              className={`px-3 py-2 rounded-lg text-xs text-left transition-colors border ${
                selectedStages.includes(stage.id)
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{stage.label}</div>
              <div className="text-xs opacity-80">{stage.range}</div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Selected summary - visible in compact mode */}
      {compact && selectedStages.length > 0 && (
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            <span className="font-medium">{selectedStages.length}</span> stage(s) selected
          </div>
        </div>
      )}
    </div>
  );
} 