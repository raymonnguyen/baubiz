'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'clothing',
    name: 'Baby Clothing',
    description: 'From preemie to toddler sizes',
    ageRange: '0-4 years',
    itemCount: 1532,
    quality: '95% like new or gently used',
    savings: 'Avg. 65% off retail',
    image: '/images/categories/baby-clothing.jpg',
    color: 'from-sky-400/80 to-blue-500/80',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
  {
    id: 'toys',
    name: 'Toys & Books',
    description: 'Educational & developmental toys',
    ageRange: '0-6 years',
    itemCount: 1247,
    quality: '90% like new condition',
    savings: 'Avg. 70% off retail',
    image: '/images/categories/toys.jpg',
    color: 'from-amber-400/80 to-yellow-500/80',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'gear',
    name: 'Strollers & Gear',
    description: 'Strollers, car seats & essentials',
    ageRange: '0-3 years',
    itemCount: 876,
    quality: '98% safety checked',
    savings: 'Avg. 55% off retail',
    image: '/images/categories/strollers.jpg',
    color: 'from-green-400/80 to-emerald-500/80',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'nursery',
    name: 'Nursery Furniture',
    description: 'Cribs, rockers & bedroom items',
    ageRange: '0-5 years',
    itemCount: 543,
    quality: '92% like new condition',
    savings: 'Avg. 60% off retail',
    image: '/images/categories/nursery.jpg',
    color: 'from-purple-400/80 to-indigo-500/80',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'maternity',
    name: 'Maternity',
    description: 'Stylish & comfortable clothing',
    ageRange: 'All trimesters',
    itemCount: 765,
    quality: '85% like new condition',
    savings: 'Avg. 75% off retail',
    image: '/images/categories/maternity.jpg',
    color: 'from-pink-400/80 to-rose-500/80',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    id: 'feeding',
    name: 'Feeding & Nursing',
    description: 'Bottles, pumps & accessories',
    ageRange: '0-2 years',
    itemCount: 932,
    quality: '97% sanitized & safe',
    savings: 'Avg. 50% off retail',
    image: '/images/categories/feeding.jpg',
    color: 'from-teal-400/80 to-cyan-500/80',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
];

const EnhancedCategorySection = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Browse Parent-Approved Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quality items for every stage of parenting, all safety-checked and ready for your growing family
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-5">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <Link href={`/marketplace/categories/${category.id}`} className="block">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-md">
                  {/* Image background with color overlay */}
                  <div className="absolute inset-0 bg-gray-300 animate-pulse"></div>
                  {/* Uncomment when you have real images */}
                  {/* <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  /> */}
                  
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-b ${category.color} opacity-80 transition-opacity duration-300 group-hover:opacity-90`}></div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2.5 shadow-sm">
                        <div className="text-primary">{category.icon}</div>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                        {category.itemCount}+ items
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-white text-xl font-bold drop-shadow-sm">{category.name}</h3>
                      <p className="text-white/90 text-sm drop-shadow-sm">{category.description}</p>
                      
                      {/* Stats that show on hover */}
                      <div 
                        className={`grid grid-cols-2 gap-2 mt-2 transition-all duration-300 ${
                          hoveredCategory === category.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                      >
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                          <p className="text-white text-xs font-medium">{category.ageRange}</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded px-2 py-1">
                          <p className="text-white text-xs font-medium">{category.savings}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Safety/Quality badge */}
                <div className="absolute -bottom-3 right-4 bg-white rounded-full shadow-md px-3 py-1 text-xs font-medium text-gray-700 border border-gray-100">
                  {category.quality}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12 text-center"
        >
          <Link 
            href="/marketplace/categories"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            <span>View all categories</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
        
        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex gap-4 items-center"
          >
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Safety Verified</h3>
              <p className="text-sm text-gray-600">All items checked against recall lists</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-4 items-center"
          >
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Massive Savings</h3>
              <p className="text-sm text-gray-600">50-80% off retail on most items</p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex gap-4 items-center"
          >
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold">Parent to Parent</h3>
              <p className="text-sm text-gray-600">Buy directly from trusted local families</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedCategorySection; 