'use client';

import React from 'react';
import { Product } from '@/types/database';
import { ShoppingCart, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartAddedConfirmationProps {
  products: Product[];
  onClose: () => void;
  onViewCart: () => void;
}

const CartAddedConfirmation: React.FC<CartAddedConfirmationProps> = ({
  products,
  onClose,
  onViewCart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold">Added to Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="max-h-64 overflow-auto">
            {products.map((product) => (
              <div key={product.id} className="flex gap-3 py-2 border-b last:border-b-0">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <Image 
                    src={product.images[0]} 
                    alt={product.title}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{product.title}</p>
                  <p className="text-sm text-gray-500 mt-1">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={onViewCart}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              View Cart
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartAddedConfirmation; 