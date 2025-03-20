'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface ReviewUser {
  name: string;
  avatar: string;
  purchaseCount: number;
}

interface Review {
  id: string;
  user: ReviewUser;
  rating: number;
  date: string;
  content: string;
  images?: string[];
  helpfulCount: number;
  isHelpful: boolean;
}

interface RatingBreakdown {
  [key: number]: number;
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

interface MarketplaceReviewsProps {
  marketplaceId: string;
  marketplaceName: string;
  overallRating: number;
  reviewCount: number;
  ratingBreakdown: RatingBreakdown;
  reviews: Review[];
}

export default function MarketplaceReviews({
  marketplaceId,
  marketplaceName,
  overallRating,
  reviewCount,
  ratingBreakdown,
  reviews
}: MarketplaceReviewsProps) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'recent' | 'helpful' | 'highest' | 'lowest'>('recent');
  const [showWriteReview, setShowWriteReview] = useState(false);

  const filteredReviews = reviews
    .filter(review => !filterRating || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortOption) {
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const calculateRatingPercentage = (rating: number) => {
    return (ratingBreakdown[rating] / reviewCount) * 100;
  };

  const handleHelpfulClick = (reviewId: string) => {
    // In a real app, this would update the review's helpful count in the backend
    console.log('Marked review as helpful:', reviewId);
  };

  return (
    <div className="bg-white">
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Reviews for {marketplaceName}</h2>
              <div className="flex items-center">
                <div className="flex items-center">
                  <span className="text-3xl font-bold mr-2">{overallRating.toFixed(1)}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= overallRating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-gray-600 ml-4">{reviewCount} reviews</span>
              </div>
            </div>
            <button
              onClick={() => setShowWriteReview(true)}
              className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none"
            >
              Write a Review
            </button>
          </div>

          {/* Rating Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm font-medium">{rating} stars</div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${calculateRatingPercentage(rating)}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-600 text-right">
                    {ratingBreakdown[rating]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex space-x-2 mb-4 md:mb-0">
              <button
                onClick={() => setFilterRating(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  !filterRating
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setFilterRating(rating)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    filterRating === rating
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {rating} stars
                </button>
              ))}
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden mr-4">
                    <Image
                      src={review.user.avatar}
                      alt={review.user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{review.user.name}</h4>
                        <p className="text-sm text-gray-600">
                          {review.user.purchaseCount} purchases • {review.date}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-4 text-gray-700">{review.content}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="mt-4 flex space-x-2">
                        {review.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative w-20 h-20 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`Review image ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex items-center">
                      <button
                        onClick={() => handleHelpfulClick(review.id)}
                        className={`flex items-center text-sm ${
                          review.isHelpful ? 'text-primary' : 'text-gray-600'
                        }`}
                      >
                        <svg
                          className={`w-4 h-4 mr-1 ${
                            review.isHelpful ? 'fill-current' : 'fill-none'
                          }`}
                          viewBox="0 0 20 20"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          />
                        </svg>
                        Helpful ({review.helpfulCount})
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      {showWriteReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-lg w-full p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Write a Review</h3>
              <button
                onClick={() => setShowWriteReview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="text-2xl text-gray-300 hover:text-yellow-400 focus:outline-none"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Share your experience with this marketplace..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photos (Optional)
                </label>
                <div className="flex items-center space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                    Add Photos
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowWriteReview(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark focus:outline-none">
                Submit Review
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 