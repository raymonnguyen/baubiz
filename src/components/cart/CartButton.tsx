'use client';

import { useCart } from '@/contexts/CartContext';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CartButton() {
  const { itemCount, setIsCartOpen } = useCart();
  const [animated, setAnimated] = useState(false);
  const [syncError, setSyncError] = useState(false);
  
  // Check for sync errors
  useEffect(() => {
    const checkSyncError = () => {
      const hasError = localStorage.getItem('cart_sync_error') === 'true';
      const isAuthenticated = localStorage.getItem('is_authenticated') === 'true';
      
      if (hasError) {
        console.log('Cart sync error detected in UI');
      }
      
      // Only show sync error indicator if we're authenticated
      // This prevents showing error icons when not logged in
      setSyncError(hasError && isAuthenticated);
    };
    
    // Check initially
    checkSyncError();
    
    // Set up interval to check periodically (every 3 seconds is enough)
    const interval = setInterval(checkSyncError, 3000);
    
    // Also listen for storage changes (works across tabs)
    window.addEventListener('storage', checkSyncError);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkSyncError);
    };
  }, []);
  
  // Add animation effect when cart count changes
  useEffect(() => {
    if (itemCount > 0) {
      setAnimated(true);
      const timer = setTimeout(() => setAnimated(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);
  
  return (
    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 text-gray-600 hover:text-primary transition-colors"
      aria-label={`Open cart with ${itemCount} items`}
      title={syncError ? "Cart is not synced with server" : "Shopping cart"}
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span 
          className={`absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm ${
            animated ? 'scale-125 transition-transform' : 'transition-transform'
          }`}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
      
      {syncError && (
        <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
          <AlertTriangle className="w-3 h-3" />
        </span>
      )}
    </button>
  );
} 