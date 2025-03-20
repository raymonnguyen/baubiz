'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface MarketplaceHeaderProps {
  marketplace: {
    id: string;
    name: string;
    description: string;
    logo: string;
    banner: string;
    members: string;
    listings: string;
    followers: string;
    categories: string[];
  };
  currentView: 'shop' | 'about' | 'reviews';
  onTabChange: (tab: 'shop' | 'about' | 'reviews') => void;
}

export default function MarketplaceHeader({ marketplace, currentView, onTabChange }: MarketplaceHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      {/* Banner Image */}
      <div className="relative h-48 md:h-64">
        <Image
          src={marketplace.banner}
          alt={`${marketplace.name} banner`}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Header Content */}
      <div className="container-custom py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
          {/* Logo and Basic Info */}
          <div className="flex items-center space-x-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={marketplace.logo}
                alt={`${marketplace.name} logo`}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{marketplace.name}</h1>
              <p className="text-sm text-gray-600 mt-1">{marketplace.description}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="hidden md:flex items-center space-x-6 mt-4 md:mt-0">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{marketplace.members}</div>
              <div className="text-sm text-gray-600">Members</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{marketplace.listings}</div>
              <div className="text-sm text-gray-600">Listings</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-900">{marketplace.followers}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex space-x-8">
              <button
                onClick={() => onTabChange('shop')}
                className={`text-sm font-medium ${
                  currentView === 'shop'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => onTabChange('about')}
                className={`text-sm font-medium ${
                  currentView === 'about'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                About
              </button>
              <button
                onClick={() => onTabChange('reviews')}
                className={`text-sm font-medium ${
                  currentView === 'reviews'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-4 space-y-4"
            >
              <button
                onClick={() => {
                  onTabChange('shop');
                  setIsMenuOpen(false);
                }}
                className={`block text-sm font-medium ${
                  currentView === 'shop'
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Shop
              </button>
              <button
                onClick={() => {
                  onTabChange('about');
                  setIsMenuOpen(false);
                }}
                className={`block text-sm font-medium ${
                  currentView === 'about'
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                About
              </button>
              <button
                onClick={() => {
                  onTabChange('reviews');
                  setIsMenuOpen(false);
                }}
                className={`block text-sm font-medium ${
                  currentView === 'reviews'
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews
              </button>
            </motion.div>
          )}
        </nav>
      </div>
    </header>
  );
} 