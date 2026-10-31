import React, { useState } from 'react';
import { Business, Product, Category, ActiveTab } from '../types';
import { StoreCard } from '../components/stores/StoreCard';
import { ProductCard } from '../components/products/ProductCard';
import { HeroCarousel } from '../components/home/HeroCarousel';
import { FeaturedCategories } from '../components/home/FeaturedCategories';
import { VerticalVideoSection } from '../components/home/VerticalVideoSection';
import { 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  PlusCircle,
  Store as StoreIcon
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
    <div className="space-y-12 pb-20">
      
      {/* 1. CARROSSEL PRINCIPAL (Banner Carrossel com fotos do comércio local e 'Compre em Mairiporã') */}
      <HeroCarousel 
        onNavigate={onNavigate}
        onSearch={(query) => onNavigate('stores', { search: query })}
      />

      {/* 2. CATEGORIAS EM DESTAQUE (Componente com ícones customizados e guia intuitivo por setores) */}
      <FeaturedCategories
        categories={categories}
        businesses={businesses}
        onNavigate={onNavigate}
        onSelectCategory={(categoryId) => onNavigate('stores', { categoryId })}
      />

      {/* 3. OS 3 BLOCOS DE DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* BANNER 1: Ofertas da Semana */}
          <div 
            onClick={() => onNavigate('offers')}
            role="button"
            tabIndex={0}
            aria-label="Ver ofertas da semana"
            className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 border border-[#E5EBE6]"
          >
            <img
              src="/images/banner_ofertas.png"
              alt="Ofertas da Semana - Produtos e serviços com preços especiais"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-200"
            />
          </div>

          {/* BANNER 2: Lojas perto de você */}
          <div 
            onClick={() => onNavigate('stores')}
            role="button"
            tabIndex={0}
            aria-label="Encontrar comércios de Mairiporã no mapa"
            className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 border border-[#E5EBE6]"
          >
            <img
              src="/images/banner_mapa.png"
              alt="Lojas perto de você - Encontre comércios de Mairiporã no mapa"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-200"
            />
          </div>

          {/* BANNER 3: Compre Local */}
          <div 
            onClick={() => onNavigate('about')}
            role="button"
            tabIndex={0}
            aria-label="Compre Local - Fortaleça o comércio de Mairiporã"
            className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-xs hover:shadow-md transition-all duration-200 border border-[#E5EBE6]"
          >
            <img
              src="/images/banner_compre_local.png"
              alt="Compre Local - Fortaleça o comércio de Mairiporã e gere mais oportunidades"
              className="w-full h-auto object-cover group-hover:scale-102 transition-transform duration-200"
            />
          </div>

        </div>
      </section>

      {/* 4. SEÇÃO: LOJAS EM DESTAQUE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17251D]">
              Lojas em destaque
            </h2>
            <p className="text-xs sm:text-sm text-[#68746C] mt-1 font-normal">
              Conheça alguns dos comércios locais que fazem parte do Conecta Mairiporã
            </p>
          </div>
          <button
            onClick={() => onNavigate('stores')}
            className="text-xs sm:text-sm font-semibold text-[#07843B] hover:text-[#07552F] flex items-center gap-1 cursor-pointer transition-colors"
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
            className="hidden xl:flex absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-md border border-[#E5EBE6] items-center justify-center text-[#17251D] hover:text-[#07843B] hover:scale-105 transition-all z-10 cursor-pointer"
            aria-label="Ver mais lojas"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* VÍDEOS EM FORMATO 9x16 - ABAIXO DAS LOJAS EM DESTAQUE */}
      <VerticalVideoSection 
        onSelectStore={onSelectStore} 
        onNavigate={onNavigate} 
      />

      {/* 5. SEÇÃO: OFERTAS PARA VOCÊ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#07843B]">
              Economia Local
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17251D] mt-1">
              Ofertas para você
            </h2>
            <p className="text-xs sm:text-sm text-[#68746C] mt-0.5 font-normal">
              Descontos de lojas de Mairiporã para consultar e comprar diretamente pelo WhatsApp.
            </p>
          </div>
          <button
            onClick={() => onNavigate('offers')}
            className="text-xs sm:text-sm font-semibold text-[#07843B] hover:text-[#07552F] flex items-center gap-1 cursor-pointer"
          >
            <span>Todas as promoções</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter categories tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedOfferCategory('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-colors cursor-pointer ${
              selectedOfferCategory === 'all'
                ? 'bg-[#07843B] text-white shadow-xs'
                : 'bg-white text-[#17251D] border border-[#E5EBE6] hover:bg-[#E9F6EC]'
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
                  ? 'bg-[#07843B] text-white shadow-xs'
                  : 'bg-white text-[#17251D] border border-[#E5EBE6] hover:bg-[#E9F6EC]'
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
      </section>

      {/* 6. CALL TO ACTION: CADASTRE SUA EMPRESA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="rounded-2xl bg-[#07552F] p-8 sm:p-12 text-white relative overflow-hidden shadow-sm border border-[#E5EBE6]">
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F4E500]">
              Juntos, o comércio local fica mais forte
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2 leading-tight">
              Divulgue seu comércio gratuitamente em Mairiporã
            </h2>
            <p className="mt-3 text-sm sm:text-base text-white/90 leading-relaxed font-normal">
              Receba clientes diretamente no WhatsApp oficial da sua loja, aumente suas vendas e faça parte da plataforma que valoriza quem produz em nossa cidade.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={onOpenRegisterModal ? onOpenRegisterModal : () => onNavigate('register-business')}
                className="px-6 py-3.5 bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-md flex items-center gap-2.5 cursor-pointer border border-[#E9F6EC]/30 group"
              >
                <div className="w-6 h-6 rounded-full bg-[#F4E500] text-[#17251D] flex items-center justify-center font-black text-lg leading-none shadow-xs group-hover:scale-110 group-hover:rotate-90 transition-transform">
                  +
                </div>
                <span>Cadastre seu comércio agora</span>
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl transition-colors border border-white/20 cursor-pointer"
              >
                Conheça o projeto
              </button>
            </div>
          </div>

          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
            <StoreIcon className="w-72 h-72 text-white" />
          </div>
        </div>
      </section>

    </div>
  );
};
