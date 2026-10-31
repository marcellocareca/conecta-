import React, { useState, useMemo } from 'react';
import { Category, Business, ActiveTab } from '../../types';
import { ChevronRight, ArrowRight, Sparkles, Store } from 'lucide-react';

/* =========================================================================
   CUSTOM BESPOKE ICONS FOR MAIRIPORÃ'S LOCAL COMMERCE SECTORS
   Custom crafted SVGs with clean lines, high-contrast paths, and brand colors
   ========================================================================= */

interface IconProps {
  className?: string;
}

// 1. Supermercado & Alimentação: Cesta de feira com hortifruti e pão artesanal
const IconSupermercado: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 10h16l-1.5 10.5a1.5 1.5 0 0 1-1.5 1.5H7a1.5 1.5 0 0 1-1.5-1.5L4 10z" />
    <path d="M8 10V6a4 4 0 0 1 8 0v4" />
    <path d="M9 14v4" />
    <path d="M15 14v4" />
    <path d="M12 13v6" />
    <circle cx="12" cy="4" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

// 2. Restaurantes & Gastronomia: Prato cloche com talheres cruzados e vapor
const IconRestaurante: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8v6a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2V8" />
    <path d="M15 16v5" />
    <path d="M18 3v3" />
    <path d="M12 3v3" />
    <path d="M15 3v3" />
    <path d="M6 4v17" />
    <path d="M4 7h4a2 2 0 0 0 2-2V4" />
    <path d="M6 11h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6" />
  </svg>
);

// 3. Moda & Vestuário: Cabide elegante com contorno de jaqueta e tag
const IconModa: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v2" />
    <path d="M3.5 15.5l7.5-6.5 7.5 6.5a2 2 0 0 1-.8 3.5H4.3a2 2 0 0 1-.8-3.5z" />
    <path d="M7 19v2.5" />
    <path d="M17 19v2.5" />
  </svg>
);

// 4. Casa & Construção: Telhado com martelo e tijolos estruturais
const IconConstrucao: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V10.5z" />
    <path d="M9 21.5v-7h6v7" />
    <path d="M14 8l3 3" />
    <path d="M15 7l2 2" />
  </svg>
);

// 5. Eletrônicos & Celulares: Smartphone moderno com conexões e chip
const IconEletronicos: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="6" y="2" width="12" height="20" rx="3" />
    <path d="M10 6h4" />
    <circle cx="12" cy="18" r="1" fill="currentColor" />
    <path d="M2 10h2" />
    <path d="M20 10h2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
  </svg>
);

// 6. Autopeças & Mecânica: Roda automotiva com chave de fenda/porca
const IconAutopecas: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v6" />
    <path d="M12 15v6" />
    <path d="M3 12h6" />
    <path d="M15 12h6" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </svg>
);

// 7. Saúde & Beleza: Cruz de farmácia com coração acolhedor e brilho
const IconSaude: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    <path d="M12 8v6" />
    <path d="M9 11h6" />
  </svg>
);

// 8. Pet Shop & Veterinária: Pata estilizada com carinho
const IconPetShop: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 13c-2.5 0-4.5 1.8-4.5 4 0 2 1.5 3.5 4.5 3.5s4.5-1.5 4.5-3.5c0-2.2-2-4-4.5-4z" />
    <circle cx="6" cy="11.5" r="2.2" />
    <circle cx="9" cy="6.5" r="2" />
    <circle cx="15" cy="6.5" r="2" />
    <circle cx="18" cy="11.5" r="2.2" />
  </svg>
);

// 9. Móveis & Decoração: Poltrona de design aconchegante com abajur
const IconMoveis: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 19v2" />
    <path d="M18 19v2" />
    <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-4z" />
    <path d="M6 9V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v3" />
    <path d="M4 14h16" />
  </svg>
);

// 10. Agro & Jardim Cantareira: Broto da Serra com folhas e orvalho
const IconAgro: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21V11" />
    <path d="M12 11c0-4.5 3.5-7 8-7 0 4.5-2.5 8-8 7z" />
    <path d="M12 15c0-3.5-3-5.5-7-5.5 0 3.5 2 6 7 5.5z" />
    <path d="M5 21h14" />
  </svg>
);

// 11. Serviços Profissionais: Maleta executiva com selo de verificação
const IconServicos: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="7" width="18" height="14" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M12 12v3" />
    <path d="M3 12h18" />
  </svg>
);

// 12. Óticas & Relojoarias: Óculos de armação moderna com foco óptico
const IconOticas: React.FC<IconProps> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="6.5" cy="14" r="3.5" />
    <circle cx="17.5" cy="14" r="3.5" />
    <path d="M10 14h4" />
    <path d="M3.5 13L2 8" />
    <path d="M20.5 13L22 8" />
  </svg>
);

