'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

// Sample breast pump product data
const breastPumpProduct = {
  id: 'mifoyo-breast-pump',
  title: 'Wearable Breast Pump Hands Free: Electric Portable Breastfeeding Pumps with 4 Modes & 9 Levels - Rechargeable Wireless Milk Pump with Smart Display for Moms - 24mm 2 Pack',
  brand: 'MIFOYO',
  rating: 4.6,
  reviewCount: 133,
  price: 89.99,
  originalPrice: 99.99,
  discount: 10,
  images: [
    '/images/products/breast-pump-1.jpg',
    '/images/products/breast-pump-2.jpg',
    '/images/products/breast-pump-3.jpg',
    '/images/products/breast-pump-4.jpg',
    '/images/products/breast-pump-5.jpg',
  ],
  purchaseCount: '600+ bought in past month',
  features: [
    'Hands-Free Design: Enjoy the freedom of hands-free breastfeeding and pumping with MIFOYO\'s breast pump',
    'Smart Display: Monitor pumping settings and battery status on the easy-to-read LED display',
    '4 Modes & 9 Levels: Customize your pumping experience with multiple modes and suction levels',
    'Rechargeable Battery: Wireless operation with long-lasting battery life',
    'Adjustable Fit: Comfortable 24mm flanges fit securely against your chest',
    'Low Noise: Quiet operation for discreet pumping anywhere',
    'Easy to Clean: Simple to disassemble and clean between uses'
  ],
  details: {
    'Brand': 'MIFOYO',
    'Special Feature': 'Spill Proof, Memory Function, Hands Free Usage, Adjustable Suction, Low Noise',
    'Material': 'Silicone',
    'Number of Items': '2',
    'Color': 'White'
  },
  aboutText: 'Hands-Free Wearable Design: Enjoy the freedom of hands-free breastfeeding and pumping with MIFOYO\'s breast pump. Its adjustable, wearable design fits snugly against your chest, providing a secure and comfortable fit for all-day use wherever in the office, commute, business trip or nursing. Assembly, disassembly, and cleaning are a breeze with our breast pump, making it a practical choice for busy moms.',
  shipping: {
    price: 46.85,
    location: 'Vietnam',
    options: [
      { id: 'pack-2', name: 'Pack of 2', price: 89.99, originalPrice: 99.99 },
      { id: 'pack-1', name: 'Pack of 1', price: 44.99, originalPrice: 49.99 }
    ]
  }
};

