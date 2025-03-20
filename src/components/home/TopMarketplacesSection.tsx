'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url?: string;
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

// Category filters
const categoryFilters = [
  { id: 'all', name: 'All' },
  { id: 'may-hut-sua', name: 'Máy Hút Sữa' },
  { id: 'binh-sua', name: 'Bình Sữa' },
  { id: 'quan-ao', name: 'Quần Áo' },
  { id: 'ta-bim', name: 'Tã Bỉm' },
  { id: 'sua-cong-thuc', name: 'Sữa' },
  { id: 'do-choi', name: 'Đồ Chơi' },
  { id: 'giac-ngu', name: 'Giấc Ngủ' },
  { id: 'me-sau-sinh', name: 'Mẹ Sau Sinh' },
  { id: 'sach', name: 'Sách' },
];

const TopMarketplacesSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketplaces = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/markets/top');
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setMarketplaces(data);
        }
      } catch (error) {
        console.error('Error fetching marketplaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplaces();
  }, []);

  // Filter marketplaces based on active category
  const filteredMarketplaces = activeFilter === 'all'
    ? marketplaces
    : marketplaces.filter(marketplace => 
        marketplace.slug.includes(activeFilter) || 
        marketplace.categories?.some(category => category.slug.includes(activeFilter))
      );
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Top Marketplaces</h2>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
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
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow overflow-hidden animate-pulse">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4 pt-10">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Featured marketplaces - Top 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
                {filteredMarketplaces.slice(0, 3).map((marketplace, index) => (
                  <motion.div
                    key={marketplace.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow overflow-hidden h-full flex flex-col"
                  >
                    {/* Badge position */}
                    {index < 3 && (
                      <div className={`absolute top-0 left-0 ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-gray-500' : 
                        'bg-amber-500'
                      } text-white font-bold px-3 py-1 rounded-br-lg z-10`}>
                        {index === 0 ? '1ST' : index === 1 ? '2ND' : '3RD'}
                      </div>
                    )}
                    
                    {/* Banner image */}
                    <div className="relative h-40 bg-gradient-to-r from-blue-100 to-purple-100">
                      {marketplace.cover_image || marketplace.banner_url ? (
                        <Image 
                          src={marketplace.cover_image || marketplace.banner_url || ''}
                          alt={`${marketplace.name} banner`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200"></div>
                      )}
                      
                      {/* Logo overlay */}
                      <div className="absolute -bottom-8 left-4 w-16 h-16 rounded-full border-4 border-white bg-white overflow-hidden shadow-md">
                        {marketplace.logo_url ? (
                          <Image 
                            src={marketplace.logo_url}
                            alt={`${marketplace.name} logo`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      
                      {/* Join button */}
                      <div className="absolute -bottom-4 right-4">
                        <Link
                          href={`/marketplace/${marketplace.slug}`}
                          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
                        >
                          Join
                        </Link>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4 pt-10 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold">{marketplace.name}</h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-3 flex-1">{marketplace.description}</p>
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-1 mt-3 mb-2">
                        {marketplace.categories?.slice(0, 3).map(category => (
                          <span key={category.id} className="inline-block text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {category.name}
                          </span>
                        ))}
                        {marketplace.categories?.length > 3 && (
                          <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded-full">
                            +{marketplace.categories.length - 3} more
                          </span>
                        )}
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
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categories
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredMarketplaces.slice(3, 10).map((marketplace, index) => (
                      <tr key={marketplace.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{index + 4}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 relative overflow-hidden">
                              {marketplace.logo_url ? (
                                <Image 
                                  src={marketplace.logo_url} 
                                  alt={marketplace.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gray-300 rounded-full"></div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{marketplace.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{marketplace.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {marketplace.categories?.slice(0, 2).map(category => (
                              <span key={category.id} className="inline-block text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {category.name}
                              </span>
                            ))}
                            {marketplace.categories?.length > 2 && (
                              <span className="inline-block text-xs bg-gray-100 px-2 py-1 rounded-full">
                                +{marketplace.categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link
                            href={`/marketplace/${marketplace.slug}`}
                            className="text-primary hover:text-primary-dark hover:underline"
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* View all marketplaces button */}
              <div className="mt-8 text-center">
                <Link 
                  href="/marketplace"
                  className="inline-flex items-center text-primary font-medium hover:underline"
                >
                  View all marketplaces
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default TopMarketplacesSection; 