'use client';

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Product } from '@/types/database';
import { toast } from 'sonner';
import { getAccessToken } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface CartProduct extends Product {
  quantity: number;
  cart_item_id?: string; // Store the actual cart_items.id
}

// Mapping from product_id to cart_item_id
interface CartItemMap {
  [productId: string]: string;
}

// Update the CartContextType interface to match the values we're providing
type CartContextType = {
  cartItems: CartProduct[];
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isAddingToCart: boolean;
  syncCart: () => Promise<void>;
  isSyncing: boolean;
  itemCount: number;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to save cart to localStorage
const saveCartToLocalStorage = (userId: string, items: CartProduct[]) => {
  try {
    localStorage.setItem(`cart_${userId}`, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Helper to get cart from localStorage
const getCartFromLocalStorage = (userId: string): CartProduct[] => {
  try {
    const cart = localStorage.getItem(`cart_${userId}`);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
};

const MAX_SYNC_RETRIES = 3;
const SYNC_RETRY_DELAY = 2000; // 2 seconds

// Direct token retrieval using the standard getAccessToken function
// Direct token retrieval for maximum reliability
const getAuthHeader = async (): Promise<Record<string, string>> => {
  try {
    // First try: Get directly from Supabase session
    const { data } = await supabase.auth.getSession();
    
    if (data.session?.access_token) {
      const token = data.session.access_token;
      
      // CONSISTENT FORMAT: Only use standard Authorization header
      return {
        'Authorization': `Bearer ${token}`
      };
    }
    
    // Force-refresh the session and try again
    console.log("No token in session, trying refresh...");
    const refreshResult = await supabase.auth.refreshSession();
    
    if (refreshResult.data.session?.access_token) {
      const token = refreshResult.data.session.access_token;
      
      return {
        'Authorization': `Bearer ${token}`
      };
    }
    
    console.log("⚠️ AUTH FAILURE: No valid token found");
    return {};
    
  } catch (e) {
    console.error('Error in getAuthHeader:', e);
    return {};
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [cartItemMap, setCartItemMap] = useState<CartItemMap>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { isAuthenticated, user, showAuthModal } = useAuth();
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [syncRetries, setSyncRetries] = useState<number>(0);

  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Get total number of items in cart
  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // Fetch cart items from API
  const fetchCartItems = async (): Promise<any[]> => {
    try {
      // Get auth headers
      const authHeaders = await getAuthHeader();
      
      if (Object.keys(authHeaders).length === 0) {
        console.log('No auth headers available, user may not be authenticated');
        return [];
      }

      // Make the request with auth headers
      const response = await fetch('/api/cart', {
        method: 'GET',
        credentials: 'include',
        mode: 'cors',
        headers: {
          ...authHeaders,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      // Handle the response
      if (!response.ok) {
        if (response.status === 401) {
          console.log('Unauthorized, attempting to refresh session...');
          // Try refreshing the session
          const { data } = await supabase.auth.refreshSession();
          if (data.session) {
            console.log('Session refreshed, retrying fetch');
            // Retry with new session
            return fetchCartItems();
          } else {
            throw new Error('Unauthorized: Please log in to view your cart');
          }
        }
        throw new Error(`Failed to fetch cart items: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Retrieved ${data.cartItems?.length || 0} cart items from server`);
      return data.cartItems || [];
    } catch (error) {
      console.error('Error fetching cart items:', error);
      throw error;
    }
  };
  
  // Fetch just the cart item mappings
  const fetchCartItemMapping = async () => {
    if (!isAuthenticated || !user) return;
    
    try {
      const response = await fetch('/api/cart/items', {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart item mappings');
      }
      
      const data = await response.json();
      setCartItemMap(data.cartItemMap || {});
      
      return data.cartItemMap;
    } catch (error) {
      console.error('Error fetching cart item mappings:', error);
      throw error;
    }
  };
  
  // Sync the local cart with the server for authenticated users
  const syncWithServer = async () => {
    // Skip syncing if not authenticated or sync is in progress
    if (!isAuthenticated || isSyncing) {
      if (!isAuthenticated) {
        console.log('Skipping cart sync: User not authenticated');
      }
      return;
    }

    console.log('Syncing cart with server...');
    setIsSyncing(true);
    setSyncError(null);

    try {
      // Get auth headers
      const authHeaders = await getAuthHeader();
      
      if (Object.keys(authHeaders).length === 0) {
        throw new Error('No auth headers available, cannot sync cart');
      }
      
      console.log('Got auth headers for sync, token length:', 
        authHeaders.Authorization ? authHeaders.Authorization.length - 7 : 0);

      // First, clear existing cart items on the server
      const clearResponse = await fetch('/api/cart/clear', {
        method: 'DELETE',
        credentials: 'include',
        mode: 'cors',
        headers: {
          ...authHeaders,
          'Content-Type': 'application/json'
        }
      });

      if (!clearResponse.ok) {
        throw new Error(`Failed to clear cart: ${clearResponse.status}`);
      }

      // If no local cart items, we're done
      if (cartItems.length === 0) {
        console.log('No local cart items to sync');
        setIsSyncing(false);
        return;
      }

      // For each cart item, send to server
      for (const item of cartItems) {
        const response = await fetch('/api/cart', {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders
          },
          body: JSON.stringify({
            product_id: item.id,
            quantity: item.quantity
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to add item ${item.id} to cart: ${response.status}`);
        }
      }

      console.log('Cart sync completed successfully');
      setSyncRetries(0);
    } catch (error: any) {
      console.error('Error syncing cart with server:', error);
      
      // Store error and increment retry counter
      setSyncError(error.message || 'Failed to sync cart');
      const newRetryCount = syncRetries + 1;
      setSyncRetries(newRetryCount);
      
      // If we've reached max retries, give up
      if (newRetryCount >= MAX_SYNC_RETRIES) {
        setSyncError('max-retries-reached');
      } else {
        // Try again after a delay
        setTimeout(() => {
          if (isAuthenticated) {
            syncWithServer();
          }
        }, SYNC_RETRY_DELAY);
      }
    } finally {
      setIsSyncing(false);
    }
  };
  
  // Schedule a sync attempt
  const scheduleSync = useCallback(() => {
    // Clear any existing timeout
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    
    // Only schedule a sync if authenticated
    if (!isAuthenticated || !user) {
      return;
    }

    // Schedule a sync attempt
    syncTimeoutRef.current = setTimeout(() => {
      if (navigator.onLine && isAuthenticated) {
        syncWithServer();
      }
      syncTimeoutRef.current = null;
    }, 5000); // 5 second delay
  }, [isAuthenticated, user]);

  // Load cart items when authentication state changes
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setCartItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetchCartItems().then(cartItems => {
      // Transform the data to match CartProduct structure
      const transformedItems = cartItems.map((item: any) => {
        // Safely handle potentially missing seller properties
        const seller = item.profiles || item.products.seller || { 
          id: 'unknown', 
          name: 'Unknown Seller',
          business_type: 'individual'
        };
        
        // Ensure verification_status exists with a default value
        if (seller && !seller.hasOwnProperty('verification_status')) {
          seller.verification_status = 'unverified';
        }
        
        return {
          ...item.products,
          quantity: item.quantity,
          cart_item_id: item.id, // Store the actual cart_items.id
          seller: seller // Use the processed seller data
        };
      });
      
      // Create mapping from product_id to cart_item_id
      const newCartItemMap: CartItemMap = {};
      cartItems.forEach((item: any) => {
        newCartItemMap[item.product_id] = item.id;
      });
      
      setCartItems(transformedItems);
      setCartItemMap(newCartItemMap);
      
      // Also save to localStorage as backup
      if (user) {
        saveCartToLocalStorage(user.id, transformedItems);
      }
      
      // Clear any previous sync error flags on successful fetch
      localStorage.removeItem('cart_sync_error');
      setIsLoading(false);
    }).catch(e => {
      console.error('Failed to fetch cart items:', e);
      // Fall back to localStorage
      if (user) {
        const localCart = getCartFromLocalStorage(user.id);
        setCartItems(localCart);
      }
      
      // Try to fetch just the ID mappings which is a lighter operation
      fetchCartItemMapping().catch(e => {
        console.error('Failed to fetch cart item mappings:', e);
      });
      
      // Only show error if we're not in the background syncing process
      if (!isSyncing) {
        toast.error('Could not sync with server. Using local cart data.', {
          duration: 3000,
          position: 'bottom-center'
        });
      }
      setIsLoading(false);
      setIsSyncing(false);
    });
    
    // Cleanup function
  }, [isAuthenticated, user?.id]);
  
  // Background sync when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (isAuthenticated && user) {
        setIsSyncing(true);
        fetchCartItems().catch(e => {
          console.error('Online sync failed:', e);
          setIsSyncing(false);
        });
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [isAuthenticated, user]);

  // Find the CartProvider component and add this useEffect for network awareness
  useEffect(() => {
    // Add online/offline event listeners for network awareness
    const handleOnline = () => {
      toast.success('You\'re back online! Syncing cart...', {
        duration: 2000,
        position: 'bottom-center',
        icon: '🔄'
      });
      syncWithServer();
    };

    const handleOffline = () => {
      toast.info('You\'re offline. Your cart is saved locally.', {
        duration: 3000,
        position: 'bottom-center',
        icon: '📶'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [cartItems]);

  // Add this useEffect to initialize cart count
  useEffect(() => {
    setCartCount(
      cartItems.reduce((total, item) => total + item.quantity, 0)
    );
  }, [cartItems]);

  // Stronger implementation for addToCart
  const addToCart = async (product: Product, quantity = 1) => {
    if (!isAuthenticated || !user) {
      showAuthModal('login');
      return;
    }

    try {
      setIsAddingToCart(true);
      
      // Optimistic update
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          const updatedItem = {
            ...prevItems[existingItemIndex],
            quantity: prevItems[existingItemIndex].quantity + quantity
          };
          
          const newItems = [...prevItems];
          newItems[existingItemIndex] = updatedItem;
          
          // Update localStorage immediately for better UX
          localStorage.setItem('cart', JSON.stringify(newItems));
          
          return newItems;
        } else {
          // Add new item
          const newItem = {
            ...product,
            quantity
          };
          
          const newItems = [...prevItems, newItem];
          
          // Update localStorage immediately
          localStorage.setItem('cart', JSON.stringify(newItems));
          
          return newItems;
        }
      });
      
      // Show success toast
      toast.success('Added to cart', {
        duration: 2000,
      });
      
      // Sync with server to save the cart
      const syncItemWithServer = async () => {
        try {
          // Get auth headers
          const headers = await getAuthHeader();
          
          // Send the request
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...headers
            },
            credentials: 'include',
            body: JSON.stringify({
              product_id: product.id,
              quantity: quantity
            })
          });
          
          if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
          }
          
          return true;
        } catch (error) {
          console.error('Error adding to cart:', error);
          return false;
        }
      };
      
      // Call the sync function
      syncItemWithServer().then(success => {
        if (!success) {
          // If sync failed, schedule more attempts
          scheduleSync();
        }
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Could not add to cart. Please try again.', {
        duration: 3000,
        position: 'bottom-center'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated || !user) {
      showAuthModal('login');
      return;
    }

    try {
      // Get the cart item ID from the map if available
      const cartItemId = cartItemMap[productId];
      
      if (!cartItemId) {
        console.error('Cannot find cart_item_id for product:', productId);
      }
      
      // Optimistic update - remove from local state first
      setCartItems(prevItems => {
        const newItems = prevItems.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(newItems));
        return newItems;
      });
      
      toast.success('Removed from cart', {
        duration: 2000
      });
      
      // Sync removal with server
      const syncWithServer = async (retries = 2) => {
        try {
          if (!cartItemId) {
            // If we don't have the cart item ID, we can't do a proper delete
            // Schedule a full cart sync instead
            scheduleSync();
            return false;
          }
          
          const response = await fetch(`/api/cart/${cartItemId}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
          
          // Update the cartItemMap
          setCartItemMap(prev => {
            const updated = { ...prev };
            delete updated[productId];
            return updated;
          });
          
          return true;
        } catch (error) {
          console.error('Error removing from cart:', error);
          toast.error('Item removed locally. Will sync when connection improves.', {
            duration: 3000,
            position: 'bottom-center'
          });
          
          // Schedule a background sync
          scheduleSync();
          return false;
        }
      };
      
      syncWithServer().then(success => {
        if (!success) {
          // If sync failed, try to reschedule
          scheduleSync();
        }
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error('Could not remove item. Please try again.', {
        duration: 3000,
        position: 'bottom-center'
      });
    }
  };

  // Update quantity of an item in the cart
  const updateQuantity = (productId: string, quantity: number) => {
    if (!isAuthenticated || !user) {
      showAuthModal('login');
      return;
    }

    try {
      // Find the cart item details
      const cartItem = cartItems.find(item => item.id === productId);
      
      if (!cartItem) {
        toast.error('Item not found in cart');
        return;
      }
      
      // Optimistic update
      setCartItems(prevItems => prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      ));
      
      // Update local storage immediately
      const updatedCart = cartItems.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      );
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      toast.success('Quantity updated', {
        duration: 2000
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Could not update quantity. Please try again.', {
        duration: 3000,
        position: 'bottom-center'
      });
    }
  };

  // Clear the entire cart
  const clearCart = () => {
    if (!isAuthenticated || !user) {
      showAuthModal('login');
      return;
    }

    try {
      setCartItems([]);
      setCartItemMap({});
      localStorage.removeItem('cart');
      
      toast.success('Cart cleared', {
        duration: 2000
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Could not clear cart. Please try again.', {
        duration: 3000,
        position: 'bottom-center'
      });
    }
  };

  // Add an effect to handle successful login events
  useEffect(() => {
    const handleLoginSuccess = () => {
      console.log('Login success event detected, syncing cart...');
      // Wait a moment to ensure auth cookies are established
      setTimeout(() => {
        fetchCartItems()
          .then(() => console.log('Cart synced after login'))
          .catch(err => console.error('Failed to sync cart after login:', err));
      }, 1000);
    };
    
    window.addEventListener('auth:login:success', handleLoginSuccess);
    
    return () => {
      window.removeEventListener('auth:login:success', handleLoginSuccess);
    };
  }, []);

  // Handle cleanup when signing out
  useEffect(() => {
    const handleLogout = () => {
      // Clear cart data when user logs out
      setCartItems([]);
      setCartItemMap({});
      localStorage.removeItem('cart');
    };
    
    window.addEventListener('auth:logout', handleLogout);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogout);
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isAddingToCart,
        syncCart: () => syncWithServer(),
        isSyncing,
        itemCount,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}