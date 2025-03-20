'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the LeafletImports component
const LeafletImports = dynamic(
  () => import('@/components/maps/leaflet-imports'),
  { ssr: false }
);

export default function LeafletProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <LeafletImports />
      {children}
    </>
  );
} 