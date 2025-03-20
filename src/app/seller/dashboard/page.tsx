'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Mock data for demonstration
const mockListings = [
  {
    id: '1',
    title: 'Vintage Wooden Rocking Horse',
    price: 89.99,
    status: 'active',
    views: 127,
    favorites: 12,
    image: '/images/products/rocking-horse.jpg',
    dateAdded: '2023-10-15',
  },
  {
    id: '2',
    title: 'Antique Silver Rattle',
    price: 45.00,
    status: 'active',
    views: 43,
    favorites: 4,
    image: '/images/products/silver-rattle.jpg',
    dateAdded: '2023-10-10',
  },
  {
    id: '3',
    title: 'Handmade Baby Blanket',
    price: 35.99,
    status: 'draft',
    views: 0,
    favorites: 0,
    image: '/images/products/baby-blanket.jpg',
    dateAdded: '2023-10-18',
  }
];

const mockOrders = [
  {
    id: 'ORD-2023-001',
    customer: 'Sarah Johnson',
    date: '2023-10-17',
    total: 89.99,
    status: 'Shipped',
    items: [{ id: '1', title: 'Vintage Wooden Rocking Horse', quantity: 1 }]
  },
  {
    id: 'ORD-2023-002',
    customer: 'Michael Chang',
    date: '2023-10-16',
    total: 45.00,
    status: 'Processing',
    items: [{ id: '2', title: 'Antique Silver Rattle', quantity: 1 }]
  }
];

const mockAnalytics = {
  totalSales: 134.99,
  totalOrders: 2,
  totalViews: 170,
  conversionRate: 1.18, // percentage
  monthlyDataPoints: [
    { month: 'Oct 1', sales: 0 },
    { month: 'Oct 5', sales: 0 },
    { month: 'Oct 10', sales: 45 },
    { month: 'Oct 15', sales: 45 },
    { month: 'Oct 17', sales: 134.99 },
    { month: 'Oct 20', sales: 134.99 }
  ]
};

const mockMessages = [
  {
    id: 'msg1',
    from: 'Sarah Johnson',
    subject: 'Question about rocking horse',
    date: '2023-10-18',
    read: false
  },
  {
    id: 'msg2',
    from: 'Michael Chang',
    subject: 'Shipping inquiry',
    date: '2023-10-17',
    read: true
  }
];

export default function SellerDashboard() {
  const { isAuthenticated, showAuthModal } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('dashboard');

  // If not authenticated, show auth modal
  useEffect(() => {
    if (!isAuthenticated) {
      showAuthModal('login');
    }
  }, [isAuthenticated, showAuthModal]);

  // Helper functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Dashboard widget components
  const SalesOverviewWidget = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-4">Sales Overview</h3>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-xs text-indigo-600 uppercase font-medium">Total Sales</p>
          <p className="text-2xl font-bold text-gray-800">{formatCurrency(mockAnalytics.totalSales)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-xs text-green-600 uppercase font-medium">Orders</p>
          <p className="text-2xl font-bold text-gray-800">{mockAnalytics.totalOrders}</p>
        </div>
      </div>
      
      <div className="h-40 w-full bg-gray-50 rounded flex items-center justify-center">
        {/* Chart would go here in a real implementation */}
        <p className="text-gray-500 text-sm">Sales chart visualization</p>
      </div>
    </div>
  );

  const RecentOrdersWidget = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Recent Orders</h3>
        <Link href="/seller/orders" className="text-sm text-indigo-600 hover:text-indigo-800">
          View all
        </Link>
      </div>
      
      <div className="space-y-4">
        {mockOrders.length > 0 ? (
          mockOrders.slice(0, 3).map(order => (
            <div key={order.id} className="flex items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <p className="font-medium text-gray-800">{order.customer}</p>
                <p className="text-sm text-gray-500">{formatDate(order.date)} • {order.id}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-800">{formatCurrency(order.total)}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No orders yet</p>
        )}
      </div>
    </div>
  );

  const MessagesWidget = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Messages</h3>
        <Link href="/seller/messages" className="text-sm text-indigo-600 hover:text-indigo-800">
          View all
        </Link>
      </div>
      
      <div className="space-y-3">
        {mockMessages.length > 0 ? (
          mockMessages.map(message => (
            <div key={message.id} className="flex items-start p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
              <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${message.read ? 'bg-gray-300' : 'bg-indigo-500'}`}></div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-gray-800">{message.subject}</p>
                <p className="text-sm text-gray-500">From: {message.from} • {formatDate(message.date)}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No messages</p>
        )}
      </div>
    </div>
  );

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SalesOverviewWidget />
            </div>
            <div className="lg:col-span-1">
              <div className="space-y-6">
                <RecentOrdersWidget />
                <MessagesWidget />
              </div>
            </div>
          </div>
        );
      case 'listings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your Listings</h2>
              <Link 
                href="/seller/create-listing" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add New Listing
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Listing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stats
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            {/* Placeholder for image */}
                            <div className="h-10 w-10 bg-gray-200 flex items-center justify-center text-gray-500">Img</div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-1">
                              {listing.title}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatCurrency(listing.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status === 'active' ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>{listing.views}</span>
                          
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span>{listing.favorites}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(listing.dateAdded)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Orders</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Messages</h2>
            
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div key={message.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 flex items-center">
                      {!message.read && (
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      )}
                      {message.subject}
                    </h3>
                    <span className="text-sm text-gray-500">{formatDate(message.date)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">From: {message.from}</p>
                  <div className="mt-3 flex justify-end space-x-3">
                    <button className="text-sm text-gray-500 hover:text-gray-700">Mark as Read</button>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800">Reply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Marketplace Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Marketplace Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md" 
                      defaultValue="Vintage Treasures" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="vintage">Vintage & Antiques</option>
                      <option value="handmade">Handmade & Crafts</option>
                      <option value="clothing">Children's Clothing</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Commission Settings</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Marketplace Commission (%)</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="20" 
                    step="0.5"
                    defaultValue="5"
                    className="w-full" 
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>0%</span>
                    <span>5%</span>
                    <span>10%</span>
                    <span>15%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="bg-indigo-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Seller Dashboard</h1>
              <p className="mt-1 opacity-90">Manage your marketplace and listings</p>
            </div>
            <div>
              <Link 
                href="/seller/create-listing" 
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                + New Listing
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-1 mb-6 flex overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'listings' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Listings
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'messages' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </main>
  );
} 