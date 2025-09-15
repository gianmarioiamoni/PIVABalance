'use client';

import React, { useState, useEffect } from 'react';
import { DonationModal } from './DonationModal';
import { donationService } from '@/services/donationService';
import { DonationStats } from '@/types';
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * Donation Button Props
 */
interface DonationButtonProps {
  variant?: 'button' | 'link' | 'card';
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  className?: string;
}

/**
 * Donation Button Component
 * 
 * A non-invasive way to allow users to support the project.
 * Can be used in footer, about page, or as a floating action button.
 */
export const DonationButton: React.FC<DonationButtonProps> = ({
  variant = 'button',
  size = 'md',
  showStats = false,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<DonationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load donation stats if requested
  useEffect(() => {
    if (showStats) {
      loadStats();
    }
  }, [showStats]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      const donationStats = await donationService.getDonationStats();
      setStats(donationStats);
    } catch (error) {
      console.error('Error loading donation stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonationSuccess = (donationId: string) => {
    // Refresh stats after successful donation
    if (showStats) {
      setTimeout(loadStats, 1000);
    }
    
    // Optional: Show success notification
    console.log('Donation successful:', donationId);
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Button variant
  if (variant === 'button') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`
            inline-flex items-center justify-center
            bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600
            text-white font-medium rounded-lg transition-all duration-200
            transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50
            ${sizeClasses[size]}
            ${className}
          `}
        >
          <HeartIcon className="h-4 w-4 mr-2" />
          Supporta il progetto
        </button>

        <DonationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleDonationSuccess}
        />
      </>
    );
  }

  // Link variant (for footer)
  if (variant === 'link') {
    return (
      <>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`
            inline-flex items-center text-gray-300 hover:text-white transition-colors
            ${className}
          `}
        >
          <HeartIcon className="h-4 w-4 mr-1" />
          Supporta il progetto
        </button>

        <DonationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleDonationSuccess}
        />
      </>
    );
  }

  // Card variant (with stats)
  if (variant === 'card') {
    return (
      <>
        <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 p-3 rounded-full">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Supporta PIVABalance
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              Aiutaci a mantenere questo servizio gratuito e a sviluppare nuove funzionalità.
            </p>

            {showStats && stats && !isLoading && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {donationService.formatAmount(stats.totalAmount)}
                    </div>
                    <div className="text-xs text-gray-500">Raccolti</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {stats.totalCount}
                    </div>
                    <div className="text-xs text-gray-500">Donazioni</div>
                  </div>
                </div>
                
                {/* Progress bar for monthly goal */}
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Obiettivo mensile</span>
                    <span className="text-xs text-gray-600">
                      {stats.monthlyProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, stats.monthlyProgress)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {donationService.formatAmount(stats.monthlyGoal)} al mese
                  </div>
                </div>
              </div>
            )}

            {showStats && isLoading && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
            >
              <div className="flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 mr-2" />
                Fai una donazione
              </div>
            </button>

            <p className="text-xs text-gray-500 mt-3">
              Pagamenti sicuri elaborati da Stripe
            </p>
          </div>
        </div>

        <DonationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleDonationSuccess}
        />
      </>
    );
  }

  return null;
};
