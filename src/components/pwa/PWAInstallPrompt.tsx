/**
 * PWA Install Prompt Component
 * 
 * Provides a user-friendly install prompt for PWA installation
 */

'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAInstallPromptProps {
  className?: string;
  autoShow?: boolean;
  showDelay?: number;
}

/**
 * PWA Install Prompt Component
 * 
 * Features:
 * - Detects PWA installability
 * - Shows native install prompt
 * - Customizable appearance and timing
 * - Handles different platforms (iOS, Android, Desktop)
 * - Remembers user preference
 */
export const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({
  className = '',
  autoShow = true,
  showDelay = 3000
}) => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');

  // Detect platform
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isDesktop = !isIOS && !isAndroid;

    if (isIOS) {
      setPlatform('ios');
    } else if (isAndroid) {
      setPlatform('android');
    } else if (isDesktop) {
      setPlatform('desktop');
    }
  }, []);

  // Listen for PWA install events
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Auto-show after delay if enabled
      if (autoShow && !hasUserDismissed()) {
        setTimeout(() => {
          setShowPrompt(true);
        }, showDelay);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setIsInstallable(false);
      // PWA installed successfully
    };

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [autoShow, showDelay]);

  // Check if user has dismissed the prompt
  const hasUserDismissed = (): boolean => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const dayInMs = 24 * 60 * 60 * 1000;
    
    // Show again after 7 days
    return Date.now() - dismissedTime < 7 * dayInMs;
  };

  // Handle install button click
  const handleInstall = async () => {
    if (!installEvent) return;

    try {
      await installEvent.prompt();
      const { outcome } = await installEvent.userChoice;
      
      if (outcome === 'accepted') {
        setShowPrompt(false);
        // User accepted PWA install
      } else {
        // User dismissed PWA install
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };

  // Handle dismiss
  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Show manual prompt
  const showManualPrompt = () => {
    setShowPrompt(true);
  };

  // Get platform-specific instructions
  const getPlatformInstructions = () => {
    switch (platform) {
      case 'ios':
        return {
          title: 'Installa P.IVA Balance',
          instructions: 'Tocca il pulsante Condividi in basso, poi "Aggiungi alla schermata Home"',
          icon: '📱'
        };
      case 'android':
        return {
          title: 'Installa P.IVA Balance',
          instructions: 'Tocca "Installa" per aggiungere l\'app al tuo dispositivo',
          icon: '📱'
        };
      case 'desktop':
        return {
          title: 'Installa P.IVA Balance',
          instructions: 'Installa questa app per un accesso rapido dal desktop',
          icon: '💻'
        };
      default:
        return {
          title: 'Installa App',
          instructions: 'Installa per un\'esperienza migliore',
          icon: '📱'
        };
    }
  };

  // Don't show if already installed
  if (isInstalled) {
    return null;
  }

  const { title, instructions, icon } = getPlatformInstructions();

  // Floating install button (when not showing full prompt)
  if (isInstallable && !showPrompt) {
    return (
      <button
        onClick={showManualPrompt}
        className={`
          fixed bottom-4 right-4 z-50
          bg-blue-500 hover:bg-blue-600 text-white
          p-3 rounded-full shadow-lg
          transition-all duration-200 hover:scale-105
          ${className}
        `}
        aria-label="Installa app"
      >
        <Download className="h-6 w-6" />
      </button>
    );
  }

  // Full install prompt
  if (showPrompt) {
    return (
      <div className={`
        fixed inset-0 z-50 flex items-center justify-center
        bg-black bg-opacity-50 p-4
        ${className}
      `}>
        <div className="
          bg-white rounded-lg shadow-xl max-w-sm w-full
          p-6 relative animate-in fade-in slide-in-from-bottom-4
          duration-300
        ">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            aria-label="Chiudi"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="text-center">
            {/* App icon */}
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">{icon}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {title}
            </h3>

            {/* Instructions */}
            <p className="text-sm text-gray-600 mb-6">
              {instructions}
            </p>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleDismiss}
                className="
                  flex-1 px-4 py-2 text-sm font-medium text-gray-700
                  bg-gray-100 hover:bg-gray-200 rounded-md
                  transition-colors duration-200
                "
              >
                Non ora
              </button>
              
              {platform !== 'ios' && installEvent && (
                <button
                  onClick={handleInstall}
                  className="
                    flex-1 px-4 py-2 text-sm font-medium text-white
                    bg-blue-500 hover:bg-blue-600 rounded-md
                    transition-colors duration-200
                    flex items-center justify-center space-x-2
                  "
                >
                  <Download className="h-4 w-4" />
                  <span>Installa</span>
                </button>
              )}
            </div>

            {/* iOS specific instructions */}
            {platform === 'ios' && (
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-xs">
                    Safari → Condividi → Aggiungi a Home
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Hook for PWA install functionality
 */
export const usePWAInstall = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = () => {
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return {
    isInstallable,
    isInstalled,
    canInstall: isInstallable && !isInstalled
  };
};

export default PWAInstallPrompt;
