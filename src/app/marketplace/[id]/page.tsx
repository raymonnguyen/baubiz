'use client';

import { useParams, usePathname, useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import MarketplaceHeader from '@/components/marketplace/MarketplaceHeader';
import MarketplaceAbout from '@/components/marketplace/MarketplaceAbout';
import MarketplaceReviews from '@/components/marketplace/MarketplaceReviews';
import SimilarMarketplaces from '@/components/marketplace/SimilarMarketplaces';
import VerifiedBadge from '@/components/seller/VerifiedBadge';

// Define interfaces for strong typing
interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number | null;
  image: string;
  isFeatured: boolean;
  condition: string;
  isNew: boolean;
  sellerId: string;
  sellerName: string;
  sellerVerificationType?: 'parent' | 'business';
}

interface Policy {
  title: string;
  content: string;
}

interface MarketplacePolicies {
  shipping: Policy;
  returns: Policy;
  payments: Policy;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Seller {
  id: string;
  name: string;
  avatar: string;
  joinedDate: string;
  location: string;
  bio: string;
  totalSales: number;
  responseRate: number;
  responseTime: string;
  lastActive: string;
  lat: number;
  lng: number;
  verificationType?: 'parent' | 'business';
}

interface RatingBreakdown {
  [key: number]: number;
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface Marketplace {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  establishedDate: string;
  logo: string;
  banner: string;
  members: string;
  listings: string;
  followers: string;
  owner: Seller;
  sellers?: Seller[];
  categories: string[];
  socialLinks: {
    instagram: string;
    twitter: string;
    website: string;
  };
  policies: MarketplacePolicies;
  faqs: FAQ[];
}

interface SimilarMarketplace {
  id: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  members: string;
  listings: string;
  categories: string[];
  rating: number;
  isLive?: boolean;
}

interface ReviewUser {
  name: string;
  avatar: string;
  purchaseCount: number;
}

interface Review {
  id: string;
  user: ReviewUser;
  rating: number;
  date: string;
  content: string;
  images?: string[];
  helpfulCount: number;
  isHelpful: boolean;
}

// Mock data for sample marketplace
const sampleMarketplace: Marketplace = {
  id: 'vintage-jewelry',
  name: 'Vintage Jewelry Addicts',
  description: 'Home to the very best vintage, antique, modern and handmade jewelry + accessories (bags, belts, hats, and more).',
  longDescription: '<p>Welcome to our curated collection of timeless jewelry pieces and accessories. Each item in our marketplace has been carefully selected for its quality, craftsmanship, and unique character.</p><p>We specialize in pieces from the Victorian era through the Mid-Century modern period, with a particular focus on Art Deco and vintage costume jewelry from renowned designers.</p>',
  establishedDate: 'January 2020',
  logo: '/images/marketplaces/vintage-logo.png',
  banner: '/images/marketplaces/vintage-banner.jpg',
  members: '4.7k',
  listings: '7.5k',
  followers: '2.3k',
  owner: {
    id: 'emma123',
    name: 'Emma Johnson',
    avatar: '/images/avatars/emma.jpg',
    joinedDate: 'Jan 2020',
    location: 'Chicago, IL',
    bio: 'Vintage jewelry collector and dealer with over 15 years of experience. I specialize in authentic Art Deco and Victorian era pieces, and I personally verify the authenticity and condition of every item in my marketplace.',
    totalSales: 1283,
    responseRate: 98,
    responseTime: 'Within 24 hours',
    lastActive: 'Today',
    lat: 41.8781, // Chicago coordinates
    lng: -87.6298,
    verificationType: 'business'
  },
  sellers: [
    {
      id: 'emma123',
      name: 'Emma Johnson',
      avatar: '/images/avatars/emma.jpg',
      joinedDate: 'Jan 2020',
      location: 'Chicago, IL',
      bio: 'Vintage jewelry collector and dealer with over 15 years of experience. I specialize in authentic Art Deco and Victorian era pieces, and I personally verify the authenticity and condition of every item in my marketplace.',
      totalSales: 1283,
      responseRate: 98,
      responseTime: 'Within 24 hours',
      lastActive: 'Today',
      lat: 41.8781,
      lng: -87.6298,
      verificationType: 'business'
    },
    {
      id: 'sarah123',
      name: 'Sarah Miller',
      avatar: '/images/avatars/sarah.jpg',
      joinedDate: 'Mar 2021',
      location: 'Los Angeles, CA',
      bio: 'Mom of two with a passion for sustainable fashion. I curate pre-loved clothing and accessories for children and mothers, focusing on quality brands at affordable prices.',
      totalSales: 478,
      responseRate: 95,
      responseTime: 'Within 1-2 days',
      lastActive: 'Yesterday',
      lat: 34.0522,
      lng: -118.2437,
      verificationType: 'parent'
    },
    {
      id: 'michael456',
      name: 'Michael Brown',
      avatar: '/images/avatars/michael.jpg',
      joinedDate: 'Sep 2020',
      location: 'New York, NY',
      bio: 'Antique jewelry specialist with a background in gemology. I handpick every item in my collection and provide detailed historical context for each piece.',
      totalSales: 829,
      responseRate: 99,
      responseTime: 'Same day',
      lastActive: 'Today',
      lat: 40.7128,
      lng: -74.0060,
      verificationType: 'business'
    },
    {
      id: 'jessica789',
      name: 'Jessica Taylor',
      avatar: '/images/avatars/jessica.jpg',
      joinedDate: 'Jun 2022',
      location: 'Miami, FL',
      bio: 'Mom and vintage enthusiast focusing on colorful, statement jewelry pieces from the 70s and 80s. Each piece in my collection is personally sourced from estate sales and vintage markets.',
      totalSales: 156,
      responseRate: 92,
      responseTime: 'Within 2 days',
      lastActive: '3 days ago',
      lat: 25.7617,
      lng: -80.1918,
      verificationType: 'parent'
    }
  ],
  categories: ['Vintage', 'Jewelry', 'Accessories'],
  socialLinks: {
    instagram: 'https://instagram.com/vintagejewelryaddict',
    twitter: 'https://twitter.com/vjaddicts',
    website: 'https://vintagejewelryaddict.com'
  },
  policies: {
    shipping: {
      title: 'Shipping',
      content: 'We ship worldwide. Standard shipping takes 3-5 business days within the US, and 7-14 days internationally. Express shipping options are available at checkout for most items.'
    },
    returns: {
      title: 'Returns & Exchanges',
      content: 'Returns accepted within 14 days of delivery. Item must be in original condition with all packaging and documentation. Buyer is responsible for return shipping costs unless the item was misrepresented.'
    },
    payments: {
      title: 'Payment Methods',
      content: 'We accept credit cards, PayPal, and platform store credit. Payment is processed securely through the platform\'s payment system.'
    }
  },
  faqs: [
    {
      question: 'How do you verify the authenticity of vintage jewelry?',
      answer: 'All items are carefully examined by our team of experts who have years of experience in vintage jewelry. We check for appropriate period markings, craftsmanship techniques, and materials used. When applicable, we also provide certificates of authenticity.'
    },
    {
      question: 'Do you offer layaway or payment plans?',
      answer: 'Yes, for purchases over $100, we offer a 3-month layaway plan with a 30% deposit. Please contact us before purchasing to arrange this.'
    },
    {
      question: 'Can you help me find a specific vintage piece?',
      answer: 'Absolutely! We offer a sourcing service for our customers. Just send us details about what you\'re looking for, and we\'ll do our best to find it for you.'
    }
  ]
};

// Mock data for sample products
const sampleProducts: Product[] = [
  {
    id: 'vintage-pearl-necklace',
    title: '1960s Vintage Pearl Necklace',
    price: 45.99,
    originalPrice: 89.99,
    image: '/images/products/pearl-necklace.jpg',
    isFeatured: true,
    condition: 'Excellent',
    isNew: false,
    sellerId: 'emma123',
    sellerName: 'Emma Johnson',
    sellerVerificationType: 'business'
  },
  {
    id: 'gold-bracelet',
    title: 'Antique Gold Link Bracelet',
    price: 129.00,
    originalPrice: null,
    image: '/images/products/gold-bracelet.jpg',
    isFeatured: true,
    condition: 'Very Good',
    isNew: true,
    sellerId: 'emma123',
    sellerName: 'Emma Johnson',
    sellerVerificationType: 'business'
  },
  {
    id: 'silver-earrings',
    title: 'Art Deco Silver Dangle Earrings',
    price: 36.50,
    originalPrice: 55.00,
    image: '/images/products/silver-earrings.jpg',
    isFeatured: false,
    condition: 'Excellent',
    isNew: false,
    sellerId: 'parent123',
    sellerName: 'Sarah Miller',
    sellerVerificationType: 'parent'
  },
  {
    id: 'cameo-brooch',
    title: 'Victorian Cameo Brooch',
    price: 75.00,
    originalPrice: 100.00,
    image: '/images/products/cameo-brooch.jpg',
    isFeatured: false,
    condition: 'Good',
    isNew: false,
    sellerId: 'parent123',
    sellerName: 'Sarah Miller',
    sellerVerificationType: 'parent'
  },
  {
    id: 'jade-pendant',
    title: 'Vintage Jade Pendant Necklace',
    price: 89.99,
    originalPrice: null,
    image: '/images/products/jade-pendant.jpg',
    isFeatured: false,
    condition: 'Excellent',
    isNew: true,
    sellerId: 'emma123',
    sellerName: 'Emma Johnson',
    sellerVerificationType: 'business'
  },
  {
    id: 'beaded-purse',
    title: '1920s Beaded Evening Purse',
    price: 195.00,
    originalPrice: 250.00,
    image: '/images/products/beaded-purse.jpg',
    isFeatured: false,
    condition: 'Very Good',
    isNew: false,
    sellerId: 'regular456',
    sellerName: 'Michael Brown',
    sellerVerificationType: undefined
  },
  {
    id: 'enamel-bracelet',
    title: 'Mid-Century Enamel Bangle Bracelet',
    price: 65.00,
    originalPrice: null,
    image: '/images/products/enamel-bracelet.jpg',
    isFeatured: false,
    condition: 'Excellent',
    isNew: false,
    sellerId: 'emma123',
    sellerName: 'Emma Johnson',
    sellerVerificationType: 'business'
  },
  {
    id: 'hat-pin',
    title: 'Antique Hat Pin with Pearl Detail',
    price: 28.50,
    originalPrice: 35.00,
    image: '/images/products/hat-pin.jpg',
    isFeatured: false,
    condition: 'Good',
    isNew: false,
    sellerId: 'regular789',
    sellerName: 'Jessica Taylor',
    sellerVerificationType: undefined
  }
];

// Mock data for similar marketplaces
const similarMarketplaces: SimilarMarketplace[] = [
  {
    id: 'vintage-clothing',
    name: 'Timeless Vintage Clothing',
    description: 'Curated collection of vintage clothing from the 1950s to the 1990s, featuring designer pieces and everyday wear.',
    logo: '/images/marketplaces/vintage-clothing-logo.jpg',
    banner: '/images/marketplaces/vintage-clothing-banner.jpg',
    members: '3.2k',
    listings: '5.1k',
    categories: ['Vintage', 'Clothing', 'Fashion', 'Accessories'],
    rating: 4.8
  },
  {
    id: 'antique-treasures',
    name: 'Antique Treasures',
    description: 'Rare and authentic antique collectibles, furniture, and decorative arts from around the world.',
    logo: '/images/marketplaces/antique-treasures-logo.jpg',
    banner: '/images/marketplaces/antique-treasures-banner.jpg',
    members: '2.8k',
    listings: '3.4k',
    categories: ['Antiques', 'Collectibles', 'Home Decor'],
    rating: 4.7,
    isLive: true
  },
  {
    id: 'artisan-jewelry',
    name: 'Artisan Jewelry Collective',
    description: 'Handcrafted jewelry made by independent artisans using traditional techniques and sustainable materials.',
    logo: '/images/marketplaces/artisan-jewelry-logo.jpg',
    banner: '/images/marketplaces/artisan-jewelry-banner.jpg',
    members: '1.9k',
    listings: '4.2k',
    categories: ['Jewelry', 'Handmade', 'Artisanal'],
    rating: 4.9
  },
  {
    id: 'luxury-accessories',
    name: 'Luxury Accessories Exchange',
    description: 'Authenticated pre-owned luxury accessories from top designers at a fraction of retail prices.',
    logo: '/images/marketplaces/luxury-accessories-logo.jpg',
    banner: '/images/marketplaces/luxury-accessories-banner.jpg',
    members: '6.5k',
    listings: '8.7k',
    categories: ['Luxury', 'Designer', 'Bags', 'Accessories'],
    rating: 4.6
  }
];

// Mock data for reviews
const sampleReviews: Review[] = [
  {
    id: 'review-1',
    user: {
      name: 'Sarah M.',
      avatar: '/images/avatars/sarah.jpg',
      purchaseCount: 3
    },
    rating: 5,
    date: '2 weeks ago',
    content: "I purchased a beautiful Art Deco bracelet from this marketplace and couldn't be happier! The description was accurate, shipping was fast, and the item arrived carefully packaged. Emma was responsive to all my questions and even included a personal note with care instructions. Will definitely shop here again!",
    images: ['/images/reviews/review-1-1.jpg', '/images/reviews/review-1-2.jpg'],
    helpfulCount: 8,
    isHelpful: false
  },
  {
    id: 'review-2',
    user: {
      name: 'Michael L.',
      avatar: '/images/avatars/michael.jpg',
      purchaseCount: 1
    },
    rating: 4,
    date: '1 month ago',
    content: 'Bought a vintage brooch as a gift for my mother and she loved it. The quality was excellent and it looked even better in person. The only reason for 4 stars instead of 5 is that shipping took a bit longer than expected, but it was during holiday season so understandable.',
    helpfulCount: 5,
    isHelpful: false
  },
  {
    id: 'review-3',
    user: {
      name: 'Jennifer K.',
      avatar: '/images/avatars/jennifer.jpg',
      purchaseCount: 7
    },
    rating: 5,
    date: '2 months ago',
    content: "I've purchased multiple items from this marketplace and have always been impressed with the quality and authenticity. Emma has an incredible eye for unique pieces and provides detailed information about each item's history and condition. Highly recommend to any vintage jewelry enthusiast!",
    images: ['/images/reviews/review-3-1.jpg'],
    helpfulCount: 12,
    isHelpful: false
  },
  {
    id: 'review-4',
    user: {
      name: 'David R.',
      avatar: '/images/avatars/david.jpg',
      purchaseCount: 2
    },
    rating: 3,
    date: '3 months ago',
    content: 'The earrings I purchased were beautiful and as described, but one of the posts was slightly bent. Emma was quick to respond to my message and offered a partial refund or return. I decided to keep them and have them fixed locally. Good customer service, but wish the issue had been caught before shipping.',
    helpfulCount: 3,
    isHelpful: false
  },
  {
    id: 'review-5',
    user: {
      name: 'Alexandra T.',
      avatar: '/images/avatars/alexandra.jpg',
      purchaseCount: 5
    },
    rating: 5,
    date: '4 months ago',
    content: "This marketplace is a treasure trove for vintage jewelry lovers! I've found pieces here that I couldn't find anywhere else, and the prices are fair for the quality and rarity. Emma provides excellent historical context for each piece, which adds to the enjoyment of owning them.",
    images: ['/images/reviews/review-5-1.jpg'],
    helpfulCount: 9,
    isHelpful: false
  }
];

export default function MarketplacePage() {
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sortOption, setSortOption] = useState('featured');
  const [currentView, setCurrentView] = useState<'shop' | 'about' | 'reviews'>('shop');
  
