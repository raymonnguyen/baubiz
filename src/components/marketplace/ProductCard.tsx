'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import VerifiedBadge from '@/components/seller/VerifiedBadge';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    condition: string;
    location: string;
    distance?: string;
    images: string[];
    seller: {
      name: string;
      rating: number;
      verified: boolean;
      verificationType?: 'parent' | 'business';
      image?: string;
    };
    listedTime: string;
    saves?: number;
    views?: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(prevIndex => prevIndex + 1);
    } else {
      setCurrentImageIndex(0);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prevIndex => prevIndex - 1);
    } else {
      setCurrentImageIndex(product.images.length - 1);
    }
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -5, transition: { duration: 0.3 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/marketplace/product/${product.id}`} className="block">
        <div className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Image
              src={product.images[currentImageIndex]}
              alt={product.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Image navigation dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-3 left-0 right-0 flex justify-center space-x-1.5 z-10">
                {product.images.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-4 bg-white'
                        : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Image navigation arrows - visible on hover */}
            {product.images.length > 1 && isHovered && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors z-10"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors z-10"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Save button */}
            <button
              onClick={toggleSave}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                isSaved 
                  ? 'bg-primary text-white'
                  : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-primary'
              }`}
              aria-label={isSaved ? 'Unsave' : 'Save'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 20 20" 
                fill={isSaved ? 'currentColor' : 'none'}
                stroke="currentColor"
                className="w-4 h-4"
                strokeWidth={isSaved ? 0 : 1.5}
              >
                <path 
                  fillRule="evenodd" 
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
            
            {/* Condition badge */}
            <div className="absolute top-3 left-3 px-2 py-1 bg-white/80 backdrop-blur-sm rounded-lg text-xs font-medium text-gray-800">
              {product.condition}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold line-clamp-2 text-gray-800 group-hover:text-primary transition-colors">
                {product.title}
              </h3>
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{product.location}</span>
              {product.distance && (
                <span className="ml-1 text-xs text-gray-400">· {product.distance}</span>
              )}
            </div>
            
            {/* Seller info */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-3">
              <div className="flex items-center">
                <div className="w-6 h-6 relative rounded-full overflow-hidden mr-2">
                  {product.seller.image ? (
                    <Image
                      src={product.seller.image}
                      alt={product.seller.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs text-gray-500">
                        {product.seller.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-1">{product.seller.name}</span>
                  {product.seller.verificationType ? (
                    <VerifiedBadge 
                      type={product.seller.verificationType} 
                      size="sm"
                    />
                  ) : product.seller.verified && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              <div className="text-xs text-gray-400">{product.listedTime}</div>
            </div>
            
            {/* Activity indicators */}
            {(product.saves !== undefined || product.views !== undefined) && (
              <div className="flex items-center mt-2 text-xs text-gray-400">
                {product.views !== undefined && (
                  <div className="flex items-center mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    {product.views} views
                  </div>
                )}
                {product.saves !== undefined && (
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    {product.saves} saves
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard; 