'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import L from 'leaflet';

// Dynamically import the Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);

// Define a SellerLocation type
export interface SellerLocation {
  id: string;
  sellerId: string;
  sellerName: string;
  approximateAddress: string;
  lat: number;
  lng: number;
  productCount: number;
  avatarUrl?: string;
  verified?: boolean;
  verificationType?: 'parent' | 'business';
  rating?: number;
}

interface SellerLocationMapProps {
  sellerLocations: SellerLocation[];
  userLocation?: { lat: number; lng: number };
  initialZoom?: number;
  height?: string;
  onSellerClick?: (sellerId: string) => void;
  searchRadius?: number; // in kilometers
  highlightedSellerId?: string;
  allowLocationAccess?: boolean;
}

// Fix the icon default path issue in Leaflet with Next.js
const fixLeafletIcons = () => {
  // Set up the default icon
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

// Seller icon
const createSellerIcon = (verificationType?: 'parent' | 'business') => {
  let iconUrl = '/images/map-markers/seller-marker.svg';
  
  // Determine icon based on verification type
  if (verificationType === 'parent') {
    iconUrl = '/images/map-markers/parent-marker.svg';
  } else if (verificationType === 'business') {
    iconUrl = '/images/map-markers/business-marker.svg';
  }
  
  return new L.Icon({
    iconUrl,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -38],
  });
};