  // State for marketplace data and loading
  const [marketplace, setMarketplace] = useState<Marketplace | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasMore: false
  });
  
  // Determine the current view based on the URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'about') {
      setCurrentView('about');
    } else if (tab === 'reviews') {
      setCurrentView('reviews');
    } else {
      setCurrentView('shop');
    }
  }, [searchParams]);
  
  // Function to change tabs
  const handleTabChange = (tab: 'shop' | 'about' | 'reviews') => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (tab === 'shop') {
      newParams.delete('tab'); // Default tab doesn't need parameter
    } else {
      newParams.set('tab', tab);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };
  
  // Fetch marketplace data
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        setIsLoading(true);
        
        // Get the slug from params.id
        const slug = params.id;
        
        // Fetch marketplace data
        const marketResponse = await fetch(`/api/markets/${slug}`);
        
        if (!marketResponse.ok) {
          throw new Error('Failed to fetch marketplace data');
        }
        
        const marketData = await marketResponse.json();
        
        // Transform data to match our interface
        const transformedMarketplace: Marketplace = {
          id: marketData.id,
          name: marketData.name,
          description: marketData.description,
          longDescription: marketData.long_description || '',
          establishedDate: marketData.established_date || new Date().toISOString(),
          logo: marketData.logo_url || '/images/marketplaces/default-logo.png',
          banner: marketData.banner_url || '/images/marketplaces/default-banner.jpg',
          members: marketData.stats?.sellerCount?.toString() || '0',
          listings: marketData.stats?.productCount?.toString() || '0',
          followers: '0', // This might need to be added to the API
          owner: {
            id: marketData.owner_id,
            name: '', // We need to fetch this separately or add to API
            avatar: '',
            joinedDate: marketData.created_at,
            location: '',
            bio: '',
            totalSales: 0,
            responseRate: 0,
            responseTime: '',
            lastActive: '',
            lat: 0,
            lng: 0
          },
          sellers: [], // This would need to be fetched separately
          categories: marketData.categories?.map((cat: any) => cat.name) || [],
          socialLinks: marketData.social_links || {
            instagram: '',
            twitter: '',
            website: ''
          },
          policies: marketData.policies || {
            shipping: { title: 'Shipping', content: '' },
            returns: { title: 'Returns & Exchanges', content: '' },
            payments: { title: 'Payment Methods', content: '' }
          },
          faqs: marketData.faqs?.map((faq: any) => ({
            question: faq.question,
            answer: faq.answer
          })) || []
        };
        
        setMarketplace(transformedMarketplace);
        
        // Fetch products for this marketplace
        const productsResponse = await fetch(`/api/markets/${slug}/products?page=1&limit=20`);
        
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch marketplace products');
        }
        
        const productsData = await productsResponse.json();
        
        // Transform product data to match our interface
        const transformedProducts: Product[] = productsData.products.map((product: any) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.images[0],
          isFeatured: product.status === 'featured',
          condition: product.condition,
          isNew: product.condition === 'new',
          sellerId: product.seller_id,
          sellerName: product.seller.name,
          sellerVerificationType: product.seller.business_type as 'parent' | 'business' | undefined
        }));
        
        setProducts(transformedProducts);
        setPagination(productsData.pagination);
      } catch (error) {
        console.error('Error fetching marketplace data:', error);
        // In case of error, use sample data (optional, could show error instead)
        setMarketplace(sampleMarketplace);
        setProducts(sampleProducts);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMarketplaceData();
  }, [params.id]);
  
  // Function to handle page changes
  const handlePageChange = async (page: number) => {
    try {
      setIsLoading(true);
      
      // Get the slug from params.id
      const slug = params.id;
      
      // Construct the API URL with sorting params if needed
      let apiUrl = `/api/markets/${slug}/products?page=${page}&limit=20`;
      
      // Add sorting parameters
      if (sortOption === 'price-low') {
        apiUrl += '&sortBy=price&sortOrder=asc';
      } else if (sortOption === 'price-high') {
        apiUrl += '&sortBy=price&sortOrder=desc';
      } else if (sortOption === 'newest') {
        apiUrl += '&sortBy=created_at&sortOrder=desc';
      }
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Transform product data
      const transformedProducts: Product[] = data.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice || null,
        image: product.images[0],
        isFeatured: product.status === 'featured',
        condition: product.condition,
        isNew: product.condition === 'new',
        sellerId: product.seller_id,
        sellerName: product.seller.name,
        sellerVerificationType: product.seller.business_type as 'parent' | 'business' | undefined
      }));
      
      setProducts(transformedProducts);
      setPagination(data.pagination);
      
      // Scroll to top of products section
      window.scrollTo({
        top: document.querySelector('.product-list-section')?.getBoundingClientRect().top as number + window.scrollY - 100,
        behavior: 'smooth',
      });
    } catch (error) {
      console.error('Error fetching page data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sort change
  const handleSortChange = (newSortOption: string) => {
    setSortOption(newSortOption);
    // Reset to page 1 when sort changes and fetch new data
    handlePageChange(1);
  };
  
  // Get featured products
  const featuredProducts = products.filter(product => product.isFeatured);
  
  // Sort function for products
  const getSortedProducts = () => {
    const nonFeaturedProducts = products.filter(product => !product.isFeatured);
    
    switch(sortOption) {
      case 'price-low':
        return [...nonFeaturedProducts].sort((a, b) => a.price - b.price);
      case 'price-high':
        return [...nonFeaturedProducts].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...nonFeaturedProducts].sort((a, b) => a.isNew ? -1 : 1);
      default:
        return nonFeaturedProducts;
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main>
        <div className="h-64 bg-gray-200 animate-pulse"></div>
        <div className="container-custom py-8">
          <div className="h-8 bg-gray-200 animate-pulse w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                <div className="h-64 bg-gray-300 animate-pulse"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 animate-pulse w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (!marketplace) {
    return (
      <main>
        <div className="container-custom py-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Marketplace Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the marketplace you're looking for.</p>
            <Link href="/marketplaces" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Browse Marketplaces
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Calculate review stats for the reviews component
  const overallRating = sampleReviews.reduce((sum, review) => sum + review.rating, 0) / sampleReviews.length;
  const reviewCount = sampleReviews.length;
  const ratingBreakdown: RatingBreakdown = {
    5: sampleReviews.filter(review => review.rating === 5).length,
    4: sampleReviews.filter(review => review.rating === 4).length,
    3: sampleReviews.filter(review => review.rating === 3).length,
    2: sampleReviews.filter(review => review.rating === 2).length,
    1: sampleReviews.filter(review => review.rating === 1).length,
  };
  
  return (
    <main>
      <MarketplaceHeader 
        marketplace={marketplace} 
        currentView={currentView}
        onTabChange={handleTabChange}
      />
      
      {/* Conditional rendering based on current view */}
      {currentView === 'shop' && (
        <>
          {/* Featured Products Section */}
          {featuredProducts.length > 0 && (
            <section className="py-12 bg-white">
              <div className="container-custom">
                <h2 className="text-2xl font-bold mb-6">Featured Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {featuredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          )}
          
          {/* All Products Section */}
          <section className="py-12 bg-gray-50 product-list-section">
            <div className="container-custom">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">All Items</h2>
                <div className="mt-4 md:mt-0">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-600 mr-2">Sort by:</label>
                  <select
                    id="sort"
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="featured">Featured</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
              
              {/* Products grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
                      <div className="h-64 bg-gray-300 animate-pulse"></div>
                      <div className="p-4">
                        <div className="h-6 bg-gray-200 animate-pulse w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 animate-pulse w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {getSortedProducts().map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
              
              {/* No products message */}
              {!isLoading && products.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No products found in this marketplace yet.</p>
                  <Link href="/marketplace" className="text-blue-600 hover:underline">
                    Browse other marketplaces
                  </Link>
                </div>
              )}
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="inline-flex" role="navigation" aria-label="Pagination Navigation">
                    {Array.from({ length: pagination.totalPages }).map((_, index) => (
                      <button
                        key={index}
                        className={`px-3 py-1 mx-1 rounded ${
                          pagination.currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => handlePageChange(index + 1)}
                        disabled={isLoading}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </section>
          
          {/* Quick About Section (Preview) */}
          <section className="py-12 bg-white">
            <div className="container-custom">
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex flex-col md:flex-row justify-between items-start">
                  <div className="mb-6 md:mb-0 md:max-w-2xl">
                    <h2 className="text-2xl font-bold mb-4">About {marketplace.name}</h2>
                    <div className="prose max-w-none">
                      <p className="mb-4">
                        {marketplace.description}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleTabChange('about')}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </section>
          
          {/* Similar Marketplaces */}
          <SimilarMarketplaces
            currentMarketplaceId={marketplace.id}
            category={marketplace.categories[0]}
            marketplaces={similarMarketplaces}
          />
        </>
      )}
      
      {currentView === 'about' && (
        <MarketplaceAbout
          marketplaceId={marketplace.id}
          marketplaceName={marketplace.name}
          description={marketplace.description}
          longDescription={marketplace.longDescription}
          establishedDate={marketplace.establishedDate}
          seller={marketplace.owner}
          sellers={marketplace.sellers}
          policies={marketplace.policies}
          faqs={marketplace.faqs}
        />
      )}
      
      {currentView === 'reviews' && (
        <>
          <MarketplaceReviews
            marketplaceId={marketplace.id}
            marketplaceName={marketplace.name}
            overallRating={overallRating}
            reviewCount={reviewCount}
            ratingBreakdown={ratingBreakdown}
            reviews={sampleReviews}
          />
          
          {/* Similar Marketplaces */}
          <SimilarMarketplaces
            currentMarketplaceId={marketplace.id}
            category={marketplace.categories[0]}
            marketplaces={similarMarketplaces}
          />
        </>
      )}
    </main>
  );
}

// Product Card Component - simpler version just for this page
function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 bg-gray-200">
          {product.image ? (
            <Image 
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <span className="bg-primary text-white text-xs font-bold px-2 py-1 rounded">New</span>
            )}
            {product.originalPrice && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>
          
          {/* Add verification badge to top right corner */}
          {product.sellerVerificationType && (
            <div className="absolute top-2 right-2">
              <VerifiedBadge
                type={product.sellerVerificationType}
                size="sm"
              />
            </div>
          )}
          
          <div className="absolute bottom-2 left-2">
            <span className="bg-white text-gray-800 text-xs font-medium px-2 py-1 rounded">
              {product.condition}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-gray-800 font-medium text-lg mb-1 line-clamp-1">{product.title}</h3>
          
          {/* Add seller info below product title */}
          <div className="flex items-center mb-2">
            <span className="text-xs text-gray-500">Sold by </span>
            <span className="text-xs text-gray-700 font-medium ml-1">{product.sellerName}</span>
            {product.sellerVerificationType && (
              <div className="ml-1">
                <VerifiedBadge
                  type={product.sellerVerificationType}
                  size="sm"
                />
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gray-900 font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-gray-500 text-sm line-through ml-2">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <button className="text-primary hover:text-primary-dark focus:outline-none">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
} 