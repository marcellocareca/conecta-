import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  variant = 'light',
  size = 'md',
  showSubtitle = false
}) => {
  const heightMap = {
    sm: 'h-[42px] sm:h-[47px]',
    md: 'h-[52px] sm:h-[62px]',
    lg: 'h-[62px] sm:h-[73px]',
    xl: 'h-[83px] sm:h-[104px]'
  };

  const isWhiteVariant = variant === 'white';

  return (
    <div className={`inline-flex items-center justify-center md:justify-start gap-2 select-none ${className}`}>
      {/* Logotipo oficial exato: https://www.gufomoda.com.br/conecta.png */}
      <img
        src="/conecta_oficial.png"
        alt="CONECTA MAIRIPORÃ"
        className={`${heightMap[size]} w-auto object-contain transition-transform hover:scale-102 duration-200 ${
          isWhiteVariant ? 'brightness-0 invert drop-shadow-sm' : ''
        }`}
        onError={(e) => {
          const target = e.currentTarget;
          if (target.src !== 'https://www.gufomoda.com.br/conecta.png') {
            target.src = 'https://www.gufomoda.com.br/conecta.png';
          }
        }}
      />
      {showSubtitle && (
        <span className="hidden sm:inline-block text-[11px] font-bold text-[#07843B] uppercase tracking-wider pl-2 border-l border-[#E5EBE6]">
          Comércio Local
        </span>
      )}
    </div>
  );
};
