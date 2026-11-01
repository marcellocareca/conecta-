import React, { useState, useMemo } from 'react';
import { Category, Business, ActiveTab } from '../../types';
import { 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Store,
  ShoppingBasket,
  Utensils,
  Shirt,
  Hammer,
  Smartphone,
  Wrench,
  HeartPulse,
  PawPrint,
  Armchair,
  Sprout,
  Briefcase,
  Glasses,
  LucideIcon
} from 'lucide-react';

/* =========================================================================
   CLEAN MINIMALIST CATEGORY ICONS FOR MAIRIPORÃ'S LOCAL COMMERCE SECTORS
   Unified 24x24 single-weight stroke geometry, crisp optical balance
   ========================================================================= */

interface FeaturedCategoryItem {
  id: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  sectorGroup: 'all' | 'food' | 'retail' | 'home' | 'services' | 'wellness';
  icon: LucideIcon;
  popularItems: string[];
}

const FEATURED_SECTOR_ITEMS: FeaturedCategoryItem[] = [
  {
    id: 'supermercados',
    name: 'Supermercado & Feira',
    shortLabel: 'Supermercados',
    subtitle: 'Hortifruti fresco, açougues, padarias e mercearias',
    sectorGroup: 'food',
    icon: ShoppingBasket,
    popularItems: ['Hortifruti', 'Padaria', 'Açougue', 'Empório']
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes & Gastronomia',
    shortLabel: 'Restaurantes',
    subtitle: 'Burgers artesanais, pizzarias, comida caipira e cafés',
    sectorGroup: 'food',
    icon: Utensils,
    popularItems: ['Pizzas', 'Lanches', 'Cafés', 'Comida Típica']
  },
  {
    id: 'moda',
    name: 'Moda & Acessórios',
    shortLabel: 'Moda',
    subtitle: 'Vestuário feminino, masculino, infantil e calçados',
    sectorGroup: 'retail',
    icon: Shirt,
    popularItems: ['Roupas', 'Calçados', 'Moda Íntima', 'Bolsas']
  },
  {
    id: 'casa-construcao',
    name: 'Casa & Construção',
    shortLabel: 'Construção',
    subtitle: 'Materiais básicos, ferramentas, elétrica e hidráulica',
    sectorGroup: 'home',
    icon: Hammer,
    popularItems: ['Ferramentas', 'Tintas', 'Elétrica', 'Acabamento']
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos & Informática',
    shortLabel: 'Eletrônicos',
    subtitle: 'Celulares, notebooks, acessórios e assistência técnica',
    sectorGroup: 'retail',
    icon: Smartphone,
    popularItems: ['Celulares', 'Assistência', 'Cabos', 'Fones']
  },
  {
    id: 'autopecas',
    name: 'Autopeças & Mecânica',
    shortLabel: 'Autopeças',
    subtitle: 'Pneus, baterias, oficinas, troca de óleo e auto center',
    sectorGroup: 'services',
    icon: Wrench,
    popularItems: ['Pneus', 'Baterias', 'Oficinas', 'Freios']
  },
  {
    id: 'saude-beleza',
    name: 'Saúde, Farmácia & Beleza',
    shortLabel: 'Saúde & Beleza',
    subtitle: 'Drogarias, salões de beleza, barbearias e estética',
    sectorGroup: 'wellness',
    icon: HeartPulse,
    popularItems: ['Farmácias', 'Salões', 'Barbearias', 'Estética']
  },
  {
    id: 'pet-shop',
    name: 'Pet Shop & Veterinária',
    shortLabel: 'Pet Shop',
    subtitle: 'Rações, banho e tosa, vacinas e cuidados para animais',
    sectorGroup: 'wellness',
    icon: PawPrint,
    popularItems: ['Rações', 'Banho & Tosa', 'Veterinária', 'Acessórios']
  },
  {
    id: 'moveis-decoracao',
    name: 'Móveis & Decoração',
    shortLabel: 'Móveis',
    subtitle: 'Móveis para casa e chácara, colchões e iluminação',
    sectorGroup: 'home',
    icon: Armchair,
    popularItems: ['Móveis', 'Colchões', 'Sofás', 'Decoração']
  },
  {
    id: 'agro-jardim',
    name: 'Agro, Flores & Jardim',
    shortLabel: 'Agro & Jardim',
    subtitle: 'Plantas ornamentais, mudas da Cantareira e jardinagem',
    sectorGroup: 'home',
    icon: Sprout,
    popularItems: ['Mudas', 'Flores', 'Gramas', 'Vasos']
  },
  {
    id: 'servicos-profissionais',
    name: 'Serviços Especializados',
    shortLabel: 'Serviços',
    subtitle: 'Contabilidade, projetos, reformas e consultorias locais',
    sectorGroup: 'services',
    icon: Briefcase,
    popularItems: ['Contábil', 'Manutenção', 'Instalações', 'Serviços']
  },
  {
    id: 'oticas',
    name: 'Óticas & Relojoaria',
    shortLabel: 'Óticas',
    subtitle: 'Armações de óculos, lentes de grau e proteção solar',
    sectorGroup: 'retail',
    icon: Glasses,
    popularItems: ['Óculos de Grau', 'Solares', 'Lentes', 'Armações']
  }
];

