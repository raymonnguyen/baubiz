'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Define types for the form data
interface PolicyData {
  shipping: string;
  returns: string;
  payments: string;
}

interface MarketplaceFormData {
  name: string;
  description: string;
  category: string;
  logo: File | null;
  banner: File | null;
  policies: PolicyData;
  rules: string;
  commission: number;
}

export default function CreateMarketplacePage() {
  const { isAuthenticated, showAuthModal } = useAuth();
  const router = useRouter();
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState<MarketplaceFormData>({
    name: '',
    description: '',
    category: '',
    logo: null,
    banner: null,
    policies: {
      shipping: '',
      returns: '',
      payments: ''
    },
    rules: '',
    commission: 5
  });

  // If not authenticated, show auth modal - using useEffect instead of useState
  useEffect(() => {
    if (!isAuthenticated) {
      showAuthModal('signup');
    }
  }, [isAuthenticated, showAuthModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'policies' && (child === 'shipping' || child === 'returns' || child === 'payments')) {
        setFormData(prev => ({
          ...prev,
          policies: {
            ...prev.policies,
            [child]: value
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const nextStep = () => {
    setFormStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setFormStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would submit to an API here
    console.log('Submitting marketplace:', formData);
    
    // Simulate successful creation and redirect
    setTimeout(() => {
      router.push('/seller/dashboard');
    }, 1500);
  };

  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-indigo-600 text-white py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Create Your Marketplace</h1>
          <p className="mt-2 opacity-90">Build a community around your unique vision</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Step {formStep} of 3</span>
              <span className="text-sm font-medium text-indigo-600">{Math.round((formStep/3) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${(formStep/3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Form Steps */}
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            {formStep === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Marketplace Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="e.g., Vintage Toys Collective"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe what makes your marketplace unique..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="vintage">Vintage & Antiques</option>
                      <option value="handmade">Handmade & Crafts</option>
                      <option value="clothing">Children's Clothing</option>
                      <option value="toys">Toys & Games</option>
                      <option value="furniture">Nursery & Furniture</option>
                      <option value="educational">Educational & Books</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {formData.logo ? (
                          <img 
                            src={URL.createObjectURL(formData.logo)} 
                            alt="Logo preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          id="logo"
                          name="logo"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="logo"
                          className="inline-block bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                        >
                          Choose file
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 500x500px, JPG or PNG</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="banner" className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                    <div className="flex flex-col space-y-2">
                      <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {formData.banner ? (
                          <img 
                            src={URL.createObjectURL(formData.banner)} 
                            alt="Banner preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="banner"
                          name="banner"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <label
                          htmlFor="banner"
                          className="inline-block bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg cursor-pointer hover:bg-indigo-100 transition-colors"
                        >
                          Choose file
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Recommended: 1200x300px, JPG or PNG</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {formStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Policies & Rules</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="policies.shipping" className="block text-sm font-medium text-gray-700 mb-1">Shipping Policy</label>
                    <textarea
                      id="policies.shipping"
                      name="policies.shipping"
                      value={formData.policies.shipping}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe your marketplace's shipping expectations..."
                    />
                  </div>

                  <div>
                    <label htmlFor="policies.returns" className="block text-sm font-medium text-gray-700 mb-1">Returns & Refunds Policy</label>
                    <textarea
                      id="policies.returns"
                      name="policies.returns"
                      value={formData.policies.returns}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe your marketplace's return policy..."
                    />
                  </div>

                  <div>
                    <label htmlFor="policies.payments" className="block text-sm font-medium text-gray-700 mb-1">Payment Policy</label>
                    <textarea
                      id="policies.payments"
                      name="policies.payments"
                      value={formData.policies.payments}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Describe accepted payment methods and terms..."
                    />
                  </div>

                  <div>
                    <label htmlFor="rules" className="block text-sm font-medium text-gray-700 mb-1">Marketplace Rules</label>
                    <textarea
                      id="rules"
                      name="rules"
                      value={formData.rules}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="List any specific rules for sellers in your marketplace..."
                    />
                    <p className="text-xs text-gray-500 mt-1">These rules help maintain quality and set expectations for sellers.</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {formStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-bold mb-6">Commission & Final Details</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="commission" className="block text-sm font-medium text-gray-700 mb-1">Marketplace Commission (%)</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        id="commission"
                        name="commission"
                        min="0"
                        max="20"
                        step="0.5"
                        value={formData.commission}
                        onChange={handleInputChange}
                        className="w-full mr-4"
                      />
                      <span className="text-lg font-medium w-12 text-center">{formData.commission}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">This is the percentage fee you'll collect from each sale. The average is 5-10%.</p>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h3 className="font-medium text-yellow-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Important Information
                    </h3>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1">
                      <li>• Your marketplace will require approval before going live.</li>
                      <li>• You'll need to connect a payment method to receive your commission.</li>
                      <li>• You are responsible for ensuring your marketplace complies with our terms of service.</li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium mb-4">Review Your Marketplace Details</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="flex">
                        <span className="font-medium w-1/3">Name:</span>
                        <span className="text-gray-700">{formData.name || "Not provided"}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Category:</span>
                        <span className="text-gray-700">{formData.category || "Not selected"}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Commission:</span>
                        <span className="text-gray-700">{formData.commission}%</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Logo:</span>
                        <span className="text-gray-700">{formData.logo ? formData.logo.name : "Not uploaded"}</span>
                      </div>
                      <div className="flex">
                        <span className="font-medium w-1/3">Banner:</span>
                        <span className="text-gray-700">{formData.banner ? formData.banner.name : "Not uploaded"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                      I agree to the <Link href="/terms" className="text-indigo-600 hover:text-indigo-500">Terms of Service</Link> and <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</Link>
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="text-gray-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-8 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Create Marketplace
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Help Sidebar */}
          <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-800">Tips for Success</h3>
            <ul className="mt-3 space-y-2 text-sm text-indigo-700">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Be specific about your marketplace niche to attract the right audience.
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                High-quality images for your logo and banner create a professional impression.
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Clear marketplace rules help maintain quality and build trust with buyers.
              </li>
            </ul>
            <div className="mt-4">
              <Link 
                href="/help/marketplace-creation" 
                className="text-sm text-indigo-600 hover:text-indigo-500 flex items-center"
              >
                View marketplace creation guide
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 