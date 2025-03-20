'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import VerifiedBadge from '@/components/seller/VerifiedBadge';
import BidSystem, { Bid, CounterOffer } from '@/components/product/BidSystem';

// Define interfaces for strong typing
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
  verificationType: 'parent' | 'business';
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  images: string[];
  condition: string;
  isNew: boolean;
  description: string;
  details: {
    [key: string]: string;
  };
  shippingInfo: {
    methods: {
      name: string;
      price: number;
      estimatedDelivery: string;
    }[];
    returns: string;
  };
  seller: Seller;
  marketplace: {
    id: string;
    name: string;
    logo: string;
  };
  relatedProducts: {
    id: string;
    title: string;
    price: number;
    image: string;
    condition: string;
  }[];
  category: string;
  features: string[];
}

// Mock data for a sample product
const sampleProduct: Product = {
  id: 'vintage-pearl-necklace',
  title: '1960s Vintage Pearl Necklace with Original Box and Certificate',
  price: 45.99,
  originalPrice: 89.99,
  images: [
    '/images/products/pearl-necklace-1.jpg',
    '/images/products/pearl-necklace-2.jpg',
    '/images/products/pearl-necklace-3.jpg',
    '/images/products/pearl-necklace-4.jpg',
  ],
  condition: 'Excellent',
  isNew: false,
  description: "This elegant vintage pearl necklace from the 1960s features a single strand of hand-knotted freshwater pearls with a secure silver clasp. The pearls maintain their original luster and show minimal wear, making this piece a beautiful addition to any jewelry collection. The necklace comes in its original box with a certificate of authenticity.\n\nLength: 18 inches\nPearl size: 5-6mm\nClasp: Sterling silver\n\nPerfect for both special occasions and everyday wear, this timeless piece adds sophistication to any outfit.",
  details: {
    'Era': '1960s',
    'Style': 'Classic',
    'Materials': 'Freshwater pearls, Sterling silver',
    'Length': '18 inches',
    'Pearl Size': '5-6mm',
    'Clasp Type': 'Secure box clasp',
    'Condition Notes': 'Excellent vintage condition. Minor surface patina on clasp consistent with age.',
    'Included': 'Original box and certificate of authenticity'
  },
  shippingInfo: {
    methods: [
      {
        name: 'Standard Shipping',
        price: 5.99,
        estimatedDelivery: '5-7 business days'
      },
      {
        name: 'Expedited Shipping',
        price: 12.99,
        estimatedDelivery: '2-3 business days'
      },
      {
        name: 'International Shipping',
        price: 24.99,
        estimatedDelivery: '7-14 business days'
      }
    ],
    returns: 'Returns accepted within 14 days of delivery. Item must be in original condition with all packaging and documentation. Buyer is responsible for return shipping costs unless the item was misrepresented.'
  },
  seller: {
    id: 'emma123',
    name: 'Emma Johnson',
    avatar: '/images/avatars/emma.jpg',
    location: 'Chicago, IL',
    verified: true,
    totalSales: 1283,
    responseRate: 98,
    responseTime: 'Within 24 hours',
    joinedDate: 'Jan 2020',
    rating: 4.8,
    reviews: 127,
    verificationType: 'business',
  },
  marketplace: {
    id: 'vintage-jewelry',
    name: 'Vintage Jewelry Addicts',
    logo: '/images/marketplaces/vintage-logo.png'
  },
  relatedProducts: [
    {
      id: 'gold-bracelet',
      title: 'Antique Gold Link Bracelet',
      price: 129.00,
      image: '/images/products/gold-bracelet.jpg',
      condition: 'Very Good'
    },
    {
      id: 'silver-earrings',
      title: 'Art Deco Silver Dangle Earrings',
      price: 36.50,
      image: '/images/products/silver-earrings.jpg',
      condition: 'Excellent'
    },
    {
      id: 'jade-pendant',
      title: 'Vintage Jade Pendant Necklace',
      price: 89.99,
      image: '/images/products/jade-pendant.jpg',
      condition: 'Excellent'
    },
    {
      id: 'cameo-brooch',
      title: 'Victorian Cameo Brooch',
      price: 75.00,
      image: '/images/products/cameo-brooch.jpg',
      condition: 'Good'
    }
  ],
  category: 'Jewelry',
  features: [
    'Authentic 1960s design',
    'Hand-knotted freshwater pearls',
    'Original brass clasp',
    'Length: 18 inches',
    'Weight: 35 grams'
  ],
};

