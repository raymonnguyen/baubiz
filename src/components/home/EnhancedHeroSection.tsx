'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const EnhancedHeroSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('join');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to search results
    window.location.href = `/marketplace/search?q=${encodeURIComponent(searchQuery)}`;
  };
  
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-16 md:py-24 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -left-8 w-32 h-32 bg-yellow-300 rounded-full opacity-20"></div>
        <div className="absolute top-1/4 right-10 w-16 h-16 bg-blue-300 rounded-full opacity-20"></div>
        <div className="absolute bottom-1/3 -left-10 w-24 h-24 bg-green-300 rounded-full opacity-10"></div>
        <div className="absolute -bottom-10 right-1/4 w-40 h-40 bg-purple-300 rounded-full opacity-20"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 max-w-lg mx-auto lg:mx-0"
          >
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="block">Parenting is better</span>
              <span className="block text-primary">as a community.</span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Buy and sell high-quality baby items from other parents near you. Save money, reduce waste, and connect with families in your neighborhood.
            </motion.p>
            
            <motion.div
              className="pt-2 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/marketplace"
                className="btn-primary px-8 py-3 text-center rounded-full text-lg"
              >
                Start Browsing
              </Link>
              <Link
                href="/signup"
                className="btn-outline px-8 py-3 text-center rounded-full text-lg"
              >
                Join Our Community
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-4"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for strollers, car seats, toys..."
                    className="form-input pl-12 pr-4 py-3 w-full rounded-full text-gray-700 focus:ring-primary"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              </form>
              
              <div className="flex flex-wrap mt-3 gap-2">
                <span className="text-sm text-gray-500">Popular:</span>
                <Link href="/marketplace/categories/strollers" className="text-sm text-primary hover:underline">Strollers</Link>
                <span className="text-gray-300">•</span>
                <Link href="/marketplace/categories/clothing" className="text-sm text-primary hover:underline">Baby Clothing</Link>
                <span className="text-gray-300">•</span>
                <Link href="/marketplace/categories/toys" className="text-sm text-primary hover:underline">Toys</Link>
                <span className="text-gray-300">•</span>
                <Link href="/marketplace/categories/feeding" className="text-sm text-primary hover:underline">Feeding</Link>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-white p-4">
              {/* Placeholder for hero image - replace with actual image */}
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-7xl">👨‍👩‍👧</div>
                <p className="text-gray-500 absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs">Happy family image placeholder</p>
              </div>
              {/* Uncomment when you have actual image */}
              {/* <Image 
                src="/images/hero-family.jpg" 
                alt="Happy family with baby items" 
                fill
                className="object-cover rounded-xl"
              /> */}
              
              {/* Stats overlay */}
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white shadow-lg rounded-xl p-4 w-40"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <p className="text-xs text-gray-500">Active families</p>
                <p className="text-2xl font-bold text-gray-800">12,500+</p>
                <div className="mt-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-4/5 bg-primary rounded-full"></div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -top-6 -left-6 bg-white shadow-lg rounded-xl p-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Safety Verified</p>
                    <p className="text-xs text-gray-500">All items checked</p>
                  </div>
                </div>
              </motion.div>
              
              {/* Recent activity */}
              <motion.div 
                className="absolute top-1/4 -right-16 md:-right-8 bg-white shadow-lg rounded-xl p-3 max-w-[200px]"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-gray-200 h-8 w-8 rounded-full flex-shrink-0"></div>
                  <div>
                    <p className="text-xs font-medium">Sarah just saved</p>
                    <p className="text-xs text-primary">$128 on a stroller</p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Trust indicators */}
            <motion.div 
              className="mt-10 grid grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-primary">65%</div>
                <p className="text-xs text-gray-600">Average savings</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-primary">15K+</div>
                <p className="text-xs text-gray-600">Items available</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-primary">4.8<span className="text-sm">/5</span></div>
                <p className="text-xs text-gray-600">Seller rating</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHeroSection;

<style jsx global>{`
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  
  .animate-blob {
    animation: blob 7s infinite;
  }
  
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  
  .animation-delay-4000 {
    animation-delay: 4s;
  }
  
  .bg-grid-white {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .bg-pattern-dots {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
  }
`}</style> 