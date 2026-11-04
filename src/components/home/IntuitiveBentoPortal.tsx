import React from 'react';
import { ActiveTab } from '../../types';
import { 
  Store, 
  Wrench, 
  Tag, 
  MapPin, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  ShoppingBag,
  TrendingUp,
  Percent,
  Search
} from 'lucide-react';

interface IntuitiveBentoPortalProps {
  onNavigate: (tab: ActiveTab, params?: any) => void;
  onOpenRegisterModal?: () => void;
  totalStoresCount?: number;
}

export const IntuitiveBentoPortal: React.FC<IntuitiveBentoPortalProps> = ({
  onNavigate,
  onOpenRegisterModal,
  totalStoresCount = 18
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Intro Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF8F2] text-[#00553A] text-xs font-bold tracking-wide uppercase shadow-xs border border-[#66CDAA]/40">
          <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
          Navegação Rápida & Intuitiva
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#12221A] mt-2 tracking-tight">
          O que você precisa em Mairiporã hoje?
        </h2>
        <p className="text-xs sm:text-sm text-[#586B60] mt-1 font-normal">
          Escolha uma das áreas da cidade e encontre estabelecimentos, produtos e serviços em 1 clique.
        </p>
      </div>

      {/* 
        Bento Grid Layout mirroring the exact composition and color blocks from the user's reference:
        - Left Pillar: Jade Ascent (#00A86B)
        - Top Right: Sapphire (#0F52BA)
        - Center Right: Gold (#FFD700)
        - Bottom Left: Jade Ascent - Light (#66CDAA)
        - Bottom Right: Jade Ascent - Dark (#00553A)
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
        
        {/* ========================================================
            BLOCK 1: JADE ASCENT (#00A86B) - Grande Destaque Esquerda
            ======================================================== */}
        <div 
          onClick={() => onNavigate('stores')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('stores'); }}
          className="md:col-span-7 bg-[#00A86B] text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[300px] sm:min-h-[350px] md:min-h-[380px]"
          style={{ backgroundColor: '#00A86B' }}
          aria-label="Explorar comércio local e lojas de Mairiporã"
        >
          {/* Subtle geometric circles overlay */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 pointer-events-none group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute right-12 top-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

          {/* Top Tag & Store counter */}
          <div className="flex items-center justify-between z-10 gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] sm:text-xs font-bold tracking-wider uppercase border border-white/30 shadow-xs">
              <Store className="w-3.5 h-3.5" />
              Comércio Local
            </span>
            <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-black/15 text-white backdrop-blur-md shrink-0">
              +{totalStoresCount} Lojas Ativas
            </span>
          </div>

          {/* Center Info */}
          <div className="my-4 sm:my-6 z-10 max-w-lg">
            <h3 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Compre em Mairiporã
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-white/95 mt-1.5 sm:mt-2 font-normal leading-relaxed">
              Supermercados, padarias, boutiques, moda, restaurantes e produtos artesanais perto de você com contato direto no WhatsApp.
            </p>

            {/* Quick shortcuts pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-white/20 text-white font-medium">Alimentação</span>
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-white/20 text-white font-medium">Moda & Estilo</span>
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-white/20 text-white font-medium">Restaurantes</span>
              <span className="text-[11px] sm:text-xs px-2.5 py-1 rounded-lg bg-white/20 text-white font-medium">Artesanato</span>
            </div>
          </div>

          {/* Bottom Action Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 sm:pt-4 border-t border-white/20 z-10">
            <span className="text-[11px] sm:text-xs font-medium text-white/90">
              Valorize quem produz na Serra da Cantareira
            </span>
            <span className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-white text-[#00A86B] font-bold text-xs sm:text-sm shadow-md group-hover:bg-[#FFD700] group-hover:text-[#12221A] transition-colors shrink-0">
              <span>Explorar Lojas</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Right Column (Sapphire + Gold) */}
        <div className="md:col-span-5 flex flex-col gap-4 sm:gap-5">
          
          {/* ========================================================
              BLOCK 2: SAPPHIRE (#0F52BA) - Serviços & Profissionais
              ======================================================== */}
          <div 
            onClick={() => onNavigate('stores', { categoryId: 'servicos-profissionais' })}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('stores', { categoryId: 'servicos-profissionais' }); }}
            className="flex-1 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white min-h-[175px]"
            style={{ backgroundColor: '#0F52BA' }}
            aria-label="Encontrar prestadores de serviços e profissionais em Mairiporã"
          >
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-white/10 pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-bold tracking-wider uppercase border border-white/30">
                <Wrench className="w-3.5 h-3.5" />
                Sapphire Hub
              </span>
              <span className="text-[11px] font-medium text-white/90">Especialistas</span>
            </div>

            <div className="my-2 z-10">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Serviços & Profissionais
              </h3>
              <p className="text-xs text-white/90 mt-1 line-clamp-2">
                Eletricistas, mecânica, assistência técnica, saúde, obras e serviços especializados.
              </p>
            </div>

            <div className="flex items-center justify-between z-10 pt-2 border-t border-white/20 text-xs font-bold text-[#FFD700]">
              <span>Contatar Especialista</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* ========================================================
              BLOCK 3: GOLD (#FFD700) - Ofertas & Economia Local
              ======================================================== */}
          <div 
            onClick={() => onNavigate('offers')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('offers'); }}
            className="flex-1 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 min-h-[175px]"
            style={{ backgroundColor: '#FFD700', color: '#12221A' }}
            aria-label="Ver ofertas e promoções com desconto em Mairiporã"
          >
            <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-black/10 pointer-events-none group-hover:scale-125 transition-transform duration-500" />

            <div className="flex items-center justify-between z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/10 text-[#12221A] text-[11px] font-extrabold tracking-wider uppercase border border-black/15">
                <Tag className="w-3.5 h-3.5 text-[#00553A]" />
                Gold Deals
              </span>
              <span className="text-[11px] font-extrabold bg-[#00553A] text-white px-2 py-0.5 rounded-full">
                Economize
              </span>
            </div>

            <div className="my-2 z-10">
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#12221A] tracking-tight">
                Ofertas & Descontos
              </h3>
              <p className="text-xs text-[#12221A]/85 mt-1 line-clamp-2 font-medium">
                Confira as melhores promoções de comércios locais para pedir pelo WhatsApp.
              </p>
            </div>

            <div className="flex items-center justify-between z-10 pt-2 border-t border-black/15 text-xs font-extrabold text-[#00553A]">
              <span>Ver Promoções da Semana</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

        {/* ========================================================
            BLOCK 4: JADE ASCENT - LIGHT (#66CDAA) - Bairros & Localização
            ======================================================== */}
        <div 
          onClick={() => onNavigate('categories')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') onNavigate('categories'); }}
          className="md:col-span-6 rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          style={{ backgroundColor: '#66CDAA', color: '#00553A' }}
          aria-label="Navegar por categorias e bairros de Mairiporã"
        >
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/20 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="flex items-center justify-between z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 text-[#00553A] text-xs font-extrabold tracking-wider uppercase border border-white/40">
              <MapPin className="w-3.5 h-3.5 text-[#00553A]" />
              Jade Light
            </span>
            <span className="text-xs font-bold text-[#00553A]/90">Todas as Regiões</span>
          </div>

          <div className="my-4 z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#00553A] tracking-tight">
              Categorias & Bairros
            </h3>
            <p className="text-xs sm:text-sm text-[#00553A]/90 mt-1.5 leading-relaxed font-medium">
              Centro, Terra Preta, Cantareira, Roseira, Capuava e todos os setores comerciais de Mairiporã.
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#00553A]/20 z-10 text-xs font-bold text-[#00553A]">
            <span>Explorar Guia Completo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* ========================================================
            BLOCK 5: JADE ASCENT - DARK (#00553A) - Cadastre Seu Comércio
            ======================================================== */}
        <div 
          onClick={onOpenRegisterModal ? onOpenRegisterModal : () => onNavigate('register-business')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { 
            if (e.key === 'Enter') {
              if (onOpenRegisterModal) onOpenRegisterModal();
              else onNavigate('register-business');
            } 
          }}
          className="md:col-span-6 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-7 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-white"
          style={{ backgroundColor: '#00553A' }}
          aria-label="Cadastrar empresa gratuitamente no Conecta Mairiporã"
        >
          <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-500" />

          <div className="flex items-center justify-between z-10 gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700] text-[#12221A] text-[11px] sm:text-xs font-black tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00553A]" />
              100% Gratuito
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-[#66CDAA]">
              Portal do Comerciante
            </span>
          </div>

          <div className="my-3 sm:my-4 z-10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Cadastre Seu Negócio Aqui</span>
            </h3>
            <p className="text-xs sm:text-sm text-white/90 mt-1.5 leading-relaxed font-normal">
              Coloque seu negócio no mapa digital de Mairiporã. Receba clientes no WhatsApp sem mensalidades.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/20 z-10">
            <span className="text-[11px] sm:text-xs text-white/80 font-medium">
              Ativação rápida em menos de 2 minutos
            </span>
            <div className="inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl bg-[#FFD700] text-[#12221A] font-black text-xs sm:text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
              <div className="w-5 h-5 rounded-full bg-[#00553A] text-[#FFD700] flex items-center justify-center font-black text-sm">
                +
              </div>
              <span>Cadastrar Agora</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
