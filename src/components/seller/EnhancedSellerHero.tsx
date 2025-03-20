'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface EnhancedSellerHeroProps {
  activeTab: 'join' | 'create';
  setActiveTab: (tab: 'join' | 'create') => void;
  handleGetStarted: () => void;
}

export default function EnhancedSellerHero({ 
  activeTab, 
  setActiveTab, 
  handleGetStarted 
}: EnhancedSellerHeroProps) {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-50"></div>
      
      {/* Animated Gradient Blobs */}
      <div className="absolute left-1/2 top-1/4 w-64 h-64 rounded-full bg-purple-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute right-1/4 top-1/3 w-72 h-72 rounded-full bg-yellow-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute left-1/4 bottom-1/4 w-80 h-80 rounded-full bg-blue-100 mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-grid-white opacity-20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Hero Content */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4 px-6 py-2 bg-indigo-50 rounded-full">
              <span className="text-indigo-600 font-medium">Become a Seller</span>
            </div>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Turn your passion for vintage <br />into a thriving business
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Join our community of sellers and reach thousands of buyers looking for unique, 
              authentic items. Our platform gives you the tools to succeed.
            </motion.p>
            
            <motion.div
              className="flex flex-wrap justify-center gap-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button
                onClick={handleGetStarted}
                className="btn-primary px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
              >
                <span>Start Selling Today</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.6673 3.33334L18.334 10L11.6673 16.6667M1.66732 10H18.334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <Link
                href="#how-it-works"
                className="btn-outline px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-300"
              >
                Learn More
              </Link>
            </motion.div>
            
            <motion.div
              className="flex flex-wrap justify-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-600">No listing fees</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-600">Set your own prices</span>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-gray-600">Simple 10% commission</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Tabs Container */}
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 md:p-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Tabs */}
          <div className="flex mb-12 border-b border-gray-200">
            <button
              className={`py-4 px-6 text-lg font-medium relative ${activeTab === 'join' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('join')}
            >
              Join an Existing Market
              {activeTab === 'join' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  layoutId="activeTab"
                />
              )}
            </button>
            <button
              className={`py-4 px-6 text-lg font-medium relative ${activeTab === 'create' ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('create')}
            >
              Create Your Own Market
              {activeTab === 'create' && (
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  layoutId="activeTab"
                />
              )}
            </button>
          </div>
          
          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Tab Content Image */}
            <div className="relative rounded-2xl overflow-hidden h-80 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
              {activeTab === 'join' ? (
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Replace with actual image */}
                    <div className="text-6xl">🛍️</div>
                    <p className="absolute bottom-4 text-xs text-gray-500">Join marketplace image placeholder</p>
                  </div>
                </div>
              ) : (
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Replace with actual image */}
                    <div className="text-6xl">🏪</div>
                    <p className="absolute bottom-4 text-xs text-gray-500">Create marketplace image placeholder</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tab Content Text */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-900">
                {activeTab === 'join' 
                  ? 'Join established marketplaces' 
                  : 'Create your specialized marketplace'}
              </h3>
              
              <div className="space-y-4 mb-8">
                {activeTab === 'join' ? (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Connect with established buyer communities</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Benefit from existing traffic and customer bases</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Start selling immediately without building from scratch</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Create your own niche with custom branding and rules</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Invite other sellers to join your specialized marketplace</p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-600">Earn commission from sales made by sellers in your market</p>
                    </div>
                  </>
                )}
              </div>
              
              <button
                onClick={handleGetStarted}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {activeTab === 'join' ? 'Find Markets to Join' : 'Create Your Market'}
              </button>
            </div>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-gray-500 text-center mb-6">Trusted by vintage sellers worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-indigo-600">5,000+</div>
                <p className="text-sm text-gray-500">Active sellers</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-indigo-600">$2.5M+</div>
                <p className="text-sm text-gray-500">Monthly sales</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-indigo-600">150+</div>
                <p className="text-sm text-gray-500">Specialized markets</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-indigo-600">98%</div>
                <p className="text-sm text-gray-500">Seller satisfaction</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 