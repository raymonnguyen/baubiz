'use client';

import { useState } from 'react';
import ListingItem, { ListingItemProps } from './ListingItem';

interface ListingsGridProps {
  listings: ListingItemProps[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
  className?: string;
}

export default function ListingsGrid({ 
  listings, 
  onEdit, 
  onDelete, 
  emptyMessage = "No listings found",
  className = ""
}: ListingsGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('recent');
  
  // Filter listings based on search term and status
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  
  // Sort listings based on selected option
  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortOption) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popular':
        return b.views - a.views;
      case 'favorites':
        return b.favorites - a.favorites;
      case 'recent':
      default:
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    }
  });
  
  return (
    <div className={className}>
      {/* Filters and search */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="recent">Newest first</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="popular">Most viewed</option>
            <option value="favorites">Most favorited</option>
          </select>
        </div>
      </div>
      
      {/* Results count */}
      <div className="text-sm text-gray-500 mb-4">
        {sortedListings.length === 0 ? (
          "No matching listings found"
        ) : (
          `Showing ${sortedListings.length} ${sortedListings.length === 1 ? 'listing' : 'listings'}`
        )}
      </div>
      
      {/* Listings grid */}
      {sortedListings.length > 0 ? (
        <div className="space-y-4">
          {sortedListings.map(listing => (
            <ListingItem
              key={listing.id}
              {...listing}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6-6h6m-6 6a3 3 0 100 6h6a3 3 0 000-6m0 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No listings found</h3>
          <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
} 