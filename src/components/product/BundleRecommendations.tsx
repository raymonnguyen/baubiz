'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  category: string;
}

interface BundleRecommendationsProps {
  currentProductId: string;
  cartProductIds?: string[];
  onAddToCart?: (productId: string) => void;
  maxItems?: number;
}

export default function BundleRecommendations({
  currentProductId,
  cartProductIds = [],
  onAddToCart,
  maxItems = 4
}: BundleRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  // In a real app, this would be an API call
  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock recommendations based on product categories
        const mockRecommendations: Product[] = [
          {
            id: 'rec1',
            title: 'Organic Cotton Muslin Swaddle Blankets',
            price: 24.99,
            image: '/images/products/swaddle-blanket.jpg',
            slug: 'organic-cotton-muslin-swaddle-blankets',
            category: 'baby-blankets'
          },
          {
            id: 'rec2',
            title: 'Bamboo Changing Pad Covers',
            price: 19.99,
            image: '/images/products/changing-pad-cover.jpg',
            slug: 'bamboo-changing-pad-covers',
            category: 'changing-accessories'
          },
          {
            id: 'rec3',
            title: 'Diaper Caddy Organizer',
            price: 29.99,
            image: '/images/products/diaper-caddy.jpg',
            slug: 'diaper-caddy-organizer',
            category: 'nursery-storage'
          },
          {
            id: 'rec4',
            title: 'Portable Changing Mat',
            price: 22.99,
            image: '/images/products/changing-mat.jpg',
            slug: 'portable-changing-mat',
            category: 'changing-accessories'
          },
          {
            id: 'rec5',
            title: 'Baby Diaper Cream',
            price: 12.99,
            image: '/images/products/diaper-cream.jpg',
            slug: 'baby-diaper-cream',
            category: 'baby-care'
          },
          {
            id: 'rec6',
            title: 'Baby Milestone Cards',
            price: 14.99,
            image: '/images/products/milestone-cards.jpg',
            slug: 'baby-milestone-cards',
            category: 'baby-gifts'
          },
        ];
        
        // Filter out items already in cart
        const filteredRecs = mockRecommendations.filter(
          product => !cartProductIds.includes(product.id) && product.id !== currentProductId
        );
        
        setRecommendations(filteredRecs);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [currentProductId, cartProductIds]);
  
  // Show only a subset of recommendations at a time for mobile carousel
  const visibleRecommendations = recommendations.slice(
    activeIndex,
    activeIndex + maxItems
  );
  
  const handlePrevious = () => {
    setActiveIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex(prev => Math.min(recommendations.length - maxItems, prev + 1));
  };
  
  const handleAddToCart = (productId: string) => {
    if (onAddToCart) {
      onAddToCart(productId);
    }
  };
  
  if (isLoading) {
    return (
      <div className="border border-gray-100 rounded-xl p-4 space-y-4 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (recommendations.length === 0) {
    return null;
  }
  
  return (
    <div 
      className="border border-gray-100 rounded-xl p-4 bg-white"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-lg text-gray-900">
          Frequently Bought Together
        </h3>
        
        {recommendations.length > maxItems && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={activeIndex === 0}
              className={`p-1 rounded-full ${
                activeIndex === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex >= recommendations.length - maxItems}
              className={`p-1 rounded-full ${
                activeIndex >= recommendations.length - maxItems
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      <div className="relative overflow-hidden">
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {visibleRecommendations.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative border border-gray-100 rounded-lg overflow-hidden group"
              >
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="aspect-square relative bg-gray-50">
                    {/* Use next/image with a placeholder if actual images aren't available */}
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    {/* Comment this out until you have actual images */}
                    {/* <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                    /> */}
                  </div>
                  
                  <div className="p-3">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
                
                {onAddToCart && (
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="absolute bottom-3 right-3 bg-indigo-600 text-white p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Add ${product.title} to cart`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Based on what other parents frequently purchase together
        </p>
      </div>
    </div>
  );
} 