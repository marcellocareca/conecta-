import React, { useState } from 'react';
import { Category, Business } from '../types';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { StoreCard } from '../components/stores/StoreCard';
import { Store } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E5EBE6] pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#07843B]">
          Segmentos Comerciais
        </span>
        <h1 className="text-3xl font-bold text-[#17251D] mt-1">
          Todas as Categorias de Mairiporã
        </h1>
        <p className="text-sm text-[#68746C] mt-2 max-w-2xl font-normal">
          Navegue pelas categorias do comércio e serviços da nossa cidade. Clique em qualquer categoria para listar os comércios locais.
        </p>
      </div>

      {/* Categories Grid (Ícones verdes #07843B sobre fundos verde-claro #E9F6EC) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => {
          const storeCount = businesses.filter(b => b.categoryId === cat.id && b.status === 'approved').length;
          const isSelected = selectedCatId === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(isSelected ? null : cat.id)}
              className={`p-5 rounded-2xl border text-left transition-all duration-150 flex items-start gap-4 cursor-pointer ${
                isSelected
                  ? 'border-[#07843B] bg-[#E9F6EC] shadow-xs'
                  : 'border-[#E5EBE6] bg-white hover:border-[#07843B] hover:shadow-xs'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-[#E5EBE6] ${
                isSelected
                  ? 'bg-[#07843B] text-white'
                  : 'bg-[#E9F6EC] text-[#07843B]'
              }`}>
                <CategoryIcon name={cat.icon} size={22} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#17251D] truncate">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-[#07843B] bg-[#E9F6EC] px-2 py-0.5 rounded-full">
                    {storeCount}
                  </span>
                </div>
                <p className="text-xs text-[#68746C] mt-1 line-clamp-2 leading-relaxed font-normal">
                  {cat.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Stores Section */}
      {selectedCategory && (
        <div className="pt-8 border-t border-[#E5EBE6] space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#07843B] uppercase tracking-wider">
                Estabelecimentos em
              </span>
              <h2 className="text-2xl font-bold text-[#17251D]">
                {selectedCategory.name}
              </h2>
            </div>
            <button
              onClick={() => setSelectedCatId(null)}
              className="text-xs text-[#68746C] hover:text-[#17251D] underline cursor-pointer font-medium"
            >
              Recolher lista
            </button>
          </div>

          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E5EBE6] p-8 shadow-xs">
              <Store className="w-10 h-10 text-[#68746C] mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-semibold text-[#17251D]">
                Nenhum estabelecimento cadastrado ainda nesta categoria
              </h4>
              <p className="text-xs text-[#68746C] mt-1 max-w-sm mx-auto font-normal">
                Se você tem uma loja de {selectedCategory.name.toLowerCase()} em Mairiporã, cadastre-se gratuitamente!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      )}
    </div>
  );
};
