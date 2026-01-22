import React from 'react';
import { Industry } from '@/types/components';

interface IndustryCardContainerProps {
  industry: Industry;
  isActive: boolean;
  index: number;
  cardDimensions: { width: string; height: string };
  isFlipped: boolean;
  onCardClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}

export default function IndustryCardContainer({
  industry,
  isActive,
  index,
  cardDimensions,
  isFlipped,
  onCardClick,
  children
}: IndustryCardContainerProps) {
  return (
    <div
      className={`absolute cursor-pointer transition-all duration-500 transform-gpu group min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 ${isActive ? 'scale-110 z-10 opacity-100' : 'scale-90 opacity-70'}`}
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
        position: 'absolute',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
      onClick={onCardClick}
      role="button"
      tabIndex={0}
      aria-label={`${industry.title} - Click to flip for more details`}
      data-index={index}
    >
      <div
        className="relative w-full h-full transition-transform duration-800"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
