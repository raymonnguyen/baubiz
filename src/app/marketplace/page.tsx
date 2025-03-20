'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
  market_id: string;
}

interface Marketplace {
  id: string;
  name: string;
  description: string;
  slug: string;
  logo_url: string;
  cover_image: string;
  banner_url?: string;
  categories: Category[];
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

interface MarketplaceResponse {
  markets: Marketplace[];
  pagination: PaginationData;
}

export default function MarketplacesIndexPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MarketplaceResponse | null>(null);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // Helper to handle page navigation
  const navigatePage = (pageNum: number, category?: string, search?: string) => {
    const params = new URLSearchParams();
    params.set('page', pageNum.toString());
    
    if (category) {
      params.set('category', category);
    }
    
    if (search) {
      params.set('search', search);
    }
    
    router.push(`/marketplace?${params.toString()}`);
  };
  
  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigatePage(1, categoryFilter, searchInput);
  };
  
  // Handle category filter change
  const handleCategoryChange = (category: string) => {
    navigatePage(1, category === 'all' ? '' : category, searchQuery);
  };
  
  // Fetch all categories to populate the filter 
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        // Get all unique category names
        const res = await fetch('/api/categories');
        const data = await res.json();
        
        if (data && Array.isArray(data) && data.length > 0) {
          // Extract unique category names
          const categoryNames = [...new Set(data.map(cat => cat.name))].sort();
          setAllCategories(categoryNames);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchAllCategories();
  }, []);
  
  // Fetch marketplace data
  useEffect(() => {
    const fetchMarketplaces = async () => {
      try {
        setIsLoading(true);
        
        // Construct the API url with query parameters
        const params = new URLSearchParams();
        params.set('page', currentPage.toString());
        params.set('limit', '12'); // Items per page
        
        if (categoryFilter) {
          params.set('category', categoryFilter);
        }
        
        if (searchQuery) {
          params.set('search', searchQuery);
        }
        
        const res = await fetch(`/api/markets?${params.toString()}`);
        const responseData: MarketplaceResponse = await res.json();
        
        setData(responseData);
      } catch (error) {
        console.error('Error fetching marketplaces:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketplaces();
  }, [currentPage, categoryFilter, searchQuery]);
  
  // Render marketplaces
  const renderMarketplaces = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (!data || !data.markets || data.markets.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-4xl mb-4">😕</div>
          <h3 className="text-xl font-bold mb-2">No marketplaces found</h3>
          <p className="text-gray-600 mb-6">
            We couldn't find any marketplaces matching your search criteria.
          </p>
          <button
            onClick={() => {
              setSearchInput('');
              navigatePage(1);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none"
          >
            Clear Filters
          </button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.markets.map((marketplace, index) => (
          <MarketplaceCard key={marketplace.id} marketplace={marketplace} index={index} />
        ))}
      </div>
    );
  };
  
  // Render pagination
  const renderPagination = () => {
    if (!data || !data.pagination || data.pagination.totalPages <= 1) return null;
    
    const { currentPage, totalPages } = data.pagination;
    
    // Show max 5 pages in pagination with current page in the middle when possible
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Adjust start page if end page is maxed out
    if (endPage === totalPages) {
      startPage = Math.max(1, endPage - 4);
    }
    
    return (
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {/* Previous button */}
        {currentPage > 1 && (
          <button
            onClick={() => navigatePage(currentPage - 1, categoryFilter, searchQuery)}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            &laquo; Previous
          </button>
        )}
        
        {/* Page numbers */}
        {Array.from({ length: endPage - startPage + 1 }).map((_, i) => {
          const pageNum = startPage + i;
          return (
            <button
              key={pageNum}
              onClick={() => navigatePage(pageNum, categoryFilter, searchQuery)}
              className={`px-4 py-2 rounded-md ${
                pageNum === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {pageNum}
            </button>
          );
        })}
        
        {/* Next button */}
        {currentPage < totalPages && (
          <button
            onClick={() => navigatePage(currentPage + 1, categoryFilter, searchQuery)}
            className="px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Next &raquo;
          </button>
        )}
      </div>
    );
  };
  
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Vibrant Shopping Communities</h1>
            <p className="text-xl text-gray-600 mb-8">Join specialized marketplaces curated for parents and families to buy, sell, and connect.</p>
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search marketplaces..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <button type="submit" className="absolute right-2 top-2 bg-primary text-white px-4 py-1 rounded-full">
                Search
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="border-b border-gray-200">
        <div className="container-custom py-4 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                !categoryFilter
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            
            {allCategories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  categoryFilter === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Marketplace Listings */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">
            {categoryFilter 
              ? `${categoryFilter} Marketplaces` 
              : searchQuery 
                ? 'Search Results' 
                : 'All Marketplaces'}
          </h2>
          
          {renderMarketplaces()}
          {renderPagination()}
        </div>
      </section>
      
      {/* Create Marketplace CTA */}
      <section className="bg-primary text-white py-12">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Start Your Own Marketplace</h2>
              <p className="text-white/90">Create a specialized shopping community for like-minded parents and families.</p>
            </div>
            <Link href="/marketplace/create" className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 focus:outline-none inline-block whitespace-nowrap">
              Create Marketplace
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// Marketplace Card Component
function MarketplaceCard({ marketplace, index }: { marketplace: Marketplace, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
    >
      {/* Banner/Cover Image */}
      <div className="relative h-48 bg-gray-100">
        {marketplace.cover_image || marketplace.banner_url ? (
          <Image
            src={marketplace.cover_image || marketplace.banner_url || ''}
            alt={marketplace.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200">
            <span className="text-gray-400 text-lg">No image available</span>
          </div>
        )}
        
        {/* Logo overlay */}
        <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-md bg-white">
          {marketplace.logo_url ? (
            <Image 
              src={marketplace.logo_url}
              alt={`${marketplace.name} logo`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500 text-xs">Logo</div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 pt-8 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-2">{marketplace.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-1">{marketplace.description}</p>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-1 mb-4">
          {marketplace.categories?.slice(0, 3).map(category => (
            <span
              key={category.id}
              className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
            >
              {category.name}
            </span>
          ))}
          {marketplace.categories?.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
              +{marketplace.categories.length - 3} more
            </span>
          )}
        </div>
        
        {/* Action button */}
        <Link
          href={`/marketplace/${marketplace.slug}`}
          className="block text-center w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          Visit Marketplace
        </Link>
      </div>
    </motion.div>
  );
} 