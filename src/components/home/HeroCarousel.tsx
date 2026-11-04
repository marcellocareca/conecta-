import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab } from '../../types';
import { 
  Search, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Heart, 
  ArrowRight, 
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react';
import { VoiceSearchButton } from '../common/VoiceSearchButton';
import { VoiceSearchModal } from '../common/VoiceSearchModal';
import { WaveDivider } from '../common/WaveDivider';
import { MediaService, subscribeMediaChanges } from '../../services/mediaService';

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  image: string;
  fallbackImage: string;
  badges: Array<{
    icon: React.ComponentType<{ className?: string }>;
    text: string;
  }>;
  primaryCta?: {
    label: string;
    tab: ActiveTab;
    params?: any;
  };
  secondaryCta?: {
    label: string;
    tab: ActiveTab;
    params?: any;
  };
}

interface HeroCarouselProps {
  onNavigate: (tab: ActiveTab, params?: any) => void;
  onSearch: (searchTerm: string) => void;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({ onNavigate, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(() => MediaService.getHeroVideo());
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Subscribe to media updates (e.g. if admin updates video)
  useEffect(() => {
    const unsubscribe = subscribeMediaChanges(() => {
      setHeroVideoUrl(MediaService.getHeroVideo());
    });
    return unsubscribe;
  }, []);

  // Ensure video autoplays smoothly on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay policy handled silently
      });
    }
  }, [heroVideoUrl]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const badges = [
    { icon: ShieldCheck, text: 'Lojas de confiança' },
    { icon: Truck, text: 'Retire na loja' },
    { icon: Tag, text: 'Promoções exclusivas' },
    { icon: Heart, text: 'Fortaleça a nossa cidade' }
  ];

  return (
    <section 
      className="relative overflow-hidden bg-black"
      aria-label="Destaque Principal com Vídeo em Looping"
    >
      {/* 
        BACKGROUND VIDEO LAYER: Fills the entire page without cropping, in original format with continuous looping.
        Green background removed completely as requested.
      */}
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          key={heroVideoUrl}
          src={heroVideoUrl}
          autoPlay
          loop
          muted={isVideoMuted}
          playsInline
          onError={() => {
            console.warn('Hero video playback error handled');
          }}
          className="w-full h-full object-cover object-center"
        />
        {/* Soft neutral dark overlay for text legibility - zero green tint */}
        <div className="absolute inset-0 bg-black/40 backdrop-brightness-95" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-14 md:pt-16 md:pb-18">
        <div className="max-w-2xl">
          
          {/* Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/20 text-white text-xs font-semibold backdrop-blur-md mb-4 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>Comércio Local & Lojas de Mairiporã</span>
          </div>

          {/* Main Headline - Over clean video background without green background */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight sm:leading-none drop-shadow-xl">
            Compre em <br />
            <span className="text-[#66CDAA] drop-shadow-lg">Mairiporã</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-xl text-white font-medium leading-relaxed max-w-xl drop-shadow-md">
            O comércio local mais perto de você. Encontre lojas, gastronomia, produtos e serviços exclusivos da nossa serra.
          </p>

          {/* 4 Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-white/95 font-medium">
            {badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-1.5 bg-black/25 sm:bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/15">
                  <Icon className="w-4 h-4 text-[#FFD700] shrink-0" />
                  <span>{badge.text}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Action Buttons & Sound Toggle */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('stores')}
              className="px-6 py-3 bg-[#00A86B] hover:bg-white hover:text-[#00553A] text-white font-bold text-xs sm:text-sm rounded-full transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer border border-[#66CDAA]/40 active:scale-95"
            >
              <span>Explorar Lojas</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('offers')}
              className="px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm rounded-full transition-colors border border-white/25 cursor-pointer backdrop-blur-md"
            >
              <span>Ver Promoções</span>
            </button>

            {/* Audio Toggle Button for Background Video */}
            <button
              type="button"
              onClick={() => setIsVideoMuted(!isVideoMuted)}
              className="px-3.5 py-2.5 bg-black/35 hover:bg-black/55 text-white rounded-full border border-white/20 text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              title={isVideoMuted ? "Ativar som do vídeo" : "Desativar som do vídeo"}
            >
              {isVideoMuted ? (
                <>
                  <VolumeX className="w-4 h-4 text-white/80" />
                  <span className="hidden sm:inline text-[11px] text-white/80">Sem som</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#66CDAA]" />
                  <span className="hidden sm:inline text-[11px] text-[#66CDAA] font-bold">Som ativo</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Floating Search Bar with clean glassmorphic aesthetic */}
      <div className="relative z-30 max-w-3xl mx-auto px-3 sm:px-4 mt-2 sm:mt-4 mb-3 sm:mb-6">
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white/95 backdrop-blur-md rounded-full p-1.5 sm:p-2 pl-4 sm:pl-6 shadow-2xl border border-white/70 flex items-center justify-between gap-1.5 sm:gap-2 ring-4 ring-black/10 transition-all hover:ring-[#66CDAA]/30"
        >
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 pr-1 sm:pr-2">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#586B60] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="O que procura em Mairiporã?"
              className="w-full text-xs sm:text-sm text-[#00553A] placeholder-[#586B60] bg-transparent focus:outline-none truncate font-medium"
            />
            <VoiceSearchButton
              variant="input-inline"
              className="shrink-0 text-[#00A86B] hover:text-[#00553A]"
              onClick={() => setIsVoiceModalOpen(true)}
              title="Buscar por voz em Mairiporã"
            />
          </div>
          <button
            type="submit"
            className="px-5 sm:px-8 py-2.5 sm:py-3 bg-[#00A86B] hover:bg-[#00553A] text-white font-bold text-xs sm:text-sm rounded-full transition-all shrink-0 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Voice Search Modal Popup */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={(spokenQuery) => {
          setSearchTerm(spokenQuery);
          onSearch(spokenQuery);
        }}
        initialQuery={searchTerm}
      />

      {/* 
        ORGANIC WAVE TRANSITION: Seamless flush transition from Hero (#00553A) to next section (#EBF8F2)
      */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <WaveDivider 
          variant="organic-1" 
          fillColor="#EBF8F2" 
          secondaryFill="#66CDAA" 
          position="top" 
          className="w-full block" 
          heightClassName="h-12 sm:h-16 md:h-24 lg:h-28"
        />
      </div>
    </section>
  );
};
