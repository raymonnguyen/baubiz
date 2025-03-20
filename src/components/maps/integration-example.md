# Integrating the Seller Location Map

This guide demonstrates how to integrate the Seller Location Map component into a product listing page to help buyers find nearby products.

## Basic Integration

### 1. Add the Map Component to a Product Listing Page

```tsx
// src/app/marketplace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProductGrid from '@/components/marketplace/ProductGrid';
import FilterSidebar from '@/components/marketplace/FilterSidebar';

// Dynamically import the map component to avoid SSR issues
const SellerLocationMap = dynamic(
  () => import('@/components/maps/SellerLocationMap'),
  { ssr: false }
);

export default function MarketplacePage() {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [nearbySellerIds, setNearbySellerIds] = useState<string[]>([]);
  
  // Get the user's location when they click "View Map"
  const handleShowMap = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setShowMap(true);
        },
        (error) => {
          console.error("Error getting location: ", error);
          // Show the map anyway without centering on user location
          setShowMap(true);
        }
      );
    } else {
      // Geolocation not supported
      setShowMap(true);
    }
  };
  
  // Handle seller click from the map
  const handleSellerClick = (sellerId: string) => {
    // Could scroll to their products or filter products to show only this seller
    console.log(`Show products from seller: ${sellerId}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        
        <button
          onClick={handleShowMap}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showMap ? 'Hide Map' : 'Find Nearby'}
        </button>
      </div>
      
      {showMap && (
        <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
          <SellerLocationMap
            sellerLocations={[]} // Would fetch from API
            userLocation={userLocation}
            onSellerClick={handleSellerClick}
            height="400px"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <FilterSidebar />
        <div className="lg:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
```

## Advanced Integration with API Fetching

For a more complete example, here's how to fetch seller locations from an API and integrate them with your product listings:

```tsx
// src/app/marketplace/page.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ProductGrid from '@/components/marketplace/ProductGrid';
import FilterSidebar from '@/components/marketplace/FilterSidebar';
import type { SellerLocation } from '@/components/maps/SellerLocationMap';
import type { Product } from '@/types/product';

// Dynamically import the map component
const SellerLocationMap = dynamic(
  () => import('@/components/maps/SellerLocationMap'),
  { ssr: false }
);

export default function MarketplacePage() {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [sellerLocations, setSellerLocations] = useState<SellerLocation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  
  // Fetch products and seller locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // In a real app, these would be actual API calls
        const productsResponse = await fetch('/api/products');
        const sellersResponse = await fetch('/api/sellers/locations');
        
        const productsData = await productsResponse.json();
        const sellersData = await sellersResponse.json();
        
        setProducts(productsData);
        setSellerLocations(sellersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Get the user's location
  const handleShowMap = () => {
    setShowMap(!showMap);
    
    if (!showMap && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  };
  
  // Handle seller click from the map
  const handleSellerClick = (sellerId: string) => {
    setSelectedSellerId(sellerId === selectedSellerId ? null : sellerId);
  };
  
  // Filter products by selected seller
  const filteredProducts = selectedSellerId 
    ? products.filter(product => product.sellerId === selectedSellerId)
    : products;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        
        <button
          onClick={handleShowMap}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showMap ? 'Hide Map' : 'Find Nearby'}
        </button>
      </div>
      
      {showMap && (
        <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
          <SellerLocationMap
            sellerLocations={sellerLocations}
            userLocation={userLocation}
            onSellerClick={handleSellerClick}
            highlightedSellerId={selectedSellerId || undefined}
            height="400px"
          />
          
          {selectedSellerId && (
            <div className="p-3 bg-indigo-50 border-t border-indigo-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Showing products from selected seller
                </span>
                
                <button
                  onClick={() => setSelectedSellerId(null)}
                  className="text-xs text-indigo-600 hover:text-indigo-800"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <FilterSidebar />
        <div className="lg:col-span-3">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <>
              {selectedSellerId && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm">
                    <strong>Tip:</strong> Click the "Clear selection" button above the map to see all products again.
                  </p>
                </div>
              )}
              <ProductGrid products={filteredProducts} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Integrating with Server Components

If you're using React Server Components in Next.js, you can fetch the seller location data on the server and pass it to the client component:

```tsx
// src/app/marketplace/page.tsx
import { Suspense } from 'react';
import MarketplaceClient from './marketplace-client';
import { getSellerLocations } from '@/lib/api';

export default async function MarketplacePage() {
  // Fetch data on the server
  const sellerLocations = await getSellerLocations();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        <MarketplaceClient initialSellerLocations={sellerLocations} />
      </Suspense>
    </div>
  );
}
```

```tsx
// src/app/marketplace/marketplace-client.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ProductGrid from '@/components/marketplace/ProductGrid';
import FilterSidebar from '@/components/marketplace/FilterSidebar';
import type { SellerLocation } from '@/components/maps/SellerLocationMap';

// Dynamically import the map component
const SellerLocationMap = dynamic(
  () => import('@/components/maps/SellerLocationMap'),
  { ssr: false }
);

interface MarketplaceClientProps {
  initialSellerLocations: SellerLocation[];
}

export default function MarketplaceClient({ initialSellerLocations }: MarketplaceClientProps) {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>(undefined);
  
  const handleShowMap = () => {
    setShowMap(!showMap);
    
    if (!showMap && !userLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    }
  };
  
  return (
    <>
      <div className="flex justify-end mb-6">
        <button
          onClick={handleShowMap}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {showMap ? 'Hide Map' : 'Find Nearby'}
        </button>
      </div>
      
      {showMap && (
        <div className="mb-8 rounded-xl overflow-hidden border border-gray-200">
          <SellerLocationMap
            sellerLocations={initialSellerLocations}
            userLocation={userLocation}
            height="400px"
          />
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <FilterSidebar />
        <div className="lg:col-span-3">
          <ProductGrid />
        </div>
      </div>
    </>
  );
}
```

## Integration Tips

1. **Privacy Considerations**: Only show approximate locations for sellers to protect privacy.

2. **Performance**: Load the map component only when needed (e.g., when the user clicks "View Map") to improve initial page load performance.

3. **Fallbacks**: Always provide fallbacks for users who don't grant location permissions or are using browsers that don't support geolocation.

4. **Mobile Experience**: Consider making the map component responsive and possibly offering a full-screen view on mobile devices.

5. **Accessibility**: Ensure the map interface is accessible, with proper ARIA labels and keyboard navigation support.

6. **Analytics**: Consider tracking map usage to understand how valuable this feature is to your users.

## SEO Considerations

Since the map is client-side rendered, make sure your page still has good SEO value without relying on the map component. Include text descriptions of locations and relevant keywords in your server-rendered content. 