'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import VerifiedBadge from '@/components/seller/VerifiedBadge';

// Dynamically import the map component to avoid SSR issues
const SellerLocationMap = dynamic(
  () => import('@/components/maps/SellerLocationMap'),
  { ssr: false }
);

interface Policy {
  title: string;
  content: string;
}

interface MarketplacePolicies {
  shipping: Policy;
  returns: Policy;
  payments: Policy;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Seller {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  location: string;
  bio: string;
  totalSales: number;
  responseRate: number;
  responseTime: string;
  lastActive: string;
  // Adding coordinates for the map
  lat?: number;
  lng?: number;
  // Adding verification status
  verificationType?: 'parent' | 'business';
}

interface MarketplaceAboutProps {
  marketplaceId: string;
  marketplaceName: string;
  description: string;
  longDescription: string;
  establishedDate: string;
  seller: Seller;
  sellers?: Seller[];
  policies: MarketplacePolicies;
  faqs: FAQ[];
}

const MarketplaceAbout = ({
  marketplaceId,
  marketplaceName,
  description,
  longDescription,
  establishedDate,
  seller,
  sellers = [],
  policies,
  faqs,
}: MarketplaceAboutProps) => {
  const [activeTab, setActiveTab] = useState<'about' | 'policies' | 'seller'>('about');
  const [expandedFaqs, setExpandedFaqs] = useState<number[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [activeSeller, setActiveSeller] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  
  // Ensure we have an array of sellers
  const allSellers = sellers.length > 0 ? sellers : seller ? [seller] : [];
  
  // Set map as ready after component mounts
  useEffect(() => {
    setMapReady(true);
  }, []);
  
  const toggleFaq = (index: number) => {
    setExpandedFaqs(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Create seller location objects for the map
  const sellerLocations = allSellers
    .filter(s => s.lat && s.lng)
    .map(s => ({
      id: s.id,
      sellerId: s.id,
      sellerName: s.name,
      approximateAddress: s.location,
      lat: s.lat!,
      lng: s.lng!,
      productCount: s.totalSales || 0,
      avatarUrl: s.avatar,
      verified: !!s.verificationType,
      verificationType: s.verificationType,
      rating: 4.8 // Assuming a default rating for now
    }));

  // Use geocoding to get coordinates from seller location if not provided
  useEffect(() => {
    // This would normally fetch coordinates if we don't have them
    // For demo purposes, we're providing fallback coordinates for different cities
    allSellers.forEach((seller, index) => {
      if (!seller.lat || !seller.lng) {
        // Assign different coordinates to each seller for visual separation
        const locations = [
          { lat: 37.7749, lng: -122.4194 }, // San Francisco
          { lat: 34.0522, lng: -118.2437 }, // Los Angeles
          { lat: 40.7128, lng: -74.0060 }, // New York
          { lat: 41.8781, lng: -87.6298 }, // Chicago
          { lat: 29.7604, lng: -95.3698 }  // Houston
        ];
        
        const locationIndex = index % locations.length;
        seller.lat = locations[locationIndex].lat;
        seller.lng = locations[locationIndex].lng;
      }
    });
  }, [allSellers]);

  // Slider mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const navigateSlider = (direction: 'prev' | 'next') => {
    if (!sliderRef.current) return;
    
    let newIndex;
    if (direction === 'next') {
      newIndex = Math.min(activeSeller + 1, allSellers.length - 1);
    } else {
      newIndex = Math.max(activeSeller - 1, 0);
    }
    
    // Update the active seller index
    setActiveSeller(newIndex);
    
    // Smoothly scroll to the selected seller card
    const cardWidth = 280; // Approximate width of a seller card including margins
    sliderRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: 'smooth'
    });
  };

  const selectSeller = (index: number) => {
    setActiveSeller(index);
    
    // Smoothly scroll to the selected seller card
    if (sliderRef.current) {
      const cardWidth = 280; // Approximate width of a seller card including margins
      sliderRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  // Get current seller
  const currentSeller = allSellers[activeSeller] || (allSellers.length > 0 ? allSellers[0] : seller);

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setTouchStartX(e.touches[0].clientX);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return;
    const touchX = e.touches[0].clientX;
    const walk = (touchStartX - touchX) * 2; // Scroll speed multiplier
    sliderRef.current.scrollLeft = scrollLeft + walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap to closest seller card
    if (sliderRef.current) {
      const cardWidth = 280; // Approximate width of a seller card including margins
      const scrollPosition = sliderRef.current.scrollLeft;
      const index = Math.round(scrollPosition / cardWidth);
      
      // Only update if we have a valid index
      if (index >= 0 && index < allSellers.length) {
        selectSeller(index);
      }
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="container-custom">
        {/* Tab navigation */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={`px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'about' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
            <button
              className={`px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'policies' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('policies')}
            >
              Policies
            </button>
            <button
              className={`px-1 py-4 text-sm font-medium border-b-2 ${
                activeTab === 'seller' 
                  ? 'border-primary text-primary' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('seller')}
            >
              {allSellers.length > 1 ? 'Sellers' : 'Seller'}
            </button>
          </nav>
        </div>
        
        {/* About tab content */}
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">About {marketplaceName}</h2>
              
              <div className="prose max-w-none">
                <p className="text-lg mb-6">{description}</p>
                
                {longDescription && (
                  <div className="mt-4" dangerouslySetInnerHTML={{ __html: longDescription }} />
                )}
                
                {establishedDate && (
                  <div className="flex items-center text-sm text-gray-500 mt-6">
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Marketplace established in {establishedDate}
                  </div>
                )}
              </div>
              
              {/* FAQs Section */}
              {faqs && faqs.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold mb-6">Frequently Asked Questions</h3>
                  
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          className="flex justify-between items-center w-full px-4 py-3 text-left font-medium bg-gray-50 hover:bg-gray-100"
                          onClick={() => toggleFaq(index)}
                        >
                          <span>{faq.question}</span>
                          <svg 
                            className={`w-5 h-5 transform transition-transform ${expandedFaqs.includes(index) ? 'rotate-180' : ''}`} 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedFaqs.includes(index) && (
                          <div className="px-4 py-3 bg-white">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Policies tab content */}
        {activeTab === 'policies' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Marketplace Policies</h2>
              
              <div className="space-y-8">
                {Object.entries(policies).map(([key, policy]) => (
                  <div key={key}>
                    <h3 className="text-lg font-bold mb-2">{policy.title}</h3>
                    <div className="prose max-w-none text-gray-700">
                      <p>{policy.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                <p>Last updated: {new Date().toLocaleDateString()}</p>
                <p className="mt-2">
                  If you have any questions about these policies, please{' '}
                  <Link href={`/marketplace/${marketplaceId}/contact`} className="text-primary hover:underline">
                    contact the seller
                  </Link>
                  .
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Seller tab content */}
        {activeTab === 'seller' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">
                {allSellers.length > 1 ? 'Meet Our Sellers' : 'Meet the Seller'}
              </h2>
              
              {/* Sellers Slider */}
              {allSellers.length > 1 && (
                <div className="mb-10 relative">
                  <div 
                    className="overflow-x-auto no-scrollbar py-4 px-2"
                    ref={sliderRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{ 
                      cursor: isDragging ? 'grabbing' : 'grab',
                      WebkitOverflowScrolling: 'touch',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    }}
                  >
                    <div className="flex space-x-6 pb-4">
                      {allSellers.map((seller, index) => (
                        <div 
                          key={seller.id}
                          className={`bg-white shadow-sm border ${activeSeller === index ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'} rounded-lg p-4 flex-shrink-0 w-64 transition-all duration-300 transform hover:scale-105 hover:shadow-md ${activeSeller === index ? 'scale-105 shadow-md' : ''}`}
                          onClick={() => selectSeller(index)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                              {/* <Image 
                                src={seller.avatar}
                                alt={seller.name}
                                fill
                                className="object-cover"
                              /> */}
                              <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">
                                {seller.name.charAt(0)}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">{seller.name}</h3>
                              {seller.verificationType && (
                                <div className="mt-1">
                                  <VerifiedBadge 
                                    type={seller.verificationType} 
                                    size="sm"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {seller.location && (
                            <div className="mt-3 flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span className="truncate">{seller.location}</span>
                            </div>
                          )}
                          
                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className={`${activeSeller === index ? 'bg-primary/10' : 'bg-gray-50'} p-2 rounded`}>
                              <div className="text-gray-500">Sales</div>
                              <div className="font-bold">{seller.totalSales}+</div>
                            </div>
                            <div className={`${activeSeller === index ? 'bg-primary/10' : 'bg-gray-50'} p-2 rounded`}>
                              <div className="text-gray-500">Response</div>
                              <div className="font-bold">{seller.responseRate}%</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between">
                            <div className={`h-1 rounded-full flex-grow ${activeSeller === index ? 'bg-primary' : 'bg-gray-200'}`}></div>
                            {activeSeller === index && (
                              <div className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">Selected</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Navigation buttons */}
                  <button 
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    onClick={() => navigateSlider('prev')}
                    aria-label="Previous sellers"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 bg-white rounded-full shadow-md p-2 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    onClick={() => navigateSlider('next')}
                    aria-label="Next sellers"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Dots for pagination */}
                  <div className="flex justify-center mt-4 space-x-2">
                    {allSellers.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => selectSeller(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none ${
                          activeSeller === index 
                            ? 'bg-primary w-8' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Select seller ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Selected Seller Detail */}
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden mx-auto">
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      {/* <Image 
                        src={currentSeller.avatar}
                        alt={currentSeller.name}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    
                    <h3 className="text-xl font-bold mt-4">{currentSeller.name}</h3>
                    
                    {/* Display verification badge if seller is verified */}
                    {currentSeller.verificationType && (
                      <div className="mt-2">
                        <VerifiedBadge 
                          type={currentSeller.verificationType} 
                          showLabel={true}
                          size="md"
                        />
                      </div>
                    )}
                    
                    {currentSeller.location && (
                      <p className="text-gray-600 mt-3">{currentSeller.location}</p>
                    )}
                    
                    <div className="mt-4 text-sm text-gray-500">
                      <p>Member since {currentSeller.joinedDate}</p>
                      {currentSeller.lastActive && (
                        <p className="mt-1">Last active: {currentSeller.lastActive}</p>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      <Link
                        href={`/messages/new?seller=${currentSeller.id}`}
                        className="block w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        Contact Seller
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-2/3">
                  {currentSeller.bio && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold mb-2">About</h3>
                      <p className="text-gray-700">{currentSeller.bio}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {currentSeller.totalSales !== undefined && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm text-gray-500 mb-1">Total Sales</h4>
                        <p className="text-2xl font-bold">{currentSeller.totalSales}+</p>
                      </div>
                    )}
                    
                    {currentSeller.responseRate !== undefined && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm text-gray-500 mb-1">Response Rate</h4>
                        <p className="text-2xl font-bold">{currentSeller.responseRate}%</p>
                      </div>
                    )}
                    
                    {currentSeller.responseTime && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm text-gray-500 mb-1">Response Time</h4>
                        <p className="text-2xl font-bold">{currentSeller.responseTime}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4">Other Marketplaces by this Seller</h3>
                    <p className="text-gray-600">This seller doesn't have any other marketplaces yet.</p>
                    {/* This could be replaced with actual marketplace listings if available */}
                  </div>
                </div>
              </div>
              
              {/* Seller Location Map */}
              <div className="mt-10">
                <h3 className="text-lg font-bold mb-4">Seller Locations Map</h3>
                
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <h4 className="text-base font-semibold">
                          {sellerLocations.length} {sellerLocations.length === 1 ? 'Seller' : 'Sellers'} in this Marketplace
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        This map shows the approximate locations of our marketplace sellers. Click on a marker to see more details about each seller.
                      </p>
                    </div>
                    
                    <div className="hidden md:block">
                      <button 
                        className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium flex items-center"
                        onClick={() => {
                          // Scroll the selected seller card into view
                          if (sliderRef.current && activeSeller >= 0) {
                            selectSeller(activeSeller);
                          }
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                        </svg>
                        View Selected Seller
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {sellerLocations.length > 0 && sellerLocations.map((location, index) => (
                      <div 
                        key={location.id}
                        className={`text-xs flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                          activeSeller === index ? 'bg-white shadow-sm border border-primary/20' : 'bg-white/50 hover:bg-white'
                        }`}
                        onClick={() => selectSeller(index)}
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-xs font-bold overflow-hidden">
                          {location.avatarUrl ? (
                            <Image 
                              src={location.avatarUrl} 
                              alt={location.sellerName}
                              width={24}
                              height={24}
                              className="object-cover"
                            />
                          ) : (
                            location.sellerName.charAt(0)
                          )}
                        </div>
                        <div className="flex-1 truncate">
                          <div className="font-medium text-gray-900 truncate">{location.sellerName}</div>
                          <div className="text-gray-500 truncate">{location.approximateAddress}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {mapReady && sellerLocations.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
                    <SellerLocationMap
                      sellerLocations={sellerLocations}
                      height="500px"
                      initialZoom={sellerLocations.length > 1 ? 5 : 10}
                      allowLocationAccess={true}
                      highlightedSellerId={currentSeller.id}
                      onSellerClick={(sellerId) => {
                        // Find the seller index and scroll to that seller card
                        const index = allSellers.findIndex(s => s.id === sellerId);
                        if (index >= 0) {
                          selectSeller(index);
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MarketplaceAbout; 