'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight, Info, X, AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import VerifiedBadge from '@/components/seller/VerifiedBadge';
import SyncCartButton from './sync-cart-button';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, itemCount, isLoading, syncCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});
  const [allSelected, setAllSelected] = useState(false);
  const [syncError, setSyncError] = useState(false);

  // Check for sync errors when component mounts or when localStorage changes
  useEffect(() => {
    const checkSyncError = () => {
      const hasSyncError = localStorage.getItem('cart_sync_error') === 'true';
      setSyncError(hasSyncError);
    };
    
    // Check initially
    checkSyncError();
    
    // Listen for storage events (for cross-tab synchronization)
    window.addEventListener('storage', checkSyncError);
    
    return () => {
      window.removeEventListener('storage', checkSyncError);
    };
  }, []);

  // Auto retry syncing if there's an error
  useEffect(() => {
    let retryTimeout: NodeJS.Timeout | null = null;
    
    if (syncError) {
      // Try syncing again in 5 seconds
      retryTimeout = setTimeout(() => {
        syncCart().catch(err => {
          console.log('Auto-retry sync failed:', err);
        });
      }, 5000);
    }
    
    return () => {
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [syncError, syncCart]);

  // Group items by seller
  const itemsBySeller = cartItems.reduce((groups, item) => {
    const sellerId = item.seller?.id || 'unknown';
    if (!groups[sellerId]) {
      groups[sellerId] = {
        seller: item.seller,
        items: [],
      };
    }
    groups[sellerId].items.push(item);
    return groups;
  }, {} as Record<string, { seller: any; items: typeof cartItems }>);

  const handleSelectAll = () => {
    const newState = !allSelected;
    setAllSelected(newState);
    
    const newSelectedItems: Record<string, boolean> = {};
    cartItems.forEach(item => {
      newSelectedItems[item.id] = newState;
    });
    
    setSelectedItems(newSelectedItems);
  };

  const handleSelectItem = (itemId: string) => {
    const newSelectedItems = { ...selectedItems };
    newSelectedItems[itemId] = !newSelectedItems[itemId];
    setSelectedItems(newSelectedItems);
    
    // Check if all items are now selected
    const allItemsSelected = cartItems.every(item => newSelectedItems[item.id]);
    setAllSelected(allItemsSelected);
  };

  const handleSelectSellerItems = (items: typeof cartItems, selected: boolean) => {
    const newSelectedItems = { ...selectedItems };
    items.forEach(item => {
      newSelectedItems[item.id] = selected;
    });
    setSelectedItems(newSelectedItems);
    
    // Check if all items are now selected
    const allItemsSelected = cartItems.every(item => newSelectedItems[item.id]);
    setAllSelected(allItemsSelected);
  };

  const getSelectedSubtotal = () => {
    return cartItems
      .filter(item => selectedItems[item.id])
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getSelectedCount = () => {
    return cartItems.filter(item => selectedItems[item.id]).length;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-gray-200 rounded-lg"></div>
          <div className="h-48 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 max-w-5xl">
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="bg-gray-100 rounded-full p-6 mb-6 inline-flex justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Looks like you haven't added any items to your cart yet.
            Browse our marketplace to find quality products for you and your baby.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Browse Marketplace <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shopping Cart ({itemCount} items)</h1>
          <SyncCartButton />
        </div>
        
        {syncError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-yellow-800 font-medium">Could not sync with server. Using local cart data.</p>
              <p className="text-yellow-700 text-sm">Your cart items are saved locally. Click 'Sync cart' to try again.</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main cart content */}
        <div className="flex-1">
          {/* Cart header */}
          <div className="bg-white rounded-t-lg shadow-sm border border-gray-200 p-4 flex items-center">
            <div className="flex items-center gap-2 w-full">
              <label className="inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-offset-0"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
                <span className="ml-2 text-gray-700">Select All</span>
              </label>
              <div className="hidden md:flex justify-between flex-1 text-sm text-gray-500 px-4">
                <span className="w-1/2">Product</span>
                <span className="w-[15%] text-center">Price</span>
                <span className="w-[20%] text-center">Quantity</span>
                <span className="w-[15%] text-center">Total</span>
              </div>
            </div>
            <button 
              onClick={handleSelectAll}
              className="text-gray-400 hover:text-red-500 md:ml-8"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Cart items by seller */}
          <div className="divide-y divide-gray-200 bg-white rounded-b-lg shadow-sm border border-gray-200 border-t-0 mb-6">
            {Object.values(itemsBySeller).map((group) => (
              <div key={group.seller?.id || 'unknown'} className="py-4">
                {/* Seller header */}
                <div className="px-4 pb-4 flex items-center gap-2">
                  <label className="inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-offset-0"
                      checked={group.items.every(item => selectedItems[item.id])}
                      onChange={() => handleSelectSellerItems(
                        group.items, 
                        !group.items.every(item => selectedItems[item.id])
                      )}
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {group.seller?.name || 
                        (group.seller?.id ? 'Marketplace Seller' : 'Marketplace Seller')}
                    </span>
                    {group.seller?.business_type && (
                      <VerifiedBadge
                        type={group.seller.business_type}
                        size="sm"
                        showLabel={false}
                        enrollmentDate={group.seller.created_at}
                      />
                    )}
                  </div>
                  <Link 
                    href={`/messages/seller/${group.seller?.id}`}
                    className="ml-auto text-sm text-primary hover:text-primary-dark"
                  >
                    Chat with Seller
                  </Link>
                </div>
                
                {/* Seller items */}
                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row px-4 py-4 border-t border-gray-100">
                      {/* Mobile layout (visible on small screens) */}
                      <div className="flex md:hidden mb-4">
                        <label className="inline-flex items-start cursor-pointer pt-2 mr-3">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-offset-0"
                            checked={!!selectedItems[item.id]}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </label>
                        <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0 mr-4 group">
                          <Image
                            src={item.images[0]}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex-1">
                          <Link 
                            href={`/product/${item.slug}`}
                            className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                          >
                            {item.title || "Product Name Unavailable"}
                          </Link>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.condition === 'new' ? 'New' : 'Pre-loved'} · {item.category}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-lg font-semibold text-red-500">${item.price.toFixed(2)}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center border border-gray-200 rounded-lg w-min mt-3 shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Desktop layout (visible on medium screens and above) */}
                      <div className="hidden md:flex items-center w-full">
                        <label className="inline-flex items-center cursor-pointer mr-3">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary focus:ring-offset-0"
                            checked={!!selectedItems[item.id]}
                            onChange={() => handleSelectItem(item.id)}
                          />
                        </label>
                        
                        <div className="flex items-center w-1/2">
                          <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0 mr-4 group">
                            <Image
                              src={item.images[0]}
                              alt={item.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link 
                              href={`/product/${item.slug}`}
                              className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors"
                            >
                              {item.title || "Product Name Unavailable"}
                            </Link>
                            <div className="text-xs text-gray-500 mt-1">
                              {item.condition === 'new' ? 'New' : 'Pre-loved'} · {item.category}
                            </div>
                          </div>
                        </div>
                        
                        <div className="w-[15%] text-center">
                          <span className="font-semibold text-red-500">${item.price.toFixed(2)}</span>
                        </div>
                        
                        <div className="w-[20%] flex justify-center">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="w-[15%] text-center">
                          <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 ml-4"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Free shipping notice */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 font-medium">Free Shipping</p>
              <p className="text-blue-600 text-sm">Orders over $50 qualify for free shipping. Add more items to your cart to qualify!</p>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-6 pb-2 border-b border-gray-100">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected Items ({getSelectedCount()})</span>
                <span className="font-medium">${getSelectedSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Shipping</span>
                <span className={getSelectedSubtotal() >= 50 ? 'text-green-600 font-medium' : ''}>
                  {getSelectedSubtotal() >= 50 ? 'Free' : '$4.99'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${(getSelectedSubtotal() * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-xl text-primary">
                  ${(
                    getSelectedSubtotal() + 
                    (getSelectedSubtotal() >= 50 ? 0 : 4.99) + 
                    getSelectedSubtotal() * 0.08
                  ).toFixed(2)}
                </span>
              </div>
            </div>
            
            <button
              disabled={getSelectedCount() === 0}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                getSelectedCount() === 0 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary-dark hover:shadow-md'
              }`}
            >
              Checkout ({getSelectedCount()})
            </button>
            
            <div className="mt-6 text-center">
              <Link
                href="/marketplace"
                className="text-primary hover:text-primary-dark text-sm inline-flex items-center transition-colors"
              >
                <ChevronRight className="w-4 h-4 transform rotate-180 mr-1" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 