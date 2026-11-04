import React, { useState, useEffect, useRef } from 'react';
import { ActiveTab } from '../../types';
import { MediaService, subscribeMediaChanges } from '../../services/mediaService';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingBag, 
  Store as StoreIcon, 
  MessageCircle, 
  Sparkles, 
  Heart, 
  X,
  Share2
} from 'lucide-react';

export interface ReelVideo {
  id: string;
  storeId: string;
  storeName: string;
  category: string;
  categoryColor?: string;
  caption: string;
  videoUrl: string;
  posterUrl: string;
  whatsapp: string;
  likesCount: number;
  durationText: string;
}

interface VerticalVideoSectionProps {
  onSelectStore?: (storeId: string) => void;
  onNavigate?: (tab: ActiveTab, params?: any) => void;
  isDarkTheme?: boolean;
}

export const VerticalVideoSection: React.FC<VerticalVideoSectionProps> = ({ 
  onSelectStore, 
  onNavigate,
  isDarkTheme = true
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [activeModalVideo, setActiveModalVideo] = useState<ReelVideo | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const [reels, setReels] = useState<ReelVideo[]>(() => MediaService.getReels());

  useEffect(() => {
    // Subscribe to media changes made in Admin panel
    const unsubscribe = subscribeMediaChanges(() => {
      setReels(MediaService.getReels());
    });
    return unsubscribe;
  }, []);

  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (playingVideoId === id) {
      video.pause();
      setPlayingVideoId(null);
    } else {
      // Pause any previously playing video
      if (playingVideoId && videoRefs.current[playingVideoId]) {
        videoRefs.current[playingVideoId]?.pause();
      }
      video.play().then(() => {
        setPlayingVideoId(id);
      }).catch(() => {
        // Fallback if autoplay policy kicks in
        video.muted = true;
        setIsMuted(true);
        video.play();
        setPlayingVideoId(id);
      });
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    Object.values(videoRefs.current).forEach(vid => {
      if (vid) vid.muted = newMuted;
    });
  };

  const handleToggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  const openWhatsApp = (e: React.MouseEvent, whatsapp: string, storeName: string) => {
    e.stopPropagation();
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Vi o vídeo de vocês no Conecta Mairiporã e gostaria de mais informações!`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-6" aria-label="Vídeos em Formato 9x16">
      {/* Header da Seção */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
            isDarkTheme 
              ? 'bg-[#F4E500] text-[#17251D] shadow-sm' 
              : 'bg-[#E9F6EC] border border-[#07843B]/20 text-[#07552F]'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 ${isDarkTheme ? 'text-[#07552F]' : 'text-[#07843B]'}`} />
            <span>VÍDEOS & REELS EM 9:16</span>
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold tracking-tight ${
            isDarkTheme ? 'text-white' : 'text-[#17251D]'
          }`}>
            Comércio em Ação em Mairiporã
          </h2>
          <p className={`text-xs sm:text-sm mt-1 font-normal ${
            isDarkTheme ? 'text-[#E9F6EC]/90' : 'text-[#68746C]'
          }`}>
            Assista a vídeos rápidos gravados pelas lojas locais, conheça produtos e fale diretamente no WhatsApp.
          </p>
        </div>

        {/* Global Sound & Scroll Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMute}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shadow-xs cursor-pointer ${
              isDarkTheme
                ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                : 'bg-white border border-[#E5EBE6] text-[#17251D] hover:bg-[#E9F6EC] hover:text-[#07843B]'
            }`}
            title={isMuted ? "Ativar som dos vídeos" : "Silenciar áudio"}
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-[#F4E500]" />
                <span className="hidden sm:inline">Sem Som</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#35B956]" />
                <span className="hidden sm:inline font-semibold text-[#35B956]">Com Som</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={scrollLeft}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                isDarkTheme
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-white border border-[#E5EBE6] text-[#17251D] hover:text-[#07843B] hover:bg-[#E9F6EC]'
              }`}
              aria-label="Vídeos anteriores"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-xs cursor-pointer ${
                isDarkTheme
                  ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                  : 'bg-white border border-[#E5EBE6] text-[#17251D] hover:text-[#07843B] hover:bg-[#E9F6EC]'
              }`}
              aria-label="Próximos vídeos"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* 9:16 Video Carousel Container */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {reels.map(reel => {
          const isPlaying = playingVideoId === reel.id;
          const isLiked = likedMap[reel.id] || false;

          return (
            <div
              key={reel.id}
              className="snap-start shrink-0 w-[240px] sm:w-[270px] md:w-[280px]"
            >
              {/* Card no formato estrito 9:16 */}
              <div 
                onClick={() => handleTogglePlay(reel.id)}
                className="relative aspect-[9/16] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-black shadow-sm hover:shadow-md transition-all duration-300 border border-[#E5EBE6] cursor-pointer group select-none"
              >
                {/* HTML5 Video in 9:16 format with cover */}
                <video
                  ref={el => { videoRefs.current[reel.id] = el; }}
                  src={reel.videoUrl}
                  poster={reel.posterUrl}
                  loop
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  onError={(e) => {
                    (e.target as HTMLVideoElement).style.opacity = '0';
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
                />

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 pointer-events-none" />

                {/* Top Bar inside Card */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2.5 py-1 rounded-full bg-[#07843B]/90 backdrop-blur-md text-white text-[11px] font-semibold tracking-wide shadow-xs">
                    {reel.category}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Badge 9:16 */}
                    <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-[10px] font-bold text-[#F4E500] border border-white/10">
                      9:16
                    </span>
                    {/* Expand Modal Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalVideo(reel);
                      }}
                      className="p-1.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white transition-colors cursor-pointer"
                      title="Assistir ampliado"
                      aria-label="Expandir vídeo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Center Play/Pause Indicator Icon */}
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 z-10 pointer-events-none ${
                    isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110">
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-white" />
                    ) : (
                      <Play className="w-6 h-6 text-[#35B956] fill-[#35B956] ml-1" />
                    )}
                  </div>
                </div>

                {/* Right Side Social Actions inside 9:16 Reel */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-3 z-10">
                  {/* Like button */}
                  <button
                    onClick={(e) => handleToggleLike(e, reel.id)}
                    className="flex flex-col items-center gap-0.5 group/btn cursor-pointer"
                    title="Curtir"
                  >
                    <div className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                      isLiked ? 'bg-red-500 text-white scale-110' : 'bg-black/40 text-white hover:bg-black/60'
                    }`}>
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </div>
                    <span className="text-[10px] font-semibold text-white drop-shadow-xs">
                      {isLiked ? reel.likesCount + 1 : reel.likesCount}
                    </span>
                  </button>

                  {/* Share button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: reel.storeName,
                          text: `Confira o vídeo de ${reel.storeName} no Conecta Mairiporã: ${reel.caption}`,
                          url: window.location.href
                        }).catch(() => {});
                      }
                    }}
                    className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer"
                    title="Compartilhar"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
                  {/* Store Name & Store Icon */}
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full bg-[#07843B] flex items-center justify-center shrink-0 border border-white/30">
                      <StoreIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-bold text-xs sm:text-sm truncate drop-shadow-xs text-white">
                      {reel.storeName}
                    </span>
                  </div>

                  {/* Video Caption */}
                  <p className="text-[11px] sm:text-xs text-white/90 line-clamp-2 leading-relaxed mb-3 drop-shadow-xs font-normal">
                    {reel.caption}
                  </p>

                  {/* Action Buttons: Ver Loja + WhatsApp */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectStore) {
                          onSelectStore(reel.storeId);
                        } else if (onNavigate) {
                          onNavigate('stores');
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white text-white hover:text-[#07552F] text-[11px] font-semibold backdrop-blur-md transition-colors flex items-center justify-center gap-1 cursor-pointer border border-white/25"
                    >
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      <span>Ver Loja</span>
                    </button>

                    <button
                      onClick={(e) => openWhatsApp(e, reel.whatsapp, reel.storeName)}
                      className="px-2.5 py-1.5 rounded-lg bg-[#07843B] hover:bg-[#35B956] text-white text-[11px] font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      title="Conversar no WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3 shrink-0 fill-current" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Modal Viewer for 9:16 Video */}
      {activeModalVideo && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveModalVideo(null)}
        >
          <div 
            className="relative w-full max-w-sm aspect-[9/16] max-h-[90vh] bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalVideo(null)}
              className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer border border-white/20"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player */}
            <video
              src={activeModalVideo.videoUrl}
              poster={activeModalVideo.posterUrl}
              autoPlay
              loop
              controls
              playsInline
              onError={(e) => {
                console.warn('Video failed to load in modal:', activeModalVideo.videoUrl);
              }}
              className="w-full h-full object-cover"
            />

            {/* Bottom Bar in Modal */}
            <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent text-white pointer-events-auto">
              <span className="px-2.5 py-1 rounded-full bg-[#07843B] text-white text-xs font-semibold">
                {activeModalVideo.category}
              </span>
              <h3 className="font-bold text-base mt-2 text-white">
                {activeModalVideo.storeName}
              </h3>
              <p className="text-xs text-white/90 mt-1 line-clamp-2">
                {activeModalVideo.caption}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    const sid = activeModalVideo.storeId;
                    setActiveModalVideo(null);
                    if (onSelectStore) onSelectStore(sid);
                  }}
                  className="flex-1 py-2 rounded-xl bg-white text-[#07552F] font-semibold text-xs hover:bg-[#E9F6EC] transition-colors"
                >
                  Visitar Perfil da Loja
                </button>
                <button
                  onClick={(e) => openWhatsApp(e, activeModalVideo.whatsapp, activeModalVideo.storeName)}
                  className="px-4 py-2 rounded-xl bg-[#07843B] hover:bg-[#07552F] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
