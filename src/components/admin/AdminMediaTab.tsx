import React, { useState, useEffect } from 'react';
import { Business } from '../../types';
import { DataService } from '../../services/dataService';
import { 
  MediaService, 
  MEDIA_LIMITS, 
  PageBanner, 
  formatBytes,
  subscribeMediaChanges 
} from '../../services/mediaService';
import { ReelVideo } from '../home/VerticalVideoSection';
import { HeroSlide } from '../home/HeroCarousel';
import { MediaUploader } from './MediaUploader';
import { 
  Film, 
  Image as ImageIcon, 
  Store, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  Sliders, 
  Sparkles,
  Info,
  Maximize2,
  X,
  ExternalLink
} from 'lucide-react';

interface AdminMediaTabProps {
  businesses: Business[];
  onNotification: (message: string, type?: 'success' | 'error') => void;
  onRefresh: () => void;
}

export const AdminMediaTab: React.FC<AdminMediaTabProps> = ({
  businesses,
  onNotification,
  onRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'reels' | 'banners' | 'stores'>('reels');

  // Dynamic media states
  const [reels, setReels] = useState<ReelVideo[]>(() => MediaService.getReels());
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => MediaService.getHeroSlides());
  const [pageBanners, setPageBanners] = useState<PageBanner[]>(() => MediaService.getPageBanners());
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>(() => MediaService.getHeroVideo());

  // Listen for reactive media updates
  useEffect(() => {
    const unsubscribe = subscribeMediaChanges(() => {
      setReels(MediaService.getReels());
      setHeroSlides(MediaService.getHeroSlides());
      setPageBanners(MediaService.getPageBanners());
      setHeroVideoUrl(MediaService.getHeroVideo());
    });
    return unsubscribe;
  }, []);

  // --- REELS MODAL STATE ---
  const [isReelModalOpen, setIsReelModalOpen] = useState(false);
  const [editingReel, setEditingReel] = useState<ReelVideo | null>(null);
  const [reelForm, setReelForm] = useState({
    storeId: businesses[0]?.id || '',
    storeName: businesses[0]?.name || '',
    category: businesses[0]?.categoryId || 'Gastronomia',
    caption: '',
    videoUrl: '',
    posterUrl: '',
    whatsapp: businesses[0]?.whatsapp || '5511993456789',
    durationText: '0:15',
    likesCount: 150
  });

  // --- HERO SLIDE MODAL STATE ---
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [slideForm, setSlideForm] = useState({
    id: '',
    tag: '',
    title: '',
    titleHighlight: '',
    subtitle: '',
    image: ''
  });

  // --- STORE MEDIA MODAL STATE ---
  const [storeSearchQuery, setStoreSearchQuery] = useState('');
  const [editingStoreMedia, setEditingStoreMedia] = useState<Business | null>(null);
  const [storeMediaForm, setStoreMediaForm] = useState({
    logoUrl: '',
    coverUrl: ''
  });

  // Filtered stores for logo/media updates
  const filteredStores = businesses.filter(b => {
    if (!storeSearchQuery.trim()) return true;
    const q = storeSearchQuery.toLowerCase().trim();
    return b.name.toLowerCase().includes(q) || 
           b.neighborhood.toLowerCase().includes(q) ||
           b.categoryName?.toLowerCase().includes(q);
  });

  // --- REEL ACTIONS ---
  const handleOpenAddReel = () => {
    setEditingReel(null);
    const defaultStore = businesses[0];
    setReelForm({
      storeId: defaultStore?.id || '',
      storeName: defaultStore?.name || '',
      category: defaultStore?.categoryName || 'Comércio Local',
      caption: '',
      videoUrl: '',
      posterUrl: '',
      whatsapp: defaultStore?.whatsapp || '5511993456789',
      durationText: '0:15',
      likesCount: Math.floor(Math.random() * 200) + 50
    });
    setIsReelModalOpen(true);
  };

  const handleOpenEditReel = (reel: ReelVideo) => {
    setEditingReel(reel);
    setReelForm({
      storeId: reel.storeId,
      storeName: reel.storeName,
      category: reel.category,
      caption: reel.caption,
      videoUrl: reel.videoUrl,
      posterUrl: reel.posterUrl,
      whatsapp: reel.whatsapp,
      durationText: reel.durationText,
      likesCount: reel.likesCount
    });
    setIsReelModalOpen(true);
  };

  const handleSaveReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reelForm.videoUrl) {
      onNotification('Selecione ou informe um vídeo (máx 15MB).', 'error');
      return;
    }

    if (editingReel) {
      MediaService.updateReel(editingReel.id, reelForm);
      onNotification('Vídeo 9x16 atualizado com sucesso!');
    } else {
      MediaService.addReel(reelForm);
      onNotification('Novo vídeo 9x16 publicado na página inicial!');
    }
    setIsReelModalOpen(false);
  };

  const handleDeleteReel = (id: string, name: string) => {
    if (confirm(`Deseja remover o vídeo da loja "${name}" da página inicial?`)) {
      MediaService.deleteReel(id);
      onNotification('Vídeo removido da página inicial.');
    }
  };

  const handleResetReels = () => {
    if (confirm('Restaurar os vídeos de demonstração originais de Mairiporã?')) {
      MediaService.resetReels();
      onNotification('Vídeos padrão restaurados.');
    }
  };

  // --- SLIDE ACTIONS ---
  const handleOpenEditSlide = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setSlideForm({
      id: slide.id,
      tag: slide.tag,
      title: slide.title,
      titleHighlight: slide.titleHighlight,
      subtitle: slide.subtitle,
      image: slide.image
    });
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    MediaService.updateHeroSlide(editingSlide.id, {
      tag: slideForm.tag,
      title: slideForm.title,
      titleHighlight: slideForm.titleHighlight,
      subtitle: slideForm.subtitle,
      image: slideForm.image
    });

    onNotification(`Slide "${slideForm.tag}" atualizado com sucesso!`);
    setIsSlideModalOpen(false);
  };

  // --- BANNER ACTIONS ---
  const handleUpdatePageBannerImage = (bannerId: string, newImageUrl: string) => {
    if (!newImageUrl) return;
    MediaService.updatePageBanner(bannerId, { imageUrl: newImageUrl });
    onNotification('Banner da página inicial atualizado com sucesso!');
  };

  const handleResetBanners = () => {
    if (confirm('Restaurar os banners padrão da página inicial?')) {
      MediaService.resetPageBanners();
      MediaService.resetHeroSlides();
      onNotification('Banners e carrossel restaurados para o padrão.');
    }
  };

  // --- STORE MEDIA ACTIONS ---
  const handleOpenEditStoreMedia = (store: Business) => {
    setEditingStoreMedia(store);
    setStoreMediaForm({
      logoUrl: store.logoUrl || '',
      coverUrl: store.coverUrl || ''
    });
  };

  const handleSaveStoreMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStoreMedia) return;

    await DataService.updateBusiness(editingStoreMedia.id, {
      logoUrl: storeMediaForm.logoUrl,
      coverUrl: storeMediaForm.coverUrl
    });

    onNotification(`Logotipo e fotos de "${editingStoreMedia.name}" atualizados!`);
    setEditingStoreMedia(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Informative Header / Size Limits Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#EBF8F2] flex items-center justify-center text-[#00A86B]">
              <Film className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#17251D]">
              Gerenciamento de Mídias, Vídeos & Logotipos
            </h3>
          </div>
          <p className="text-xs text-[#68746C] mt-1">
            Controle total sobre vídeos verticais 9x16, banners do carrossel e logos dos comércios de Mairiporã.
          </p>
        </div>

        {/* Global Limits Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Logos: Máx {formatBytes(MEDIA_LIMITS.LOGO_MAX_BYTES)}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-900 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Banners: Máx {formatBytes(MEDIA_LIMITS.BANNER_MAX_BYTES)}
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[11px] text-purple-900 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            Vídeos 9x16: Máx {formatBytes(MEDIA_LIMITS.VIDEO_MAX_BYTES)}
          </div>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-[#F4FAF6] rounded-2xl border border-[#E2ECE5] max-w-fit">
        <button
          onClick={() => setActiveSubTab('reels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'reels'
              ? 'bg-[#00A86B] text-white shadow-xs'
              : 'text-[#68746C] hover:text-[#17251D]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Vídeos 9x16 (Reels Home)</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px]">
            {reels.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('banners')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'banners'
              ? 'bg-[#00A86B] text-white shadow-xs'
              : 'text-[#68746C] hover:text-[#17251D]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Banners & Carrossel</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px]">
            {heroSlides.length + pageBanners.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('stores')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'stores'
              ? 'bg-[#00A86B] text-white shadow-xs'
              : 'text-[#68746C] hover:text-[#17251D]'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Logos & Capas das Lojas</span>
          <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px]">
            {businesses.length}
          </span>
        </button>
      </div>

      {/* =========================================================================
          SUB-TAB 1: REELS (VÍDEOS VERTICAIS 9x16)
          ========================================================================= */}
      {activeSubTab === 'reels' && (
        <div className="space-y-6">
          {/* Action Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5EBE6]">
            <div>
              <h4 className="text-sm font-bold text-[#17251D]">
                Vídeos Curtos Verticais (9:16) da Página Inicial
              </h4>
              <p className="text-xs text-[#68746C]">
                Exibidos no carrossel de vídeos curtos para destacar os comércios locais de Mairiporã.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleResetReels}
                className="px-3 py-2 text-xs font-bold text-[#68746C] hover:text-red-600 bg-[#F7F9F7] hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-[#E5EBE6]"
                title="Restaurar vídeos originais"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar Originais</span>
              </button>
              <button
                onClick={handleOpenAddReel}
                className="flex-1 sm:flex-initial px-4 py-2 bg-[#00A86B] hover:bg-[#00553A] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Novo Vídeo 9x16</span>
              </button>
            </div>
          </div>

          {/* Reels Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reels.map((reel) => (
              <div 
                key={reel.id}
                className="bg-white rounded-2xl border border-[#E5EBE6] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                {/* 9:16 Aspect ratio video preview */}
                <div className="relative aspect-9/16 bg-black overflow-hidden group">
                  <video
                    src={reel.videoUrl}
                    poster={reel.posterUrl}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => (e.target as HTMLVideoElement).play().catch(() => {})}
                    onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                  />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {reel.durationText || '0:15'}
                  </div>
                  <div className="absolute top-2 right-2 bg-[#00A86B] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    9:16 Reel
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3 pointer-events-none">
                    <span className="text-white text-xs font-bold line-clamp-1">
                      {reel.storeName}
                    </span>
                    <span className="text-[#66CDAA] text-[10px] font-semibold">
                      {reel.category}
                    </span>
                  </div>
                </div>

                {/* Reel Info & Actions */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-[#17251D] line-clamp-2 italic">
                    "{reel.caption}"
                  </p>

                  <div className="pt-2 border-t border-[#E5EBE6] flex items-center justify-between">
                    <span className="text-[11px] text-[#68746C] font-semibold">
                      ♥ {reel.likesCount} curtidas
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditReel(reel)}
                        className="p-1.5 text-[#00A86B] hover:bg-[#EBF8F2] rounded-lg transition-colors cursor-pointer"
                        title="Editar vídeo"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteReel(reel.id, reel.storeName)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir vídeo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 2: BANNERS & CARROSSEL DA PÁGINA
          ========================================================================= */}
      {activeSubTab === 'banners' && (
        <div className="space-y-8">
          
          {/* Section: Hero Background Video (Looping) */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-[#E5EBE6]">
              <div>
                <h4 className="text-sm font-bold text-[#17251D] flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#00A86B]" />
                  Vídeo de Fundo do Carrossel Principal (Em Looping)
                </h4>
                <p className="text-xs text-[#68746C]">
                  Vídeo exibido continuamente no topo da página inicial com efeito cinematográfico e transição suave.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  MediaService.resetHeroVideo();
                  onNotification('Vídeo de fundo restaurado para o padrão conecta.mp4.');
                }}
                className="px-3 py-1.5 text-xs font-bold text-[#68746C] hover:text-[#00A86B] bg-[#F7F9F7] rounded-xl border border-[#E5EBE6] cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restaurar conecta.mp4</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Video Player Preview */}
              <div className="relative rounded-2xl overflow-hidden aspect-16/9 bg-black border border-[#E2ECE5] shadow-xs">
                <video
                  src={heroVideoUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Vídeo em Looping Ativo
                </div>
              </div>

              {/* Uploader / URL Field */}
              <div className="space-y-3">
                <MediaUploader
                  label="Substituir Vídeo de Fundo"
                  helperText="Selecione um arquivo de vídeo (máx 15MB) ou cole a URL direta (ex: https://gufomoda.com.br/conecta.mp4)."
                  mediaType="video"
                  maxSizeBytes={MEDIA_LIMITS.VIDEO_MAX_BYTES}
                  currentUrl={heroVideoUrl}
                  onMediaSelected={(newUrl) => {
                    if (newUrl) {
                      MediaService.saveHeroVideo(newUrl);
                      onNotification('Vídeo de fundo atualizado com sucesso!');
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Section A: Hero Slides */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE6]">
              <div>
                <h4 className="text-sm font-bold text-[#17251D] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  Slides do Carrossel Principal da Página (Topo)
                </h4>
                <p className="text-xs text-[#68746C]">
                  4 slides rotativos no topo do site com mensagens e imagens de alta resolução.
                </p>
              </div>
              <button
                onClick={handleResetBanners}
                className="px-3 py-1.5 text-xs font-bold text-[#68746C] hover:text-red-600 bg-[#F7F9F7] rounded-lg border border-[#E5EBE6] cursor-pointer"
              >
                Restaurar Imagens Padrão
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  className="p-4 rounded-xl border border-[#E5EBE6] bg-[#F7F9F7] flex flex-col sm:flex-row gap-4 items-center justify-between"
                >
                  <img
                    src={slide.image}
                    alt={slide.tag}
                    className="w-full sm:w-36 h-24 object-cover rounded-xl border border-[#E2ECE5] bg-white shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = slide.fallbackImage || '/images/hero_woman_mountain.png';
                    }}
                  />
                  <div className="flex-1 space-y-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#00A86B] bg-[#EBF8F2] px-2 py-0.5 rounded-md">
                      Slide 0{idx + 1}: {slide.tag}
                    </span>
                    <h5 className="text-xs font-bold text-[#17251D]">
                      {slide.title} <span className="text-[#00A86B]">{slide.titleHighlight}</span>
                    </h5>
                    <p className="text-[11px] text-[#68746C] line-clamp-1">
                      {slide.subtitle}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenEditSlide(slide)}
                    className="px-3 py-1.5 bg-white hover:bg-[#EBF8F2] text-[#00A86B] border border-[#CADBD0] rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Mudar Imagem</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: 3 Action Banners */}
          <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs space-y-4">
            <div>
              <h4 className="text-sm font-bold text-[#17251D] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#00A86B]" />
                3 Banners de Destaque da Página Inicial
              </h4>
              <p className="text-xs text-[#68746C]">
                Banners promocionais para Ofertas da Semana, Lojas no Mapa e Compre Local (Máx {formatBytes(MEDIA_LIMITS.BANNER_MAX_BYTES)}).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pageBanners.map((banner) => (
                <div key={banner.id} className="p-4 rounded-xl border border-[#E5EBE6] bg-[#F7F9F7] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#17251D]">{banner.title}</span>
                    <span className="text-[10px] font-semibold text-[#0F52BA] bg-blue-50 px-2 py-0.5 rounded-md">
                      Aba: {banner.targetTab}
                    </span>
                  </div>

                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-28 object-cover rounded-xl border border-[#E2ECE5] bg-white"
                  />

                  <MediaUploader
                    label="Substituir Imagem do Banner"
                    mediaType="image"
                    maxSizeBytes={MEDIA_LIMITS.BANNER_MAX_BYTES}
                    aspectRatioHint="Panorâmico 16:7"
                    currentUrl={banner.imageUrl}
                    onMediaSelected={(newUrl) => handleUpdatePageBannerImage(banner.id, newUrl)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 3: LOGOS & CAPAS DAS LOJAS
          ========================================================================= */}
      {activeSubTab === 'stores' && (
        <div className="space-y-6">
          {/* Search bar and counter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E5EBE6]">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={storeSearchQuery}
                onChange={(e) => setStoreSearchQuery(e.target.value)}
                placeholder="Buscar comércio por nome ou bairro..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] outline-none text-[#17251D]"
              />
            </div>
            <div className="text-xs font-semibold text-[#68746C]">
              Mostrando {filteredStores.length} de {businesses.length} estabelecimentos
            </div>
          </div>

          {/* Stores Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStores.map((store) => (
              <div
                key={store.id}
                className="bg-white rounded-2xl border border-[#E5EBE6] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Store Header & Cover */}
                <div className="relative h-24 bg-[#EBF8F2] overflow-hidden">
                  {store.coverUrl ? (
                    <img
                      src={store.coverUrl}
                      alt={store.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#68746C] text-xs">
                      Sem foto de capa
                    </div>
                  )}

                  {/* Logo overlay */}
                  <div className="absolute -bottom-4 left-4 w-14 h-14 rounded-xl border-2 border-white bg-white shadow-sm overflow-hidden flex items-center justify-center">
                    {store.logoUrl ? (
                      <img
                        src={store.logoUrl}
                        alt={store.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <Store className="w-6 h-6 text-[#00A86B]" />
                    )}
                  </div>
                </div>

                {/* Store Information */}
                <div className="p-4 pt-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-[#17251D] line-clamp-1">
                      {store.name}
                    </h5>
                    <span className="text-[11px] text-[#68746C] block">
                      {store.neighborhood} • {store.categoryName || 'Comércio'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#E5EBE6] flex items-center justify-end">
                    <button
                      onClick={() => handleOpenEditStoreMedia(store)}
                      className="w-full px-3 py-2 bg-[#F4FAF6] hover:bg-[#EBF8F2] text-[#00A86B] border border-[#CADBD0] rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Mudar Logo & Foto de Capa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD / EDIT REEL (9:16 VIDEO)
          ========================================================================= */}
      {isReelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#E5EBE6] flex items-center justify-between bg-[#F7F9F7]">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#00A86B]" />
                <h3 className="text-sm font-bold text-[#17251D]">
                  {editingReel ? 'Editar Vídeo 9x16 (Reel)' : 'Cadastrar Novo Vídeo 9x16 (Reel)'}
                </h3>
              </div>
              <button
                onClick={() => setIsReelModalOpen(false)}
                className="text-[#68746C] hover:text-[#17251D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Select Business */}
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Estabelecimento Comercial Associado
                </label>
                <select
                  value={reelForm.storeId}
                  onChange={(e) => {
                    const found = businesses.find(b => b.id === e.target.value);
                    if (found) {
                      setReelForm({
                        ...reelForm,
                        storeId: found.id,
                        storeName: found.name,
                        category: found.categoryName || reelForm.category,
                        whatsapp: found.whatsapp || reelForm.whatsapp
                      });
                    }
                  }}
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D] bg-white outline-none"
                >
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.neighborhood})
                    </option>
                  ))}
                </select>
              </div>

              {/* Video Uploader (Max 15MB) */}
              <MediaUploader
                label="Arquivo de Vídeo Vertical (9:16)"
                helperText="Vídeo curto no formato vertical para o carrossel da home (MP4 ou WebM)."
                mediaType="video"
                maxSizeBytes={MEDIA_LIMITS.VIDEO_MAX_BYTES}
                aspectRatioHint="Vertical 9:16"
                currentUrl={reelForm.videoUrl}
                onMediaSelected={(url) => setReelForm({ ...reelForm, videoUrl: url })}
              />

              {/* Poster Image Uploader (Max 1.0MB) */}
              <MediaUploader
                label="Imagem de Capa do Vídeo (Poster)"
                helperText="Imagem estática que aparece antes do vídeo iniciar."
                mediaType="image"
                maxSizeBytes={MEDIA_LIMITS.LOGO_MAX_BYTES}
                aspectRatioHint="Vertical 9:16"
                currentUrl={reelForm.posterUrl}
                onMediaSelected={(url) => setReelForm({ ...reelForm, posterUrl: url })}
              />

              {/* Caption */}
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Legenda / Chamada do Vídeo
                </label>
                <textarea
                  required
                  rows={2}
                  value={reelForm.caption}
                  onChange={(e) => setReelForm({ ...reelForm, caption: e.target.value })}
                  placeholder="Ex: Pratos deliciosos preparados com ingredientes frescos da nossa serra."
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D] outline-none"
                />
              </div>

              {/* Duration and Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Duração Estimada
                  </label>
                  <input
                    type="text"
                    value={reelForm.durationText}
                    onChange={(e) => setReelForm({ ...reelForm, durationText: e.target.value })}
                    placeholder="0:15"
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Categoria Exibida
                  </label>
                  <input
                    type="text"
                    value={reelForm.category}
                    onChange={(e) => setReelForm({ ...reelForm, category: e.target.value })}
                    placeholder="Gastronomia"
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D] outline-none"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#E5EBE6] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReelModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#68746C] hover:text-[#17251D] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A86B] hover:bg-[#00553A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  {editingReel ? 'Salvar Alterações' : 'Publicar Vídeo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT HERO SLIDE
          ========================================================================= */}
      {isSlideModalOpen && editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#E5EBE6] flex items-center justify-between bg-[#F7F9F7]">
              <h3 className="text-sm font-bold text-[#17251D]">
                Editar Slide do Carrossel: {slideForm.tag}
              </h3>
              <button
                onClick={() => setIsSlideModalOpen(false)}
                className="text-[#68746C] hover:text-[#17251D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSlide} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Image Uploader (Max 1.5MB) */}
              <MediaUploader
                label="Imagem do Slide (Alta Resolução)"
                helperText="Imagem de fundo nítida para a seção inicial do site."
                mediaType="image"
                maxSizeBytes={MEDIA_LIMITS.BANNER_MAX_BYTES}
                aspectRatioHint="16:9 Panorâmico"
                currentUrl={slideForm.image}
                onMediaSelected={(url) => setSlideForm({ ...slideForm, image: url })}
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Tag / Categoria
                  </label>
                  <input
                    type="text"
                    required
                    value={slideForm.tag}
                    onChange={(e) => setSlideForm({ ...slideForm, tag: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Palavra Destaque
                  </label>
                  <input
                    type="text"
                    required
                    value={slideForm.titleHighlight}
                    onChange={(e) => setSlideForm({ ...slideForm, titleHighlight: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Subtítulo Explicativo
                </label>
                <input
                  type="text"
                  required
                  value={slideForm.subtitle}
                  onChange={(e) => setSlideForm({ ...slideForm, subtitle: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-xl focus:border-[#00A86B] text-[#17251D]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#E5EBE6] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSlideModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-[#68746C] hover:text-[#17251D] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A86B] hover:bg-[#00553A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Salvar Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT STORE LOGO & COVER
          ========================================================================= */}
      {editingStoreMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6] max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-[#E5EBE6] flex items-center justify-between bg-[#F7F9F7]">
              <div>
                <h3 className="text-sm font-bold text-[#17251D]">
                  Logotipo & Capa: {editingStoreMedia.name}
                </h3>
                <span className="text-[11px] text-[#68746C]">
                  {editingStoreMedia.neighborhood} • {editingStoreMedia.categoryName}
                </span>
              </div>
              <button
                onClick={() => setEditingStoreMedia(null)}
                className="text-[#68746C] hover:text-[#17251D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStoreMedia} className="p-5 space-y-4 overflow-y-auto flex-1">
              {/* Store Logo (Max 1.0MB) */}
              <MediaUploader
                label="Logotipo da Loja"
                helperText="Formato quadrado ou transparente (PNG, SVG, JPG). Máximo de 1.0 MB."
                mediaType="image"
                maxSizeBytes={MEDIA_LIMITS.LOGO_MAX_BYTES}
                aspectRatioHint="Quadrado 1:1"
                currentUrl={storeMediaForm.logoUrl}
                onMediaSelected={(url) => setStoreMediaForm({ ...storeMediaForm, logoUrl: url })}
              />

              {/* Store Cover (Max 1.5MB) */}
              <MediaUploader
                label="Foto de Capa / Fachada da Loja"
                helperText="Imagem da fachada ou ambiente do estabelecimento. Máximo de 1.5 MB."
                mediaType="image"
                maxSizeBytes={MEDIA_LIMITS.IMAGE_MAX_BYTES}
                aspectRatioHint="Panorâmico 16:9"
                currentUrl={storeMediaForm.coverUrl}
                onMediaSelected={(url) => setStoreMediaForm({ ...storeMediaForm, coverUrl: url })}
              />

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#E5EBE6] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingStoreMedia(null)}
                  className="px-4 py-2 text-xs font-bold text-[#68746C] hover:text-[#17251D] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#00A86B] hover:bg-[#00553A] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Salvar Mídias da Loja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
