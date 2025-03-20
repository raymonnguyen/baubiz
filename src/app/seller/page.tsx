// src/app/seller/page.tsx
'use client';

import { useState } from 'react';
import EnhancedSellerHero from '@/components/seller/EnhancedSellerHero';
import MarketplaceShowcase from '@/components/seller/MarketplaceShowcase';
import PremiumFeatures from '@/components/seller/PremiumFeatures';
import { useAuth } from '@/contexts/AuthContext';

export default function SellerLandingPage() {
  const { isAuthenticated, showAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');

  const handleGetStarted = () => {
    if (!isAuthenticated) {
      showAuthModal('signup');
    } else {
      // Redirect to the appropriate page based on active tab
      window.location.href = activeTab === 'join' 
        ? '/marketplace?filter=join' 
        : '/seller/create-marketplace';
    }
  };

  return (
    <main className="bg-white min-h-screen">
      {/* Enhanced Hero Section */}
      <EnhancedSellerHero 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleGetStarted={handleGetStarted}
      />
      
      {/* Premium Features Section */}
      <PremiumFeatures />
      
      {/* Marketplace Showcase Section */}
      <MarketplaceShowcase />
      
      {/* Enhanced CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Premium Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900"></div>
        
        {/* Animated Accents */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-purple-500 to-pink-500"></div>
          <div className="absolute left-1/4 top-20 w-64 h-64 rounded-full bg-purple-700 mix-blend-screen filter blur-3xl opacity-40 animate-blob"></div>
          <div className="absolute right-1/3 top-30 w-80 h-80 rounded-full bg-teal-700 mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
          <div className="absolute left-1/2 bottom-20 w-72 h-72 rounded-full bg-indigo-700 mix-blend-screen filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Start your journey today
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of sellers who are creating thriving communities and businesses around vintage and specialty items.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-5">
              <a href="/seller/create-marketplace" className="group relative overflow-hidden rounded-xl bg-white px-8 py-4 text-indigo-900 font-medium hover:shadow-xl transition-all duration-300">
                <span className="relative z-10">Create Market</span>
                <div className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-teal-100 to-white group-hover:scale-y-100 transition-transform duration-500"></div>
              </a>
              
              <a href="/marketplace?filter=join" className="group relative overflow-hidden rounded-xl bg-transparent border-2 border-white/30 px-8 py-4 text-white font-medium hover:border-white/60 transition-all duration-300">
                <span className="relative z-10">Start Selling</span>
                <div className="absolute inset-0 origin-bottom scale-y-0 bg-white/10 group-hover:scale-y-100 transition-transform duration-500"></div>
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Add CSS animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .bg-grid-white {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/svg%3E");
        }
        
        .bg-pattern-dots {
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
    </main>
  );
}
