'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import VerifiedBadge from '@/components/seller/VerifiedBadge';

// Define interfaces for type safety
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  condition: string;
  category: string;
  images: string[];
  sellerId: string;
  sellerName: string;
  sellerVerificationType?: 'parent' | 'business';
  location: string;
  distance?: string;
  listingDate: string;
  isNew?: boolean;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    condition: [] as string[],
    category: [] as string[],
    sellerType: [] as string[],
    priceRange: { min: 0, max: 500 },
  });

  // Fetch search results
  useEffect(() => {
    // In a real app, this would fetch from an API
    setLoading(true);
    
    // Mock data for demonstration
    setTimeout(() => {
      const mockResults: Product[] = [
        {
          id: 'p1',
          title: 'Baby Carrier Ergonomic',
          description: 'Gently used baby carrier suitable for infants and toddlers',
          price: 49.99,
          originalPrice: 120,
          condition: 'Like New',
          category: 'Baby Gear',
          images: ['/images/products/baby-carrier.jpg'],
          sellerId: 's1',
          sellerName: 'Sarah Johnson',
          sellerVerificationType: 'parent',
          location: 'Chicago, IL',
          distance: '3.2 miles away',
          listingDate: '2 days ago',
          isNew: true
        },
        {
          id: 'p2',
          title: 'Wooden Building Blocks',
          description: 'Set of 50 colorful wooden blocks for creative play',
          price: 35.50,
          condition: 'Good',
          category: 'Toys',
          images: ['/images/products/wooden-blocks.jpg'],
          sellerId: 's2',
          sellerName: 'Kids First Toys',
          sellerVerificationType: 'business',
          location: 'Chicago, IL',
          distance: '5.7 miles away',
          listingDate: '1 week ago'
        },
        {
          id: 'p3',
          title: 'Children\'s Bookshelf',
          description: 'White painted wooden bookshelf, perfect for a nursery',
          price: 65.00,
          originalPrice: 89.99,
          condition: 'Good',
          category: 'Furniture',
          images: ['/images/products/bookshelf.jpg'],
          sellerId: 's3',
          sellerName: 'Emily\'s Home Goods',
          sellerVerificationType: 'business',
          location: 'Chicago, IL',
          distance: '4.3 miles away',
          listingDate: '3 days ago'
        },
        {
          id: 'p4',
          title: 'Toddler T-Shirt Bundle',
          description: 'Set of 5 t-shirts for toddlers, size 3T, various colors',
          price: 18.99,
          condition: 'Excellent',
          category: 'Clothing',
          images: ['/images/products/tshirt-bundle.jpg'],
          sellerId: 's4',
          sellerName: 'Michael Smith',
          sellerVerificationType: 'parent',
          location: 'Chicago, IL',
          distance: '2.1 miles away',
          listingDate: '5 days ago'
        }
      ];
      
      setResults(mockResults);
      setLoading(false);
    }, 1000);
  }, [query]);

  // Filter handling would go here in a real app

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Search Results for "{query}"</h1>
        <button 
          onClick={() => setFilterOpen(!filterOpen)}
          className="flex items-center bg-white px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          Filter
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filter sidebar */}
        {filterOpen && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-lg mb-4">Filters</h2>
            
            {/* Seller Type Filter - specifically includes verification types */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Seller Type</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-primary" 
                    checked={activeFilters.sellerType.includes('parent')}
                    onChange={() => {/* Filter handling logic */}}
                  />
                  <span className="ml-2 flex items-center">
                    Parent Seller
                    <VerifiedBadge type="parent" size="sm" className="ml-1" />
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-primary" 
                    checked={activeFilters.sellerType.includes('business')}
                    onChange={() => {/* Filter handling logic */}}
                  />
                  <span className="ml-2 flex items-center">
                    Business Seller
                    <VerifiedBadge type="business" size="sm" className="ml-1" />
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    className="form-checkbox h-4 w-4 text-primary" 
                    checked={activeFilters.sellerType.includes('unverified')}
                    onChange={() => {/* Filter handling logic */}}
                  />
                  <span className="ml-2">Unverified Seller</span>
                </label>
              </div>
            </div>
            
            {/* Other filters would go here */}
            
            <div className="pt-4 border-t border-gray-200">
              <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark">
                Apply Filters
              </button>
              <button className="w-full text-gray-600 py-2 mt-2 hover:text-gray-800">
                Clear All
              </button>
            </div>
          </div>
        )}
        
        {/* Results grid */}
        <div className={`${filterOpen ? 'md:col-span-3' : 'md:col-span-4'} space-y-4`}>
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading results...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-700 mb-2">No results found</h2>
              <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(product => (
                <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100">
                  <Link href={`/product/${product.id}`} className="block">
                    <div className="relative h-48 bg-gray-200">
                      {/* Placeholder for product image */}
                      <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                      
                      {/* New tag */}
                      {product.isNew && (
                        <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-full font-medium">
                          New
                        </div>
                      )}
                      
                      {/* Verification badge */}
                      {product.sellerVerificationType && (
                        <div className="absolute top-2 right-2">
                          <VerifiedBadge type={product.sellerVerificationType} size="sm" />
                        </div>
                      )}
                      
                      {/* Discount tag */}
                      {product.originalPrice && (
                        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-900 line-clamp-1">{product.title}</h3>
                        <span className="font-bold text-primary">${product.price.toFixed(2)}</span>
                      </div>
                      
                      {/* Seller info with verification badge */}
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span>Sold by {product.sellerName}</span>
                        {product.sellerVerificationType && (
                          <div className="ml-1">
                            <VerifiedBadge type={product.sellerVerificationType} size="sm" />
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{product.distance || product.location}</span>
                        </div>
                        <span>{product.listingDate}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 