// Mock data for parent seller product
const parentSellerProduct: Product = {
  id: 'handmade-baby-blanket',
  title: 'Handmade Organic Cotton Baby Blanket',
  price: 35.99,
  originalPrice: 45.99,
  images: [
    '/images/products/baby-blanket-1.jpg',
    '/images/products/baby-blanket-2.jpg',
    '/images/products/baby-blanket-3.jpg',
  ],
  condition: 'New',
  isNew: true,
  description: "This beautifully crafted handmade baby blanket is made from 100% organic cotton, perfect for sensitive skin. Each blanket is lovingly made by a parent seller, with special attention to quality and safety. The soft, breathable fabric is ideal for newborns and features a gentle pattern that works well for any nursery theme.\n\nSize: 30 x 40 inches\nMaterial: 100% Organic Cotton\nCare: Machine washable on gentle cycle, tumble dry low\n\nThis blanket makes a wonderful baby shower gift or addition to your own little one's nursery.",
  details: {
    'Material': '100% Organic Cotton',
    'Size': '30 x 40 inches',
    'Weight': '12 oz',
    'Care': 'Machine washable (gentle), tumble dry low',
    'Age Range': '0-36 months',
    'Made By': 'Hand-crafted by a parent',
    'Origin': 'Made in USA',
  },
  shippingInfo: {
    methods: [
      {
        name: 'Standard Shipping',
        price: 4.99,
        estimatedDelivery: '3-5 business days'
      },
      {
        name: 'Express Shipping',
        price: 9.99,
        estimatedDelivery: '1-2 business days'
      }
    ],
    returns: 'Returns accepted within 30 days if unused and in original packaging. Buyer pays return shipping.'
  },
  seller: {
    id: 'sarah456',
    name: 'Sarah Miller',
    avatar: '/images/avatars/sarah.jpg',
    location: 'Portland, OR',
    verified: true,
    totalSales: 187,
    responseRate: 99,
    responseTime: 'Within 12 hours',
    joinedDate: 'Mar 2021',
    rating: 4.9,
    reviews: 64,
    verificationType: 'parent',
  },
  marketplace: {
    id: 'parent-made-goods',
    name: 'Parent-Made Baby Goods',
    logo: '/images/marketplaces/parent-made-logo.png'
  },
  relatedProducts: [
    {
      id: 'baby-hat-set',
      title: 'Organic Cotton Baby Hat Set',
      price: 22.50,
      image: '/images/products/baby-hat.jpg',
      condition: 'New'
    },
    {
      id: 'wooden-rattle',
      title: 'Handcrafted Wooden Baby Rattle',
      price: 18.99,
      image: '/images/products/wooden-rattle.jpg',
      condition: 'New'
    },
    {
      id: 'organic-bib-set',
      title: 'Set of 3 Organic Cotton Bibs',
      price: 24.99,
      image: '/images/products/bib-set.jpg',
      condition: 'New'
    }
  ],
  category: 'Baby',
  features: [
    '100% Organic Cotton',
    'Handmade by a parent seller',
    'Machine washable',
    'Hypoallergenic',
    'Chemical-free dyes'
  ],
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  // Add state for bids and counter offers
  const [bids, setBids] = useState<Bid[]>([]);
  const [counterOffers, setCounterOffers] = useState<CounterOffer[]>([]);
  
  // Auth state
  const { isAuthenticated, showAuthModal, authModalVisible, hideAuthModal, authModalMode, user, authModalActionAfterAuth } = useAuth();
  
  // Auth-required action handlers
  const handleAuthRequiredAction = (action: 'save' | 'message' | 'buy' | 'cart', mode: 'login' | 'signup' = 'signup') => {
    if (!isAuthenticated) {
      showAuthModal(mode);
    } else {
      // Handle the authenticated action
      switch (action) {
        case 'save':
          toggleSave();
          break;
        case 'message':
          // In a real app, redirect to messaging
          router.push(`/messages/new?seller=${product?.seller.id}`);
          break;
        case 'buy':
          // In a real app, redirect to checkout
          router.push(`/checkout?product=${product?.id}`);
          break;
        case 'cart':
          // In a real app, add to cart
          console.log('Added to cart:', product?.id);
          // Show some confirmation
          break;
      }
    }
  };

  // Effect to load the product data
  useEffect(() => {
    // In a real app, this would be an API call based on params.id
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Choose product based on id
      const productId = params.id as string;
      if (productId === 'handmade-baby-blanket') {
        setProduct(parentSellerProduct);
      } else {
        setProduct(sampleProduct);
      }
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading) {
    return (
      <div className="container-custom py-16 min-h-screen">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="h-32 bg-gray-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the product you're looking for.</p>
          <Link href="/marketplace" className="btn-primary">
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const handleImageChange = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  // Add functions to handle bids
  const handleBidPlaced = async (bid: Omit<Bid, 'id' | 'createdAt' | 'status'>) => {
    // In a real app, this would be an API call
    console.log('Bid placed:', bid);
    
    // Mock implementation: create a new bid and add it to state
    const newBid: Bid = {
      id: `bid-${Date.now()}`,
      userId: bid.userId,
      amount: bid.amount,
      status: 'pending',
      createdAt: new Date(),
      expiresAt: bid.expiresAt,
      message: bid.message
    };
    
    setBids(prev => [...prev, newBid]);
    return Promise.resolve();
  };
  
  const handleCounterOfferMade = async (
    counteroffer: Omit<CounterOffer, 'bidId'>, 
    bidId: string
  ) => {
    // In a real app, this would be an API call
    console.log('Counter offer made:', counteroffer, 'for bid:', bidId);
    
    // Mock implementation: create a new counter offer and add it to state
    const newCounterOffer: CounterOffer = {
      bidId,
      amount: counteroffer.amount,
      expiresAt: counteroffer.expiresAt,
      message: counteroffer.message
    };
    
    setCounterOffers(prev => [...prev, newCounterOffer]);
    
    // Update the bid status to countered
    setBids(prev => 
      prev.map(bid => 
        bid.id === bidId ? { ...bid, status: 'countered' } : bid
      )
    );
    
    return Promise.resolve();
  };
  
  const handleBidAccepted = async (bidId: string) => {
    // In a real app, this would be an API call
    console.log('Bid accepted:', bidId);
    
    // Mock implementation: update the bid status
    setBids(prev => 
      prev.map(bid => 
        bid.id === bidId ? { ...bid, status: 'accepted' } : bid
      )
    );
    
    return Promise.resolve();
  };
  
  const handleBidRejected = async (bidId: string, reason?: string) => {
    // In a real app, this would be an API call
    console.log('Bid rejected:', bidId, 'Reason:', reason);
    
    // Mock implementation: update the bid status
    setBids(prev => 
      prev.map(bid => 
        bid.id === bidId ? { ...bid, status: 'rejected' } : bid
      )
    );
    
    return Promise.resolve();
  };

  return (
    <main className="bg-gray-50 pb-16">
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalVisible}
        onClose={hideAuthModal}
        initialMode={authModalMode}
        title="Join Mom Marketplace"
        subtitle="Sign up to save items, message sellers, and more!"
        actionAfterAuth={authModalActionAfterAuth}
      />
      
      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <div className="text-sm text-gray-500">
          <Link href="/marketplace" className="hover:text-primary">Marketplace</Link>
          {!loading && product && (
            <>
              <span className="mx-2">›</span>
              <Link href={`/marketplace/${product.marketplace.id}`} className="hover:text-primary">{product.marketplace.name}</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-700">{product.title}</span>
            </>
          )}
        </div>
      </div>

      {/* Testing Instructions Alert */}
      <div className="container-custom mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800 mb-1">Testing the Bid System</h4>
            <p className="text-sm text-blue-700">
              The bid system is available only for products from parent sellers. To test it:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-blue-700 ml-2">
              <li>Visit <Link href="/product/handmade-baby-blanket" className="underline font-medium">/product/handmade-baby-blanket</Link> to see a product from a parent seller with bidding enabled</li>
              <li>The "Vintage Pearl Necklace" product is from a business seller, so bidding is not available</li>
              <li>You must be logged in to place a bid</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden p-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                  <div className="h-12 bg-gray-200 rounded mb-4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product content */}
      {!loading && product && (
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left column - Images */}
                <div>
                  {/* Main Image */}
                  <div className="relative aspect-square overflow-hidden rounded-lg mb-4 bg-gray-100">
                    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                    {/* Uncomment when you have actual images */}
                    {/* <Image
                      src={product.images[currentImageIndex]}
                      alt={product.title}
                      fill
                      className="object-contain"
                      priority
                    /> */}
                    
                    {/* Navigation arrows */}
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white focus:outline-none z-10"
                      aria-label="Previous image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center text-gray-800 hover:bg-white focus:outline-none z-10"
                      aria-label="Next image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Thumbnails */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-primary' : 'border-transparent'
                        }`}
                      >
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                        {/* Uncomment when you have actual images */}
                        {/* <Image
                          src={image}
                          alt={`${product.title} - image ${index + 1}`}
                          fill
                          className="object-cover"
                        /> */}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Right column - Product info */}
                <div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                      <div className="flex items-center mb-4">
                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-800 mr-2">
                          {product.condition}
                        </div>
                        {product.isNew && (
                          <div className="bg-green-100 px-3 py-1 rounded-full text-sm font-medium text-green-800">
                            New
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAuthRequiredAction('save')}
                      aria-label={isSaved ? "Unsave product" : "Save product"}
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        isSaved ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill={isSaved ? "currentColor" : "none"} 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                        strokeWidth={isSaved ? 0 : 2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through ml-2">${product.originalPrice.toFixed(2)}</span>
                      )}
                      {product.originalPrice && (
                        <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-0.5 rounded">
                          {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Seller info */}
                  <div className="flex items-center p-4 border border-gray-200 rounded-lg mb-6">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      {/* Uncomment when you have actual images */}
                      {/* <Image
                        src={product.seller.avatar}
                        alt={product.seller.name}
                        fill
                        className="object-cover"
                      /> */}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{product.seller.name}</span>
                        {product.seller.verificationType && (
                          <div className="ml-2">
                            <VerifiedBadge 
                              type={product.seller.verificationType as 'parent' | 'business'} 
                              showLabel={true}
                              size="sm"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span>{product.seller.location}</span>
                        <span className="mx-1">•</span>
                        <span>{product.seller.totalSales}+ sales</span>
                        <span className="mx-1">•</span>
                        <span>{product.seller.responseRate}% response</span>
                      </div>
                    </div>
                    <Link 
                      href={`/seller/${product.seller.id}`}
                      className="text-primary hover:text-primary-dark text-sm font-medium"
                    >
                      View profile
                    </Link>
                  </div>
                  
                  {/* Add the BidSystem component here, but only for parent sellers */}
                  {product.seller.verificationType === 'parent' && (
                    <div className="mb-6">
                      <BidSystem
                        productId={product.id}
                        productTitle={product.title}
                        askingPrice={product.price}
                        sellerId={product.seller.id}
                        currentUserId={user?.id || ''}
                        isCurrentUserSeller={user?.id === product.seller.id}
                        isLoggedIn={isAuthenticated}
                        onShowLoginModal={() => showAuthModal('login', () => {
                          // This function will be called after successful login
                          console.log('User logged in, continuing with bid submission');
                          // The user will need to submit the bid again after logging in
                        })}
                        onBidPlaced={handleBidPlaced}
                        onCounterOfferMade={handleCounterOfferMade}
                        onBidAccepted={handleBidAccepted}
                        onBidRejected={handleBidRejected}
                        existingBids={bids}
                        counterOffers={counterOffers}
                      />
                    </div>
                  )}
                  
                  {/* Purchase options */}
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-700 mr-4">Quantity:</label>
                      <div className="relative inline-flex">
                        <button
                          type="button"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-l-md hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <input
                          type="number"
                          id="quantity"
                          min="1"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-16 text-center border-y border-gray-300 py-2 focus:ring-primary focus:border-primary"
                        />
                        <button
                          type="button"
                          onClick={() => setQuantity(quantity + 1)}
                          className="p-2 border border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        onClick={() => handleAuthRequiredAction('buy')}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => handleAuthRequiredAction('cart')}
                        className="w-full px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary-light/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Product details and description - Tabbed */}
      <div className="container-custom mt-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button className="py-4 px-6 border-b-2 border-primary text-primary font-medium">
                Details & Description
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                Shipping & Returns
              </button>
              <button className="py-4 px-6 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                Seller Information
              </button>
            </nav>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left - Product specs */}
              <div>
                <h3 className="text-lg font-bold mb-4">Product Specifications</h3>
                <dl className="space-y-3">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-2 gap-4">
                      <dt className="text-gray-600 font-medium">{key}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              
              {/* Right - Description */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-bold mb-4">Description</h3>
                <div className="prose max-w-none">
                  {product.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                  ))}
                </div>
                
                {/* Authentication note */}
                <div className="mt-8 bg-gray-50 rounded-lg p-4 flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900">Authentication Guarantee</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      This item has been verified by our expert team for authenticity. It includes original documentation and comes with our marketplace guarantee.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Related products */}
      <div className="container-custom mt-8">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {product.relatedProducts.map((relatedProduct) => (
            <motion.div
              key={relatedProduct.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md border border-gray-100"
            >
              <Link href={`/product/${relatedProduct.id}`}>
                <div className="relative aspect-square bg-gray-100">
                  <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                  {/* Uncomment when you have actual images */}
                  {/* <Image
                    src={relatedProduct.image}
                    alt={relatedProduct.title}
                    fill
                    className="object-cover"
                  /> */}
                  
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded">
                      {relatedProduct.condition}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1">{relatedProduct.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-bold">${relatedProduct.price.toFixed(2)}</span>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleAuthRequiredAction('save');
                      }}
                      className="text-primary hover:text-primary-dark focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Marketplace link banner */}
      <div className="container-custom mt-8">
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white mr-4">
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                {/* Uncomment when you have actual images */}
                {/* <Image
                  src={product.marketplace.logo}
                  alt={product.marketplace.name}
                  fill
                  className="object-cover"
                /> */}
              </div>
              <div>
                <p className="text-white/80 text-sm">This item is from</p>
                <h3 className="text-xl font-bold">{product.marketplace.name}</h3>
              </div>
            </div>
            <Link href={`/marketplace/${product.marketplace.id}`} className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 shadow-md">
              Visit Marketplace
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 