interface FeaturedCategoriesProps {
  categories?: Category[];
  businesses: Business[];
  onNavigate: (tab: ActiveTab, params?: any) => void;
  onSelectCategory?: (categoryId: string) => void;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  businesses,
  onNavigate,
  onSelectCategory
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'food' | 'retail' | 'home' | 'services' | 'wellness'>('all');

  // Sector groups filter buttons
  const sectorFilters = [
    { id: 'all', label: 'Todos os setores' },
    { id: 'food', label: 'Alimentação & Gastronomia' },
    { id: 'retail', label: 'Moda & Eletrônicos' },
    { id: 'home', label: 'Casa, Construção & Jardim' },
    { id: 'services', label: 'Serviços & Autopeças' },
    { id: 'wellness', label: 'Saúde & Pet Shop' }
  ] as const;

  // Filtered categories according to selected sector
  const displayedCategories = useMemo(() => {
    if (selectedGroup === 'all') {
      return FEATURED_SECTOR_ITEMS;
    }
    return FEATURED_SECTOR_ITEMS.filter(item => item.sectorGroup === selectedGroup);
  }, [selectedGroup]);

  // Compute store counts for each category
  const storeCountMap = useMemo(() => {
    const map = new Map<string, number>();
    businesses.forEach(b => {
      if (b.status === 'approved') {
        map.set(b.categoryId, (map.get(b.categoryId) || 0) + 1);
      }
    });
    return map;
  }, [businesses]);

