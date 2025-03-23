'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import AuthModal from '@/components/auth/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import VerifiedBadge from '@/components/seller/VerifiedBadge';
import BidSystem, { Bid, CounterOffer } from '@/components/product/BidSystem';
import { Check, ChevronLeft, ChevronRight, Heart, Minus, Plus, HelpCircle, Tag, ShoppingBag, Truck, RefreshCw } from 'lucide-react';
import { Product, ProductProperty } from '@/types/database';
import { useCart } from '@/contexts/CartContext';
import CartAddedConfirmation from '@/components/cart/CartAddedConfirmation';

// Define the seller type from the database
interface DatabaseSeller {
  id: string;
  name: string;
  avatar_url: string | null;
  business_type: 'company' | 'parent';
  seller_verification_status: string;
  created_at: string;
}

// Helper component for sliders
interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onProductSelect?: (product: Product) => void;
  selectedProducts?: Product[];
  showPrice?: boolean;
  showQuantity?: boolean;
}

const ProductSlider = ({ 
  title, 
  subtitle,
  products, 
  onProductSelect,
  selectedProducts = [],
  showPrice = true,
  showQuantity = false 
}: ProductSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      sliderRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {selectedProducts.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold text-primary">
              ${selectedProducts.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0).toFixed(2)}
            </p>
          </div>
        )}
      </div>
      
      <div className="relative">
        <div className="overflow-hidden" ref={sliderRef}>
          <div className="flex gap-4">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[250px]">
                <div className="group relative bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {product.condition === 'new' && (
                        <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      {showPrice && (
                        <div className="flex items-center justify-between">
                          <p className="text-lg font-semibold text-primary">
                            ${product.price.toFixed(2)}
                          </p>
                          {product.originalPrice && (
                            <p className="text-sm text-gray-500 line-through">
                              ${product.originalPrice.toFixed(2)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Link>
                  {showQuantity && (
                    <div className="p-4 pt-0 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onProductSelect?.({
                            ...product,
                            quantity: Math.max(1, (product.quantity || 1) - 1)
                          })}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{product.quantity || 1}</span>
                        <button
                          onClick={() => onProductSelect?.({
                            ...product,
                            quantity: (product.quantity || 1) + 1
                          })}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => onProductSelect?.(product)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Add to Cart
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10 border border-gray-200 hover:bg-gray-100 transition-colors"
          aria-label="Previous items"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg z-10 border border-gray-200 hover:bg-gray-100 transition-colors"
          aria-label="Next items"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

// Component for frequently bought together section
interface FrequentlyBoughtTogetherProps {
  mainProduct: Product;
  relatedProducts: Product[];
}

const FrequentlyBoughtTogether = ({ mainProduct, relatedProducts }: FrequentlyBoughtTogetherProps) => {
  const { addToCart } = useCart();
  const { push } = useRouter();
  const [selectedProducts, setSelectedProducts] = useState(
    new Set([mainProduct.id, ...relatedProducts.map(p => p.id)])
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [addedProducts, setAddedProducts] = useState<Product[]>([]);
  
  const toggleProduct = (id: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      // Don't allow deselecting the main product
      if (id !== mainProduct.id) {
        newSelected.delete(id);
      }
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
  };
  
  const calculateTotal = () => {
    let total = selectedProducts.has(mainProduct.id) ? mainProduct.price : 0;
    relatedProducts.forEach(product => {
      if (selectedProducts.has(product.id)) {
        total += product.price;
      }
    });
    return total.toFixed(2);
  };
  
  return (
    <div className="mt-12 bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-6">Frequently Bought Together</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8">
          <div className="flex flex-wrap gap-8 items-start">
            {/* Main product (always selected) */}
            <div className="w-[120px]">
              <div className="relative">
                <div className="aspect-square rounded-md overflow-hidden bg-white border border-gray-200">
                  <Image
                    src={mainProduct.images[0]}
                    alt={mainProduct.title}
                    width={120}
                    height={120}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-md">
                  1
                </div>
              </div>
              <p className="text-xs mt-2 text-center line-clamp-2">{mainProduct.title}</p>
            </div>
            
            {/* Plus sign */}
            <div className="flex items-center justify-center">
              <Plus className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Related products */}
            {relatedProducts.map((product, index) => (
              <div key={product.id} className="w-[120px]">
                <div className="relative">
                  <button 
                    onClick={() => toggleProduct(product.id)}
                    className={`absolute -top-2 -left-2 w-5 h-5 rounded-md ${
                      selectedProducts.has(product.id) ? 'bg-blue-600' : 'bg-white border border-gray-300'
                    } flex items-center justify-center z-10`}
                    aria-label={`${selectedProducts.has(product.id) ? 'Remove' : 'Add'} ${product.title}`}
                  >
                    {selectedProducts.has(product.id) && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  <div className={`aspect-square rounded-md overflow-hidden ${
                    selectedProducts.has(product.id) ? 'bg-white border border-gray-200' : 'bg-gray-100 opacity-70'
                  }`}>
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      width={120}
                      height={120}
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-xs shadow-md">
                    {index + 2}
                  </div>
                </div>
                <p className="text-xs mt-2 text-center line-clamp-2">{product.title}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Price for all:</p>
              <p className="text-xl font-bold text-gray-900">${calculateTotal()}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedProducts.size} item{selectedProducts.size > 1 ? 's' : ''} selected
              </p>
            </div>
            
            <button 
              onClick={() => {
                // Get the selected products
                const selectedProductItems = [mainProduct, ...relatedProducts].filter(
                  product => selectedProducts.has(product.id)
                );
                
                // Add each selected product to cart
                selectedProductItems.forEach(product => {
                  addToCart(product, 1);
                });
                
                // Show confirmation
                setAddedProducts(selectedProductItems);
                setShowConfirmation(true);
              }}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Add Selected to Cart
            </button>
            
            <div className="mt-4 text-xs text-gray-500">
              <p className="flex items-center gap-1">
                <Truck className="w-3 h-3" />
                Ships together
              </p>
              <p className="flex items-center gap-1 mt-1">
                <Tag className="w-3 h-3" />
                Save 10% when bought together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add the confirmation modal */}
      {showConfirmation && (
        <CartAddedConfirmation
          products={addedProducts}
          onClose={() => setShowConfirmation(false)}
          onViewCart={() => {
            setShowConfirmation(false);
            push('/cart');
          }}
        />
      )}
    </div>
  );
};

// Add new interfaces for the sections
interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  onProductSelect?: (product: Product) => void;
  selectedProducts?: Product[];
  showPrice?: boolean;
  showQuantity?: boolean;
}

// Add new component for product sections
const ProductSection = ({ 
  title, 
  subtitle, 
  products, 
  onProductSelect, 
  selectedProducts = [], 
  showPrice = true,
  showQuantity = false 
}: ProductSectionProps) => {
  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => total + (product.price * (product.quantity || 1)), 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {selectedProducts.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="text-lg font-semibold text-primary">${calculateTotal().toFixed(2)}</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div 
            key={product.id}
            className="group relative bg-white rounded-lg border border-gray-200 hover:border-primary transition-colors duration-200"
          >
            <Link href={`/product/${product.slug}`} className="block">
              <div className="aspect-square relative overflow-hidden rounded-t-lg">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                {product.condition === 'new' && (
                  <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">
                  {product.title}
                </h4>
                {showPrice && (
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
                {showQuantity && (
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onProductSelect?.({
                            ...product,
                            quantity: Math.max(1, (product.quantity || 1) - 1)
                          });
                        }}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center">{product.quantity || 1}</span>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          onProductSelect?.({
                            ...product,
                            quantity: (product.quantity || 1) + 1
                          });
                        }}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        onProductSelect?.(product);
                      }}
                      className="text-primary hover:text-primary-dark"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTab, setSelectedTab] = useState('details');
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  // Add state for bids and counter offers
  const [bids, setBids] = useState<Bid[]>([]);
  const [counterOffers, setCounterOffers] = useState<CounterOffer[]>([]);
  
  const { isAuthenticated, showAuthModal, authModalVisible, hideAuthModal, authModalMode, user, authModalActionAfterAuth } = useAuth();
  
  const [frequentlyBoughtTogether, setFrequentlyBoughtTogether] = useState<Product[]>([]);
  const [moreFromSeller, setMoreFromSeller] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  const { addToCart } = useCart();
  
  // Add to cart with feedback
  const [cartFeedback, setCartFeedback] = useState(false);
  const [showAddedToCartConfirmation, setShowAddedToCartConfirmation] = useState(false);
  
  const handleAddToCart = async () => {
    if (!product) return;
    await addToCart(product, quantity);
    setShowAddedToCartConfirmation(true);
  };

  // Effect to load the product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const data = await response.json();
        setProduct(data.product);
        setFrequentlyBoughtTogether(data.frequentlyBoughtTogether);
        setMoreFromSeller(data.moreFromSeller);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

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
          router.push(`/messages/new?seller=${product?.seller_id}`);
          break;
        case 'buy':
          // In a real app, redirect to checkout
          router.push(`/checkout?product=${product?.id}`);
          break;
        case 'cart':
          // In a real app, add to cart
          console.log('Added to cart:', product?.id);
          // Show some confirmation
          handleAddToCart();
          break;
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-16 px-4 min-h-screen">
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
      <div className="container mx-auto py-16 px-4 min-h-screen">
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

  // Add handler for product selection
  const handleProductSelect = (selectedProduct: Product) => {
    setSelectedProducts(prev => {
      const existingIndex = prev.findIndex(p => p.id === selectedProduct.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = selectedProduct;
        return updated;
      }
      return [...prev, selectedProduct];
    });
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Added to cart feedback */}
      {cartFeedback && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <Check className="w-5 h-5" />
          Added to cart successfully!
        </div>
      )}
      
      {/* Breadcrumb */}
      <div className="container mx-auto py-3 px-4">
        <div className="text-sm text-gray-500">
          <Link href="/" className="hover:text-primary hover:underline">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/marketplace" className="hover:text-primary hover:underline">Marketplace</Link>
          <span className="mx-2">›</span>
          <Link href={`/categories/${product.category}`} className="hover:text-primary hover:underline">
            {product.category}
          </Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{product.title}</span>
        </div>
      </div>

      {/* Product Title and Seller Info */}
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.title}</h1>
        </div>

        {/* Seller Overview */}
        {product.seller && (
          <div className={`rounded-lg p-4 mb-6 ${
            product.seller.business_type === 'business' 
              ? 'bg-purple-50 border border-purple-100' 
              : 'bg-blue-50 border border-blue-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                <Image
                  src={product.seller.avatar_url || '/images/default-avatar.png'}
                  alt={product.seller.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/seller/${product.seller.id}`} className="text-gray-900 hover:underline font-medium">
                    {product.seller.name}
                  </Link>
                  <VerifiedBadge 
                    type={product.seller.business_type}
                    showLabel={true}
                    size="sm"
                    enrollmentDate={product.seller.created_at}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Product Content */}
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {/* Left Column - Images */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
              {product.images && product.images.length > 0 && (
                <Image
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              )}
              <button 
                onClick={() => handlePrevImage()}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => handleNextImage()}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              <button
                onClick={toggleSave}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
                aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-6 h-6 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              </button>
            </div>
            {product.images && (
              <div className="grid grid-cols-6 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index)}
                    className={`relative aspect-square rounded-md overflow-hidden ${
                      currentImageIndex === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                    }`}
                    aria-label={`View product image ${index + 1}`}
                  >
                    <Image
                      src={image}
                      alt={`Product view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Product Info */}
          <div className="col-span-12 lg:col-span-5">
            <div className="sticky top-4 border border-gray-200 rounded-lg shadow-lg p-6">
              <div className="mb-6">
                {/* Price Display */}
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-red-500">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Key Benefits */}
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Truck className="w-4 h-4 text-gray-500" /> 
                    Free shipping on orders over $50
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <RefreshCw className="w-4 h-4 text-gray-500" /> 
                    30-day return policy
                  </div>
                </div>

                {/* Bid System */}
                <div className="mt-6">
                  <BidSystem
                    productId={product.id}
                    productTitle={product.title}
                    askingPrice={product.price}
                    sellerId={product.seller_id}
                    currentUserId={isAuthenticated ? user?.id || '' : ''}
                    isCurrentUserSeller={isAuthenticated && user?.id === product.seller_id}
                    isLoggedIn={isAuthenticated}
                    onShowLoginModal={() => showAuthModal('login')}
                    onBidPlaced={handleBidPlaced}
                    onCounterOfferMade={handleCounterOfferMade}
                    onBidAccepted={handleBidAccepted}
                    onBidRejected={handleBidRejected}
                    existingBids={bids}
                    counterOffers={counterOffers}
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
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 h-10 text-center border border-gray-300 rounded-lg"
                      aria-label="Quantity"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleAuthRequiredAction('buy')}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    Buy Now
                  </button>
                  <button 
                    onClick={() => handleAuthRequiredAction('message')}
                    className="w-full py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Chat with Seller
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

        {/* Product Details Tabs */}
        <div className="mt-12">
          <div className="border-b border-gray-200 mb-6">
            <div className="flex flex-wrap -mb-px">
              <button
                onClick={() => setSelectedTab('details')}
                className={`mr-6 py-4 text-sm font-medium border-b-2 ${
                  selectedTab === 'details' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Details & Specs
              </button>
              <button
                onClick={() => setSelectedTab('shipping')}
                className={`mr-6 py-4 text-sm font-medium border-b-2 ${
                  selectedTab === 'shipping' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => setSelectedTab('seller')}
                className={`py-4 text-sm font-medium border-b-2 ${
                  selectedTab === 'seller' 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                About the Seller
              </button>
            </div>
          </div>
          
          {selectedTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Condition:</span>
                    <span className={`px-2 py-1 ${
                      product.condition === 'new' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    } text-sm font-medium rounded`}>
                      {product.condition}
                    </span>
                  </div>
                  {product.seller_description && (
                    <div>
                      <h3 className="font-medium mb-2">Product Details</h3>
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: product.seller_description }}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {product.description && (
                <div className="prose max-w-none">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="whitespace-pre-wrap">{product.description}</p>
                </div>
              )}
            </div>
          )}
          
          {selectedTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-4">Shipping Options</h3>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-sm text-gray-600">Estimated Delivery: 5-7 business days</p>
                      </div>
                      <p className="font-medium">$5.99</p>
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Express Shipping</p>
                        <p className="text-sm text-gray-600">Estimated Delivery: 2-3 business days</p>
                      </div>
                      <p className="font-medium">$12.99</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Returns & Exchanges</h3>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700">
                    Returns accepted within 30 days if unused and in original packaging. Buyer pays return shipping.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'seller' && product.seller && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <Image
                        src={product.seller.avatar_url || '/images/default-avatar.png'}
                        alt={product.seller.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{product.seller.name}</h3>
                      <p className="text-gray-600 text-sm">{product.seller.business_type}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-4">Seller Verification</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <VerifiedBadge 
                        type={product.seller.business_type}
                        showLabel={true}
                        size="md"
                        enrollmentDate={product.seller.created_at}
                      />
                    </div>
                    
                    <p className="text-sm text-gray-700">
                      {product.seller.business_type === 'business' 
                        ? 'This seller is a verified business with proper credentials and documentation. Business sellers maintain high-quality standards and professional services.'
                        : 'This seller is a verified parent with a focus on creating quality products for children and families. Parent sellers prioritize safety, quality, and thoughtful design in their products.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ProductSlider 
            title="You may also like"
            products={relatedProducts}
            showPrice={true}
          />
        )}

        {/* Add the new sections after the product details */}
        {!loading && product && (
          <>
            {/* Frequently Bought Together Section */}
            {frequentlyBoughtTogether.length > 0 && (
              <FrequentlyBoughtTogether
                mainProduct={product}
                relatedProducts={frequentlyBoughtTogether}
              />
            )}

            {/* More from Seller Section */}
            {moreFromSeller.length > 0 && (
              <ProductSlider
                title={`More from ${product.seller?.name}`}
                subtitle="Browse more items from this seller"
                products={moreFromSeller}
                onProductSelect={handleProductSelect}
                selectedProducts={selectedProducts}
                showPrice={true}
                showQuantity={true}
              />
            )}
          </>
        )}
      </div>

      {/* Add the confirmation modal */}
      {showAddedToCartConfirmation && (
        <CartAddedConfirmation
          products={[product]}
          onClose={() => setShowAddedToCartConfirmation(false)}
          onViewCart={() => {
            setShowAddedToCartConfirmation(false);
            router.push('/cart');
          }}
        />
      )}
    </div>
  );
}