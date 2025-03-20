'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void;
  isVisible: boolean;
  onClose: () => void;
}

export interface FilterState {
  categories: string[];
  price: {
    min: number | null;
    max: number | null;
  };
  condition: string[];
  distance: number | null;
  sellerType: 'all' | 'verified' | 'local';
  sortBy: 'newest' | 'price_low_high' | 'price_high_low' | 'closest';
}

const FilterSidebar = ({ onFilterChange, isVisible, onClose }: FilterSidebarProps) => {
  // Default filter state
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    price: {
      min: null,
      max: null,
    },
    condition: [],
    distance: null,
    sellerType: 'all',
    sortBy: 'newest',
  });

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    
    const newFilters = { ...filters, categories: newCategories };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle condition toggle
  const handleConditionToggle = (condition: string) => {
    const newConditions = filters.condition.includes(condition)
      ? filters.condition.filter((c) => c !== condition)
      : [...filters.condition, condition];
    
    const newFilters = { ...filters, condition: newConditions };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle price change
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    const newFilters = {
      ...filters,
      price: {
        ...filters.price,
        [type]: numValue,
      },
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle distance change
  const handleDistanceChange = (value: string) => {
    const newFilters = {
      ...filters,
      distance: value === '' ? null : parseInt(value, 10),
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle seller type change
  const handleSellerTypeChange = (type: 'all' | 'verified' | 'local') => {
    const newFilters = { ...filters, sellerType: type };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as FilterState['sortBy'];
    const newFilters = { ...filters, sortBy: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters: FilterState = {
      categories: [],
      price: {
        min: null,
        max: null,
      },
      condition: [],
      distance: null,
      sellerType: 'all',
      sortBy: 'newest',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isVisible && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside 
        className={`fixed md:sticky top-0 left-0 h-full md:h-auto bg-background 
          shadow-lg md:shadow-none z-50 md:z-0 p-6 w-[280px] overflow-y-auto
          transform transition-transform duration-300 ease-in-out md:translate-x-0
          ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
        initial={false}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Filters</h2>
          <button 
            onClick={onClose}
            className="md:hidden text-text-light"
            aria-label="Close filters"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sort By - Desktop */}
        <div className="mb-6 hidden md:block">
          <label htmlFor="sort" className="block text-sm font-medium mb-2">
            Sort By
          </label>
          <select
            id="sort"
            className="form-input w-full"
            value={filters.sortBy}
            onChange={handleSortChange}
          >
            <option value="newest">Newest First</option>
            <option value="price_low_high">Price: Low to High</option>
            <option value="price_high_low">Price: High to Low</option>
            <option value="closest">Distance: Closest</option>
          </select>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="checkbox"
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`category-${category}`}
                  className="ml-2 text-sm text-text-light"
                >
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Price Range</h3>
          <div className="flex items-center gap-2">
            <div>
              <label htmlFor="price-min" className="sr-only">
                Minimum Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-light text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price-min"
                  placeholder="Min"
                  value={filters.price.min === null ? '' : filters.price.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  className="form-input pl-7 py-1 text-sm w-full"
                  min="0"
                />
              </div>
            </div>
            <span className="text-text-light">to</span>
            <div>
              <label htmlFor="price-max" className="sr-only">
                Maximum Price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-text-light text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price-max"
                  placeholder="Max"
                  value={filters.price.max === null ? '' : filters.price.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  className="form-input pl-7 py-1 text-sm w-full"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Condition</h3>
          <div className="space-y-2">
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  id={`condition-${condition}`}
                  checked={filters.condition.includes(condition)}
                  onChange={() => handleConditionToggle(condition)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`condition-${condition}`}
                  className="ml-2 text-sm text-text-light"
                >
                  {condition}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Distance */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Distance</h3>
          <div className="relative">
            <select
              value={filters.distance === null ? '' : filters.distance.toString()}
              onChange={(e) => handleDistanceChange(e.target.value)}
              className="form-input w-full text-sm"
            >
              <option value="">Any distance</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
              <option value="100">Within 100 miles</option>
            </select>
          </div>
        </div>

        {/* Seller Type */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Seller Type</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="seller-all"
                name="seller-type"
                checked={filters.sellerType === 'all'}
                onChange={() => handleSellerTypeChange('all')}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="seller-all"
                className="ml-2 text-sm text-text-light"
              >
                All Sellers
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="seller-verified"
                name="seller-type"
                checked={filters.sellerType === 'verified'}
                onChange={() => handleSellerTypeChange('verified')}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="seller-verified"
                className="ml-2 text-sm text-text-light"
              >
                Verified Sellers Only
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="seller-local"
                name="seller-type"
                checked={filters.sellerType === 'local'}
                onChange={() => handleSellerTypeChange('local')}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              <label
                htmlFor="seller-local"
                className="ml-2 text-sm text-text-light"
              >
                Local Sellers Only
              </label>
            </div>
          </div>
        </div>

        {/* Reset Filters */}
        <button
          type="button"
          onClick={resetFilters}
          className="w-full py-2 px-4 text-sm font-medium text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
        >
          Reset Filters
        </button>
      </motion.aside>
    </>
  );
};

export default FilterSidebar;

// Sample categories and conditions
const categories = [
  'Baby Clothes (0-2)',
  'Toddler Clothes (2-4)',
  'Toys & Games',
  'Strollers',
  'Car Seats',
  'Cribs & Bedding',
  'Feeding & Nursing',
  'Diapering',
  'Bath & Potty',
  'Safety Gear',
  'Maternity Clothes',
  'Books',
  'Educational',
  'Outdoor Play',
  'Nursery Decor',
];

const conditions = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Used',
];