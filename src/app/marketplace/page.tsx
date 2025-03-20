'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface Marketplace {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  members: string;
  listings: string;
  categories: string[];
  rating: number;
  isLive?: boolean;
}

// Mock data for marketplaces
const marketplaces: Marketplace[] = [
  {
    id: 'vintage-jewelry',
    name: 'Vintage Jewelry Addicts',
    description: 'Home to the very best vintage, antique, modern and handmade jewelry + accessories (bags, belts, hats, and more).',
    logo: '/images/marketplaces/vintage-logo.png',
    banner: '/images/marketplaces/vintage-banner.jpg',
    members: '4.7k',
    listings: '7.5k',
    categories: ['Vintage', 'Jewelry', 'Accessories'],
    rating: 4.7
  },
  {
    id: 'vintage-clothing',
    name: 'Timeless Vintage Clothing',
    description: 'Curated collection of vintage clothing from the 1950s to the 1990s, featuring designer pieces and everyday wear.',
    logo: '/images/marketplaces/vintage-clothing-logo.jpg',
    banner: '/images/marketplaces/vintage-clothing-banner.jpg',
    members: '3.2k',
    listings: '5.1k',
    categories: ['Vintage', 'Clothing', 'Fashion', 'Accessories'],
    rating: 4.8
  },
  {
    id: 'antique-treasures',
    name: 'Antique Treasures',
    description: 'Rare and authentic antique collectibles, furniture, and decorative arts from around the world.',
    logo: '/images/marketplaces/antique-treasures-logo.jpg',
    banner: '/images/marketplaces/antique-treasures-banner.jpg',
    members: '2.8k',
    listings: '3.4k',
    categories: ['Antiques', 'Collectibles', 'Home Decor'],
    rating: 4.7,
    isLive: true
  },
  {
    id: 'artisan-jewelry',
    name: 'Artisan Jewelry Collective',
    description: 'Handcrafted jewelry made by independent artisans using traditional techniques and sustainable materials.',
    logo: '/images/marketplaces/artisan-jewelry-logo.jpg',
    banner: '/images/marketplaces/artisan-jewelry-banner.jpg',
    members: '1.9k',
    listings: '4.2k',
    categories: ['Jewelry', 'Handmade', 'Artisanal'],
    rating: 4.9
  },
  {
    id: 'luxury-accessories',
    name: 'Luxury Accessories Exchange',
    description: 'Authenticated pre-owned luxury accessories from top designers at a fraction of retail prices.',
    logo: '/images/marketplaces/luxury-accessories-logo.jpg',
    banner: '/images/marketplaces/luxury-accessories-banner.jpg',
    members: '6.5k',
    listings: '8.7k',
    categories: ['Luxury', 'Designer', 'Bags', 'Accessories'],
    rating: 4.6
  },
  {
    id: 'baby-essentials',
    name: 'Baby Essentials Collective',
    description: 'Carefully curated baby products from trusted brands, featuring clothing, toys, and nursery items.',
    logo: '/images/marketplaces/baby-essentials-logo.jpg',
    banner: '/images/marketplaces/baby-essentials-banner.jpg',
    members: '8.3k',
    listings: '12.6k',
    categories: ['Baby', 'Kids', 'Essentials', 'Parenting'],
    rating: 4.9,
    isLive: true
  },
  {
    id: 'maternity-fashion',
    name: 'Maternity Fashion Hub',
    description: 'Stylish maternity clothing and accessories for every stage of pregnancy and beyond.',
    logo: '/images/marketplaces/maternity-fashion-logo.jpg',
    banner: '/images/marketplaces/maternity-fashion-banner.jpg',
    members: '5.2k',
    listings: '9.4k',
    categories: ['Maternity', 'Fashion', 'Clothing', 'Pregnancy'],
    rating: 4.7
  },
  {
    id: 'eco-friendly-baby',
    name: 'Eco-Friendly Baby Products',
    description: 'Sustainable and non-toxic baby products with minimal environmental impact, perfect for eco-conscious parents.',
    logo: '/images/marketplaces/eco-friendly-logo.jpg',
    banner: '/images/marketplaces/eco-friendly-banner.jpg',
    members: '3.7k',
    listings: '6.8k',
    categories: ['Eco-Friendly', 'Sustainable', 'Baby', 'Organic'],
    rating: 4.8
  }
];

export default function MarketplacesIndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // All unique categories
  const uniqueCategories = Array.from(
    new Set(marketplaces.flatMap(marketplace => marketplace.categories))
  ).sort();
  
  // Filter marketplaces based on search and category
  const filteredMarketplaces = marketplaces.filter(marketplace => {
    const matchesSearch = searchQuery === '' || 
      marketplace.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marketplace.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marketplace.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || 
      marketplace.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gray-50">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Discover Vibrant Shopping Communities</h1>
            <p className="text-xl text-gray-600 mb-8">Join specialized marketplaces curated for parents and families to buy, sell, and connect.</p>
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search marketplaces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Category Filter */}
      <section className="border-b border-gray-200">
        <div className="container-custom py-4 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            
            {uniqueCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedCategory === category
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
            {selectedCategory 
              ? `${selectedCategory} Marketplaces` 
              : searchQuery 
                ? 'Search Results' 
                : 'All Marketplaces'}
          </h2>
          
          {filteredMarketplaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMarketplaces.map(marketplace => (
                <MarketplaceCard key={marketplace.id} marketplace={marketplace} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">😕</div>
              <h3 className="text-xl font-bold mb-2">No marketplaces found</h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any marketplaces matching your search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory(null);
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none"
              >
                Clear Filters
              </button>
            </div>
          )}
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
function MarketplaceCard({ marketplace }: { marketplace: Marketplace }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <Link href={`/marketplace/${marketplace.id}`}>
        <div className="relative h-44">
          {/* Banner Image */}
          <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
          {/* Uncomment when you have actual images */}
          {/* <Image 
            src={marketplace.banner}
            alt={`${marketplace.name} banner`}
            fill
            className="object-cover"
          /> */}
          
          {/* Live Badge */}
          {marketplace.isLive && (
            <div className="absolute top-2 right-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <span className="h-2 w-2 mr-1 bg-green-500 rounded-full"></span>
                Live Now
              </span>
            </div>
          )}
          
          {/* Logo */}
          <div className="absolute -bottom-6 left-4">
            <div className="relative h-12 w-12 bg-white rounded-full border-2 border-white shadow-md">
              <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
              {/* Uncomment when you have actual images */}
              {/* <Image 
                src={marketplace.logo}
                alt={`${marketplace.name} logo`}
                fill
                className="object-cover rounded-full"
              /> */}
            </div>
          </div>
        </div>
        
        <div className="p-4 pt-8">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">{marketplace.name}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-2">{marketplace.description}</p>
            </div>
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">★</span>
              <span className="text-sm font-medium">{marketplace.rating.toFixed(1)}</span>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-4">
            {marketplace.categories.slice(0, 3).map(category => (
              <span key={category} className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                {category}
              </span>
            ))}
            {marketplace.categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                +{marketplace.categories.length - 3}
              </span>
            )}
          </div>
          
          {/* Stats */}
          <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
            <div>
              <span className="font-medium">{marketplace.members}</span> members
            </div>
            <div>
              <span className="font-medium">{marketplace.listings}</span> products
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 