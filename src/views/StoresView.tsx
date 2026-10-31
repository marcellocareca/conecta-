import React, { useState, useMemo, useEffect } from 'react';
import { Business, Category } from '../types';
import { MAIRIPORA_NEIGHBORHOODS } from '../data/categories';
import { StoreCard } from '../components/stores/StoreCard';
import { Search, MapPin, Filter, Store, X } from 'lucide-react';
import { VoiceSearchButton } from '../components/common/VoiceSearchButton';
import { VoiceSearchModal } from '../components/common/VoiceSearchModal';

interface StoresViewProps {
  businesses: Business[];
  categories: Category[];
  initialSearch?: string;
  initialCategoryId?: string;
  onSelectStore: (storeId: string) => void;
  savedStoreIds: Set<string>;
  onToggleSaveStore: (store: Business) => void;
}

export const StoresView: React.FC<StoresViewProps> = ({
  businesses,
  categories,
  initialSearch = '',
  initialCategoryId = 'all',
  onSelectStore,
  savedStoreIds,
  onToggleSaveStore
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Sync with prop updates (e.g. from navbar voice search)
  useEffect(() => {
    if (initialSearch !== undefined) {
      setSearchTerm(initialSearch);
    }
  }, [initialSearch]);

  useEffect(() => {
    if (initialCategoryId !== undefined) {
      setSelectedCategory(initialCategoryId);
    }
  }, [initialCategoryId]);

  // Filter approved businesses
  const filteredStores = useMemo(() => {
    return businesses.filter(store => {
      // Must be approved
      if (store.status !== 'approved') return false;

      // Category
      if (selectedCategory !== 'all' && store.categoryId !== selectedCategory) {
        return false;
      }

      // Neighborhood
      if (selectedNeighborhood !== 'all' && store.neighborhood !== selectedNeighborhood) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const inName = store.name.toLowerCase().includes(query);
        const inTrade = store.tradeName?.toLowerCase().includes(query) || false;
        const inDesc = store.description.toLowerCase().includes(query);
        const inCategory = store.categoryName.toLowerCase().includes(query);
        const inNeighborhood = store.neighborhood.toLowerCase().includes(query);
        if (!inName && !inTrade && !inDesc && !inCategory && !inNeighborhood) {
          return false;
        }
      }

      return true;
    });
  }, [businesses, selectedCategory, selectedNeighborhood, searchTerm]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedNeighborhood('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedCategory !== 'all' || selectedNeighborhood !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title & Introduction */}
      <div className="border-b border-[#E5EBE6] pb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#07843B]">
          Guia do Comércio Local
        </span>
        <h1 className="text-3xl font-bold text-[#17251D] mt-1">
          Lojas e Estabelecimentos de Mairiporã
        </h1>
        <p className="text-sm text-[#68746C] mt-2 max-w-2xl font-normal">
          Conecte-se diretamente com os comerciantes da cidade. Encontre serviços, produtos e fale pelo WhatsApp sem intermediários.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Keyword Search */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#68746C] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, produto, serviço..."
              className="w-full pl-10 pr-16 py-2.5 bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl text-sm text-[#17251D] placeholder-[#68746C] focus:bg-white focus:border-[#07843B] transition-colors"
            />
            <div className="absolute right-2 flex items-center gap-1">
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="p-1 text-[#68746C] hover:text-[#17251D] cursor-pointer"
                  title="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <VoiceSearchButton
                variant="input-inline"
                onClick={() => setIsVoiceModalOpen(true)}
                title="Buscar por voz em Mairiporã"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3.5" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl text-sm focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D] cursor-pointer"
            >
              <option value="all">Todas as categorias</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3.5" />
            <select
              value={selectedNeighborhood}
              onChange={e => setSelectedNeighborhood(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl text-sm focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D] cursor-pointer"
            >
              <option value="all">Todos os bairros de Mairiporã</option>
              {MAIRIPORA_NEIGHBORHOODS.map(nh => (
                <option key={nh} value={nh}>
                  {nh}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results summary and reset */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E5EBE6] text-xs text-[#68746C]">
          <span>
            Exibindo <strong className="text-[#17251D]">{filteredStores.length}</strong> {filteredStores.length === 1 ? 'estabelecimento' : 'estabelecimentos'}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-[#07843B] hover:text-[#07552F] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Stores List */}
      {filteredStores.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E5EBE6] p-8 shadow-xs">
          <div className="w-16 h-16 bg-[#E9F6EC] text-[#07843B] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-[#17251D]">Nenhum estabelecimento encontrado</h3>
          <p className="text-xs text-[#68746C] mt-1 max-w-md mx-auto font-normal">
            Não encontramos lojas que correspondam aos filtros selecionados. Tente buscar com outros termos ou limpar os filtros.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 px-5 py-2.5 bg-[#07843B] hover:bg-[#07552F] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Ver todas as lojas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
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

      {/* Voice Search Modal Popup */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={(spokenQuery) => {
          setSearchTerm(spokenQuery);
        }}
        initialQuery={searchTerm}
      />
    </div>
  );
};
