'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ListingItemProps {
  id: string;
  title: string;
  price: number;
  status: 'active' | 'draft' | 'sold' | 'pending';
  image: string;
  views: number;
  favorites: number;
  dateAdded: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ListingItem({
  id,
  title,
  price,
  status,
  image,
  views,
  favorites,
  dateAdded,
  onEdit,
  onDelete
}: ListingItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleEdit = () => {
    setIsMenuOpen(false);
    if (onEdit) onEdit(id);
  };
  
  const handleDelete = () => {
    setIsMenuOpen(false);
    if (onDelete) onDelete(id);
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-40 h-40 relative">
          <Link href={`/product/${id}`} className="block w-full h-full">
            {image ? (
              <Image 
                src={image}
                alt={title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </Link>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 md:p-5 flex flex-col">
          <div className="flex justify-between">
            <div>
              <Link href={`/product/${id}`} className="hover:underline">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
              </Link>
              <p className="text-lg font-semibold text-indigo-600 mt-1">
                {formatCurrency(price)}
              </p>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Listing options"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Edit Listing
                    </button>
                    <Link
                      href={`/product/${id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      View Listing
                    </Link>
                    <button
                      onClick={handleDelete}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      Delete Listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-2 flex items-center">
            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusStyles()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
            <span className="text-xs text-gray-500 ml-2">Added {formatDate(dateAdded)}</span>
          </div>
          
          <div className="mt-auto pt-3 flex items-center text-sm text-gray-500">
            <div className="flex items-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views} views
            </div>
            
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {favorites} favorites
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 