'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AnalyticsData {
  totalSales: number;
  totalOrders: number;
  totalViews: number;
  conversionRate: number;
  monthlyDataPoints: {
    month: string;
    sales: number;
  }[];
}

interface DashboardAnalyticsProps {
  data: AnalyticsData;
  period?: 'week' | 'month' | 'year' | 'all';
  className?: string;
}

export default function DashboardAnalytics({ 
  data, 
  period = 'month',
  className = '' 
}: DashboardAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year' | 'all'>(period);
  
  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Analytics Overview</h2>
        
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedPeriod === 'week' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedPeriod === 'month' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedPeriod === 'year' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Year
          </button>
          <button
            onClick={() => setSelectedPeriod('all')}
            className={`px-3 py-1 text-xs rounded-md ${
              selectedPeriod === 'all' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All time
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-xs text-indigo-600 uppercase font-medium">Sales</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{formatCurrency(data.totalSales)}</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-xs text-green-600 uppercase font-medium">Orders</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{data.totalOrders}</p>
        </div>
        
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-xs text-amber-600 uppercase font-medium">Views</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{data.totalViews}</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-xs text-purple-600 uppercase font-medium">Conversion</p>
          <p className="text-xl md:text-2xl font-bold text-gray-800">{formatPercentage(data.conversionRate)}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sales Trend</h3>
        
        <div className="h-60 w-full">
          {/* This would be replaced with a real chart component like Chart.js or Recharts */}
          <div className="h-full w-full bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="relative h-4/5 w-11/12 flex items-end justify-between">
              {data.monthlyDataPoints.map((point, index) => {
                const height = `${(point.sales / Math.max(...data.monthlyDataPoints.map(p => p.sales)) * 100) || 0}%`;
                return (
                  <div key={index} className="flex flex-col items-center w-1/12">
                    <div 
                      className="w-full bg-indigo-500 rounded-t-sm" 
                      style={{ height, minHeight: point.sales > 0 ? '8px' : '0' }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-1 rotate-45 origin-top-left whitespace-nowrap">
                      {point.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-right">
        <Link 
          href="/seller/analytics" 
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          View detailed analytics →
        </Link>
      </div>
    </div>
  );
} 