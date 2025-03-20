# Seller Location Map Implementation Guide

## Overview

The `SellerLocationMap` component displays seller locations on an interactive map, allowing users to find nearby sellers and their products. This component uses React-Leaflet, a React wrapper for the Leaflet mapping library.

## Installation

Due to potential dependency conflicts in the project, you'll need to install the required packages with the `--legacy-peer-deps` flag:

```bash
npm install leaflet react-leaflet date-fns --save --legacy-peer-deps
```

Or if you prefer Yarn:

```bash
yarn add leaflet react-leaflet date-fns --ignore-peer-dependencies
```

## Required CSS

Add the Leaflet CSS to your project by adding this line to your main CSS file or layout component:

```tsx
// In your layout.tsx or a CSS import file
import 'leaflet/dist/leaflet.css';
```

## Map Marker Icons

Leaflet uses image assets for map markers. Create a directory for these assets:

```bash
mkdir -p public/images/map-markers
```

Add at least one marker SVG or PNG to this directory, for example:

```svg
<!-- public/images/map-markers/seller-marker.svg -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#4F46E5" width="36px" height="36px">
  <path d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>
```

## Usage Example

The map component is designed to be used as follows:

```tsx
import SellerLocationMap, { SellerLocation } from '@/components/maps/SellerLocationMap';

// Sample data
const sellerLocations: SellerLocation[] = [
  {
    id: '1',
    sellerId: 'seller1',
    sellerName: 'Sarah Johnson',
    approximateAddress: 'San Francisco, CA',
    lat: 37.7749,
    lng: -122.4194,
    productCount: 15,
    verified: true,
    rating: 4.8
  },
  // More seller locations...
];

// Inside your component
return (
  <SellerLocationMap
    sellerLocations={sellerLocations}
    onSellerClick={(sellerId) => {
      // Handle seller click, e.g., navigate to seller page
      console.log(`Clicked on seller: ${sellerId}`);
    }}
    searchRadius={25} // Search radius in kilometers
    height="500px" // Height of the map container
  />
);
```

## Troubleshooting

### SSR Issues

React-Leaflet depends on browser APIs and can cause issues when rendering on the server. The component uses `dynamic` imports with `{ ssr: false }` to avoid these issues, but if you encounter problems, ensure your component is only imported client-side.

### Map Not Displaying

If the map isn't displaying:

1. Check that Leaflet CSS is properly imported
2. Verify the container has a defined height (the map won't show without it)
3. Ensure the data passed to the map has valid coordinates

### Marker Icons Not Showing

Leaflet has a known issue with marker icons in non-standard webpack setups. If icons don't appear:

1. Check that marker icon paths are correct and the files exist
2. You may need to use a custom icon setup with direct imports

## Customization

The map component accepts several props for customization:

- `sellerLocations`: Array of seller location data
- `userLocation`: Optional user's location for centering the map
- `initialZoom`: Initial zoom level (default: 11)
- `height`: Height of the map container (default: '500px')
- `onSellerClick`: Callback when a seller marker is clicked
- `searchRadius`: Radius in kilometers to search for sellers (default: 25)
- `highlightedSellerId`: ID of a seller to highlight
- `allowLocationAccess`: Whether to request user location (default: true)

## Important Notes

1. For privacy reasons, consider showing only approximate seller locations rather than exact addresses.
2. Always request user permission before accessing their location.
3. Provide fallbacks when location access is denied or unavailable.
4. Consider map tile usage limits if you're using a service like Mapbox or Google Maps. 