  const handleCategoryClick = (categoryId: string) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    onNavigate('stores', { categoryId });
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
      {/* Header Container */}
      <div className="bg-white/95 backdrop-blur-xs rounded-2xl sm:rounded-3xl border border-[#D5EADB] p-4 sm:p-6 md:p-8 shadow-xs">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-[#E5EBE6]">
          <div className="space-y-1 sm:space-y-1.5 max-w-2xl">
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F2] text-[#00553A] text-[10px] sm:text-xs font-bold tracking-wide border border-[#66CDAA]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
              <span>SETORIZAÇÃO COMERCIAL DE MAIRIPORÃ</span>
            </div>
            
            {/* Title: Inter ExtraBold */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#12221A] tracking-tight">
              Categorias em Destaque
            </h2>

            {/* Subtitle: Inter Regular */}
            <p className="text-xs sm:text-sm text-[#586B60] leading-relaxed">
              Encontre com facilidade o comércio local de Mairiporã dividido por setores. Escolha uma categoria para visualizar lojas, contatos e ofertas.
            </p>
          </div>

          {/* Quick Action: Ver Todas as Categorias */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onNavigate('categories')}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#EBF8F2] text-[#00553A] hover:bg-[#00A86B] hover:text-white transition-all duration-200 text-xs sm:text-sm font-bold border border-[#66CDAA]/40 hover:border-[#00A86B] cursor-pointer group shadow-xs"
              title="Acessar catálogo completo com todos os segmentos de Mairiporã"
            >
              <span>Ver todas as categorias</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Sector Group Filter Chips */}
        <div className="pt-4 sm:pt-5 pb-2 sm:pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {sectorFilters.map(filter => {
              const isActive = selectedGroup === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedGroup(filter.id)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#00A86B] text-white shadow-xs'
                      : 'bg-[#F7F9F7] text-[#586B60] hover:text-[#00553A] hover:bg-[#EBF8F2] border border-[#E5EBE6]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid - Responsive for Tablets & Smartphones */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-4.5 pt-3 sm:pt-4">
          {displayedCategories.map(cat => {
            const Icon = cat.icon;
            const count = storeCountMap.get(cat.id) || 0;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCategoryClick(cat.id);
                  }
                }}
                className="group relative flex flex-col justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white border border-[#E5EBE6] hover:border-[#00A86B] hover:shadow-md transition-all duration-200 cursor-pointer text-left hover:-translate-y-1"
                aria-label={`Ver comércios de ${cat.name}`}
              >
                {/* Top Row: Minimalist Lucide Icon + Count Badge */}
                <div>
                  <div className="flex items-start justify-between gap-2 sm:gap-3 mb-2.5 sm:mb-3.5">
                    {/* Minimalist Icon Container */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-[#EBF8F2] text-[#00A86B] group-hover:bg-[#00A86B] group-hover:text-white transition-colors duration-200 flex items-center justify-center shrink-0 border border-[#66CDAA]/30 shadow-xs group-hover:scale-105">
                      <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6" strokeWidth={1.75} />
                    </div>

                    {/* Establishment count badge */}
                    <span className="text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#F7F9F7] text-[#586B60] group-hover:bg-[#EBF8F2] group-hover:text-[#00553A] border border-[#E5EBE6] transition-colors shrink-0">
                      {count > 0 ? `${count} ${count === 1 ? 'loja' : 'lojas'}` : 'Explorar'}
                    </span>
                  </div>

                  {/* Title: Inter SemiBold */}
                  <h3 className="text-xs sm:text-sm md:text-base font-semibold text-[#12221A] group-hover:text-[#00A86B] transition-colors leading-snug line-clamp-1">
                    {cat.name}
                  </h3>

                  {/* Subtitle / Description */}
                  <p className="text-[11px] sm:text-xs text-[#586B60] mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Popular tags & Explore footer */}
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E5EBE6]/70 flex items-center justify-between text-[10px] sm:text-[11px]">
                  <span className="text-[#586B60] truncate max-w-[100px] sm:max-w-[130px] font-normal">
                    {cat.popularItems.slice(0, 2).join(' • ')}
                  </span>

                  <span className="text-[#00A86B] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Ver lojas</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}

          {/* Special "Ver Todas as Categorias" Card */}
          <div
            onClick={() => onNavigate('categories')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onNavigate('categories');
              }
            }}
            className="group flex flex-col justify-between p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#00553A] to-[#00A86B] text-white shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left hover:-translate-y-1 border border-[#00553A]"
            aria-label="Ver todas as categorias comerciais de Mairiporã"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5 sm:mb-3.5">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-white group-hover:text-[#00553A] transition-colors duration-200 group-hover:scale-105">
                  <Store className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 text-white border border-white/20">
                  +12 Setores
                </span>
              </div>

              <h3 className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-[#FFD700] transition-colors leading-snug">
                Catálogo Geral
              </h3>

              <p className="text-[11px] sm:text-xs text-white/90 mt-1 sm:mt-1.5 leading-relaxed line-clamp-2">
                Descubra todos os comércios, prestadores de serviços e produtores rurais de Mairiporã.
              </p>
            </div>

            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-white/20 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold">
              <span className="text-white/90">Acessar índice</span>
              <span className="flex items-center gap-1 text-[#FFD700] group-hover:translate-x-1 transition-transform">
                <span>Abrir guia</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
