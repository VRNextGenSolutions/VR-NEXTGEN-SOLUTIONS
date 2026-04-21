/**
 * HeroBackground Component
 * Optimized, reusable background for hero sections with parallax and fade effects
 */

import React from 'react';
// Tree-shaken Framer Motion imports for optimal bundle size
import { motion } from 'framer-motion';
import type { MotionValue } from 'framer-motion';

interface HeroBackgroundProps {
  videoSource?: string;
  backgroundImage?: string; // Made optional mostly fallback
  opacity?: MotionValue<number>;
  parallaxOffset?: MotionValue<number>;
  overlayImage?: string;
  overlayOpacity?: string;
}

export default function HeroBackground({
  videoSource = '/videos/hero-background.mp4',
  backgroundImage,
  opacity,
  parallaxOffset,
  overlayImage,
  overlayOpacity = '0.03'
}: HeroBackgroundProps) {
  return (
    <>
      {/* Container for video background and overlay */}
      <motion.div
        className="absolute inset-0 -z-30 overflow-hidden bg-black"
        style={{
          opacity: opacity,
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)', // Force hardware acceleration
          backfaceVisibility: 'hidden', // Optimize rendering
        }}
        transition={{ duration: 0.7, ease: 'easeInOut' }}
      >
        {/* HTML5 Video tag with required attributes, scaled by 1.78 to crop out native 16:9 pillarboxing from 1:1 generation */}
        <video
          src={videoSource}
          poster={backgroundImage}
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ zIndex: -10, transform: 'scale(1.78)', transformOrigin: 'center' }}
        />
        
        {/* Dark readability overlay directly above the video component */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: 'rgba(0, 0, 0, 0.5)', zIndex: 0 }} 
        />
      </motion.div>

      {/* Optional overlay image with parallax effect - using motion.div for MotionValue optimization */}
      {overlayImage && (
        <motion.div
          className="absolute inset-0 -z-20 bg-no-repeat bg-center bg-parallax pointer-events-none"
          aria-hidden="true"
          style={{
            backgroundImage: `url('${overlayImage}')`,
            opacity: overlayOpacity,
            // Use y property directly with MotionValue for compositor optimization
            y: parallaxOffset,
            willChange: parallaxOffset ? 'transform' : 'auto',
            backfaceVisibility: 'hidden',
          }}
        />
      )}
    </>
  );
}
