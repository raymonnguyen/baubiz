'use client';

import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from '@/types/database';
import VerifiedBadge from '../seller/VerifiedBadge';

interface CartItemProps {
  product: Product & { quantity: number };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const CartItem = ({ product, onUpdateQuantity, onRemove }: CartItemProps) => {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-200">
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover rounded-md"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <Link 
          href={`/product/${product.slug}`}
          className="text-sm font-medium text-gray-900 hover:text-primary line-clamp-2"
        >
          {product.title}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          ${product.price.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdateQuantity(product.id, product.quantity - 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-8 text-center">{product.quantity}</span>
        <button
          onClick={() => onUpdateQuantity(product.id, product.quantity + 1)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-right">
        <p className="font-medium">
          ${(product.price * product.quantity).toFixed(2)}
        </p>
        <button
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-600 mt-1"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface SellerGroupProps {
  seller: {
    id: string;
    name: string;
    business_type: 'parent' | 'business' | 'individual';
    created_at: string;
  };
  items: (Product & { quantity: number })[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

const SellerGroup = ({ seller, items, onUpdateQuantity, onRemove }: SellerGroupProps) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium">{seller.name}</h3>
        <VerifiedBadge
          type={seller.business_type}
          size="sm"
          showLabel={false}
          enrollmentDate={seller.created_at}
        />
      </div>
      
      <div className="divide-y divide-gray-200">
        {items.map((item) => (
          <CartItem
            key={item.id}
            product={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
      
      <div className="mt-4 text-right">
        <p className="text-sm text-gray-500">Subtotal</p>
        <p className="text-lg font-semibold">${total.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some items to your cart to get started</p>
        <Link
          href="/marketplace"
          className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>
    );
  }

  // Group items by seller
  const itemsBySeller = cartItems.reduce((groups, item) => {
    const sellerId = item.seller?.id || 'unknown';
    if (!groups[sellerId]) {
      groups[sellerId] = {
        seller: item.seller!,
        items: [],
      };
    }
    groups[sellerId].items.push(item);
    return groups;
  }, {} as Record<string, { seller: NonNullable<Product['seller']>; items: typeof cartItems }>);

  return (
    <div>
      <div className="space-y-6">
        {Object.values(itemsBySeller).map(({ seller, items }) => (
          <SellerGroup
            key={seller.id}
            seller={seller}
            items={items}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
        ))}
      </div>
      
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold">${cartTotal.toFixed(2)}</span>
          </div>
          
          <Link
            href="/checkout"
            className="block w-full bg-primary text-white text-center py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
} 