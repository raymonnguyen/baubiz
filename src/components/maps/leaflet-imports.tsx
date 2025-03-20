'use client';

// This file provides an easy way to import Leaflet CSS in Next.js layouts
// Add this component to your layout.tsx file 

import { useEffect } from 'react';

export default function LeafletImports() {
  useEffect(() => {
    // Add Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    // Add to head
    document.head.appendChild(link);
    
    // Cleanup function
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // No visible UI is needed
  return null;
}

// Alternatively, you can use this in a page or layout directly:
// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" /> 