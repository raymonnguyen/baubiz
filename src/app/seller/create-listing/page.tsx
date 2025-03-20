'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Define types for the form data
interface ListingFormData {
  title: string;
  description: string;
  category: string;
  condition: string;
  price: string;
  quantity: string;
  shipping: string;
  images: File[];
  marketplace: string;
  tags: string[];
  isVintage: boolean;
  vintage: {
    era: string;
    originalPrice: string;
    brand: string;
  };
}

export default function CreateListingPage() {
  const { isAuthenticated, showAuthModal } = useAuth();
  const router = useRouter();
  
  // Mock data for marketplaces the user owns or is part of
  const mockMarketplaces = [
    { id: '1', name: 'Vintage Treasures' },
    { id: '2', name: 'Handmade Baby Items' },
    { id: '3', name: 'Kids Collectibles' }
  ];
  
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    category: '',
    condition: 'used',
    price: '',
    quantity: '1',
    shipping: 'seller',
    images: [],
    marketplace: mockMarketplaces[0]?.id || '',
    tags: [],
    isVintage: false,
    vintage: {
      era: '',
      originalPrice: '',
      brand: ''
    }
  });
  
  const [newTag, setNewTag] = useState('');
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // If not authenticated, show auth modal
  useEffect(() => {
    if (!isAuthenticated) {
      showAuthModal('login');
    }
  }, [isAuthenticated, showAuthModal]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      if (parent === 'vintage') {
        setFormData(prev => ({
          ...prev,
          vintage: {
            ...prev.vintage,
            [child]: value
          }
        }));
      }
    } else if (name === 'isVintage') {
      setFormData(prev => ({
        ...prev,
        isVintage: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...newPreviews]);
    }
  };
  
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    
    // Also remove the preview
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would normally send the data to your API
      console.log('Submitting form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to the listings page after success
      router.push('/seller/dashboard?tab=listings');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <main className="bg-gray-50 min-h-screen pb-16">
      <div className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold">Create New Listing</h1>
          <p className="mt-1 opacity-90">Add a new item to your marketplace</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
            {/* Basic information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Item Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="E.g., Vintage 1950s Fisher Price Pull Toy"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your item, including details about condition, measurements, etc."
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select a category</option>
                      <option value="toys">Toys & Games</option>
                      <option value="clothing">Children's Clothing</option>
                      <option value="furniture">Nursery & Furniture</option>
                      <option value="books">Books & Educational</option>
                      <option value="vintage">Vintage & Collectibles</option>
                      <option value="handmade">Handmade Items</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Condition <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="new">New with tags</option>
                      <option value="like-new">Like new</option>
                      <option value="excellent">Excellent used condition</option>
                      <option value="good">Good used condition</option>
                      <option value="fair">Fair condition</option>
                      <option value="used">Used</option>
                      <option value="for-parts">For parts/not working</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Images section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Images</h2>
              
              <div className="mb-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative w-24 h-24 border rounded-md overflow-hidden group">
                      <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <span className="sr-only">Remove</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {formData.images.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="text-xs text-gray-500 mt-1">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        multiple
                      />
                    </label>
                  )}
                </div>
                
                <p className="text-sm text-gray-500">
                  Add up to 5 images. First image will be the cover (main) image. You can drag to reorder.
                </p>
              </div>
            </div>
            
            {/* Pricing and inventory */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity Available <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Shipping */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost Paid By</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="seller"
                        checked={formData.shipping === 'seller'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Free Shipping (I'll pay)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="shipping"
                        value="buyer"
                        checked={formData.shipping === 'buyer'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Buyer pays shipping</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Marketplace selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Marketplace</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="marketplace" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Marketplace <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="marketplace"
                    name="marketplace"
                    value={formData.marketplace}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select a marketplace</option>
                    {mockMarketplaces.map(marketplace => (
                      <option key={marketplace.id} value={marketplace.id}>
                        {marketplace.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Vintage specific */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="isVintage"
                  name="isVintage"
                  checked={formData.isVintage}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="isVintage" className="ml-2 text-xl font-semibold text-gray-800">
                  This is a vintage item
                </label>
              </div>
              
              {formData.isVintage && (
                <div className="space-y-4 pl-6 border-l-2 border-indigo-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="vintage.era" className="block text-sm font-medium text-gray-700 mb-1">
                        Era/Decade
                      </label>
                      <select
                        id="vintage.era"
                        name="vintage.era"
                        value={formData.vintage.era}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select era</option>
                        <option value="1950s">1950s</option>
                        <option value="1960s">1960s</option>
                        <option value="1970s">1970s</option>
                        <option value="1980s">1980s</option>
                        <option value="1990s">1990s</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="vintage.brand" className="block text-sm font-medium text-gray-700 mb-1">
                        Brand/Manufacturer
                      </label>
                      <input
                        type="text"
                        id="vintage.brand"
                        name="vintage.brand"
                        value={formData.vintage.brand}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="E.g., Fisher Price, Mattel"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="vintage.originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price (if known)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="vintage.originalPrice"
                        name="vintage.originalPrice"
                        value={formData.vintage.originalPrice}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Original price when new"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tags */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tags</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                    Add Tags (helps buyers find your item)
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="newTag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="E.g., wooden, educational, rare"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-indigo-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit section */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Link
                href="/seller/dashboard"
                className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
              >
                Cancel
              </Link>
              
              <div className="space-x-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Listing'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
} 