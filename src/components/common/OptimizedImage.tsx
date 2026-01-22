/**
 * OptimizedImage Component
 * Automatically serves optimal format based on device capabilities
 * with responsive sizing, lazy loading, and performance optimization
 */

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import performanceDetector from '@/utils/performanceDetection';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

/**
 * Get optimized image path based on device capabilities and browser support
 */
function getOptimizedImagePath(originalPath: string): string {
  // If it's already an optimized path, return as is
  if (originalPath.includes('images-optimized') || originalPath.includes('icons-optimized')) {
    return originalPath;
  }

  // Convert original path to optimized path
  const pathParts = originalPath.split('/');
  const filename = pathParts[pathParts.length - 1];
  const dir = pathParts.slice(0, -1).join('/');

  const basename = filename.replace(/\.[^/.]+$/, '');

  // Determine optimal format based on device capabilities
  const settings = performanceDetector.getSettings();
  const capabilities = performanceDetector.getCapabilities();

  let format = 'webp'; // Default fallback

  if (settings?.imageQuality === 'high' && capabilities?.supportsAVIF) {
    format = 'avif';
  } else if (settings?.imageQuality === 'medium' || settings?.imageQuality === 'low') {
    format = 'webp';
  } else if (capabilities?.supportsWebP) {
    format = 'webp';
  } else {
    format = 'png'; // Ultimate fallback
  }

  if (dir === '/images') {
    return `/images-optimized/${basename}.${format}`;
  } else if (dir === '/images/Industries') {
    return `/images-optimized/Industries/${basename}.${format}`;
  } else if (dir === '/images/Our Services') {
    return `/images-optimized/Our Services/${basename}.${format}`;
  } else if (dir === '/images/logo-Final-png.svg') {
    return '/icons-optimized/vr-logo-md.webp';
  }

  return originalPath;
}



/**
 * OptimizedImage Component
 */

/**
 * Static blur placeholder - avoids expensive Canvas creation on every render
 * This is a small 10x10 dark gradient JPEG encoded as base64
 */
const STATIC_BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMCwsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgcI/8QAIhAAAQQBBAMBAAAAAAAAAAAAAQIDBAUGBxESIQgTMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8ApaV4yxuosTt5c1Oz1bFrp21litrIvYRmWt5NtuV7BAIII369+tAD//Z';

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  quality = 85,
  fill = false,
  style,
  onLoad,
  onError,
  placeholder = 'blur',
  blurDataURL,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Get optimized image paths
  const optimizedSrc = getOptimizedImagePath(src);

  // Use static blur placeholder - no dynamic generation needed
  const defaultBlurDataURL = blurDataURL || STATIC_BLUR_PLACEHOLDER;

  // Set optimized source
  useEffect(() => {
    setImageSrc(optimizedSrc);
  }, [optimizedSrc]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    // Fallback to original image
    setImageSrc(src);
    onError?.();
  };

  // If there's an error, show fallback
  if (hasError) {
    return (
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        sizes={sizes}
        quality={quality}
        fill={fill}
        style={style}
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  }

  return (
    <div className={`relative ${className || ''}`} style={style}>
      {isLoading && placeholder === 'blur' && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded" />
      )}

      <Image
        ref={imgRef}
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes || (fill ? '100vw' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')}
        quality={quality}
        fill={fill}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? defaultBlurDataURL : undefined}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'
          }`}
      />
    </div>
  );
}

/**
 * Background Image Component with optimization
 */
interface OptimizedBackgroundImageProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export function OptimizedBackgroundImage({
  src,
  className = '',
  style = {},
  children,
}: OptimizedBackgroundImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    const optimizedSrc = getOptimizedImagePath(src);
    setImageSrc(optimizedSrc);
  }, [src]);

  return (
    <div
      className={`bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url('${imageSrc}')`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}