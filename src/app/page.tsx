'use client';

import { Suspense } from 'react';
import Link from "next/link";
import EnhancedHeroSection from '@/components/home/EnhancedHeroSection';
import TopMarketplacesSection from '@/components/home/TopMarketplacesSection';
import toast from 'react-hot-toast';

// Create a client component to test toast notifications
function ToastTester() {
  const showTestToast = () => {
    toast.success('Toast notifications are working properly!');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={showTestToast}
        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-full shadow-lg flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Test Toast
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <EnhancedHeroSection />
      <TopMarketplacesSection />
      <HowItWorks />
      <WhyStartMarketplace />
      <NewsletterSection />
      <ToastTester />
    </main>
  );
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Create an Account',
      description: 'Sign up in seconds with your email or social accounts.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
        </svg>
      ),
    },
    {
      number: 2,
      title: 'Create Your Marketplace',
      description: 'Set up your own marketplace with custom branding and products.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
        </svg>
      ),
    },
    {
      number: 3,
      title: 'List Your Products',
      description: 'Add detailed product listings with photos and descriptions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      number: 4,
      title: 'Grow Your Community',
      description: 'Connect with buyers and other sellers to expand your audience.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
    },
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your own marketplace and start selling in minutes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link href="/auth/register" className="btn-primary px-8 py-3 inline-block rounded-full">
            Start Your Marketplace
          </Link>
        </div>
      </div>
    </section>
  );
}

// Why Start a Marketplace Section
function WhyStartMarketplace() {
  const benefits = [
    {
      icon: (
        <svg className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
        </svg>
      ),
      title: "Build Your Brand",
      description: "Create a dedicated space to showcase your products and build your unique brand identity.",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
      ),
      title: "Earn More",
      description: "Keep more of your earnings with lower fees than traditional marketplaces.",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      title: "Join a Community",
      description: "Connect with like-minded sellers and engage with customers who share your interests.",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ),
      title: "Grow Your Business",
      description: "Access powerful tools to analyze sales, manage inventory, and scale your online presence.",
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Start Your Own Marketplace?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who are building successful businesses on our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-4">Ready to showcase your products?</h3>
              <p className="text-gray-600 mb-6">
                Whether you're selling handmade items, vintage finds, or curated collections, our platform gives you the tools to succeed.
              </p>
              <Link href="/create-marketplace" className="btn-primary px-6 py-3 inline-block rounded-full">
                Create Your Marketplace
              </Link>
            </div>
            <div className="md:w-1/2 bg-gradient-to-r from-gray-100 to-gray-200 flex items-center justify-center p-8">
              <div className="text-6xl">🛍️</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Newsletter Section
function NewsletterSection() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Our Marketplace Community
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Sign up for our newsletter to receive updates on new features, seller success stories, and platform tips.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-full focus:outline-none text-gray-800"
              required
            />
            <button 
              type="submit"
              className="bg-white text-primary font-bold px-6 py-3 rounded-full hover:bg-opacity-90 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p className="mt-4 text-sm opacity-80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
