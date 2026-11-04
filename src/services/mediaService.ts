import { ReelVideo } from '../components/home/VerticalVideoSection';
import { HeroSlide } from '../components/home/HeroCarousel';
import { DBStorage } from './dbStorage';
import { 
  ShieldCheck, 
  Truck, 
  Tag, 
  Heart, 
  UtensilsCrossed, 
  Shirt, 
  Home 
} from 'lucide-react';

export interface PageBanner {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  targetTab: 'offers' | 'stores' | 'about' | 'categories';
}

export const MEDIA_LIMITS = {
  LOGO_MAX_BYTES: 1.0 * 1024 * 1024,      // 1.0 MB
  IMAGE_MAX_BYTES: 1.5 * 1024 * 1024,     // 1.5 MB
  BANNER_MAX_BYTES: 1.5 * 1024 * 1024,    // 1.5 MB
  VIDEO_MAX_BYTES: 15.0 * 1024 * 1024     // 15.0 MB (Short 9x16 videos)
};

export const formatBytes = (bytes: number, decimals: number = 1): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const validateFile = (
  file: File, 
  maxBytes: number, 
  allowedTypes: string[]
): { valid: boolean; error?: string; sizeFormatted: string } => {
  const sizeFormatted = formatBytes(file.size);
  const maxFormatted = formatBytes(maxBytes);

  // Check MIME type
  const isTypeValid = allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.replace('/*', '');
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });

  if (!isTypeValid) {
    return {
      valid: false,
      error: `Formato de arquivo não suportado (${file.type || 'desconhecido'}). Formatos aceitos: ${allowedTypes.join(', ')}.`,
      sizeFormatted
    };
  }

  // Check file size limit
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Arquivo muito pesado (${sizeFormatted}). O limite máximo é de ${maxFormatted} para manter a plataforma leve e rápida.`,
      sizeFormatted
    };
  }

  return { valid: true, sizeFormatted };
};

/**
 * Client-side canvas image compression to keep platform lightweight
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1600,
  maxHeight: number = 1600,
  quality: number = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If it's a vector SVG, read as text data url directly
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG based on support and transparency
        const isPng = file.type === 'image/png';
        const outputType = isPng ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(outputType, quality);
        resolve(dataUrl);
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.onerror = reject;
  });
};

export const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/* =========================================================================
   INITIAL DATA DEFAULTS
   ========================================================================= */

export const INITIAL_REELS: ReelVideo[] = [
  {
    id: 'reel-1',
    storeId: 'emp-02',
    storeName: 'Cantina & Hamburgueria da Serra',
    category: 'Gastronomia',
    caption: 'Burgers na brasa com queijo derretido e receitas de família no almoço e jantar.',
    videoUrl: 'https://gufomoda.com.br/conecta.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5511993456789',
    likesCount: 342,
    durationText: '0:15'
  },
  {
    id: 'reel-2',
    storeId: 'emp-03',
    storeName: 'Boutique Cantareira',
    category: 'Moda & Estilo',
    caption: 'Novas peças da coleção outono/inverno com tecidos confortáveis e elegantes.',
    videoUrl: 'https://gufomoda.com.br/conecta.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5511988776655',
    likesCount: 289,
    durationText: '0:12'
  },
  {
    id: 'reel-3',
    storeId: 'emp-01',
    storeName: 'Café & Padaria Mairiporã',
    category: 'Cafeteria & Padaria',
    caption: 'Café colonial colhido na serra, expresso cremoso e pães caseiros saindo quentinhos.',
    videoUrl: 'https://gufomoda.com.br/conecta.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5511971234567',
    likesCount: 512,
    durationText: '0:18'
  },
  {
    id: 'reel-4',
    storeId: 'emp-04',
    storeName: 'Flores & Viveiro Mantiqueira',
    category: 'Plantas & Flores',
    caption: 'Orquídeas, mudas e plantas ornamentais direto dos produtores de Mairiporã.',
    videoUrl: 'https://gufomoda.com.br/conecta.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80',
    whatsapp: '5511991234567',
    likesCount: 420,
    durationText: '0:14'
  }
];

export const INITIAL_HERO_SLIDES: HeroSlide[] = [
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

export const INITIAL_PAGE_BANNERS: PageBanner[] = [
  {
    id: 'banner-ofertas',
    title: 'Ofertas da Semana',
    imageUrl: '/images/banner_ofertas.png',
    altText: 'Ofertas da Semana - Produtos e serviços com preços especiais',
    targetTab: 'offers'
  },
  {
    id: 'banner-mapa',
    title: 'Lojas Perto de Você',
    imageUrl: '/images/banner_mapa.png',
    altText: 'Lojas perto de você - Encontre comércios de Mairiporã no mapa',
    targetTab: 'stores'
  },
  {
    id: 'banner-compre-local',
    title: 'Compre Local',
    imageUrl: '/images/banner_compre_local.png',
    altText: 'Compre Local - Fortaleça o comércio de Mairiporã e gere mais oportunidades',
    targetTab: 'about'
  }
];

/* =========================================================================
   STORAGE & REACTIVE SUBSCRIPTION
   ========================================================================= */

export const DEFAULT_HERO_VIDEO = 'https://gufomoda.com.br/conecta.mp4';

const STORAGE_KEYS = {
  REELS: 'conecta_mairipora_reels_v2',
  HERO_SLIDES: 'conecta_mairipora_hero_slides_v2',
  PAGE_BANNERS: 'conecta_mairipora_page_banners_v2',
  HERO_VIDEO: 'conecta_mairipora_hero_video_v1'
};

type MediaListener = () => void;
const mediaListeners = new Set<MediaListener>();

export const subscribeMediaChanges = (callback: MediaListener) => {
  mediaListeners.add(callback);
  return () => {
    mediaListeners.delete(callback);
  };
};

const notifyMediaChanged = () => {
  mediaListeners.forEach(fn => fn());
};

// In-memory cache to guarantee synchronous reads with async IndexedDB backup
let memoryReels: ReelVideo[] | null = null;
let memorySlides: HeroSlide[] | null = null;
let memoryBanners: PageBanner[] | null = null;
let memoryHeroVideo: string | null = null;

// Initial hydration from IndexedDB on startup
if (typeof window !== 'undefined') {
  DBStorage.get<ReelVideo[]>(STORAGE_KEYS.REELS).then(stored => {
    if (stored && Array.isArray(stored) && stored.length > 0) {
      memoryReels = stored;
      notifyMediaChanged();
    }
  });

  DBStorage.get<HeroSlide[]>(STORAGE_KEYS.HERO_SLIDES).then(stored => {
    if (stored && Array.isArray(stored) && stored.length > 0) {
      memorySlides = stored;
      notifyMediaChanged();
    }
  });

  DBStorage.get<PageBanner[]>(STORAGE_KEYS.PAGE_BANNERS).then(stored => {
    if (stored && Array.isArray(stored) && stored.length > 0) {
      memoryBanners = stored;
      notifyMediaChanged();
    }
  });

  DBStorage.get<string>(STORAGE_KEYS.HERO_VIDEO).then(stored => {
    if (stored) {
      memoryHeroVideo = stored;
      notifyMediaChanged();
    }
  });
}

const safeSetLocalStorage = (key: string, value: any, fallbackValue?: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.warn(`LocalStorage quota exceeded for ${key}, falling back to IndexedDB persistent storage.`);
    if (fallbackValue !== undefined) {
      try {
        localStorage.setItem(key, JSON.stringify(fallbackValue));
      } catch {
        // Silently handled: IndexedDB has the true persistent data
      }
    }
  }
};

export const MediaService = {
  // --- REELS (VÍDEOS 9x16) ---
  getReels: (): ReelVideo[] => {
    if (memoryReels && memoryReels.length > 0) {
      return memoryReels;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.REELS);
      if (raw) {
        memoryReels = JSON.parse(raw);
        return memoryReels!;
      }
    } catch {
      // Fallback
    }
    memoryReels = INITIAL_REELS;
    return INITIAL_REELS;
  },

  saveReels: (reels: ReelVideo[]): void => {
    memoryReels = reels;
    // 1. Persistent storage in IndexedDB (handles 100MB+ without quota issues)
    DBStorage.set(STORAGE_KEYS.REELS, reels).catch(err => {
      console.warn('Could not save reels to IndexedDB:', err);
    });

    // 2. Safe localStorage write (with lightweight fallback if base64 videos exceed 5MB quota)
    const lightweightReels = reels.map(r => ({
      ...r,
      videoUrl: r.videoUrl.startsWith('data:') ? 'https://gufomoda.com.br/conecta.mp4' : r.videoUrl
    }));
    safeSetLocalStorage(STORAGE_KEYS.REELS, reels, lightweightReels);

    notifyMediaChanged();
  },

  addReel: (reel: Omit<ReelVideo, 'id'>): ReelVideo => {
    const list = [...MediaService.getReels()];
    const newReel: ReelVideo = {
      ...reel,
      id: `reel-${Date.now()}`
    };
    list.unshift(newReel);
    MediaService.saveReels(list);
    return newReel;
  },

  updateReel: (id: string, updates: Partial<ReelVideo>): void => {
    const list = [...MediaService.getReels()];
    const index = list.findIndex(r => r.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      MediaService.saveReels(list);
    }
  },

  deleteReel: (id: string): void => {
    const list = MediaService.getReels();
    const filtered = list.filter(r => r.id !== id);
    MediaService.saveReels(filtered);
  },

  resetReels: (): void => {
    MediaService.saveReels(INITIAL_REELS);
  },

  // --- HERO CAROUSEL SLIDES ---
  getHeroSlides: (): HeroSlide[] => {
    if (memorySlides && memorySlides.length > 0) {
      return memorySlides;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      if (raw) {
        memorySlides = JSON.parse(raw);
        return memorySlides!;
      }
    } catch {
      // Ignored
    }
    memorySlides = INITIAL_HERO_SLIDES;
    return INITIAL_HERO_SLIDES;
  },

  saveHeroSlides: (slides: HeroSlide[]): void => {
    memorySlides = slides;
    DBStorage.set(STORAGE_KEYS.HERO_SLIDES, slides).catch(() => {});
    safeSetLocalStorage(STORAGE_KEYS.HERO_SLIDES, slides);
    notifyMediaChanged();
  },

  updateHeroSlide: (id: string, updates: Partial<HeroSlide>): void => {
    const list = [...MediaService.getHeroSlides()];
    const index = list.findIndex(s => s.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      MediaService.saveHeroSlides(list);
    }
  },

  resetHeroSlides: (): void => {
    MediaService.saveHeroSlides(INITIAL_HERO_SLIDES);
  },

  // --- PAGE BANNERS ---
  getPageBanners: (): PageBanner[] => {
    if (memoryBanners && memoryBanners.length > 0) {
      return memoryBanners;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PAGE_BANNERS);
      if (raw) {
        memoryBanners = JSON.parse(raw);
        return memoryBanners!;
      }
    } catch {
      // Ignored
    }
    memoryBanners = INITIAL_PAGE_BANNERS;
    return INITIAL_PAGE_BANNERS;
  },

  savePageBanners: (banners: PageBanner[]): void => {
    memoryBanners = banners;
    DBStorage.set(STORAGE_KEYS.PAGE_BANNERS, banners).catch(() => {});
    safeSetLocalStorage(STORAGE_KEYS.PAGE_BANNERS, banners);
    notifyMediaChanged();
  },

  updatePageBanner: (id: string, updates: Partial<PageBanner>): void => {
    const list = [...MediaService.getPageBanners()];
    const index = list.findIndex(b => b.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      MediaService.savePageBanners(list);
    }
  },

  resetPageBanners: (): void => {
    MediaService.savePageBanners(INITIAL_PAGE_BANNERS);
  },

  // --- HERO BACKGROUND VIDEO (LOOPING) ---
  getHeroVideo: (): string => {
    if (memoryHeroVideo) return memoryHeroVideo;
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HERO_VIDEO);
      if (stored) {
        memoryHeroVideo = stored;
        return stored;
      }
    } catch {
      // Ignored
    }
    memoryHeroVideo = DEFAULT_HERO_VIDEO;
    return DEFAULT_HERO_VIDEO;
  },

  saveHeroVideo: (url: string): void => {
    memoryHeroVideo = url;
    DBStorage.set(STORAGE_KEYS.HERO_VIDEO, url).catch(() => {});
    try {
      localStorage.setItem(STORAGE_KEYS.HERO_VIDEO, url);
    } catch {
      // Ignored: IndexedDB has it
    }
    notifyMediaChanged();
  },

  resetHeroVideo: (): void => {
    MediaService.saveHeroVideo(DEFAULT_HERO_VIDEO);
  }
};
