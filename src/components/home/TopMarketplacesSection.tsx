'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

// Sample marketplace data
const marketplaces = [
  {
    id: 'commons-wholesale',
    name: 'Commons Wholesale Marketplace',
    logo: '/images/marketplaces/commons-logo.png',
    banner: '/images/marketplaces/commons-banner.jpg',
    description: 'Discover and buy top-quality, wholesale products from trusted sellers. Buyer and Seller Protection on all transactions.',
    members: '6.4k',
    listings: '1.1k',
    categories: ['Wholesale', 'Bulk Items', 'Resellers'],
    badgeColor: 'bg-blue-500',
    badgeText: '1ST',
  },
  {
    id: 'vintage-jewelry',
    name: 'Vintage Jewelry Addicts',
    logo: '/images/marketplaces/vintage-logo.png',
    banner: '/images/marketplaces/vintage-banner.jpg',
    description: 'Home to the very best vintage, antique, modern and handmade jewelry + accessories (bags, belts, hats, and more).',
    members: '4.7k',
    listings: '7.5k',
    categories: ['Vintage', 'Jewelry', 'Accessories'],
    isLive: true,
    badgeColor: 'bg-gray-500',
    badgeText: '2ND',
  },
  {
    id: 'quirky-groovy',
    name: 'Quirky Groovy Vintage',
    logo: '/images/marketplaces/quirky-logo.png',
    banner: '/images/marketplaces/quirky-banner.jpg',
    description: 'Hi all! Welcome to Quirky Groovy Vintage. This is a one stop shop for everything! QGV was founded in May of 2022 on Depop.',
    members: '4.6k',
    listings: '4.6k',
    categories: ['Vintage', 'Quirky', 'Eclectic'],
    badgeColor: 'bg-amber-500',
    badgeText: '3RD',
  },
  {
    id: 'keepin-it-real',
    name: 'Keepin it Real',
    logo: '/images/marketplaces/keepin-logo.png',
    banner: '/images/marketplaces/keepin-banner.jpg',
    description: 'Real products. Real people. Real deals. We are more than just a shopping destination; we\'re a community where values matter.',
    members: '2.6k',
    listings: '2.7k',
    categories: ['Authentic', 'Community', 'Sustainable'],
  },
];

// Category filters
const categoryFilters = [
  { id: 'all', name: 'All' },
  { id: 'sports-cards', name: 'Sports Cards' },
  { id: 'collectibles', name: 'Collectibles' },
  { id: 'antiques', name: 'Antiques' },
  { id: 'fandom', name: 'Fandom' },
  { id: 'womens-fashion', name: 'Women\'s Fashion' },
  { id: 'mens-fashion', name: 'Men\'s Fashion' },
  { id: 'plants', name: 'Plants' },
  { id: 'home-living', name: 'Home & Living' },
  { id: 'jewelry', name: 'Jewelry' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'handcrafted', name: 'Handcrafted' },
];

const TopMarketplacesSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Top Marketplaces</h2>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categoryFilters.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === category.id 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveFilter(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          
          {/* Featured marketplaces - Top 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {marketplaces.slice(0, 3).map((marketplace, index) => (
              <motion.div
                key={marketplace.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow overflow-hidden"
              >
                {/* Badge position */}
                {marketplace.badgeText && (
                  <div className={`absolute top-0 left-0 ${marketplace.badgeColor} text-white font-bold px-3 py-1 rounded-br-lg z-10`}>
                    {marketplace.badgeText}
                  </div>
                )}
                
                {/* Banner image */}
                <div className="relative h-40 bg-gradient-to-r from-blue-100 to-purple-100">
                  {/* Placeholder for marketplace banner */}
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  {/* Uncomment when you have actual images */}
                  {/* <Image 
                    src={marketplace.banner}
                    alt={`${marketplace.name} banner`}
                    fill
                    className="object-cover"
                  /> */}
                  
                  {/* Logo overlay */}
                  <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                    <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-full"></div>
                    {/* Uncomment when you have actual images */}
                    {/* <Image 
                      src={marketplace.logo}
                      alt={`${marketplace.name} logo`}
                      fill
                      className="object-cover"
                    /> */}
                  </div>
                  
                  {/* Live badge */}
                  {marketplace.isLive && (
                    <div className="absolute bottom-2 left-24 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      LIVE
                    </div>
                  )}
                  
                  {/* Join button */}
                  <div className="absolute -bottom-4 right-4">
                    <Link
                      href={`/marketplace/${marketplace.id}`}
                      className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Join
                    </Link>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 pt-10">
                  <h3 className="text-xl font-bold">{marketplace.name}</h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{marketplace.description}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>{marketplace.members} Members</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                      </svg>
                      <span>{marketplace.listings} Listings</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Table of other marketplaces */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Listings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* Example marketplace entry in table format */}
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">4</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gray-300 animate-pulse rounded-full"></div>
                        {/* Uncomment when you have actual images */}
                        {/* <Image 
                          src={marketplaces[3].logo} 
                          alt={marketplaces[3].name}
                          fill
                          className="object-cover"
                        /> */}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{marketplaces[3].name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{marketplaces[3].description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {marketplaces[3].members}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    {marketplaces[3].listings}
                  </td>
                </tr>
                
                {/* Add more table rows as needed */}
              </tbody>
            </table>
          </div>
          
          {/* View all marketplaces button */}
          <div className="mt-8 text-center">
            <Link 
              href="/marketplaces"
              className="inline-flex items-center text-primary font-medium hover:underline"
            >
              View all marketplaces
              <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopMarketplacesSection; 