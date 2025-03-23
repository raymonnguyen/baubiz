'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import VerifiedBadge from '@/components/seller/VerifiedBadge';
import BidSystem from '@/components/product/BidSystem';
import { ChevronLeft, ChevronRight, Minus, Plus, HelpCircle, Check, Heart } from 'lucide-react';

type VerificationType = 'parent' | 'business';

interface Seller {
  id: string;
  name: string;
  avatar: string;
  location: string;
  verified: boolean;
  totalSales: number;
  responseRate: number;
  responseTime: string;
  joinedDate: string;
  rating: number;
  reviews: number;
  verificationType: VerificationType;
  description: string;
  badges: string[];
}

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
  },
  seller: {
    id: 'mifoyo-seller',
    name: 'MIFOYO',
    avatar: '/images/sellers/mifoyo.jpg',
    location: 'Ho Chi Minh City, Vietnam',
    verified: true,
    totalSales: 1200,
    responseRate: 98,
    responseTime: '< 2 hours',
    joinedDate: '2022-01-15',
    rating: 4.8,
    reviews: 450,
    verificationType: 'business' as VerificationType,
    description: 'Leading manufacturer of innovative baby care products. We focus on creating high-quality, safe, and convenient solutions for parents.',
    badges: ['Top Seller', 'Fast Shipper', 'Quality Products']
  } as Seller,
  recommendations: [
    {
      id: 'rec1',
      title: 'Breast Milk Storage Bags',
      price: 12.99,
      image: '/images/products/storage-bags.jpg',
      rating: 4.7,
      reviews: 89
    },
    {
      id: 'rec2',
      title: 'Nursing Cover',
      price: 19.99,
      image: '/images/products/nursing-cover.jpg',
      rating: 4.5,
      reviews: 67
    },
    {
      id: 'rec3',
      title: 'Nipple Cream',
      price: 9.99,
      image: '/images/products/nipple-cream.jpg',
      rating: 4.8,
      reviews: 123
    },
    {
      id: 'rec4',
      title: 'Nursing Pads',
      price: 14.99,
      image: '/images/products/nursing-pads.jpg',
      rating: 4.6,
      reviews: 92
    }
  ],
  sellerProducts: [
    {
      id: 'sp1',
      title: 'Electric Baby Bottle Warmer',
      price: 29.99,
      image: '/images/products/bottle-warmer.jpg',
      rating: 4.7,
      reviews: 156
    },
    {
      id: 'sp2',
      title: 'Baby Food Maker',
      price: 79.99,
      image: '/images/products/food-maker.jpg',
      rating: 4.9,
      reviews: 203
    },
    {
      id: 'sp3',
      title: 'Smart Baby Monitor',
      price: 149.99,
      image: '/images/products/baby-monitor.jpg',
      rating: 4.8,
      reviews: 178
    },
    {
      id: 'sp4',
      title: 'Baby Bottle Sterilizer',
      price: 59.99,
      image: '/images/products/sterilizer.jpg',
      rating: 4.6,
      reviews: 145
    }
  ],
  sellerDescription: {
    content: `
      <h2>Product Description</h2>
      <p>Welcome to MIFOYO's latest innovation in breast pumping technology!</p>
      
      <h3>Key Features:</h3>
      <ul>
        <li><strong>Hands-Free Design:</strong> Our wearable breast pump fits securely and discreetly under your clothing</li>
        <li><strong>Smart Technology:</strong> Built-in memory chip remembers your preferred settings</li>
        <li><strong>Ultra-Quiet Operation:</strong> Less than 45dB noise level for discreet pumping</li>
      </ul>

      <h3>Package Includes:</h3>
      <ul>
        <li>2x Breast Pump Units</li>
        <li>4x Collection Cups (24mm)</li>
        <li>2x USB Charging Cables</li>
        <li>1x Carrying Bag</li>
        <li>1x User Manual</li>
      </ul>

      <h3>Technical Specifications:</h3>
      <table>
        <tr>
          <td>Battery Life:</td>
          <td>Up to 3 hours</td>
        </tr>
        <tr>
          <td>Charging Time:</td>
          <td>2 hours</td>
        </tr>
        <tr>
          <td>Suction Levels:</td>
          <td>9 levels</td>
        </tr>
      </table>

      <div class="warning">
        <strong>Important Note:</strong> Please sterilize all parts before first use
      </div>
    `,
    lastUpdated: '2024-03-15'
  }
};