// Default seller icon (fallback)
const sellerIcon = new L.Icon({
  iconUrl: '/images/map-markers/seller-marker.svg',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// User icon
const userIcon = new L.Icon({
  iconUrl: '/images/map-markers/user-marker.svg',
  iconSize: [35, 35],
  iconAnchor: [17, 17],
  popupAnchor: [0, -20],
});

export default function SellerLocationMap({
  sellerLocations,
  userLocation,
  initialZoom = 11,
  height = '500px',
  onSellerClick,
  searchRadius = 25, // 25km default radius
  highlightedSellerId,
  allowLocationAccess = true
}: SellerLocationMapProps) {
  const [mapReady, setMapReady] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(userLocation);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef(null);
  
  // Calculate center of the map based on available locations
  const getMapCenter = () => {
    if (currentLocation) {
      return [currentLocation.lat, currentLocation.lng];
    }
    
    if (sellerLocations.length === 0) {
      // Default to a central US location if no locations provided
      return [39.8283, -98.5795];
    }
    
    if (sellerLocations.length === 1) {
      return [sellerLocations[0].lat, sellerLocations[0].lng];
    }
    
    // Calculate the center based on all seller locations
    const sumLat = sellerLocations.reduce((sum, loc) => sum + loc.lat, 0);
    const sumLng = sellerLocations.reduce((sum, loc) => sum + loc.lng, 0);
    
    return [sumLat / sellerLocations.length, sumLng / sellerLocations.length];
  };
  
  // Get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    setError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCurrentLocation(userLoc);
        setIsLocating(false);
        
        // If we have the map reference, fly to the user's location
        if (mapRef.current) {
          // @ts-ignore - Leaflet typing issue
          mapRef.current.flyTo([userLoc.lat, userLoc.lng], initialZoom);
        }
      },
      (error) => {
        setIsLocating(false);
        setError('Unable to retrieve your location');
        console.error('Geolocation error:', error);
      }
    );
  };
  
  // Effect to set map as ready after mounting
  useEffect(() => {
    setMapReady(true);
  }, []);
  
  // Automatically get user location if allowed and not already provided
  useEffect(() => {
    if (mapReady && allowLocationAccess && !userLocation && !currentLocation) {
      getUserLocation();
    }
  }, [mapReady, allowLocationAccess, userLocation, currentLocation]);
  
  // Fix Leaflet icons on component mount
  useEffect(() => {
    fixLeafletIcons();
  }, []);
  
  // Function to calculate distance between two coordinates (in km)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };
  
  const deg2rad = (deg: number) => {
    return deg * (Math.PI / 180);
  };
  
  // Filter sellers within search radius if user location is available
  const getSellersInRadius = () => {
    if (!currentLocation) return sellerLocations;
    
    return sellerLocations.filter(seller => {
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        seller.lat,
        seller.lng
      );
      return distance <= searchRadius;
    });
  };
  
  const renderStarsRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <div className="flex">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {halfStar && (
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStar" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStar)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };
  
  // Create a filter for sellers within the radius
  const sellersInRadius = getSellersInRadius();
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 bg-primary/10 border-b border-primary/20 flex justify-between items-center">
        <h3 className="font-medium text-gray-900 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Seller Locations
        </h3>
        
        {allowLocationAccess && (
          <button 
            onClick={getUserLocation}
            disabled={isLocating}
            className="text-xs px-2 py-1 bg-white border border-primary/30 text-primary rounded hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {isLocating ? 'Locating...' : currentLocation ? 'Update Location' : 'Find Near Me'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border-b border-red-100 text-sm text-red-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      
      <div style={{ height }} className="relative">
        {/* Map Loading Placeholder */}
        {!mapReady && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-sm text-gray-600">Loading map...</span>
          </div>
        )}
        
        {mapReady && (
          <MapContainer
            // @ts-ignore - Leaflet expects LatLngExpression, but TypeScript doesn't know it
            center={getMapCenter()}
            zoom={initialZoom}
            style={{ height: '100%', width: '100%' }}
            // @ts-ignore - Leaflet ref typing issue
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {currentLocation && (
              <>
                <Marker 
                  // @ts-ignore - Leaflet typing issue
                  position={[currentLocation.lat, currentLocation.lng]}
                  icon={userIcon}
                >
                  <Popup>
                    <div className="text-center">
                      <div className="font-medium text-indigo-700">Your Location</div>
                      <div className="text-xs text-gray-500">Showing sellers within {searchRadius}km</div>
                    </div>
                  </Popup>
                </Marker>
                
                <Circle 
                  // @ts-ignore - Leaflet typing issue
                  center={[currentLocation.lat, currentLocation.lng]}
                  radius={searchRadius * 1000} // Convert km to meters
                  pathOptions={{ color: 'rgba(79, 70, 229, 0.2)', fillColor: 'rgba(79, 70, 229, 0.1)' }}
                />
              </>
            )}
            
            {sellersInRadius.map(seller => (
              <Marker
                key={seller.id}
                // @ts-ignore - Leaflet typing issue
                position={[seller.lat, seller.lng]}
                icon={seller.verificationType ? createSellerIcon(seller.verificationType) : sellerIcon}
                eventHandlers={{
                  click: () => {
                    if (onSellerClick) {
                      onSellerClick(seller.sellerId);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="p-1">
                    <div className="flex items-center mb-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex-shrink-0 overflow-hidden mr-2">
                        {seller.avatarUrl ? (
                          <Image 
                            src={seller.avatarUrl} 
                            alt={seller.sellerName}
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Link 
                          href={`/seller/${seller.sellerId}`}
                          className="font-medium text-sm text-gray-900 hover:text-indigo-600"
                        >
                          {seller.sellerName}
                        </Link>
                        
                        <div className="flex items-center space-x-1">
                          {seller.verificationType && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                              seller.verificationType === 'parent' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {seller.verificationType === 'parent' ? 'Parent Seller' : 'Business Seller'}
                            </span>
                          )}
                          
                          {seller.rating && (
                            <div className="flex items-center">
                              {renderStarsRating(seller.rating)}
                              <span className="text-xs text-gray-500 ml-1">
                                ({seller.rating.toFixed(1)})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500 mb-1">
                      {seller.approximateAddress}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-indigo-600 font-medium">
                        {seller.productCount} {seller.productCount === 1 ? 'item' : 'items'} for sale
                      </span>
                      
                      {currentLocation && (
                        <span className="text-xs text-gray-500">
                          {calculateDistance(
                            currentLocation.lat,
                            currentLocation.lng,
                            seller.lat,
                            seller.lng
                          ).toFixed(1)}km away
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => onSellerClick?.(seller.sellerId)}
                      className="mt-2 w-full text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
                    >
                      View Seller
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>
      
      {/* Show a legend for different seller types */}
      <div className="py-2 px-4 bg-white border-t border-gray-100">
        <p className="text-xs text-gray-600 mb-2">Map Legend:</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
            <span className="text-xs text-gray-700">Parent Seller</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span className="text-xs text-gray-700">Business Seller</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
            <span className="text-xs text-gray-700">Regular Seller</span>
          </div>
          {currentLocation && (
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
              <span className="text-xs text-gray-700">Your Location</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {sellersInRadius.length} {sellersInRadius.length === 1 ? 'seller' : 'sellers'}
            {currentLocation && ` within ${searchRadius}km of your location`}
          </div>
          
          {currentLocation && sellersInRadius.length === 0 && sellerLocations.length > 0 && (
            <button
              onClick={() => setCurrentLocation(undefined)}
              className="text-xs text-indigo-600 hover:text-indigo-800"
            >
              Show all sellers
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 