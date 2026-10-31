import React, { useState } from 'react';
import { Category, Business } from '../types';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { StoreCard } from '../components/stores/StoreCard';
import { WaveDivider } from '../components/common/WaveDivider';
import { Store, Sparkles, ArrowRight, Layers } from 'lucide-react';

interface CategoriesViewProps {
  categories: Category[];
  businesses: Business[];
  onSelectStore: (storeId: string) => void;
  savedStoreIds: Set<string>;
  onToggleSaveStore: (store: Business) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  businesses,
  onSelectStore,
  savedStoreIds,
  onToggleSaveStore
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);

  const selectedCategory = categories.find(c => c.id === selectedCatId) || null;
  const filteredBusinesses = selectedCatId
    ? businesses.filter(b => b.categoryId === selectedCatId && b.status === 'approved')
    : [];

  return (
    <div className="w-full pb-16">
      {/* Header Banner com Gradiente Jade Dark (#00553A) e Ondas */}
      <div className="relative bg-gradient-to-r from-[#00553A] via-[#00A86B] to-[#00553A] text-white pt-10 pb-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFD700] text-[#12221A] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#00553A]" />
            <span>Guia Comercial por Segmentos</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Todas as Categorias de Mairiporã
          </h1>
          <p className="text-sm sm:text-base text-[#EBF8F2] mt-2 max-w-2xl font-normal leading-relaxed">
            Navegue pelos setores do comércio e serviços da serra. Selecione qualquer categoria abaixo para visualizar os comércios locais cadastrados.
          </p>
        </div>
      </div>

      {/* Onda suave conectando o cabeçalho verde à área de cards (Jade Tint #EBF8F2) */}
      <WaveDivider 
        variant="organic-1" 
        fillColor="#EBF8F2" 
        secondaryFill="#66CDAA" 
        position="top" 
        className="-mt-1 relative z-10" 
      />

      {/* Grid de Categorias com Fundo em Verde Suave */}
      <div className="bg-[#EBF8F2] pt-2 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => {
              const storeCount = businesses.filter(b => b.categoryId === cat.id && b.status === 'approved').length;
              const isSelected = selectedCatId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(isSelected ? null : cat.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-start gap-4 cursor-pointer hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-[#00A86B] bg-white shadow-md ring-2 ring-[#00A86B]/30'
                      : 'border-[#E2ECE5] bg-white hover:border-[#00A86B] hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                    isSelected
                      ? 'bg-[#00A86B] text-white border-[#00553A]'
                      : 'bg-[#EBF8F2] text-[#00A86B] border-[#66CDAA]/40'
                  }`}>
                    <CategoryIcon name={cat.icon} size={22} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className={`text-sm font-bold truncate ${
                        isSelected ? 'text-[#00553A]' : 'text-[#12221A]'
                      }`}>
                        {cat.name}
                      </h3>
                      <span className={`text-[11px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                        isSelected 
                          ? 'bg-[#00A86B] text-white' 
                          : 'text-[#00A86B] bg-[#EBF8F2]'
                      }`}>
                        {storeCount}
                      </span>
                    </div>
                    <p className="text-xs text-[#586B60] mt-1 line-clamp-2 leading-relaxed font-normal">
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Selected Category Stores Section with Wave Transition */}
      {selectedCategory && (
        <div className="relative animate-in fade-in duration-300">
          <WaveDivider 
            variant="gentle-swell" 
            fillColor="#FFFFFF" 
            secondaryFill="#66CDAA" 
            position="top" 
            className="relative z-10" 
          />

          <div className="bg-white pt-2 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#E2ECE5]">
                <div>
                  <span className="text-xs font-bold text-[#00A86B] uppercase tracking-wider">
                    Estabelecimentos encontrados em
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12221A]">
                    {selectedCategory.name}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCatId(null)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold text-[#00A86B] bg-[#EBF8F2] hover:bg-[#d8f0e5] transition-colors cursor-pointer border border-[#00A86B]/20"
                >
                  Fechar filtro
                </button>
              </div>

              {filteredBusinesses.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {filteredBusinesses.map(store => (
                    <StoreCard
                      key={store.id}
                      store={store}
                      onSelect={onSelectStore}
                      isSaved={savedStoreIds.has(store.id)}
                      onToggleSave={onToggleSaveStore}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-[#F6FAF7] rounded-2xl border border-[#E2ECE5]">
                  <Store className="w-12 h-12 text-[#586B60] mx-auto mb-3 opacity-60" />
                  <p className="text-base font-semibold text-[#12221A]">
                    Nenhum estabelecimento cadastrado nesta categoria ainda.
                  </p>
                  <p className="text-xs text-[#586B60] mt-1">
                    Seja o primeiro a divulgar sua empresa neste setor em Mairiporã!
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
