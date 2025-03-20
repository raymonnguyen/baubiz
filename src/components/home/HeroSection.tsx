'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'toys', label: 'Toys & Games' },
    { id: 'gear', label: 'Baby Gear' },
    { id: 'maternity', label: 'Maternity' },
    { id: 'services', label: 'Services' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchTerm, 'in category:', selectedCategory);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="relative w-full h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Video/Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/mom-baby-hero.mp4" type="video/mp4" />
          {/* Fallback image if video doesn't load */}
          <Image 
            src="/images/hero-fallback.jpg" 
            alt="Mom and baby marketplace" 
            fill 
            className="object-cover"
            priority
          />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center">
        <div className="container-custom">
          <motion.div
            className="max-w-2xl text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              The Marketplace for <span className="text-primary">Moms</span> and Their <span className="text-primary">Little Ones</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl opacity-90 mb-8"
              variants={itemVariants}
            >
              Buy, sell, and trade quality baby and maternity items in your local community.
              Connect with other moms and access the services you need.
            </motion.p>

            {/* Search Component */}
            <motion.div
              className="bg-white rounded-xl p-1 shadow-xl mb-8"
              variants={itemVariants}
            >
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row">
                <div className="flex-1 flex items-center p-3">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="w-full text-text focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="md:border-l border-gray-200 p-3 flex items-center">
                  <select
                    className="text-text bg-transparent focus:outline-none pr-8"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button 
                  type="submit"
                  className="btn-primary p-4 rounded-lg"
                >
                  Search
                </button>
              </form>
            </motion.div>

            {/* Call to action buttons */}
            <motion.div 
              className="flex flex-wrap gap-4"
              variants={itemVariants}
            >
              <Link 
                href="/marketplace" 
                className="btn-primary px-6 py-3 inline-flex items-center gap-2"
              >
                <span>Explore Marketplace</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link 
                href="/auth/register"  
                className="btn-outline px-6 py-3 inline-flex items-center gap-2 border-2 border-white hover:bg-white/10"
              >
                <span>Join Today</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                  <path d="M16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Trending Categories Pills */}
      <motion.div 
        className="absolute bottom-8 left-0 right-0 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <div className="container-custom">
          <div className="flex flex-wrap gap-3 justify-center">
            <span className="text-white opacity-80 mr-2">Trending:</span>
            {['Strollers', 'Baby Clothes 0-3M', 'Nursery Furniture', 'Maternity Dresses', 'Toys'].map((item, index) => (
              <Link
                key={item}
                href={`/marketplace?search=${item}`}
                className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/30 transition-colors text-sm"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 