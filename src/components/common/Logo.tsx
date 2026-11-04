import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  imgClassName?: string;
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  imgClassName = '',
  variant = 'light',
  size = 'md',
  showSubtitle = false
}) => {
  const [imageErrorIndex, setImageErrorIndex] = useState(0);

  // Fallback image sources in order of resilience
  const imageSources = [
    '/conecta_oficial.png',
    '/conecta.png',
    '/conecta_verde_amarelo_hd.png',
    'https://www.gufomoda.com.br/conecta.png'
  ];

  const hasExhaustedImages = imageErrorIndex >= imageSources.length;
  const currentSrc = !hasExhaustedImages ? imageSources[imageErrorIndex] : '';

  const heightMap = {
    sm: 'h-8 sm:h-9 md:h-10',
    md: 'h-10 sm:h-12 md:h-14',
    lg: 'h-12 sm:h-14 md:h-16',
    xl: 'h-16 sm:h-20 md:h-24',
    '2xl': 'h-20 sm:h-26 md:h-32'
  };

  const maxWidthMap = {
    sm: 'max-w-[160px] sm:max-w-[190px]',
    md: 'max-w-[200px] sm:max-w-[240px]',
    lg: 'max-w-[240px] sm:max-w-[280px]',
    xl: 'max-w-[320px] sm:max-w-[380px] md:max-w-[440px]',
    '2xl': 'max-w-[400px] sm:max-w-[480px] md:max-w-[560px]'
  };

  const isWhiteVariant = variant === 'white';

  const handleImageError = () => {
    setImageErrorIndex(prev => prev + 1);
  };

  return (
    <div className={`inline-flex items-center shrink-0 gap-2 select-none ${className}`}>
      {!hasExhaustedImages ? (
        <img
          src={currentSrc}
          alt="CONECTA MAIRIPORÃ - Comércio Local"
          className={`${heightMap[size]} w-auto ${maxWidthMap[size]} object-contain object-left transition-transform duration-200 hover:scale-102 shrink-0 ${
            isWhiteVariant ? 'brightness-0 invert drop-shadow-xs' : ''
          } ${imgClassName}`}
          onError={handleImageError}
        />
      ) : (
        /* Vector SVG brand fallback: Guaranteed to display anywhere on any device */
        <div className={`flex items-center gap-2 ${heightMap[size]} shrink-0`}>
          <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#00A86B] to-[#00553A] flex items-center justify-center shadow-xs shrink-0">
            {/* Minimalist Shopping Cart / Leaf Emblem */}
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#FFD700]">
              <path d="M3 4h2l2.2 9.5a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="19" r="1.5" fill="#FFD700" />
              <circle cx="17" cy="19" r="1.5" fill="#FFD700" />
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`text-sm sm:text-base md:text-lg font-black tracking-tight ${isWhiteVariant ? 'text-white' : 'text-[#00553A]'}`}>
              CONECTA
            </span>
            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-extrabold tracking-widest text-[#00A86B]">
              MAIRIPORÃ
            </span>
          </div>
        </div>
      )}

      {showSubtitle && (
        <span className={`hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider pl-2 border-l ${
          isWhiteVariant ? 'text-[#66CDAA] border-white/20' : 'text-[#00A86B] border-[#E2ECE5]'
        }`}>
          Comércio Local
        </span>
      )}
    </div>
  );
};
