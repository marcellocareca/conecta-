import React, { useState, useEffect } from 'react';
import { Business, Product, Category, ActiveTab } from '../types';
import { StoreCard } from '../components/stores/StoreCard';
import { ProductCard } from '../components/products/ProductCard';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { VerticalVideoSection } from '../components/home/VerticalVideoSection';
import { IntuitiveBentoPortal } from '../components/home/IntuitiveBentoPortal';
import { WaveDivider } from '../components/common/WaveDivider';
import { MediaService, subscribeMediaChanges, PageBanner } from '../services/mediaService';
import { 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';

interface HomeViewProps {
  categories: Category[];
  businesses: Business[];
  products: Product[];
  onNavigate: (tab: ActiveTab, params?: any) => void;
  onSelectStore: (storeId: string) => void;
  onSelectProduct: (product: Product) => void;
  savedStoreIds: Set<string>;
  savedProductIds: Set<string>;
  onToggleSaveStore: (store: Business) => void;
  onToggleSaveProduct: (product: Product) => void;
  onOpenRegisterModal?: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  businesses,
  products,
  onNavigate,
  onSelectStore,
  onSelectProduct,
  savedStoreIds,
  savedProductIds,
  onToggleSaveStore,
  onToggleSaveProduct,
  onOpenRegisterModal
}) => {
  const [selectedOfferCategory, setSelectedOfferCategory] = useState<string>('all');
  const [pageBanners, setPageBanners] = useState<PageBanner[]>(() => MediaService.getPageBanners());

  useEffect(() => {
    const unsubscribe = subscribeMediaChanges(() => {
      setPageBanners(MediaService.getPageBanners());
    });
    return unsubscribe;
  }, []);

  // Featured stores (approved & flagged as featured)
  const featuredStores = businesses
    .filter(b => b.status === 'approved' && b.isFeatured)
    .slice(0, 6);

  // Offers list
  const offersList = products.filter(p => {
    if (selectedOfferCategory !== 'all' && p.categoryId !== selectedOfferCategory) {
      return false;
    }
    return p.isOffer || Boolean(p.promotionalPrice);
  }).slice(0, 8);

  return (
    <div className="flex flex-col w-full overflow-hidden">
      
      {/* 1. CARROSSEL PRINCIPAL (Banner Carrossel com fotos do comércio local, 'Compre em Mairiporã' e onda orgânica integrada) */}
      <HeroCarousel 
        onNavigate={onNavigate}
        onSearch={(query) => onNavigate('stores', { search: query })}
      />

      {/* 2. PORTAL BENTO INTUITIVO (Seguindo fielmente as cores da paleta solicitada) */}
      <section className="bg-gradient-to-b from-[#EBF8F2] via-[#F4FAF6] to-[#E6F7F0] pt-2 pb-6 relative">
        <IntuitiveBentoPortal 
          onNavigate={onNavigate}
          onOpenRegisterModal={onOpenRegisterModal}
          totalStoresCount={businesses.filter(b => b.status === 'approved').length}
        />
      </section>

      {/* TRANSIÇÃO EM ONDA SUAVE: Portal Bento (#E6F7F0) -> Categorias em Destaque (#FFFFFF) */}
      <div className="bg-[#E6F7F0] w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <WaveDivider 
          variant="organic-2" 
          fillColor="#FFFFFF" 
          secondaryFill="#66CDAA" 
          position="top" 
          className="w-full block" 
          heightClassName="h-10 sm:h-14 md:h-20"
        />
      </div>

      {/* 3. SETORIZAÇÃO COMERCIAL: CATEGORIAS EM DESTAQUE */}
      <section className="bg-white pt-2 pb-8 px-0 relative">
        <FeaturedCategories
          categories={categories}
          businesses={businesses}
          onNavigate={onNavigate}
          onSelectCategory={(categoryId) => onNavigate('stores', { categoryId })}
        />
      </section>

      {/* TRANSIÇÃO EM ONDA SUAVE: Categorias (#FFFFFF) -> Banners e Lojas (#EBF8F2) */}
      <div className="bg-white w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <WaveDivider 
          variant="gentle-swell" 
          fillColor="#EBF8F2" 
          secondaryFill="#66CDAA" 
          position="top" 
          className="w-full block" 
          heightClassName="h-10 sm:h-14 md:h-18"
        />
      </div>

      {/* 4. ZONA CLARA: BANNERS DE AÇÃO & LOJAS EM DESTAQUE */}
      <section className="bg-gradient-to-b from-[#EBF8F2] via-[#F4FAF6] to-[#EBF8F2] pt-4 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* 3 BLOCOS DE DESTAQUE DINÂMICOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {pageBanners.map((banner) => (
              <div 
                key={banner.id}
                onClick={() => onNavigate(banner.targetTab)}
                role="button"
                tabIndex={0}
                aria-label={banner.title}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 border border-[#E2ECE5] bg-white aspect-16/7 sm:aspect-auto"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.altText || banner.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                  onError={(e) => {
                    // Fallback to initial image if custom upload failed
                    if (banner.id === 'banner-ofertas') (e.target as HTMLImageElement).src = '/images/banner_ofertas.png';
                    else if (banner.id === 'banner-mapa') (e.target as HTMLImageElement).src = '/images/banner_mapa.png';
                    else (e.target as HTMLImageElement).src = '/images/banner_compre_local.png';
                  }}
                />
              </div>
            ))}
          </div>

          {/* SEÇÃO: LOJAS EM DESTAQUE */}
          <div className="pt-2">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B]">
                  Comércio de Mairiporã
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12221A] mt-0.5">
                  Lojas em destaque
                </h2>
                <p className="text-xs sm:text-sm text-[#586B60] mt-1 font-normal">
                  Conheça alguns dos comércios locais que fazem parte do Conecta Mairiporã
                </p>
              </div>
              <button
                onClick={() => onNavigate('stores')}
                className="text-xs sm:text-sm font-bold text-[#00A86B] hover:text-[#00553A] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Ver todas as lojas</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* 6 Store Cards */}
            <div className="relative">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredStores.map(store => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onSelect={onSelectStore}
                    isSaved={savedStoreIds.has(store.id)}
                    onToggleSave={onToggleSaveStore}
                  />
                ))}
              </div>

              {/* Carousel Next Arrow on desktop */}
              <button
                onClick={() => onNavigate('stores')}
                className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-[#E2ECE5] items-center justify-center text-[#12221A] hover:text-[#00A86B] hover:scale-105 transition-all z-10 cursor-pointer"
                aria-label="Ver mais lojas"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* TRANSIÇÃO EM ONDA SUAVE: Lojas (#EBF8F2) -> Vídeos 9x16 (#00553A) */}
      <div className="bg-[#EBF8F2] w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <WaveDivider 
          variant="multi-layered" 
          fillColor="#00553A" 
          secondaryFill="#00A86B" 
          position="top" 
          className="w-full block" 
          heightClassName="h-10 sm:h-14 md:h-20"
        />
      </div>

      {/* 5. ZONA JADE ASCENT - DARK (#00553A): VÍDEOS EM FORMATO 9x16 */}
      <section className="bg-gradient-to-b from-[#00553A] via-[#014730] to-[#00553A] pt-2 pb-6 relative overflow-hidden text-white">
        {/* Subtle radial decorative glow with Gold & Jade Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#66CDAA]/10 rounded-full blur-3xl pointer-events-none" />

        <VerticalVideoSection 
          onSelectStore={onSelectStore} 
          onNavigate={onNavigate} 
          isDarkTheme={true}
        />
      </section>

      {/* TRANSIÇÃO EM ONDA SUAVE: Vídeos (#00553A) -> Ofertas (#EBF8F2) */}
      <div className="bg-[#00553A] w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <WaveDivider 
          variant="deep-crest" 
          fillColor="#EBF8F2" 
          secondaryFill="#00553A" 
          flipX={true}
          position="top" 
          className="w-full block" 
          heightClassName="h-10 sm:h-14 md:h-20"
        />
      </div>

      {/* 6. ZONA JADE TINT (#EBF8F2): OFERTAS PARA VOCÊ */}
      <section className="bg-gradient-to-b from-[#EBF8F2] via-[#F4FAF6] to-[#E2ECE5] pt-4 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00A86B]">
                Economia Local
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12221A] mt-1">
                Ofertas & Promoções
              </h2>
              <p className="text-xs sm:text-sm text-[#586B60] mt-0.5 font-normal">
                Descontos de lojas de Mairiporã para consultar e pedir diretamente pelo WhatsApp.
              </p>
            </div>
            <button
              onClick={() => onNavigate('offers')}
              className="text-xs sm:text-sm font-bold text-[#00A86B] hover:text-[#00553A] flex items-center gap-1 cursor-pointer"
            >
              <span>Todas as promoções</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filter categories tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            <button
              onClick={() => setSelectedOfferCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                selectedOfferCategory === 'all'
                  ? 'bg-[#00A86B] text-white shadow-xs'
                  : 'bg-white text-[#12221A] border border-[#E2ECE5] hover:bg-[#EBF8F2]'
              }`}
            >
              Todas as Ofertas
            </button>
            {categories.slice(0, 8).map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedOfferCategory(c.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
                  selectedOfferCategory === c.id
                    ? 'bg-[#00A86B] text-white shadow-xs'
                    : 'bg-white text-[#12221A] border border-[#E2ECE5] hover:bg-[#EBF8F2]'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {offersList.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onViewProduct={onSelectProduct}
                onViewStore={onSelectStore}
                isSaved={savedProductIds.has(prod.id)}
                onToggleSave={onToggleSaveProduct}
              />
            ))}
          </div>

        </div>
      </section>

      {/* TRANSIÇÃO EM ONDA SUAVE: Ofertas (#E2ECE5) -> Rodapé Oficial (#00553A) */}
      <div className="bg-[#E2ECE5] w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <WaveDivider 
          variant="gentle-swell" 
          fillColor="#00553A" 
          secondaryFill="#FFD700" 
          position="top" 
          className="w-full block" 
          heightClassName="h-10 sm:h-14 md:h-20"
        />
      </div>

    </div>
  );
};
