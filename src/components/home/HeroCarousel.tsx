import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ActiveTab } from '../../types';
import { 
  Search, 
  ShieldCheck, 
  Truck, 
  Tag, 
  Heart, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play,
  UtensilsCrossed,
  Shirt,
  Home,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { VoiceSearchButton } from '../common/VoiceSearchButton';
import { VoiceSearchModal } from '../common/VoiceSearchModal';

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
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const slides: HeroSlide[] = [
    {
      id: 'slide-comercio',
      tag: 'Comércio Local & Lojas',
      title: 'Compre em',
      titleHighlight: 'Mairiporã',
      subtitle: 'O comércio local mais perto de você.',
      image: '/images/hero_woman_clean.png',
      fallbackImage: '/images/hero_woman_mountain.png',
      badges: [
        { icon: ShieldCheck, text: 'Lojas de confiança' },
        { icon: Truck, text: 'Retire na loja' },
        { icon: Tag, text: 'Promoções exclusivas' },
        { icon: Heart, text: 'Fortaleça a nossa cidade' }
      ],
      primaryCta: { label: 'Explorar Lojas', tab: 'stores' },
      secondaryCta: { label: 'Ver Promoções', tab: 'offers' }
    },
    {
      id: 'slide-gastronomia',
      tag: 'Gastronomia & Restaurantes',
      title: 'Compre em',
      titleHighlight: 'Mairiporã',
      subtitle: 'Sabores, gastronomia e os melhores restaurantes da nossa serra.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
      fallbackImage: '/images/store_restaurante.png',
      badges: [
        { icon: UtensilsCrossed, text: 'Restaurantes & Cafés' },
        { icon: Truck, text: 'Delivery rápido' },
        { icon: Tag, text: 'Cardápios no WhatsApp' },
        { icon: Heart, text: 'Valorize os chefs locais' }
      ],
      primaryCta: { label: 'Ver Restaurantes', tab: 'stores', params: { categoryId: 'restaurantes' } },
      secondaryCta: { label: 'Ver Promoções', tab: 'offers' }
    },
    {
      id: 'slide-moda',
      tag: 'Moda, Estilo & Presentes',
      title: 'Compre em',
      titleHighlight: 'Mairiporã',
      subtitle: 'Boutiques, artesanato e presentes especiais pertinho de casa.',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80',
      fallbackImage: '/images/store_moda.png',
      badges: [
        { icon: Shirt, text: 'Moda feminina & masculina' },
        { icon: ShieldCheck, text: 'Atendimento próximo' },
        { icon: Tag, text: 'Ofertas da estação' },
        { icon: Heart, text: 'Apoie o comerciante local' }
      ],
      primaryCta: { label: 'Ver Moda & Estilo', tab: 'stores', params: { categoryId: 'moda' } },
      secondaryCta: { label: 'Todas as Categorias', tab: 'categories' }
    },
    {
      id: 'slide-casa',
      tag: 'Casa, Construção & Campo',
      title: 'Compre em',
      titleHighlight: 'Mairiporã',
      subtitle: 'Materiais, ferramentas, flores e soluções para seu lar e chácara.',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
      fallbackImage: '/images/store_construcao.png',
      badges: [
        { icon: Home, text: 'Materiais para sua casa' },
        { icon: Truck, text: 'Entregas na região' },
        { icon: Tag, text: 'Orçamento direto no Zap' },
        { icon: Heart, text: 'Desenvolvimento local' }
      ],
      primaryCta: { label: 'Casa & Construção', tab: 'stores', params: { categoryId: 'casa-construcao' } },
      secondaryCta: { label: 'Cadastrar Loja', tab: 'register-business' }
    }
  ];

  const totalSlides = slides.length;

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Autoplay effect with exact 5-second interval and pause-on-hover support
  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        goToNextSlide();
      }, 5000); // Exatos 5 segundos solicitados
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, currentSlideIndex, goToNextSlide]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <section 
      className="relative overflow-hidden bg-[#07552F]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="Carrossel Principal de Destaques"
    >
      {/* Background Images Layer with smooth cross-fade */}
      <div className="absolute inset-0 z-0 flex justify-end overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <div className="relative w-full lg:w-3/5 h-full ml-auto">
                <img
                  src={slide.image}
                  alt={`${slide.title} ${slide.titleHighlight} - ${slide.tag}`}
                  className="w-full h-full object-cover object-center lg:object-left transform transition-transform duration-7000 ease-out scale-100"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== slide.fallbackImage) {
                      target.src = slide.fallbackImage;
                    }
                  }}
                />
                {/* Gradient overlays matching brand guidelines: #07552F */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#07552F] via-[#07552F]/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07552F]/95 via-transparent to-black/25" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative backdrop glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#35B956]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20 md:pt-16 md:pb-24">
        <div className="max-w-2xl">
          
          {/* Slide Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#35B956]/20 border border-[#35B956]/30 text-white text-xs font-semibold backdrop-blur-xs mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#F4E500]" />
            <span>{currentSlide.tag}</span>
          </div>

          {/* Main Headline - Required: 'Compre em Mairiporã' */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-none min-h-[90px] sm:min-h-[115px]">
            {currentSlide.title} <br />
            <span className="text-[#35B956]">{currentSlide.titleHighlight}</span>
          </h1>

          {/* Subtitle with smooth transition */}
          <p className="mt-3 text-base sm:text-xl text-white/95 font-medium min-h-[48px] sm:min-h-[30px]">
            {currentSlide.subtitle}
          </p>

          {/* 4 Badges */}
          <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-white/90 font-medium">
            {currentSlide.badges.map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div key={idx} className="flex items-center gap-1.5 bg-black/20 sm:bg-transparent px-2.5 py-1 sm:p-0 rounded-lg sm:rounded-none backdrop-blur-xs sm:backdrop-blur-none border border-white/10 sm:border-none">
                  <Icon className="w-4 h-4 text-[#35B956] shrink-0" />
                  <span>{badge.text}</span>
                </div>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {currentSlide.primaryCta && (
              <button
                onClick={() => onNavigate(currentSlide.primaryCta!.tab, currentSlide.primaryCta!.params)}
                className="px-5 py-2.5 bg-[#07843B] hover:bg-white hover:text-[#07552F] text-white font-semibold text-xs sm:text-sm rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer border border-[#35B956]/30"
              >
                <span>{currentSlide.primaryCta.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {currentSlide.secondaryCta && (
              <button
                onClick={() => onNavigate(currentSlide.secondaryCta!.tab, currentSlide.secondaryCta!.params)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-full transition-colors border border-white/20 cursor-pointer backdrop-blur-xs"
              >
                <span>{currentSlide.secondaryCta.label}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Carousel Navigation Arrows & Slide Indicators */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-14 mb-4 flex items-center justify-between pointer-events-none">
        
        {/* Indicators and Counter */}
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 pointer-events-auto">
          {slides.map((_, index) => {
            const isActive = index === currentSlideIndex;
            return (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`relative h-2 rounded-full overflow-hidden transition-all duration-300 cursor-pointer ${
                  isActive ? 'w-8 sm:w-10 bg-white/20' : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              >
                {isActive && (
                  <span
                    key={`progress-${currentSlideIndex}-${isPaused}`}
                    className="absolute inset-0 bg-[#35B956] rounded-full animate-carousel-progress"
                    style={{
                      animationPlayState: isPaused ? 'paused' : 'running'
                    }}
                  />
                )}
              </button>
            );
          })}
          <span className="text-[11px] font-medium text-white/90 pl-1 border-l border-white/20">
            0{currentSlideIndex + 1} / 0{totalSlides}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer ml-1 p-0.5"
            title={isPaused ? "Retomar rotação automática" : "Pausar rotação automática"}
            aria-label={isPaused ? "Retomar" : "Pausar"}
          >
            {isPaused ? <Play className="w-3 h-3 text-[#F4E500]" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        {/* Arrow Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={goToPrevSlide}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-[#07843B] text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
            aria-label="Slide anterior"
            title="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNextSlide}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/30 hover:bg-[#07843B] text-white backdrop-blur-md border border-white/15 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
            aria-label="Próximo slide"
            title="Próximo slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>

      {/* Floating Search Bar (Campo de pesquisa branco, Botão de pesquisa verde #07843B) */}
      <div className="relative z-30 max-w-3xl mx-auto px-4 mt-6 sm:mt-8">
        <form 
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-full p-2 pl-6 shadow-md border border-[#E5EBE6] flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
            <Search className="w-5 h-5 text-[#68746C] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="O que você está procurando em Mairiporã?"
              className="w-full text-xs sm:text-sm text-[#17251D] placeholder-[#68746C] bg-transparent focus:outline-none truncate font-normal"
            />
            <VoiceSearchButton
              variant="input-inline"
              className="shrink-0 text-[#07552F] hover:text-[#07843B]"
              onClick={() => setIsVoiceModalOpen(true)}
              title="Buscar por voz em Mairiporã"
            />
          </div>
          <button
            type="submit"
            className="px-6 sm:px-8 py-3 bg-[#07843B] hover:bg-[#07552F] text-white font-semibold text-xs sm:text-sm rounded-full transition-colors shrink-0 shadow-xs cursor-pointer"
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

      {/* Bottom smooth clean transition to body */}
      <div className="h-6 bg-[#F7F9F7] rounded-t-3xl mt-4" />
    </section>
  );
};