export default function BreastPumpProductPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('pack-2');
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  
  const { isAuthenticated, showAuthModal } = useAuth();
  
  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleOptionChange = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(Math.max(1, newQuantity));
  };

  const toggleSave = () => {
    if (!isAuthenticated) {
      showAuthModal('login');
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      showAuthModal('login');
      return;
    }
    // Add to cart logic here
    console.log('Added to cart:', breastPumpProduct.id, 'Quantity:', quantity);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      showAuthModal('login');
      return;
    }
    // Buy now logic here
    console.log('Buy now:', breastPumpProduct.id, 'Quantity:', quantity);
  };
  
  // Find selected option details
  const selectedOptionDetails = breastPumpProduct.shipping.options.find(
    option => option.id === selectedOption
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto py-3 px-4">
        <div className="text-sm text-gray-500">
          <Link href="/" className="hover:text-primary hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/marketplace" className="hover:text-primary hover:underline">Marketplace</Link>
          <span className="mx-2">›</span>
          <Link href="/categories/breastfeeding" className="hover:text-primary hover:underline">Breastfeeding</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">Breast Pumps</span>
        </div>
      </div>
      
      {/* Main Product Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Images */}
          <div className="w-full lg:w-2/5">
            {/* Main Image */}
            <div className="sticky top-4">
              <div className="relative aspect-square mb-2 border border-gray-200 rounded-md overflow-hidden">
                <Image
                  src="/images/products/breast-pump-1.jpg"
                  alt={breastPumpProduct.title}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="flex flex-wrap gap-2 mt-2">
                {breastPumpProduct.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`relative w-16 h-16 border rounded-md overflow-hidden ${
                      index === currentImageIndex ? 'border-primary border-2' : 'border-gray-200'
                    }`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src="/images/products/breast-pump-1.jpg"
                        alt={`${breastPumpProduct.title} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Middle Column - Product Details */}
          <div className="w-full lg:w-2/5">
            <h1 className="text-xl md:text-2xl font-medium mb-1">{breastPumpProduct.title}</h1>
            
            {/* Brand */}
            <Link href="/brand/mifoyo" className="text-blue-500 hover:text-blue-700 hover:underline text-sm">
              Brand: {breastPumpProduct.brand}
            </Link>
            
            {/* Ratings */}
            <div className="flex items-center mt-2 mb-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(breastPumpProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                
                {/* Half star for partial ratings */}
                {breastPumpProduct.rating % 1 >= 0.5 && (
                  <div className="relative w-4 h-4">
                    <svg className="w-4 h-4 text-gray-300 absolute" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-4 h-4 text-yellow-400 absolute" fill="currentColor" viewBox="0 0 20 20" style={{ clipPath: 'inset(0 50% 0 0)' }}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="ml-1 text-sm text-gray-500">{breastPumpProduct.rating}</span>
              <Link href="#reviews" className="ml-2 text-sm text-blue-500 hover:text-blue-700 hover:underline">
                {breastPumpProduct.reviewCount} ratings
              </Link>
            </div>
            
            {/* Purchases */}
            <div className="text-sm font-medium text-gray-800 mb-4">
              {breastPumpProduct.purchaseCount}
            </div>
            
            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center mb-1">
                <span className="text-red-600 text-lg font-medium">-{breastPumpProduct.discount}%</span>
                <span className="ml-2 text-2xl font-medium">${selectedOptionDetails?.price.toFixed(2)}</span>
                <span className="ml-2 text-gray-500 line-through">${selectedOptionDetails?.originalPrice.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Shipping */}
            <div className="mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-700">
                  ${breastPumpProduct.shipping.price} Shipping & Import Charges to {breastPumpProduct.shipping.location}
                </span>
                <Link href="#shipping-details" className="ml-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Options */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Size: {selectedOptionDetails?.name}</p>
              <div className="flex flex-wrap gap-2">
                {breastPumpProduct.shipping.options.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionChange(option.id)}
                    className={`relative p-3 border rounded-md flex flex-col w-48 ${
                      selectedOption === option.id ? 'border-primary bg-blue-50' : 'border-gray-300'
                    }`}
                  >
                    <span className="font-medium">{option.name}</span>
                    <span className="text-sm text-gray-700">${option.price.toFixed(2)}</span>
                    {selectedOption === option.id && (
                      <span className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* About This Item */}
            <div className="mb-6">
              <h2 className="text-lg font-medium mb-2">About This Item</h2>
              <p className="text-sm text-gray-700 mb-3">{breastPumpProduct.aboutText}</p>
              
              <ul className="list-disc ml-5 text-sm text-gray-700 space-y-1">
                {breastPumpProduct.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Right Column - Buy Box */}
          <div className="w-full lg:w-1/5">
            <div className="border border-gray-200 rounded-lg p-4 sticky top-4">
              <div className="mb-4">
                <span className="text-2xl font-medium">${selectedOptionDetails?.price.toFixed(2)}</span>
                <span className="ml-2 text-sm text-gray-500 line-through">${selectedOptionDetails?.originalPrice.toFixed(2)}</span>
              </div>
              
              <div className="text-sm mb-4">
                <div className="mb-1">FREE Returns</div>
                <div className="text-gray-700">
                  FREE delivery to {breastPumpProduct.shipping.location}
                </div>
                <div className="font-medium text-green-700 mt-1">In Stock</div>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-4">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity:</label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-1 border border-gray-300 bg-gray-50 text-gray-500 rounded-l-md hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-16 text-center border-y border-gray-300 py-1 focus:ring-primary focus:border-primary"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-1 border border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Buy Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium rounded-full border border-yellow-500 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-2 px-4 bg-orange-400 hover:bg-orange-500 text-sm font-medium rounded-full border border-orange-500 transition-colors"
                >
                  Buy Now
                </button>
              </div>
              
              {/* Secure Transaction */}
              <div className="mt-4 text-xs text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure transaction</span>
                </div>
              </div>
              
              {/* Add to Wishlist */}
              <button
                onClick={toggleSave}
                className="mt-4 text-sm text-blue-500 hover:text-blue-700 hover:underline flex items-center"
              >
                <svg
                  className={`w-4 h-4 mr-1 ${isSaved ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  stroke="currentColor"
                  fill={isSaved ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
              
              {/* Seller Info */}
              <div className="mt-4 text-sm">
                <p>Sold by: <Link href="/seller/mifoyo" className="text-blue-500 hover:underline">MIFOYO</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Table */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-medium mb-4">Product Details</h2>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="divide-y divide-gray-200">
                {Object.entries(breastPumpProduct.details).map(([key, value]) => (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3">{key}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Product Reviews Section */}
      <div id="reviews" className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-medium mb-4">Customer Reviews</h2>
        {/* Review summary and distribution would go here */}
        {/* Individual reviews would go here */}
      </div>
    </div>
  );
} 