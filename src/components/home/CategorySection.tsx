'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    id: 'clothing',
    name: 'Baby Clothing',
    icon: '/icons/baby-clothing.svg',
    bgColor: 'bg-teal-50',
    accent: 'text-teal-600',
    borderColor: 'border-teal-100',
    description: 'New & gently used clothing for babies and toddlers',
    image: '/images/categories/baby-clothing.jpg',
    count: 1245,
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    icon: '/icons/toys.svg',
    bgColor: 'bg-amber-50',
    accent: 'text-amber-600',
    borderColor: 'border-amber-100',
    description: 'Educational toys, games, and books for all ages',
    image: '/images/categories/toys.jpg',
    count: 987,
  },
  {
    id: 'strollers',
    name: 'Strollers & Car Seats',
    icon: '/icons/stroller.svg',
    bgColor: 'bg-blue-50',
    accent: 'text-blue-600',
    borderColor: 'border-blue-100',
    description: 'Safe travel gear from trusted brands',
    image: '/images/categories/stroller.jpg',
    count: 543,
  },
  {
    id: 'maternity',
    name: 'Maternity',
    icon: '/icons/maternity.svg',
    bgColor: 'bg-purple-50',
    accent: 'text-purple-600',
    borderColor: 'border-purple-100',
    description: 'Stylish and comfortable maternity clothes',
    image: '/images/categories/maternity.jpg',
    count: 621,
  },
  {
    id: 'nursery',
    name: 'Nursery & Furniture',
    icon: '/icons/crib.svg',
    bgColor: 'bg-rose-50',
    accent: 'text-rose-600',
    borderColor: 'border-rose-100',
    description: 'Everything you need for the perfect nursery',
    image: '/images/categories/nursery.jpg',
    count: 412,
  },
  {
    id: 'feeding',
    name: 'Feeding & Nursing',
    icon: '/icons/feeding.svg',
    bgColor: 'bg-emerald-50',
    accent: 'text-emerald-600',
    borderColor: 'border-emerald-100',
    description: 'Bottles, breast pumps, highchairs, and more',
    image: '/images/categories/feeding.jpg',
    count: 752,
  },
];

const CategorySection = () => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  return (
    <section className="py-16 bg-gray-50/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Category</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find exactly what you need for your little one or sell items they've outgrown
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="relative"
            >
              <Link 
                href={`/marketplace/categories/${category.id}`}
                className={`
                  block overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-all duration-300
                  border ${category.borderColor} ${category.bgColor}
                `}
              >
                <div className="aspect-[3/2] relative overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`
                      object-cover transition-transform duration-500
                      ${hoveredCategory === category.id ? 'scale-110' : 'scale-105'}
                    `}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                
                <div className="p-6 relative">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${category.bgColor}`}>
                        <div className={`w-6 h-6 ${category.accent}`}>
                          {/* You can replace this with actual SVG icons */}
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${category.accent}`}>
                      {category.count.toLocaleString()} items
                    </span>
                  </div>
                  
                  <motion.div 
                    className="mt-6 flex justify-between items-center"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: hoveredCategory === category.id ? 1 : 0,
                      y: hoveredCategory === category.id ? 0 : 10
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-sm text-gray-600">View all items</span>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`h-5 w-5 transition-transform duration-300 ${
                        hoveredCategory === category.id ? 'translate-x-1' : ''
                      } ${category.accent}`}
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
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
      </div>
    </section>
  );
};

export default CategorySection; 