export default function BreastPumpProductPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('pack-2');
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [recommendationsIndex, setRecommendationsIndex] = useState(0);
  const [sellerProductsIndex, setSellerProductsIndex] = useState(0);
  
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

      {/* Product Title and Seller Info */}
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <div className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium mb-2">
            MARCH
          </div>
          <h1 className="text-xl font-bold text-gray-900">{breastPumpProduct.title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <span>No reviews yet</span>
            <span>•</span>
            <span>400 sold</span>
            <span>•</span>
            <Link href="#" className="text-gray-900 hover:underline">
              #2 Most popular in Wearable Breast Pump
            </Link>
          </div>
        </div>

        {/* Seller Overview */}
        <div className={`rounded-lg p-4 mb-6 ${
          breastPumpProduct.seller.verificationType === 'business' 
            ? 'bg-purple-100' 
            : 'bg-blue-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex-shrink-0">
              <Image
                src="/images/seller/horigen-logo.png"
                alt="Horigen"
                width={32}
                height={32}
                className="rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Link href="#" className="text-gray-900 hover:underline font-medium">
                  {breastPumpProduct.seller.name}
                </Link>
                <VerifiedBadge 
                  type={breastPumpProduct.seller.verificationType}
                  showLabel={true}
                  size="sm"
                />
                <div className="text-gray-500">•</div>
                <div className="text-gray-600 text-sm">Custom manufacturer</div>
                <div className="text-gray-500">•</div>
                <div className="text-gray-600 text-sm">12 yrs</div>
                <div className="text-gray-500">•</div>
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/flags/cn.png"
                    alt="CN"
                    width={16}
                    height={12}
                    className="rounded"
                  />
                  <span className="text-gray-600 text-sm">CN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Product Content */}
        <div className="grid grid-cols-12 gap-8">
          {/* Left Column - Images */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={breastPumpProduct.images[currentImageIndex]}
                alt={breastPumpProduct.title}
                fill
                className="object-contain"
              />
              <button 
                onClick={() => handleImageChange(Math.max(0, currentImageIndex - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleImageChange(Math.min(breastPumpProduct.images.length - 1, currentImageIndex + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={toggleSave}
                className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center"
              >
                <Heart className={`w-6 h-6 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {breastPumpProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageChange(index)}
                  className={`relative aspect-square rounded-md overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-4 border border-gray-200 rounded-lg shadow-lg p-6">
              <div className="mb-6">
                {/* Price Display */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-red-500">${breastPumpProduct.price.toFixed(2)}</span>
                      {breastPumpProduct.discount > 0 && (
                        <span className="text-sm font-medium text-red-500">-{breastPumpProduct.discount}%</span>
                      )}
                    </div>
                    {breastPumpProduct.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">${breastPumpProduct.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Bid System - Moved right below price */}
                <div className="mt-6">
                  <BidSystem
                    productId={breastPumpProduct.id}
                    productTitle={breastPumpProduct.title}
                    askingPrice={breastPumpProduct.price}
                    sellerId={breastPumpProduct.seller.id}
                    currentUserId={isAuthenticated ? 'current-user-id' : ''}
                    isCurrentUserSeller={false}
                    isLoggedIn={isAuthenticated}
                    onShowLoginModal={() => showAuthModal('login')}
                    onBidPlaced={async (bid) => {
                      console.log('Bid placed:', bid);
                    }}
                    onCounterOfferMade={async (counteroffer, bidId) => {
                      console.log('Counter offer made:', counteroffer, 'for bid:', bidId);
                    }}
                    onBidAccepted={async (bidId) => {
                      console.log('Bid accepted:', bidId);
                    }}
                    onBidRejected={async (bidId) => {
                      console.log('Bid rejected:', bidId);
                    }}
                    existingBids={[]}
                    counterOffers={[]}
                  />
                </div>
              </div>

              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(0, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => handleAddToCart()}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Chat now
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Image src="/images/payment/paypal.png" alt="PayPal" width={48} height={20} />
                    <Image src="/images/payment/klarna.png" alt="Klarna" width={48} height={20} />
                  </div>
                  <span>4 interest-free payments</span>
                  <button className="text-gray-400">
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">About This Item</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Condition:</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm font-medium rounded">New</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Product Details</h3>
                  <div className="space-y-2">
                    {Object.entries(breastPumpProduct.details).map(([key, value]) => (
                      <div key={key} className="grid grid-cols-2 gap-4 text-sm">
                        <dt className="text-gray-600">{key}</dt>
                        <dd className="font-medium text-gray-900">{value}</dd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Product descriptions from supplier */}
        <div className="mt-12">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold">Product descriptions from supplier</h2>
              <p className="text-sm text-gray-500 mt-1">Last updated: {new Date(breastPumpProduct.sellerDescription.lastUpdated).toLocaleDateString()}</p>
            </div>
            <div className="p-6">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: breastPumpProduct.sellerDescription.content }}
              />
            </div>
          </div>
        </div>


        {/* Frequently bought together */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Frequently bought together</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                drag="x"
                dragConstraints={{ right: 0, left: -1120 }} // Assuming 4 visible items at 280px each
                dragElastic={0.2}
              >
                {[
                  {
                    id: 'medela-pump',
                    title: 'Medela Pump In Style with MaxFlow Technology',
                    price: 199.99,
                    image: '/images/products/medela-pump.jpg',
                    rating: 4.8,
                    reviews: 2456,
                    supplier: 'Medela Official Store',
                    minOrder: '1 piece'
                  },
                  {
                    id: 'lansinoh-bags',
                    title: 'Lansinoh Breast Milk Storage Bags, 100 Count',
                    price: 13.99,
                    image: '/images/products/storage-bags.jpg',
                    rating: 4.9,
                    reviews: 3211,
                    supplier: 'Lansinoh Baby',
                    minOrder: '2 packs'
                  },
                  {
                    id: 'spectra-bottles',
                    title: 'Spectra Baby USA - Wide Neck Bottle Set',
                    price: 24.99,
                    image: '/images/products/bottles.jpg',
                    rating: 4.7,
                    reviews: 892,
                    supplier: 'Spectra Baby',
                    minOrder: '1 set'
                  },
                  {
                    id: 'medela-shields',
                    title: 'Medela PersonalFit Flex Breast Shields',
                    price: 29.99,
                    image: '/images/products/shields.jpg',
                    rating: 4.6,
                    reviews: 1543,
                    supplier: 'Medela Official Store',
                    minOrder: '1 pair'
                  },
                  {
                    id: 'haakaa-collector',
                    title: 'Haakaa Manual Breast Pump & Collector',
                    price: 12.99,
                    image: '/images/products/haakaa.jpg',
                    rating: 4.8,
                    reviews: 4521,
                    supplier: 'Haakaa Official',
                    minOrder: '1 piece'
                  },
                  {
                    id: 'bamboobies-pads',
                    title: 'Bamboobies Premium Nursing Pads Bundle',
                    price: 19.99,
                    image: '/images/products/nursing-pads.jpg',
                    rating: 4.7,
                    reviews: 2187,
                    supplier: 'Bamboobies',
                    minOrder: '1 pack'
                  }
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex-shrink-0 w-[280px]"
                  >
                    <Link href="#" className="group block">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={280}
                          height={280}
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{item.supplier}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-500">({item.reviews})</span>
                        </div>
                        <p className="text-gray-900 font-medium mt-1">${item.price.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs mt-1">Min. order: {item.minOrder}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-hidden');
                if (container) container.scrollLeft -= 280;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-hidden');
                if (container) container.scrollLeft += 280;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Business Recommendations */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Other recommendations for your business</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                drag="x"
                dragConstraints={{ right: 0, left: -((breastPumpProduct.recommendations.length - 4) * 280) }}
                dragElastic={0.2}
              >
                {breastPumpProduct.recommendations.map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex-shrink-0 w-[280px]"
                  >
                    <Link href="#" className="group block">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={280}
                          height={280}
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                          {item.title}
                        </h3>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-500">({item.reviews})</span>
                        </div>
                        <p className="text-gray-600 mt-1">${item.price.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs mt-1">Min. order: 100 pieces</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-hidden');
                if (container) container.scrollLeft -= 280;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-hidden');
                if (container) container.scrollLeft += 280;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Know your supplier */}
        <div className="mt-12">
          <div className={`rounded-xl overflow-hidden ${
            breastPumpProduct.seller.verificationType === 'business' 
              ? 'bg-purple-100' 
              : 'bg-blue-100'
          }`}>
            <div className="px-6 py-4 border-b border-black/5">
              <h2 className="text-xl font-bold">Know your supplier</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">On-time delivery rate</div>
                  <div className="text-3xl font-bold">75.0%</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Online revenue</div>
                  <div className="text-3xl font-bold">US$ 20,000+</div>
                </div>
                <div className="bg-white/80 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Response Time</div>
                  <div className="text-3xl font-bold">≤3h</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/80 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      <Image
                        src="/images/seller/horigen-logo.png"
                        alt="Horigen"
                        width={64}
                        height={64}
                        className="rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">{breastPumpProduct.seller.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Manufacturer, Trading Company</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">12 yrs on Alibaba.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">Located in CN</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 rounded-lg p-6 flex items-center justify-between">
                  <div className="space-y-4">
                    <h3 className="font-medium">Want to view more products?</h3>
                    <div className="flex gap-3">
                      <Link 
                        href="#" 
                        className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        More products
                      </Link>
                      <Link 
                        href="#" 
                        className="px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        Company profile
                      </Link>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* All Products Slider */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">All Products from this supplier</h2>
          <div className="relative">
            <div className="overflow-hidden">
              <motion.div
                className="flex gap-4"
                drag="x"
                dragConstraints={{ right: 0, left: -1680 }} // Assuming 6 visible items at 280px each
                dragElastic={0.2}
              >
                {[
                  {
                    id: 'pump-1',
                    title: 'Electric Double Breast Pump Pro',
                    price: 159.99,
                    image: '/images/products/breast-pump-2.jpg',
                    rating: 4.7,
                    reviews: 1256,
                    supplier: 'MomCare Pro',
                    minOrder: '1 piece'
                  },
                  {
                    id: 'pump-2',
                    title: 'Smart Wearable Breast Pump',
                    price: 199.99,
                    image: '/images/products/breast-pump-3.jpg',
                    rating: 4.9,
                    reviews: 2341,
                    supplier: 'BabyTech Solutions',
                    minOrder: '1 piece'
                  },
                  {
                    id: 'pump-3',
                    title: 'Hospital Grade Breast Pump',
                    price: 299.99,
                    image: '/images/products/breast-pump-4.jpg',
                    rating: 4.8,
                    reviews: 892,
                    supplier: 'MedicalCare Plus',
                    minOrder: '1 unit'
                  },
                  {
                    id: 'pump-4',
                    title: 'Portable Mini Breast Pump',
                    price: 79.99,
                    image: '/images/products/breast-pump-5.jpg',
                    rating: 4.6,
                    reviews: 1543,
                    supplier: 'EasyPump',
                    minOrder: '2 pieces'
                  },
                  {
                    id: 'pump-5',
                    title: 'Dual Motor Electric Breast Pump',
                    price: 189.99,
                    image: '/images/products/breast-pump-1.jpg',
                    rating: 4.8,
                    reviews: 2187,
                    supplier: 'NursePro Tech',
                    minOrder: '1 set'
                  },
                  {
                    id: 'pump-6',
                    title: 'LCD Display Breast Pump Set',
                    price: 169.99,
                    image: '/images/products/breast-pump-2.jpg',
                    rating: 4.7,
                    reviews: 1876,
                    supplier: 'SmartCare Baby',
                    minOrder: '1 piece'
                  },
                  {
                    id: 'pump-7',
                    title: 'Rechargeable Silent Breast Pump',
                    price: 149.99,
                    image: '/images/products/breast-pump-3.jpg',
                    rating: 4.5,
                    reviews: 1432,
                    supplier: 'QuietComfort',
                    minOrder: '1 unit'
                  },
                  {
                    id: 'pump-8',
                    title: 'Travel-Friendly Breast Pump Kit',
                    price: 129.99,
                    image: '/images/products/breast-pump-4.jpg',
                    rating: 4.6,
                    reviews: 987,
                    supplier: 'TravelMom',
                    minOrder: '1 set'
                  }
                ].map((item) => (
                  <motion.div
                    key={item.id}
                    className="flex-shrink-0 w-[280px]"
                  >
                    <Link href="#" className="group block">
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={280}
                          height={280}
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-sm">
                        <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600">
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{item.supplier}</p>
                        <div className="flex items-center mt-1">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-1 text-sm text-gray-500">({item.reviews})</span>
                        </div>
                        <p className="text-gray-900 font-medium mt-1">${item.price.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs mt-1">Min. order: {item.minOrder}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-hidden:last-of-type');
                if (container) container.scrollLeft -= 280;
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-hidden:last-of-type');
                if (container) container.scrollLeft += 280;
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Related Searches */}
        <div className="mt-12 mb-16">
          <h2 className="text-xl font-bold mb-6">Related searches</h2>
          <div className="flex flex-wrap gap-3">
            {[
              'mk watch',
              'ice watch',
              'im watch',
              'ap watch',
              'u watch',
              'spy watch',
              'tvg watch',
              'g watch',
              'ks watch',
              'mce watch',
              'ck watch',
              'fob watch',
              'ots watch',
              'toy watch',
              'u8 watch'
            ].map((term) => (
              <Link
                key={term}
                href="#"
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 