'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ToastDemo() {
  const [loadingToastId, setLoadingToastId] = useState<string | null>(null);
  
  const showSuccessToast = () => {
    toast.success('Success notification!', {
      duration: 4000,
    });
  };
  
  const showErrorToast = () => {
    toast.error('Error notification!', {
      duration: 4000,
    });
  };
  
  const showInfoToast = () => {
    toast('Information notification!', {
      icon: '📢',
      duration: 4000,
    });
  };
  
  const showLoadingToast = () => {
    if (loadingToastId) {
      toast.dismiss(loadingToastId);
      setLoadingToastId(null);
      return;
    }
    
    const id = toast.loading('Loading... Please wait');
    setLoadingToastId(id);
    
    // Clear loading toast after 5 seconds for demo
    setTimeout(() => {
      toast.dismiss(id);
      toast.success('Loading completed!');
      setLoadingToastId(null);
    }, 5000);
  };
  
  const showPromiseToast = async () => {
    const promise = new Promise((resolve, reject) => {
      // Simulate an API call
      setTimeout(() => {
        // 80% chance of success for demo purposes
        if (Math.random() > 0.2) {
          resolve('Data loaded successfully!');
        } else {
          reject(new Error('Failed to load data'));
        }
      }, 3000);
    });
    
    toast.promise(promise, {
      loading: 'Loading data...',
      success: (data) => `${data}`,
      error: (err) => `${err.message}`,
    });
  };
  
  const showCustomToast = () => {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Custom Notification
              </p>
              <p className="mt-1 text-sm text-gray-500">
                This is a fully customized toast with rich content.
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary-dark focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Toast Notification Demo</h1>
        <p className="text-gray-600">
          This page demonstrates all available toast notification types using react-hot-toast
        </p>
        <div className="mt-4">
          <Link href="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-medium text-lg mb-4">Basic Toast Types</h3>
          <div className="space-y-4">
            <button
              onClick={showSuccessToast}
              className="w-full py-2 px-4 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
            >
              Success Toast
            </button>
            <button
              onClick={showErrorToast}
              className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg transition-colors"
            >
              Error Toast
            </button>
            <button
              onClick={showInfoToast}
              className="w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
            >
              Info Toast
            </button>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
          <h3 className="font-medium text-lg mb-4">Advanced Toast Types</h3>
          <div className="space-y-4">
            <button
              onClick={showLoadingToast}
              className="w-full py-2 px-4 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition-colors"
            >
              {loadingToastId ? 'Dismiss Loading Toast' : 'Loading Toast'}
            </button>
            <button
              onClick={showPromiseToast}
              className="w-full py-2 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
            >
              Promise Toast
            </button>
            <button
              onClick={showCustomToast}
              className="w-full py-2 px-4 bg-primary text-white hover:bg-primary-dark rounded-lg transition-colors"
            >
              Custom Toast
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-10 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-lg mb-4">Toast Usage in Authentication</h3>
        <p className="text-gray-700 mb-4">
          The authentication system is now integrated with toast notifications:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Success toasts are shown after successful login and signup</li>
          <li>Error toasts are displayed when authentication fails</li>
          <li>Loading toasts indicate when authentication is in progress</li>
          <li>Toast notifications are automatically dismissed after 4 seconds</li>
        </ul>
      </div>
    </div>
  );
} 