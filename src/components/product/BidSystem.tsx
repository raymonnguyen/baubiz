'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Types for bids and offers
export interface Bid {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'accepted' | 'countered' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  message?: string;
}

export interface CounterOffer {
  bidId: string;
  amount: number;
  expiresAt: Date;
  message?: string;
}

interface BidHistoryItem {
  id: string;
  type: 'bid' | 'counter' | 'accepted' | 'rejected';
  amount: number;
  timestamp: Date;
  message?: string;
  fromSeller?: boolean;
}

interface BidSystemProps {
  productId: string;
  productTitle: string;
  askingPrice: number;
  sellerId: string;
  currentUserId: string;
  isCurrentUserSeller: boolean;
  isLoggedIn: boolean;
  onShowLoginModal: () => void;
  onBidPlaced?: (bid: Omit<Bid, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  onCounterOfferMade?: (counteroffer: Omit<CounterOffer, 'bidId'>, bidId: string) => Promise<void>;
  onBidAccepted?: (bidId: string) => Promise<void>;
  onBidRejected?: (bidId: string, reason?: string) => Promise<void>;
  existingBids?: Bid[];
  counterOffers?: CounterOffer[];
}

export default function BidSystem({
  productId,
  productTitle,
  askingPrice,
  sellerId,
  currentUserId,
  isCurrentUserSeller,
  isLoggedIn,
  onShowLoginModal,
  onBidPlaced,
  onCounterOfferMade,
  onBidAccepted,
  onBidRejected,
  existingBids = [],
  counterOffers = []
}: BidSystemProps) {
  const [bidAmount, setBidAmount] = useState<number | ''>(askingPrice * 0.8);
  const [counterAmount, setCounterAmount] = useState<number | ''>(askingPrice * 0.9);
  const [message, setMessage] = useState('');
  const [counterMessage, setCounterMessage] = useState('');
  const [activeBid, setActiveBid] = useState<Bid | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Create bid history from existing bids and counteroffers
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);
  