/* =========================================================================
   CATEGORY DEFINITIONS WITH INTUITIVE METADATA
   ========================================================================= */

interface FeaturedCategoryItem {
  id: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  sectorGroup: 'all' | 'food' | 'retail' | 'home' | 'services' | 'wellness';
  iconComponent: React.FC<IconProps>;
  highlightColor?: string;
  popularItems: string[];
}

const FEATURED_SECTOR_ITEMS: FeaturedCategoryItem[] = [
  {
    id: 'supermercados',
    name: 'Supermercado & Feira',
    shortLabel: 'Supermercados',
    subtitle: 'Hortifruti fresco, açougues, padarias e mercearias',
    sectorGroup: 'food',
    iconComponent: IconSupermercado,
    popularItems: ['Hortifruti', 'Padaria', 'Açougue', 'Empório']
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes & Gastronomia',
    shortLabel: 'Restaurantes',
    subtitle: 'Burgers artesanais, pizzarias, comida caseira e cafés',
    sectorGroup: 'food',
    iconComponent: IconRestaurante,
    popularItems: ['Pizzas', 'Lanches', 'Cafés', 'Comida Caipira']
  },
  {
    id: 'moda',
    name: 'Moda & Acessórios',
    shortLabel: 'Moda',
    subtitle: 'Vestuário feminino, masculino, infantil e calçados',
    sectorGroup: 'retail',
    iconComponent: IconModa,
    popularItems: ['Roupas', 'Calçados', 'Moda Íntima', 'Bolsas']
  },
  {
    id: 'casa-construcao',
    name: 'Casa & Construção',
    shortLabel: 'Construção',
    subtitle: 'Materiais básicos, ferramentas, elétrica e hidráulica',
    sectorGroup: 'home',
    iconComponent: IconConstrucao,
    popularItems: ['Ferramentas', 'Tintas', 'Elétrica', 'Acabamento']
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos & Informática',
    shortLabel: 'Eletrônicos',
    subtitle: 'Celulares, notebooks, acessórios e assistência técnica',
    sectorGroup: 'retail',
    iconComponent: IconEletronicos,
    popularItems: ['Celulares', 'Assistência', 'Cabos', 'Fones']
  },
  {
    id: 'autopecas',
    name: 'Autopeças & Mecânica',
    shortLabel: 'Autopeças',
    subtitle: 'Pneus, baterias, oficinas, troca de óleo e auto center',
    sectorGroup: 'services',
    iconComponent: IconAutopecas,
    popularItems: ['Pneus', 'Baterias', 'Oficinas', 'Freios']
  },
  {
    id: 'saude-beleza',
    name: 'Saúde, Farmácia & Beleza',
    shortLabel: 'Saúde & Beleza',
    subtitle: 'Drogarias, salões de beleza, barbearias e estética',
    sectorGroup: 'wellness',
    iconComponent: IconSaude,
    popularItems: ['Farmácias', 'Salões', 'Barbearias', 'Estética']
  },
  {
    id: 'pet-shop',
    name: 'Pet Shop & Veterinária',
    shortLabel: 'Pet Shop',
    subtitle: 'Rações, banho e tosa, vacinas e cuidados para animais',
    sectorGroup: 'wellness',
    iconComponent: IconPetShop,
    popularItems: ['Rações', 'Banho & Tosa', 'Veterinária', 'Acessórios']
  },
  {
    id: 'moveis-decoracao',
    name: 'Móveis & Decoração',
    shortLabel: 'Móveis',
    subtitle: 'Móveis para casa e chácara, colchões e iluminação',
    sectorGroup: 'home',
    iconComponent: IconMoveis,
    popularItems: ['Móveis', 'Colchões', 'Sofás', 'Decoração']
  },
  {
    id: 'agro-jardim',
    name: 'Agro, Flores & Jardim',
    shortLabel: 'Agro & Jardim',
    subtitle: 'Plantas ornamentais, mudas da Cantareira e jardinagem',
    sectorGroup: 'home',
    iconComponent: IconAgro,
    popularItems: ['Mudas', 'Flores', 'Gramas', 'Vasos']
  },
  {
    id: 'servicos-profissionais',
    name: 'Serviços Especializados',
    shortLabel: 'Serviços',
    subtitle: 'Contabilidade, projetos, reformas e consultorias locais',
    sectorGroup: 'services',
    iconComponent: IconServicos,
    popularItems: ['Contábil', 'Manutenção', 'Instalações', 'Serviços']
  },
  {
    id: 'oticas',
    name: 'Óticas & Relojoaria',
    shortLabel: 'Óticas',
    subtitle: 'Armações de óculos, lentes de grau e proteção solar',
    sectorGroup: 'retail',
    iconComponent: IconOticas,
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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 -mt-2 sm:-mt-4">
      {/* Header Container */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E5EBE6] p-5 sm:p-8 shadow-xs">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5EBE6]">
          <div className="space-y-1.5 max-w-2xl">
            {/* Tag / Eyebrow */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F6EC] text-[#07843B] text-[11px] sm:text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#07843B]" />
              <span>SETORIZAÇÃO COMERCIAL DE MAIRIPORÃ</span>
            </div>
            
            {/* Title: Inter ExtraBold */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#17251D] tracking-tight">
              Categorias em Destaque
            </h2>

            {/* Subtitle: Inter Regular */}
            <p className="text-xs sm:text-sm text-[#68746C] leading-relaxed">
              Encontre com facilidade o comércio local de Mairiporã dividido por setores. Escolha uma categoria para visualizar lojas, contatos e ofertas.
            </p>
          </div>

          {/* Quick Action: Ver Todas as Categorias */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('categories')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E9F6EC] text-[#07843B] hover:bg-[#07843B] hover:text-white transition-all duration-200 text-xs sm:text-sm font-semibold border border-[#E5EBE6] hover:border-[#07843B] cursor-pointer group shadow-xs"
              title="Acessar catálogo completo com todos os segmentos de Mairiporã"
            >
              <span>Ver todas as categorias</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Sector Group Filter Chips */}
        <div className="pt-5 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {sectorFilters.map(filter => {
              const isActive = selectedGroup === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedGroup(filter.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#07843B] text-white shadow-xs'
                      : 'bg-[#F7F9F7] text-[#68746C] hover:text-[#07843B] hover:bg-[#E9F6EC] border border-[#E5EBE6]'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5 pt-4">
          {displayedCategories.map(cat => {
            const Icon = cat.iconComponent;
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
                className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-[#E5EBE6] hover:border-[#07843B] hover:shadow-md transition-all duration-200 cursor-pointer text-left hover:-translate-y-1"
                aria-label={`Ver comércios de ${cat.name}`}
              >
                {/* Top Row: Custom Icon + Count Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3.5">
                    {/* Custom Icon Container */}
                    <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-[#E9F6EC] text-[#07843B] group-hover:bg-[#07843B] group-hover:text-white transition-colors duration-200 flex items-center justify-center shrink-0 border border-[#E5EBE6] shadow-xs group-hover:scale-105">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>

                    {/* Establishment count badge */}
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F7F9F7] text-[#68746C] group-hover:bg-[#E9F6EC] group-hover:text-[#07843B] border border-[#E5EBE6] transition-colors shrink-0">
                      {count > 0 ? `${count} ${count === 1 ? 'loja' : 'lojas'}` : 'Explorar'}
                    </span>
                  </div>

                  {/* Title: Inter SemiBold */}
                  <h3 className="text-sm sm:text-base font-semibold text-[#17251D] group-hover:text-[#07843B] transition-colors leading-snug line-clamp-1">
                    {cat.name}
                  </h3>

                  {/* Subtitle / Description */}
                  <p className="text-xs text-[#68746C] mt-1.5 leading-relaxed line-clamp-2">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Popular tags & Explore footer */}
                <div className="mt-4 pt-3 border-t border-[#E5EBE6]/70 flex items-center justify-between text-[11px]">
                  <span className="text-[#68746C] truncate max-w-[130px] font-normal">
                    {cat.popularItems.slice(0, 2).join(' • ')}
                  </span>

                  <span className="text-[#07843B] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
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
            className="group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#07552F] to-[#07843B] text-white shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left hover:-translate-y-1 border border-[#07552F]"
            aria-label="Ver todas as categorias comerciais de Mairiporã"
          >
            <div>
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 border border-white/20 group-hover:bg-white group-hover:text-[#07843B] transition-colors duration-200 group-hover:scale-105">
                  <Store className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/20">
                  +12 Setores
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#F4E500] transition-colors leading-snug">
                Catálogo Geral
              </h3>

              <p className="text-xs text-white/80 mt-1.5 leading-relaxed">
                Descubra todos os comércios, prestadores de serviços e produtores rurais de Mairiporã.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-semibold">
              <span className="text-white/90">Acessar índice</span>
              <span className="flex items-center gap-1 text-[#F4E500] group-hover:translate-x-1 transition-transform">
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
