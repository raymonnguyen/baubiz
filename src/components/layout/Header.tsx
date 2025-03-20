'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import UserAvatar from '@/components/common/UserAvatar';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSellerMenuOpen, setIsSellerMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const sellerMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout, showAuthModal } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sellerMenuRef.current && !sellerMenuRef.current.contains(event.target as Node)) {
        setIsSellerMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsCartOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Mock cart data - would come from a cart context in a real app
  useEffect(() => {
    setCartItemCount(3); // Example - would be actual cart items count
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled || isMobileMenuOpen ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-md'}`}>
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-10 h-10 mr-2">
              <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-primary">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7v-2z" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900">Mom Marketplace</span>
          </Link>

          {/* Navigation links - desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/marketplace" 
              className={`transition-colors ${isActive('/marketplace') ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
            >
              Browse
            </Link>
            <Link 
              href="/blog" 
              className={`transition-colors ${isActive('/blog') ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
            >
              Blog
            </Link>
            <Link 
              href="/toast-demo" 
              className={`transition-colors ${isActive('/toast-demo') ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'}`}
            >
              Toast Demo
            </Link>
          </div>

          {/* Right side icons & auth */}
          <div className="flex items-center space-x-4">
            {/* Seller Tools Dropdown */}
            <div className="relative hidden md:block" ref={sellerMenuRef}>
              <button 
                onClick={() => setIsSellerMenuOpen(!isSellerMenuOpen)}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
                aria-label="Seller Tools"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
              
              {isSellerMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg shadow-lg py-2 z-30">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">Seller Tools</span>
                    </div>
                  </div>
                  <Link 
                    href="/seller/dashboard" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSellerMenuOpen(false)}
                  >
                    Seller Dashboard
                  </Link>
                  <Link 
                    href="/seller/listings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSellerMenuOpen(false)}
                  >
                    My Listings
                  </Link>
                  <Link 
                    href="/seller/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSellerMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link 
                    href="/seller" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsSellerMenuOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Start a Market
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Notifications/Activity Feed */}
            <div className="relative hidden md:block" ref={notificationsRef}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
                aria-label="Activity Feed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              {isNotificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-30">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Activity Feed</span>
                      <button className="text-sm text-primary hover:text-primary-dark">Mark all as read</button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">Your order <span className="font-medium">#12345</span> has been shipped!</p>
                          <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">You've received a payment of <span className="font-medium">$45.00</span></p>
                          <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-800">New message from <span className="font-medium">Emma Johnson</span></p>
                          <p className="text-xs text-gray-500 mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 text-center">
                    <Link href="/notifications" className="text-sm text-primary hover:text-primary-dark">
                      View all activity
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart */}
            <div className="relative hidden md:block" ref={cartRef}>
              <button 
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="flex items-center text-gray-600 hover:text-primary transition-colors"
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </button>
              
              {isCartOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-30">
                  <div className="p-3 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Shopping Cart ({cartItemCount})</span>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Vintage Pearl Necklace</h4>
                          <p className="text-xs text-gray-500">Vintage Jewelry Addicts</p>
                          <div className="flex justify-between mt-2">
                            <p className="text-sm font-medium text-gray-900">$45.99</p>
                            <button className="text-xs text-red-500 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex">
                        <div className="flex-shrink-0 mr-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-md"></div>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">Handcrafted Wooden Toy</h4>
                          <p className="text-xs text-gray-500">Artisan Collectibles</p>
                          <div className="flex justify-between mt-2">
                            <p className="text-sm font-medium text-gray-900">$32.50</p>
                            <button className="text-xs text-red-500 hover:text-red-700">Remove</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-900">$78.49</span>
                    </div>
                    <button className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                      Checkout
                    </button>
                    <Link href="/cart" className="block text-center mt-2 text-sm text-primary hover:text-primary-dark">
                      View Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth"
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
                  >
                    Log in / Sign up
                  </Link>
                </div>
              ) : (
                <UserAvatar
                  name={user?.name || 'User'}
                  isOpen={isProfileMenuOpen}
                  onToggle={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  onLogout={handleLogout}
                />
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700"
              aria-label="Toggle mobile menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white"
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <Link 
                href="/marketplace" 
                className={`block py-2 ${isActive('/marketplace') ? 'text-primary font-medium' : 'text-gray-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link 
                href="/blog" 
                className={`block py-2 ${isActive('/blog') ? 'text-primary font-medium' : 'text-gray-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                href="/toast-demo" 
                className={`block py-2 ${isActive('/toast-demo') ? 'text-primary font-medium' : 'text-gray-600'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Toast Demo
              </Link>
              <div className="border-t border-gray-100 pt-2">
                <Link
                  href="/seller"
                  className="flex items-center py-2 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Seller Tools
                </Link>
                <Link
                  href="/seller"
                  className="flex items-center py-2 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Start a Market
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center py-2 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  Activity Feed
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center py-2 text-gray-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="relative mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {cartItemCount}
                      </span>
                    )}
                  </div>
                  Cart
                </Link>
              </div>
              
              {isAuthenticated ? (
                <div className="border-t border-gray-100 pt-2">
                  <Link 
                    href="/profile" 
                    className="block py-2 text-gray-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block py-2 text-gray-600 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-2 flex flex-col space-y-2">
                  <Link
                    href="/auth"
                    className="py-2 text-primary font-medium text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/auth?mode=signup"
                    className="bg-primary text-white py-2 px-4 rounded-lg text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;

// Sample navigation items
const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Marketplace', href: '/marketplace' },
  { name: 'Categories', href: '/marketplace/categories' },
  { name: 'Services', href: '/services' },
  { name: 'Near Me', href: '/map' },
]; 