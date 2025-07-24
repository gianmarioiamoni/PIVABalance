'use client';

import React from 'react';

/**
 * AnimatedBackground Component (Client Component)
 * 
 * Single Responsibility: Provide animated background effects
 * Requires client-side rendering for CSS animations and dynamic positioning
 */
export const AnimatedBackground: React.FC = () => {
    return (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-purple-500/5"></div>

            {/* Floating Elements - Animated circles */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-20 w-24 h-24 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
            <div className="absolute bottom-40 right-10 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
    );
}; 