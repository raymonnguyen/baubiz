'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Sample activity data - in a real app, this would come from an API
const sampleActivities = [
  { id: 1, user: { name: 'Sarah', image: '/images/avatars/sarah.jpg' }, action: 'purchased', item: 'Baby Carrier', time: '2 mins ago', actionColor: 'bg-green-500' },
  { id: 2, user: { name: 'Michael', image: '/images/avatars/michael.jpg' }, action: 'listed', item: 'Crib Mobile', time: '5 mins ago', actionColor: 'bg-blue-500' },
  { id: 3, user: { name: 'Emma', image: '/images/avatars/emma.jpg' }, action: 'saved', item: 'Nursing Chair', time: '7 mins ago', actionColor: 'bg-pink-500' },
  { id: 4, user: { name: 'David', image: '/images/avatars/david.jpg' }, action: 'messaged', item: 'about Stroller', time: '12 mins ago', actionColor: 'bg-purple-500' },
  { id: 5, user: { name: 'Jessica', image: '/images/avatars/jessica.jpg' }, action: 'reviewed', item: 'Baby Monitor', time: '15 mins ago', actionColor: 'bg-yellow-500' },
  { id: 6, user: { name: 'Alex', image: '/images/avatars/alex.jpg' }, action: 'offered', item: 'on Changing Table', time: '18 mins ago', actionColor: 'bg-teal-500' },
];

const ActivityFeed = () => {
  const [activities, setActivities] = useState(sampleActivities.slice(0, 3));
  const [currentIndex, setCurrentIndex] = useState(3);
  
  // Rotate activities to create a live feed effect
  useEffect(() => {
    const interval = setInterval(() => {
      setActivities(prev => {
        const newActivities = [...prev];
        newActivities.pop(); // Remove the last one
        
        // Add a new one at the beginning, cycling through our sample data
        const nextActivity = sampleActivities[currentIndex % sampleActivities.length];
        newActivities.unshift({...nextActivity, id: nextActivity.id + currentIndex}); // Ensure unique id
        
        setCurrentIndex(prev => prev + 1);
        return newActivities;
      });
    }, 5000); // Change every 5 seconds
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section className="py-12 bg-gray-50/80 overflow-hidden">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Our Community Right Now</h2>
        <p className="text-text-light text-center mb-8">Join thousands of parents connecting every day</p>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Activity bubbles */}
          <div className="relative h-24 md:h-20 overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100">
            <AnimatePresence>
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className={`absolute inset-x-0 p-4 ${index === 0 ? 'z-10' : 'z-0'}`}
                  style={{ top: index === 0 ? '0' : '-100%' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* User avatar */}
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                        {/* Uncomment when you have real images */}
                        {/* <Image
                          src={activity.user.image}
                          alt={activity.user.name}
                          fill
                          className="object-cover"
                        /> */}
                      </div>
                      {/* Activity indicator */}
                      <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full ${activity.actionColor} border-2 border-white flex items-center justify-center`}>
                        <ActivityIcon action={activity.action} />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <p className="text-text font-medium">
                        <span className="font-semibold">{activity.user.name}</span>
                        {' '}
                        <span className="text-text-light">{activity.action}</span>
                        {' '}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-text-lighter">{activity.time}</p>
                    </div>
                    
                    <div className="hidden md:block">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                        {getActionLabel(activity.action)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {/* Community stats */}
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center mt-8">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">15,000+</p>
              <p className="text-sm text-text-light">Active Parents</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">25,000+</p>
              <p className="text-sm text-text-light">Items Exchanged</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">$500,000+</p>
              <p className="text-sm text-text-light">Saved by Families</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-primary">98%</p>
              <p className="text-sm text-text-light">Positive Ratings</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivityFeed;

// Helper functions
const ActivityIcon = ({ action }: { action: string }) => {
  switch (action) {
    case 'purchased':
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    case 'listed':
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      );
    case 'saved':
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
        </svg>
      );
    case 'messaged':
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      );
    case 'reviewed':
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    case 'offered':
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    default:
      return (
        <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
      );
  }
};

const getActionLabel = (action: string): string => {
  switch (action) {
    case 'purchased':
      return 'New Purchase';
    case 'listed':
      return 'New Listing';
    case 'saved':
      return 'Saved Item';
    case 'messaged':
      return 'New Message';
    case 'reviewed':
      return 'New Review';
    case 'offered':
      return 'New Offer';
    default:
      return 'Activity';
  }
}; 