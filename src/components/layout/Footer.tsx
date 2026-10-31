import React from 'react';
import { Logo } from '../common/Logo';
import { ActiveTab } from '../../types';
import { Heart, MapPin, Phone, ShieldCheck, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenRegisterModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRegisterModal }) => {
  return (
    <footer className="bg-[#07552F] text-white border-t border-[#07843B]">
      {/* Top Banner / Slogan Section */}
      <div className="border-b border-[#07843B]/40 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Logo variant="white" size="lg" showSubtitle={true} />
            <p className="mt-3 text-lg font-medium text-[#E9F6EC] italic">
              &ldquo;Juntos, o comércio local fica mais forte.&rdquo;
            </p>
            <p className="text-xs text-[#35B956] mt-1 font-medium">
              Compre em Mairiporã. O comércio local mais perto de você.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={onOpenRegisterModal ? onOpenRegisterModal : () => onNavigate('register-business')}
              className="px-5 py-2.5 bg-[#F4E500] hover:bg-[#e0d200] text-[#17251D] font-bold text-sm rounded-lg shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              Cadastre sua empresa
            </button>
            <button
              onClick={() => onNavigate('stores')}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-lg transition-colors border border-white/20 cursor-pointer"
            >
              Explorar Lojas
            </button>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: About the Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#F4E500]">
              Sobre a Plataforma
            </h4>
            <p className="text-xs text-[#E9F6EC]/90 leading-relaxed">
              O <strong>Conecta Mairiporã</strong> é a ponte digital entre os cidadãos e as lojas, profissionais e prestadores de serviços da cidade de Mairiporã - SP.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#E9F6EC]">
              <MapPin className="w-4 h-4 text-[#F4E500] shrink-0" />
              <span>Mairiporã, Serra da Cantareira - SP</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#E9F6EC]">
              <Mail className="w-4 h-4 text-[#F4E500] shrink-0" />
              <span>contato@conectamairipora.com.br</span>
            </div>
          </div>

          {/* Col 2: Comércio & Consumidor */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#F4E500]">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs text-[#E9F6EC]">
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Início
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('stores')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Lojas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('categories')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Categorias
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('offers')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Promoções
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Para Comerciantes & Institucional */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#F4E500]">
              Comerciantes & Apoio
            </h4>
            <ul className="space-y-2 text-xs text-[#E9F6EC]">
              <li>
                <button 
                  onClick={() => onNavigate('register-business')} 
                  className="hover:text-white hover:underline font-semibold text-[#F4E500] transition-colors cursor-pointer"
                >
                  Cadastre sua empresa
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('about')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Sobre o projeto
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('contact')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Contato
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Área Administrativa
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Legal & Confiança */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold tracking-wider uppercase text-[#F4E500]">
              Legal & Segurança
            </h4>
            <ul className="space-y-2 text-xs text-[#E9F6EC]">
              <li>
                <button 
                  onClick={() => onNavigate('privacy')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('terms')} 
                  className="hover:text-white hover:underline transition-colors cursor-pointer"
                >
                  Termos de Uso
                </button>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-[#E9F6EC]/80 flex items-start gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#F4E500] shrink-0 mt-0.5" />
              <span>Conexão direta com estabelecimentos locais via WhatsApp oficial. Sem taxas ou comissões nas vendas.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Subfooter */}
      <div className="border-t border-[#07843B]/30 bg-[#04381F] py-4 px-4 text-center text-xs text-[#E9F6EC]/70">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} CONECTA MAIRIPORÃ · Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="w-3.5 h-3.5 text-red-400 fill-current" /> para fortalecer a economia de Mairiporã - SP
          </p>
        </div>
      </div>
    </footer>
  );
};
