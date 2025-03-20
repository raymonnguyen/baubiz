'use client';

import { useState } from 'react';
import SellerLocationMap, { SellerLocation } from '@/components/maps/SellerLocationMap';
import VerifiedBadge from '@/components/seller/VerifiedBadge';

// Sample seller location data
const SAMPLE_SELLER_LOCATIONS: SellerLocation[] = [
  {
    id: '1',
    sellerId: 'seller1',
    sellerName: 'Sarah Johnson',
    approximateAddress: 'San Francisco, CA',
    lat: 37.7749,
    lng: -122.4194,
    productCount: 15,
    avatarUrl: '/images/avatars/avatar-1.jpg',
    verified: true,
    verificationType: 'parent',
    rating: 4.8
  },
  {
    id: '2',
    sellerId: 'seller2',
    sellerName: 'Michael Chen',
    approximateAddress: 'Oakland, CA',
    lat: 37.8044,
    lng: -122.2711,
    productCount: 8,
    verified: true,
    verificationType: 'business',
    rating: 4.6
  },
  {
    id: '3',
    sellerId: 'seller3',
    sellerName: 'Zoe Martinez',
    approximateAddress: 'Berkeley, CA',
    lat: 37.8715,
    lng: -122.2730,
    productCount: 12,
    rating: 4.2
  },
  {
    id: '4',
    sellerId: 'seller4',
    sellerName: 'David Wilson',
    approximateAddress: 'Fremont, CA',
    lat: 37.5485,
    lng: -121.9886,
    productCount: 5,
    rating: 3.9
  },
  {
    id: '5',
    sellerId: 'seller5',
    sellerName: 'Emily Thompson',
    approximateAddress: 'San Jose, CA',
    lat: 37.3382,
    lng: -121.8863,
    productCount: 23,
    verified: true,
    rating: 4.9
  },
  {
    id: '6',
    sellerId: 'seller6',
    sellerName: 'James Rodriguez',
    approximateAddress: 'Palo Alto, CA',
    lat: 37.4419,
    lng: -122.1430,
    productCount: 7,
    rating: 4.1
  },
  {
    id: '7',
    sellerId: 'seller7',
    sellerName: 'Lisa Kim',
    approximateAddress: 'Daly City, CA',
    lat: 37.6879,
    lng: -122.4702,
    productCount: 9,
    verified: true,
    rating: 4.7
  },
];

export default function MapPage() {
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [searchRadius, setSearchRadius] = useState(25);
  
  const handleSellerClick = (sellerId: string) => {
    setSelectedSellerId(sellerId);
    console.log(`Navigating to seller ${sellerId} profile or products...`);
    // In a real app, you would navigate to the seller's profile or products page
  };
  
  const selectedSeller = selectedSellerId
    ? SAMPLE_SELLER_LOCATIONS.find(seller => seller.sellerId === selectedSellerId)
    : null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Sellers Near You</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <h2 className="font-medium text-gray-900">Map Settings</h2>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Radius: {searchRadius}km
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5km</span>
                  <span>50km</span>
                  <span>100km</span>
                </div>
              </div>
            </div>
          </div>
          
          <SellerLocationMap
            sellerLocations={SAMPLE_SELLER_LOCATIONS}
            onSellerClick={handleSellerClick}
            searchRadius={searchRadius}
            highlightedSellerId={selectedSellerId || undefined}
            height="600px"
          />
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-4">
            <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
              <h2 className="font-medium text-gray-900">
                {selectedSeller ? `About ${selectedSeller.sellerName}` : 'Select a Seller'}
              </h2>
            </div>
            
            {selectedSeller ? (
              <div className="p-4">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex-shrink-0 overflow-hidden mr-3">
                    {selectedSeller.avatarUrl ? (
                      <div className="relative h-full w-full">
                        {/* Comment this out until you have actual images */}
                        {/* <Image 
                          src={selectedSeller.avatarUrl} 
                          alt={selectedSeller.sellerName}
                          fill
                          className="object-cover"
                        /> */}
                        <div className="absolute inset-0 flex items-center justify-center text-indigo-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-indigo-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {selectedSeller.sellerName}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mt-1">
                      {selectedSeller.verified && selectedSeller.verificationType && (
                        <VerifiedBadge 
                          type={selectedSeller.verificationType}
                          size="sm"
                          showLabel={true}
                          className="mt-1"
                        />
                      )}
                      
                      {selectedSeller.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600 ml-1">
                            {selectedSeller.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Location</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSeller.approximateAddress}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Available Products</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedSeller.productCount} {selectedSeller.productCount === 1 ? 'item' : 'items'} for sale
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <button 
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                      onClick={() => console.log(`View all products from ${selectedSeller.sellerName}`)}
                    >
                      Browse All Products
                    </button>
                    
                    <button 
                      className="w-full py-2 mt-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      onClick={() => console.log(`Contact ${selectedSeller.sellerName}`)}
                    >
                      Contact Seller
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="h-32 flex items-center justify-center text-gray-400">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="mt-2 text-sm">
                      Select a seller on the map to view their details
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
        <h2 className="text-lg font-medium text-gray-900 mb-2">About This Map</h2>
        <p className="text-sm text-gray-600">
          This map shows approximate seller locations to help you find baby items near you. For privacy 
          reasons, exact addresses are not shown. When you're ready to purchase, you can use our Safe 
          Meetup feature to coordinate a pickup at a mutually convenient public location.
        </p>
      </div>
    </div>
  );
} 