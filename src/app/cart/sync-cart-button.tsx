'use client';

import { useCart } from '@/contexts/CartContext';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SyncCartButton() {
  const { syncCart, isSyncing } = useCart();
  const [syncAttempt, setSyncAttempt] = useState(0);
  
  const handleSyncClick = async () => {
    try {
      // Increment the sync attempt counter
      setSyncAttempt(prev => prev + 1);
      
      // Clear previous sync error
      localStorage.removeItem('cart_sync_error');
      
      // Trigger manual sync
      await syncCart();
      
      // Show success message on successful sync
      toast.success('Cart synced successfully', {
        duration: 2000,
        position: 'bottom-center',
      });
    } catch (error) {
      console.error('Error syncing cart:', error);
      
      // Error is already handled in CartContext, but we can add extra
      // visual feedback here if needed
      toast.error('Could not sync cart. Will try again automatically.', {
        duration: 3000,
        position: 'bottom-center',
      });
    }
  };
  
  return (
    <button
      onClick={handleSyncClick}
      disabled={isSyncing}
      className="flex items-center text-primary hover:text-primary-dark disabled:text-gray-400 text-sm font-medium transition-colors"
      aria-label="Sync cart with server"
      title="Click to sync cart with server"
    >
      <RefreshCw className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? 'Syncing...' : 'Sync cart'}
    </button>
  );
} 