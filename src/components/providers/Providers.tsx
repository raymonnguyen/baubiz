'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import LeafletProvider from '@/components/maps/LeafletProvider';
import { Toaster } from 'sonner';
import CartDrawer from '@/components/cart/CartDrawer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <LeafletProvider>
          {children}
          <CartDrawer />
          <Toaster />
        </LeafletProvider>
      </CartProvider>
    </AuthProvider>
  );
} 