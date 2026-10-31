import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceSearchButtonProps {
  onClick: () => void;
  isListening?: boolean;
  variant?: 'input-inline' | 'navbar-pill' | 'header-circle';
  className?: string;
  title?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onClick,
  isListening = false,
  variant = 'input-inline',
  className = '',
  title = 'Buscar por voz no Conecta Mairiporã'
}) => {
  if (variant === 'header-circle') {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#E5EBE6] bg-white hover:bg-[#E9F6EC] flex items-center justify-center transition-all shadow-xs cursor-pointer group ${
          isListening ? 'border-[#07843B] bg-[#E9F6EC]' : ''
        } ${className}`}
      >
        {isListening && (
          <span className="absolute inset-0 rounded-full bg-[#07843B]/20 animate-ping pointer-events-none" />
        )}
        <Mic className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
          isListening ? 'text-[#07843B] animate-pulse' : 'text-[#07552F] group-hover:text-[#07843B]'
        }`} />
        <span className="sr-only">Busca por voz</span>
      </button>
    );
  }

  if (variant === 'navbar-pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        aria-label={title}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#07552F] bg-[#E9F6EC] hover:bg-[#d5eedb] hover:text-[#07843B] border border-[#07843B]/20 transition-all cursor-pointer shadow-xs ${className}`}
      >
        <Mic className="w-3.5 h-3.5 text-[#07843B]" />
        <span>Voz</span>
      </button>
    );
  }

  // Default: 'input-inline' inside a search input
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`relative p-1.5 rounded-full text-[#68746C] hover:text-[#07843B] hover:bg-[#E9F6EC] transition-all cursor-pointer ${
        isListening ? 'text-[#07843B] bg-[#E9F6EC] animate-pulse' : ''
      } ${className}`}
    >
      {isListening && (
        <span className="absolute inset-0 rounded-full bg-[#07843B]/20 animate-ping pointer-events-none" />
      )}
      <Mic className="w-4 h-4" />
      <span className="sr-only">Buscar por voz</span>
    </button>
  );
};
