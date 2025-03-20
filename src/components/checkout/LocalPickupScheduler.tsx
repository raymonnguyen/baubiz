'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define available time slots
const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
  '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
  '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM',
  '7:00 PM', '7:30 PM'
];

// Safe public meeting places
const SAFE_LOCATIONS = [
  { id: 'police', name: 'Police Station Parking Lot', address: 'Safe exchange zone', isSafe: true },
  { id: 'library', name: 'Public Library', address: 'Main entrance', isSafe: true },
  { id: 'mall', name: 'Shopping Mall', address: 'Food court entrance', isSafe: true },
  { id: 'coffee', name: 'Local Coffee Shop', address: 'Indoor seating area', isSafe: true },
  { id: 'custom', name: 'Custom Location', address: '', isSafe: false },
];

interface LocalPickupSchedulerProps {
  onSchedulePickup: (pickupDetails: PickupDetails) => void;
  sellerId: string;
  sellerName: string;
  orderId: string;
}

export interface PickupDetails {
  date: string;
  timeSlot: string;
  location: {
    id: string;
    name: string;
    address: string;
    isSafe: boolean;
    customAddress?: string;
  };
  notes: string;
  contactPreference: 'app' | 'phone' | 'email';
  contactDetail?: string;
}

export default function LocalPickupScheduler({
  onSchedulePickup,
  sellerId,
  sellerName,
  orderId
}: LocalPickupSchedulerProps) {
  // Get dates for the next 7 days
  const getNextSevenDays = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(date);
      
      const isoDate = date.toISOString().split('T')[0];
      
      dates.push({
        date: formattedDate,
        isoDate,
        isToday: i === 0,
        isTomorrow: i === 1,
      });
    }
    
    return dates;
  };
  
  const availableDates = getNextSevenDays();
  
  // State for pickup details
  const [selectedDate, setSelectedDate] = useState(availableDates[0].isoDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(SAFE_LOCATIONS[0]);
  const [customAddress, setCustomAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [contactPreference, setContactPreference] = useState<'app' | 'phone' | 'email'>('app');
  const [contactDetail, setContactDetail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState(TIME_SLOTS);
  
  // In a real app, you would fetch available time slots based on seller availability
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        // Simulate API call to get seller availability
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Randomize some time slots as unavailable
        const mockAvailable = TIME_SLOTS.filter(() => Math.random() > 0.3);
        setAvailableTimeSlots(mockAvailable);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        setAvailableTimeSlots(TIME_SLOTS);
      }
    };
    
    fetchAvailableTimeSlots();
  }, [selectedDate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTimeSlot) {
      setError('Please select a time slot');
      return;
    }
    
    if (selectedLocation.id === 'custom' && !customAddress) {
      setError('Please enter a custom address');
      return;
    }
    
    if (contactPreference !== 'app' && !contactDetail) {
      setError('Please provide contact details');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Create pickup details object
      const pickupDetails: PickupDetails = {
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        location: {
          ...selectedLocation,
          customAddress: selectedLocation.id === 'custom' ? customAddress : undefined,
        },
        notes,
        contactPreference,
        contactDetail: contactPreference !== 'app' ? contactDetail : undefined,
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onSchedulePickup prop
      onSchedulePickup(pickupDetails);
    } catch (error) {
      setError('Failed to schedule pickup. Please try again.');
      console.error('Error scheduling pickup:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a date
        </label>
        <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
          {availableDates.map((date) => (
            <button
              key={date.isoDate}
              type="button"
              onClick={() => setSelectedDate(date.isoDate)}
              className={`py-3 px-2 text-center rounded-lg border text-sm transition-colors ${
                selectedDate === date.isoDate
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">
                {date.isToday ? 'Today' : date.isTomorrow ? 'Tomorrow' : date.date.split(',')[0]}
              </div>
              <div className="text-xs mt-1 opacity-80">
                {date.date.split(',')[1].trim()}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a time
        </label>
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-2">
          {TIME_SLOTS.map((timeSlot) => {
            const isAvailable = availableTimeSlots.includes(timeSlot);
            return (
              <button
                key={timeSlot}
                type="button"
                disabled={!isAvailable}
                onClick={() => isAvailable && setSelectedTimeSlot(timeSlot)}
                className={`py-2 px-3 rounded-lg border text-sm ${
                  !isAvailable
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : selectedTimeSlot === timeSlot
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {timeSlot}
              </button>
            );
          })}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select a location
        </label>
        <div className="space-y-2">
          {SAFE_LOCATIONS.map((location) => (
            <div key={location.id}>
              <label className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="location"
                  value={location.id}
                  checked={selectedLocation.id === location.id}
                  onChange={() => setSelectedLocation(location)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">
                    {location.name}
                    {location.isSafe && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Safe Location
                      </span>
                    )}
                  </div>
                  {location.address && (
                    <p className="text-sm text-gray-500">{location.address}</p>
                  )}
                  {location.id === 'custom' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        value={customAddress}
                        onChange={(e) => setCustomAddress(e.target.value)}
                        placeholder="Enter address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes for the seller
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special instructions or identifiers to help the seller recognize you"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contact preference
        </label>
        <div className="space-y-2">
          <label className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="contactPreference"
              value="app"
              checked={contactPreference === 'app'}
              onChange={() => setContactPreference('app')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-3 text-gray-900">App messaging (recommended)</span>
          </label>
          
          <label className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="contactPreference"
              value="phone"
              checked={contactPreference === 'phone'}
              onChange={() => setContactPreference('phone')}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3 flex-1">
              <div className="text-gray-900">Phone</div>
              {contactPreference === 'phone' && (
                <div className="mt-2">
                  <input
                    type="tel"
                    value={contactDetail}
                    onChange={(e) => setContactDetail(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </label>
          
          <label className="flex items-start p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
            <input
              type="radio"
              name="contactPreference"
              value="email"
              checked={contactPreference === 'email'}
              onChange={() => setContactPreference('email')}
              className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-3 flex-1">
              <div className="text-gray-900">Email</div>
              {contactPreference === 'email' && (
                <div className="mt-2">
                  <input
                    type="email"
                    value={contactDetail}
                    onChange={(e) => setContactDetail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
            </div>
          </label>
        </div>
      </div>
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-1 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Safety Tips
        </h4>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>Meet in public, well-lit places</li>
          <li>Consider bringing a friend</li>
          <li>Verify the item before payment</li>
          <li>Trust your instincts</li>
        </ul>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Scheduling...' : 'Schedule Pickup'}
        </button>
      </div>
    </form>
  );
} 