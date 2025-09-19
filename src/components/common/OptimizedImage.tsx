/**
 * Optimized Image Component
 * SRP: High-performance image loading with WebP/AVIF support
 */

'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized Image with automatic format selection and lazy loading
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  objectFit = 'cover',
  loading = 'lazy',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const blurDataURLRef = useRef(blurDataURL || '');

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate blur placeholder for better UX
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  useEffect(() => {
    if (placeholder === 'blur' && !blurDataURLRef.current) {
      // Auto-generate blur placeholder if not provided
      const autoBlurDataURL = generateBlurDataURL(20, 20);
      blurDataURLRef.current = autoBlurDataURL;
    }
  }, [placeholder]);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-500 text-sm">Immagine non disponibile</span>
      </div>
    );
  }

  const imageProps = {
    src,
    alt,
    quality,
    priority,
    placeholder,
    ...(blurDataURLRef.current && { blurDataURL: blurDataURLRef.current }),
    sizes,
    onLoad: handleLoad,
    onError: handleError,
    className: `${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`,
    ...(fill ? { fill: true, style: { objectFit } } : { width, height }),
    ...(loading && !priority && { loading }),
  };

  return (
    <div className="relative overflow-hidden">
      <Image {...imageProps} alt={alt} />

      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width: fill ? '100%' : width, height: fill ? '100%' : height }}
        />
      )}
    </div>
  );
};

/**
 * Avatar component with optimized loading
 */
export const OptimizedAvatar: React.FC<{
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallbackText?: string;
}> = ({ src, alt, size = 'md', className = '', fallbackText }) => {
  const sizeMap = {
    sm: { width: 32, height: 32, text: 'text-xs' },
    md: { width: 48, height: 48, text: 'text-sm' },
    lg: { width: 64, height: 64, text: 'text-base' },
    xl: { width: 96, height: 96, text: 'text-lg' },
  };

  const { width, height, text } = sizeMap[size];
  const initials = fallbackText?.split(' ').map(n => n[0]).join('').slice(0, 2) || alt.slice(0, 2);

  if (!src) {
    return (
      <div
        className={`bg-blue-500 text-white flex items-center justify-center rounded-full ${text} font-medium ${className}`}
        style={{ width, height }}
      >
        {initials.toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-full object-cover ${className}`}
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
};

/**
 * Logo component with fallback
 */
export const OptimizedLogo: React.FC<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}> = ({ src, alt, width = 120, height = 40, className = '', priority = true }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      quality={95}
      placeholder="empty"
    />
  );
};

/**
 * Hook for preloading images
 */
export const useImagePreload = (sources: string[]) => {
  useEffect(() => {
    const preloadImages = sources.map(src => {
      const img = new window.Image();
      img.alt = '';
      img.src = src;
      return img;
    });

    return () => {
      preloadImages.forEach(img => {
        img.src = '';
      });
    };
  }, [sources]);
};
