import React, { useState } from 'react';
import { Product, Category } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { Sparkles, Search, Filter, Tag, X } from 'lucide-react';

interface OffersViewProps {
  products: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
  onSelectStore: (storeId: string) => void;
  savedProductIds: Set<string>;
  onToggleSaveProduct: (product: Product) => void;
}

export const OffersView: React.FC<OffersViewProps> = ({
  products,
  categories,
  onSelectProduct,
  onSelectStore,
  savedProductIds,
  onToggleSaveProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter only offers / promotional items
  const offers = products.filter(p => {
    const isOfferItem = p.isOffer || Boolean(p.promotionalPrice && p.promotionalPrice < p.price);
    if (!isOfferItem) return false;

    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
      return false;
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const inName = p.name.toLowerCase().includes(q);
      const inStore = p.businessName.toLowerCase().includes(q);
      const inDesc = p.description.toLowerCase().includes(q);
      if (!inName && !inStore && !inDesc) return false;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-[#E5EBE6] pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F6EC] text-[#07843B] text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#F4E500]" />
          <span>Economia Local em Mairiporã</span>
        </div>
        <h1 className="text-3xl font-bold text-[#17251D]">
          Promoções e Ofertas da Semana
        </h1>
        <p className="text-sm text-[#68746C] mt-2 max-w-2xl font-normal">
          Aproveite preços especiais direto com os comerciantes de Mairiporã. Consulte itens e negocie diretamente pelo WhatsApp.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5EBE6] shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por produto ou loja..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl text-sm text-[#17251D] placeholder-[#68746C] focus:bg-white focus:border-[#07843B] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-3 text-[#68746C] hover:text-[#17251D] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#68746C] shrink-0" />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full sm:w-64 px-3.5 py-2.5 bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl text-sm focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D] cursor-pointer"
          >
            <option value="all">Todas as categorias em oferta</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Offers */}
      {offers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5EBE6] p-8 shadow-xs">
          <Tag className="w-12 h-12 text-[#68746C] mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-[#17251D]">Nenhuma oferta encontrada com esses filtros</h3>
          <p className="text-xs text-[#68746C] mt-1 max-w-sm mx-auto font-normal">
            Tente remover os filtros de busca ou conferir todas as lojas de Mairiporã.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
            className="mt-4 px-5 py-2.5 bg-[#07843B] hover:bg-[#07552F] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offers.map(prod => (
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
      )}
    </div>
  );
};
