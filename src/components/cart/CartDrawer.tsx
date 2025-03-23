'use client';

import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, ChevronRight, Trash2, Plus, Minus, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { Product } from '@/types/database';
import VerifiedBadge from '../seller/VerifiedBadge';

const EmptyCart = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4 h-full">
    <div className="bg-gray-100 rounded-full p-6 mb-6">
      <ShoppingCart className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
    </div>
    <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
    <p className="text-gray-500 text-center mb-8 max-w-xs">
      Add products to your cart to see them here
    </p>
    <Link
      href="/marketplace"
      className="flex items-center justify-center gap-2 bg-primary text-white py-3 px-6 rounded-lg font-medium hover:bg-primary-dark transition-colors w-full max-w-xs"
    >
      Browse Marketplace <ChevronRight className="w-4 h-4" />
    </Link>
  </div>
);

interface CartItemProps {
  product: Product & { quantity: number };
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ product, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex gap-3 py-4 border-b border-gray-100">
      <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link 
            href={`/product/${product.slug}`}
            className="text-sm font-medium line-clamp-2 hover:text-primary"
          >
            {product.title}
          </Link>
          <button
            onClick={() => onRemove(product.id)}
            className="text-gray-400 hover:text-red-500 flex-shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        
        {product.seller && (
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
            <span>{product.seller.name}</span>
            {product.seller.business_type && (
              <VerifiedBadge
                type={product.seller.business_type}
                size="xs"
                showLabel={false}
                enrollmentDate={product.seller.created_at}
              />
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm">{product.quantity}</span>
            <button
              onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          
          <div className="text-right">
            <span className="font-medium">${(product.price * product.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cartItems, 
    updateQuantity,
    removeFromCart,
    cartTotal,
    itemCount,
    isLoading
  } = useCart();
  
  const drawerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node) && isCartOpen) {
        setIsCartOpen(false);
      }
    }
    
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    }
    
    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    // Prevent body scroll when cart is open
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, setIsCartOpen]);

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
  }, {} as Record<string, { seller: Product['seller']; items: typeof cartItems }>);
  
  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsCartOpen(false)}
          />
          
          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-lg z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Shopping Cart</h2>
                <span className="bg-gray-100 text-gray-700 text-sm rounded-full px-2 py-0.5 inline-flex items-center justify-center min-w-[1.5rem]">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 space-y-4">
                  <div className="animate-pulse h-24 bg-gray-100 rounded-lg" />
                  <div className="animate-pulse h-24 bg-gray-100 rounded-lg" />
                  <div className="animate-pulse h-24 bg-gray-100 rounded-lg" />
                </div>
              ) : cartItems.length === 0 ? (
                <EmptyCart />
              ) : (
                <div className="p-4 pb-32">
                  {Object.values(itemsBySeller).map((group) => (
                    <div 
                      key={group.seller?.id || 'unknown'} 
                      className="mb-6 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm"
                    >
                      {group.seller && (
                        <div className="flex items-center gap-2 p-3 border-b border-gray-100 bg-gray-50">
                          <span className="font-medium text-sm">{group.seller.name}</span>
                          {group.seller.business_type && (
                            <VerifiedBadge
                              type={group.seller.business_type}
                              size="sm"
                              showLabel={false}
                              enrollmentDate={group.seller.created_at}
                            />
                          )}
                        </div>
                      )}
                      
                      <div className="p-3">
                        {group.items.map((item) => (
                          <CartItem
                            key={item.id}
                            product={item}
                            onUpdateQuantity={updateQuantity}
                            onRemove={removeFromCart}
                          />
                        ))}
                      </div>
                      
                      <div className="p-3 border-t border-gray-100 bg-gray-50 text-right">
                        <div className="text-sm text-gray-500">Subtotal</div>
                        <div className="font-medium">
                          ${group.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Shipping notification */}
                  <div className="flex items-center gap-2 p-3 mb-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>Free shipping on orders over $50</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0 w-full shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total ({itemCount} items)</span>
                  <span className="text-xl font-bold">${cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href="/checkout" 
                    className="block w-full py-3 bg-primary text-white rounded-lg font-medium text-center hover:bg-primary-dark transition-colors"
                    onClick={() => setIsCartOpen(false)}
                  >
                    Checkout
                  </Link>
                  
                  <Link
                    href="/cart"
                    className="block w-full py-3 border border-gray-300 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
                    onClick={() => setIsCartOpen(false)}
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 