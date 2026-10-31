import React from 'react';

export type WaveVariant = 'organic-1' | 'organic-2' | 'multi-layered' | 'deep-crest' | 'gentle-swell';

interface WaveDividerProps {
  variant?: WaveVariant;
  fillColor: string;
  position?: 'top' | 'bottom';
  className?: string;
  heightClassName?: string;
  flipX?: boolean;
  secondaryFill?: string;
}

export const WaveDivider: React.FC<WaveDividerProps> = ({
  variant = 'organic-1',
  fillColor,
  position = 'top',
  className = '',
  heightClassName = 'h-10 sm:h-14 md:h-20 lg:h-24',
  flipX = false,
  secondaryFill
}) => {
  const isBottom = position === 'bottom';

  // Transform matrix for top vs bottom and flipX
  const transform = [
    isBottom ? 'rotate(180deg)' : '',
    flipX ? 'scaleX(-1)' : ''
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={`w-full overflow-hidden leading-none pointer-events-none select-none z-10 ${className}`}
      style={{
        transform: transform || undefined,
        lineHeight: 0
      }}
      aria-hidden="true"
    >
      {variant === 'organic-1' && (
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`w-full block ${heightClassName}`}
        >
          {secondaryFill && (
            <path 
              d="M0,45 C220,95 440,25 680,65 C920,105 1160,55 1440,85 L1440,120 L0,120 Z" 
              fill={secondaryFill} 
              opacity="0.35"
            />
          )}
          <path 
            d="M0,32 C240,90 480,10 720,62 C960,114 1200,42 1440,78 L1440,120 L0,120 Z" 
            fill={fillColor} 
          />
        </svg>
      )}

      {variant === 'organic-2' && (
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`w-full block ${heightClassName}`}
        >
          {secondaryFill && (
            <path 
              d="M0,60 C180,15 380,85 640,40 C900,-5 1180,75 1440,30 L1440,120 L0,120 Z" 
              fill={secondaryFill} 
              opacity="0.3"
            />
          )}
          <path 
            d="M0,72 C200,28 420,92 700,50 C980,8 1220,88 1440,45 L1440,120 L0,120 Z" 
            fill={fillColor} 
          />
        </svg>
      )}

      {variant === 'multi-layered' && (
        <svg 
          viewBox="0 0 1440 140" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`w-full block ${heightClassName}`}
        >
          <path 
            d="M0,80 C280,130 560,40 840,95 C1120,150 1320,70 1440,85 L1440,140 L0,140 Z" 
            fill={secondaryFill || fillColor} 
            opacity={secondaryFill ? "0.4" : "0.25"}
          />
          <path 
            d="M0,60 C320,110 600,20 900,75 C1200,130 1360,50 1440,70 L1440,140 L0,140 Z" 
            fill={fillColor} 
          />
        </svg>
      )}

      {variant === 'deep-crest' && (
        <svg 
          viewBox="0 0 1440 120" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`w-full block ${heightClassName}`}
        >
          {secondaryFill && (
            <path 
              d="M0,20 C320,90 640,10 960,80 C1200,130 1360,70 1440,40 L1440,120 L0,120 Z" 
              fill={secondaryFill} 
              opacity="0.3"
            />
          )}
          <path 
            d="M0,40 C360,110 680,25 1020,95 C1260,140 1380,85 1440,60 L1440,120 L0,120 Z" 
            fill={fillColor} 
          />
        </svg>
      )}

      {variant === 'gentle-swell' && (
        <svg 
          viewBox="0 0 1440 90" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className={`w-full block ${heightClassName}`}
        >
          {secondaryFill && (
            <path 
              d="M0,35 C300,65 600,15 900,50 C1200,85 1380,45 1440,40 L1440,90 L0,90 Z" 
              fill={secondaryFill} 
              opacity="0.3"
            />
          )}
          <path 
            d="M0,25 C340,60 680,10 1020,45 C1280,70 1390,30 1440,35 L1440,90 L0,90 Z" 
            fill={fillColor} 
          />
        </svg>
      )}
    </div>
  );
};
