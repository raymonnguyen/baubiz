'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Define interface for marketplace data
interface Marketplace {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner?: string;
  members: string;
  listings: string;
  categories: string[];
  rating?: number;
  isLive?: boolean;
}

interface SimilarMarketplacesProps {
  currentMarketplaceId: string;
  category?: string;
  marketplaces: Marketplace[];
}

const SimilarMarketplaces = ({ 
  currentMarketplaceId,
  category,
  marketplaces 
}: SimilarMarketplacesProps) => {
  // Filter out the current marketplace and limit to 3-4 items
  const filteredMarketplaces = marketplaces
    .filter(marketplace => marketplace.id !== currentMarketplaceId)
    .slice(0, 4);
  
  if (filteredMarketplaces.length === 0) {
    return null;
  }
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold">Similar Marketplaces</h2>
            <p className="text-gray-600 mt-1">
              {category 
                ? `Explore more ${category.toLowerCase()} marketplaces` 
                : 'You might also like these marketplaces'}
            </p>
          </div>
          <Link 
            href="/marketplaces" 
            className="text-primary hover:underline font-medium flex items-center"
          >
            View all
            <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMarketplaces.map((marketplace, index) => (
            <MarketplaceCard 
              key={marketplace.id} 
              marketplace={marketplace} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Marketplace Card Component
const MarketplaceCard = ({ marketplace, index }: { marketplace: Marketplace; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-shadow hover:shadow-md"
    >
      <Link href={`/marketplace/${marketplace.id}`} className="block">
        {/* Banner background */}
        <div className="relative h-32 bg-gradient-to-r from-blue-50 to-indigo-50">
          {/* This would be replaced with actual banner image */}
          {/* <Image 
            src={marketplace.banner || '/images/marketplace-default-banner.jpg'}
            alt={`${marketplace.name} banner`}
            fill
            className="object-cover"
          /> */}
          
          {/* Live badge */}
          {marketplace.isLive && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
              <span className="relative flex h-2 w-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </div>
          )}
          
          {/* Logo */}
          <div className="absolute -bottom-8 left-4 h-16 w-16 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden">
            <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            {/* This would be replaced with actual logo image */}
            {/* <Image 
              src={marketplace.logo} 
              alt={marketplace.name} 
              fill 
              className="object-cover"
            /> */}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-4 pt-10">
          <h3 className="font-bold text-lg text-gray-900 truncate">{marketplace.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2 mt-1 h-10">
            {marketplace.description}
          </p>
          
          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-1">
            {marketplace.categories.slice(0, 3).map((category, i) => (
              <span 
                key={i} 
                className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600"
              >
                {category}
              </span>
            ))}
            {marketplace.categories.length > 3 && (
              <span className="inline-block bg-gray-100 rounded-full px-2 py-0.5 text-xs text-gray-600">
                +{marketplace.categories.length - 3}
              </span>
            )}
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex justify-between text-sm border-t border-gray-100 pt-3">
            <div>
              <span className="text-gray-500">Members:</span>{' '}
              <span className="font-medium">{marketplace.members}</span>
            </div>
            <div>
              <span className="text-gray-500">Products:</span>{' '}
              <span className="font-medium">{marketplace.listings}</span>
            </div>
            {marketplace.rating && (
              <div className="flex items-center">
                <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">{marketplace.rating}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default SimilarMarketplaces; 