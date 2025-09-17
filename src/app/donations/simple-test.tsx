'use client';

import React, { useState } from 'react';
import { HeartIcon, SparklesIcon } from '@heroicons/react/24/outline';

/**
 * Simple Donation Test Page
 * 
 * Basic test without complex dependencies
 */
export default function SimpleDonationTest() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-full">
              <HeartIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Supporta PIVABalance
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sistema di donazioni in fase di test
          </p>
        </div>

        {/* Simple Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Test Sistema Donazioni
          </h2>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-center">
              <SparklesIcon className="h-5 w-5 mr-2" />
              Test Modal
            </div>
          </button>

          {isModalOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)} />
                
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div className="text-center">
                    <HeartIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Modal Funziona!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Il sistema base è operativo. Ora integriamo Stripe.
                    </p>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Chiudi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">🔧 Debug Info</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Stripe Key:</strong> {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? '✅ Configurata' : '❌ Mancante'}</p>
              <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              <p><strong>Status:</strong> Test Page Loaded</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
