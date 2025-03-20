'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Sample data for marketplace displays
const MARKETPLACES = [
  {
    id: 1,
    name: "Vintage Treasures",
    description: "Curated collection of classic and retro items from the 60s-90s",
    image: "/images/marketplace-vintage.jpg", // Replace with actual image
    sellers: 126,
    rating: 4.8,
    items: 1240,
  },
  {
    id: 2,
    name: "Mid-Century Modern",
    description: "Authentic furniture and decor from the iconic design era",
    image: "/images/marketplace-midcentury.jpg", // Replace with actual image
    sellers: 84,
    rating: 4.9,
    items: 890,
  },
  {
    id: 3,
    name: "Handcrafted Goods",
    description: "Artisan-made products with exceptional craftsmanship",
    image: "/images/marketplace-handcrafted.jpg", // Replace with actual image
    sellers: 215,
    rating: 4.7,
    items: 1875,
  },
];

const MarketplaceCard = ({ marketplace }: { marketplace: typeof MARKETPLACES[0] }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {/* Image container with overlay */}
      <div className="relative h-48 overflow-hidden">
        {/* Placeholder gradient if no image */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
          <div className="text-4xl">{marketplace.name.charAt(0)}</div>
        </div>
        
        {/* Uncomment when you have actual images */}
        {/* <Image 
          src={marketplace.image} 
          alt={marketplace.name} 
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        /> */}
        
        {/* Premium overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-70"></div>
        
        {/* Marketplace name */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white">{marketplace.name}</h3>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <p className="text-gray-600 text-sm mb-4">{marketplace.description}</p>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-600">{marketplace.sellers}</p>
            <p className="text-xs text-gray-500">Sellers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <p className="text-lg font-bold text-indigo-600 mr-1">{marketplace.rating}</p>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4F46E5" />
              </svg>
            </div>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-indigo-600">{marketplace.items.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Items</p>
          </div>
        </div>
        
        {/* CTA */}
        <Link 
          href={`/marketplace/${marketplace.id}`}
          className="block w-full py-2.5 px-4 text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          View Marketplace
        </Link>
      </div>
      
      {/* Premium corner effect */}
      <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-yellow-400 to-orange-500 transform rotate-45 translate-x-6 -translate-y-6"></div>
    </motion.div>
  );
};

export default function MarketplaceShowcase() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-pattern-dots opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Join thriving marketplaces
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Connect with established communities or create your own specialized marketplace. Build your reputation and grow your business with like-minded sellers.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MARKETPLACES.map(marketplace => (
            <MarketplaceCard key={marketplace.id} marketplace={marketplace} />
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link 
            href="/marketplace"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            Explore all marketplaces
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </motion.div>
      </div>
      
      {/* Testimonial */}
      <motion.div 
        className="relative max-w-lg mx-auto mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-100">
            <path d="M36 60C36 46.8 46.8 36 60 36C73.2 36 84 46.8 84 60C84 73.2 73.2 84 60 84C46.8 84 36 73.2 36 60ZM0 60C0 26.9 26.9 0 60 0C93.1 0 120 26.9 120 60C120 93.1 93.1 120 60 120C26.9 120 0 93.1 0 60Z" fill="currentColor"/>
          </svg>
        </div>
        
        <div className="flex items-center mb-6">
          <div className="h-14 w-14 rounded-full bg-gray-200 mr-4 overflow-hidden">
            {/* Replace with actual seller image */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900">Jessica Chen</h4>
            <div className="flex items-center">
              <p className="text-sm text-gray-500 mr-2">Vintage Treasures Market</p>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4F46E5" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 italic mb-6">
          "Joining Mom Marketplace changed everything for my vintage business. I went from selling a few items a month on generic platforms to connecting with collectors who truly value what I offer. The community aspect makes all the difference."
        </p>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Seller since 2022</span>
          <span className="font-medium text-indigo-600">+186% sales growth</span>
        </div>
      </motion.div>
    </section>
  );
} 