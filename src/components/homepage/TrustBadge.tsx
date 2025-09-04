import React from 'react';
import type { TrustBadgeProps } from './types';

/**
 * TrustBadge Component (Server Component)
 * 
 * Single Responsibility: Display trust indicators (reviews, user count)
 * Only renders if trustData is enabled and has valid data
 */
export const TrustBadge: React.FC<TrustBadgeProps> = ({ trustData }) => {
  // Early return if trust data is not enabled or invalid
  if (!trustData.enabled || trustData.userCount <= 0) {
    return null;
  }

  return (
    <div className="mt-12 animate-fade-in delay-500">
      <p className="body-sm text-tertiary mb-4">
        Già scelto da {trustData.userCount.toLocaleString()} professionisti
      </p>
      <div className="flex items-center justify-center space-x-8 opacity-60">
        <div className="flex items-center space-x-1">
          {[...Array(trustData.maxRating)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.floor(trustData.rating) ? 'text-yellow-400' : 'text-gray-300'} fill-current`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="body-sm text-tertiary ml-2">
            {trustData.rating}/{trustData.maxRating} ({trustData.reviewCount} recensioni)
          </span>
        </div>
      </div>
    </div>
  );
}; 