  useEffect(() => {
    // Find the latest bid from the current user that is still active
    const userBids = existingBids.filter(bid => bid.userId === currentUserId);
    const latestActiveBid = userBids.length > 0 
      ? userBids.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0]
      : null;
    
    if (latestActiveBid && ['pending', 'countered'].includes(latestActiveBid.status)) {
      setActiveBid(latestActiveBid);
    } else {
      setActiveBid(null);
    }
    
    // Construct bid history
    const history: BidHistoryItem[] = [];
    
    // Add bids to history
    existingBids.forEach(bid => {
      history.push({
        id: bid.id,
        type: 'bid',
        amount: bid.amount,
        timestamp: bid.createdAt,
        message: bid.message,
        fromSeller: false
      });
      
      // For accepted or rejected bids, add the status update to history
      if (bid.status === 'accepted' || bid.status === 'rejected') {
        // We'll use a timestamp slightly after the bid timestamp if no counteroffers exist
        let statusTimestamp = new Date(bid.createdAt.getTime() + 1000); // 1 second after bid
        
        // If there are counter offers for this bid, use the latest one's timestamp
        const relatedCounterOffers = counterOffers.filter(co => co.bidId === bid.id);
        if (relatedCounterOffers.length > 0) {
          // Find the most recent counter offer
          const latestCounterOffer = relatedCounterOffers.sort(
            (a, b) => b.expiresAt.getTime() - a.expiresAt.getTime()
          )[0];
          
          // Use a timestamp from when the counter offer was likely created (3 days before expiry)
          statusTimestamp = new Date(latestCounterOffer.expiresAt.getTime() - (3 * 24 * 60 * 60 * 1000));
        }
        
        history.push({
          id: `${bid.status}-${bid.id}`,
          type: bid.status === 'accepted' ? 'accepted' : 'rejected',
          amount: bid.amount,
          timestamp: statusTimestamp,
          fromSeller: true
        });
      }
    });
    
    // Add counter offers to history
    counterOffers.forEach(counter => {
      history.push({
        id: `counter-${counter.bidId}`,
        type: 'counter',
        amount: counter.amount,
        timestamp: new Date(counter.expiresAt.getTime() - (3 * 24 * 60 * 60 * 1000)), // Approximate creation time
        message: counter.message,
        fromSeller: true
      });
    });
    
    // Sort by timestamp
    history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    setBidHistory(history);
  }, [existingBids, counterOffers, currentUserId]);
  
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      // Show login modal with callback to continue after login
      onShowLoginModal();
      return;
    }
    
    if (bidAmount === '' || isNaN(Number(bidAmount))) {
      setError('Please enter a valid bid amount');
      return;
    }
    
    if (Number(bidAmount) <= 0) {
      setError('Bid amount must be greater than zero');
      return;
    }
    
    if (Number(bidAmount) >= askingPrice) {
      setError('Bid must be lower than the asking price');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3); // Expires in 3 days
      
      if (onBidPlaced) {
        await onBidPlaced({
          userId: currentUserId,
          amount: Number(bidAmount),
          expiresAt: expirationDate,
          message: message || undefined
        });
      }
      
      setSuccess('Your bid has been submitted successfully!');
      setMessage('');
      
      // Simulate bid being added to the existingBids array
      const newBid: Bid = {
        id: `temp-${Date.now()}`,
        userId: currentUserId,
        amount: Number(bidAmount),
        status: 'pending',
        createdAt: new Date(),
        expiresAt: expirationDate,
        message: message || undefined
      };
      
      setActiveBid(newBid);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError('Failed to submit bid. Please try again.');
      console.error('Error submitting bid:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCounterOffer = async (bidId: string) => {
    if (counterAmount === '' || isNaN(Number(counterAmount))) {
      setError('Please enter a valid counter offer amount');
      return;
    }
    
    if (Number(counterAmount) <= 0) {
      setError('Counter offer amount must be greater than zero');
      return;
    }
    
    if (Number(counterAmount) >= askingPrice) {
      setError('Counter offer must be lower than the asking price');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 3); // Expires in 3 days
      
      if (onCounterOfferMade) {
        await onCounterOfferMade({
          amount: Number(counterAmount),
          expiresAt: expirationDate,
          message: counterMessage || undefined
        }, bidId);
      }
      
      setSuccess('Your counter offer has been sent!');
      setCounterMessage('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError('Failed to send counter offer. Please try again.');
      console.error('Error sending counter offer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAcceptBid = async (bidId: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (onBidAccepted) {
        await onBidAccepted(bidId);
      }
      
      setSuccess('You have accepted the bid!');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError('Failed to accept bid. Please try again.');
      console.error('Error accepting bid:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRejectBid = async (bidId: string) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (onBidRejected) {
        await onBidRejected(bidId, rejectionReason);
      }
      
      setSuccess('You have rejected the bid.');
      setRejectionReason('');
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError('Failed to reject bid. Please try again.');
      console.error('Error rejecting bid:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div 
        className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">
            {isCurrentUserSeller ? 'Manage Offers' : 'Make an Offer'}
          </h3>
          {activeBid && !isCurrentUserSeller && (
            <span className="ml-3 px-2.5 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
              Offer Pending
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-900 font-medium mr-2">Asking: ${askingPrice.toFixed(2)}</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {expanded && (
        <div className="p-6">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          
          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg"
            >
              {success}
            </motion.div>
          )}
          
          {/* Bid History */}
          {bidHistory.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Offer History</h4>
              <div className="space-y-3">
                {bidHistory.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg flex items-start ${
                      item.fromSeller 
                        ? 'bg-indigo-50 ml-8' 
                        : 'bg-gray-50 mr-8'
                    }`}
                  >
                    <div className={`flex-shrink-0 mt-1 ${item.fromSeller ? 'order-last ml-3' : 'mr-3'}`}>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    <div className={`flex-1 ${item.fromSeller ? 'text-right' : ''}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs text-gray-500 ${item.fromSeller ? 'order-last' : ''}`}>
                          {format(item.timestamp, 'MMM d, h:mm a')}
                        </span>
                        <span className="text-sm font-medium">
                          {item.fromSeller ? 'Seller' : 'You'}
                        </span>
                      </div>
                      
                      {item.type === 'bid' && (
                        <div className="text-indigo-700 font-medium">
                          Made an offer: ${item.amount.toFixed(2)}
                        </div>
                      )}
                      
                      {item.type === 'counter' && (
                        <div className="text-purple-700 font-medium">
                          Countered: ${item.amount.toFixed(2)}
                        </div>
                      )}
                      
                      {item.type === 'accepted' && (
                        <div className="text-green-700 font-medium">
                          Accepted offer: ${item.amount.toFixed(2)}
                        </div>
                      )}
                      
                      {item.type === 'rejected' && (
                        <div className="text-red-700 font-medium">
                          Rejected offer: ${item.amount.toFixed(2)}
                        </div>
                      )}
                      
                      {item.message && (
                        <p className="text-gray-600 text-sm mt-1">{item.message}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Seller View - Managing Bids */}
          {isCurrentUserSeller && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Pending Offers</h4>
              
              {existingBids.filter(bid => bid.status === 'pending').length === 0 ? (
                <p className="text-gray-500 text-sm">No pending offers at this time.</p>
              ) : (
                <div className="space-y-4">
                  {existingBids
                    .filter(bid => bid.status === 'pending')
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .map((bid) => (
                      <div key={bid.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="block text-lg font-medium text-gray-900">
                              ${bid.amount.toFixed(2)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Offer received {format(bid.createdAt, 'MMM d, h:mm a')}
                            </span>
                          </div>
                          <div className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Expires {format(bid.expiresAt, 'MMM d')}
                          </div>
                        </div>
                        
                        {bid.message && (
                          <p className="text-gray-600 text-sm mb-4 p-3 bg-gray-50 rounded border border-gray-100">
                            "{bid.message}"
                          </p>
                        )}
                        
                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button
                            type="button"
                            onClick={() => handleAcceptBid(bid.id)}
                            disabled={isSubmitting}
                            className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                          >
                            Accept Offer
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => handleRejectBid(bid.id)}
                            disabled={isSubmitting}
                            className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            Decline
                          </button>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="mb-3">
                            <label htmlFor="counterAmount" className="block text-sm font-medium text-gray-700">
                              Counter Offer (Optional)
                            </label>
                            
                            {/* Preset percentage buttons for counter offers */}
                            <div className="flex justify-between mb-3 space-x-2 mt-2">
                              {[5, 10, 15, 20].map((discount) => {
                                const discountedPrice = askingPrice * (1 - discount / 100);
                                return (
                                  <button
                                    key={discount}
                                    type="button"
                                    onClick={() => setCounterAmount(Number(discountedPrice.toFixed(2)))}
                                    className={`py-1 px-2 text-xs rounded-md transition-colors ${
                                      Number(counterAmount) === Number(discountedPrice.toFixed(2))
                                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                                    }`}
                                  >
                                    {discount}% off
                                  </button>
                                );
                              })}
                            </div>
                            
                            {/* Counter offer slider */}
                            <div className="mb-3">
                              <input
                                type="range"
                                min={Math.floor(bid.amount)}
                                max={Math.floor(askingPrice * 0.99)}
                                step="1"
                                value={Number(counterAmount) || Math.floor((bid.amount + askingPrice) / 2)}
                                onChange={(e) => setCounterAmount(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Their bid: ${bid.amount.toFixed(2)}</span>
                                <span>Your asking: ${askingPrice.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            {/* Counter offer number input with +/- buttons */}
                            <div className="relative flex rounded-md shadow-sm">
                              <button
                                type="button"
                                onClick={() => {
                                  const newAmount = Math.max(
                                    bid.amount + 0.01,
                                    Number(counterAmount) - 1
                                  );
                                  setCounterAmount(newAmount);
                                }}
                                className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md hover:bg-gray-100"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                </svg>
                              </button>
                              
                              <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">$</span>
                                </div>
                                <input
                                  type="number"
                                  step="0.01"
                                  id="counterAmount"
                                  value={counterAmount}
                                  onChange={(e) => setCounterAmount(e.target.value === '' ? '' : Number(e.target.value))}
                                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-8 pr-12 py-2 sm:text-sm border-y border-gray-300"
                                  placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                  <span className="text-gray-500 sm:text-sm">USD</span>
                                </div>
                              </div>
                              
                              <button
                                type="button"
                                onClick={() => {
                                  const newAmount = Math.min(
                                    askingPrice - 0.01,
                                    Number(counterAmount) + 1
                                  );
                                  setCounterAmount(newAmount);
                                }}
                                className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Price differential indicator */}
                            <div className="mt-2 text-center">
                              <span className="text-xs font-medium text-indigo-600">
                                {Number(counterAmount) > bid.amount ? 
                                  `${((Number(counterAmount) - bid.amount) / bid.amount * 100).toFixed(1)}% higher than their bid` :
                                  'Same as their bid'
                                }
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <label htmlFor="counterMessage" className="block text-sm font-medium text-gray-700">
                              Message (Optional)
                            </label>
                            <textarea
                              id="counterMessage"
                              value={counterMessage}
                              onChange={(e) => setCounterMessage(e.target.value)}
                              rows={2}
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              placeholder="Add a message to the buyer..."
                            />
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleCounterOffer(bid.id)}
                            disabled={isSubmitting}
                            className="w-full inline-flex justify-center items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            Send Counter Offer
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
          
          {/* Buyer View - Make a Bid */}
          {!isCurrentUserSeller && (
            <div>
              {activeBid ? (
                <div className="p-4 border border-indigo-200 rounded-lg bg-indigo-50">
                  <h4 className="font-medium text-indigo-800 mb-2">Your Current Offer</h4>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-indigo-900">${activeBid.amount.toFixed(2)}</span>
                    <span className="text-xs text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full">
                      {activeBid.status === 'pending' ? 'Pending' : 'Countered'}
                    </span>
                  </div>
                  <p className="text-sm text-indigo-700">
                    Your offer expires on {format(activeBid.expiresAt, 'MMMM d, yyyy')}
                  </p>
                  
                  {/* If there's a counter offer for this bid */}
                  {counterOffers.some(co => co.bidId === activeBid.id) && (
                    <div className="mt-4 p-3 border border-purple-200 rounded-lg bg-purple-50">
                      <h5 className="font-medium text-purple-800 mb-2">Seller Counter Offer</h5>
                      {counterOffers
                        .filter(co => co.bidId === activeBid.id)
                        .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime())
                        .slice(0, 1)
                        .map((counter) => (
                          <div key={`counter-${counter.bidId}`}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-lg font-bold text-purple-900">${counter.amount.toFixed(2)}</span>
                              <span className="text-xs text-purple-700">
                                Expires {format(counter.expiresAt, 'MMM d')}
                              </span>
                            </div>
                            
                            {counter.message && (
                              <p className="text-sm text-purple-700 mb-3 italic">"{counter.message}"</p>
                            )}
                            
                            <div className="grid grid-cols-2 gap-3 mt-4">
                              <button
                                type="button"
                                onClick={() => handleAcceptBid(activeBid.id)}
                                disabled={isSubmitting}
                                className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                              >
                                Accept Counter
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => setActiveBid(null)}
                                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Make New Offer
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleBidSubmit}>
                  <div className="mb-4">
                    <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Offer
                    </label>
                    
                    {/* Added preset percentage buttons */}
                    <div className="flex justify-between mb-3 space-x-2">
                      {[10, 15, 20, 25].map((discount) => {
                        const discountedPrice = askingPrice * (1 - discount / 100);
                        return (
                          <button
                            key={discount}
                            type="button"
                            onClick={() => setBidAmount(Number(discountedPrice.toFixed(2)))}
                            className={`py-1 px-2 text-xs rounded-md transition-colors ${
                              Number(bidAmount) === Number(discountedPrice.toFixed(2))
                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {discount}% off
                          </button>
                        );
                      })}
                    </div>
                    
                    {/* Added slider */}
                    <div className="mb-3">
                      <input
                        type="range"
                        min={Math.floor(askingPrice * 0.5)}
                        max={Math.floor(askingPrice * 0.95)}
                        step="1"
                        value={Number(bidAmount) || Math.floor(askingPrice * 0.8)}
                        onChange={(e) => setBidAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>${Math.floor(askingPrice * 0.5)}</span>
                        <span>${Math.floor(askingPrice * 0.95)}</span>
                      </div>
                    </div>
                    
                    {/* Original number input with + and - buttons */}
                    <div className="relative flex rounded-md shadow-sm">
                      <button
                        type="button"
                        onClick={() => {
                          const newAmount = Math.max(
                            Math.floor(askingPrice * 0.5),
                            Number(bidAmount) - 1
                          );
                          setBidAmount(newAmount);
                        }}
                        className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          id="bidAmount"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value === '' ? '' : Number(e.target.value))}
                          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-y border-gray-300 py-2"
                          placeholder="0.00"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">USD</span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const newAmount = Math.min(
                            askingPrice - 0.01,
                            Number(bidAmount) + 1
                          );
                          setBidAmount(newAmount);
                        }}
                        className="inline-flex items-center px-3 border border-l-0 border-gray-300 bg-gray-50 text-gray-500 rounded-r-md hover:bg-gray-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Savings summary */}
                    <div className="mt-2 flex justify-between">
                      <span className="text-xs text-gray-500">Suggested: ${(askingPrice * 0.8).toFixed(2)}</span>
                      <span className="text-xs font-medium text-green-600">
                        Save ${(askingPrice - Number(bidAmount)).toFixed(2)} ({Math.round((1 - Number(bidAmount) / askingPrice) * 100)}%)
                      </span>
                      <span className="text-xs text-gray-500">Asking: ${askingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message to Seller (Optional)
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      placeholder="Add a note with your offer..."
                    />
                  </div>
                  
                  {!isLoggedIn && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Login Required</h4>
                          <p className="mt-1 text-sm text-yellow-700">
                            You'll need to log in to submit your offer. Click the button below to continue.
                          </p>
                          <p className="mt-2 text-xs text-yellow-600">
                            <strong>Demo credentials:</strong> username: phunguyen, password: phunguyen
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    <p className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>
                        Your offer will be active for 3 days. The seller can accept, decline, or send a counter offer.
                      </span>
                    </p>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
                      isLoggedIn 
                        ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700' 
                        : 'border-indigo-600 text-indigo-600 bg-white hover:bg-indigo-50'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      isLoggedIn ? 'Submit Offer' : 'Log in to Submit Offer'
                    )}
                  </button>
                </form>
              )}
              
              <div className="mt-4 text-xs text-gray-500">
                <p>
                  By placing an offer, you agree to the Mom Marketplace terms of service. If the seller accepts, 
                  you'll be notified and directed to complete the purchase at the agreed price.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 