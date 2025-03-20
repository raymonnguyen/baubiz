import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/database';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-square">
          {product.images && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
          {/* Quick actions */}
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                // TODO: Implement wishlist functionality
              }}
              className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"
            >
              <Heart className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1 line-clamp-1">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">
              ${product.price.toFixed(2)}
            </span>
            
            <span className="text-sm text-gray-500 capitalize">
              {product.condition}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 