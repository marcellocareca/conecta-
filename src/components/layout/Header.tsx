import React, { useState } from 'react';
import { Logo } from '../common/Logo';
import { ActiveTab } from '../../types';
import { 
  User, 
  Menu, 
  X, 
  Search, 
  Store, 
  Layers, 
  Sparkles, 
  Info, 
  PhoneCall, 
  PlusCircle, 
  Plus,
  ShieldCheck 
} from 'lucide-react';
import { VoiceSearchButton } from '../common/VoiceSearchButton';
import { VoiceSearchModal } from '../common/VoiceSearchModal';

interface HeaderProps {
  currentTab: ActiveTab;
  onNavigate: (tab: ActiveTab, params?: any) => void;
  savedItemsCount: number;
  onOpenSavedBag: () => void;
  isAdminLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onOpenRegisterModal?: () => void;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  savedItemsCount,
  onOpenSavedBag,
  isAdminLoggedIn,
  onOpenLoginModal,
  onOpenRegisterModal,
  onSearch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearchTerm, setHeaderSearchTerm] = useState('');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'home', label: 'Início', icon: Store },
    { id: 'stores', label: 'Lojas', icon: Store },
    { id: 'categories', label: 'Categorias', icon: Layers },
    { id: 'offers', label: 'Promoções', icon: Sparkles },
    { id: 'about', label: 'Sobre', icon: Info },
    { id: 'contact', label: 'Contato', icon: PhoneCall },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  const executeSearch = (term: string) => {
    if (term.trim()) {
      if (onSearch) {
        onSearch(term.trim());
      } else {
        onNavigate('stores', { search: term.trim() });
      }
      setMobileMenuOpen(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(headerSearchTerm);
  };

  const handleVoiceSearchResult = (spokenTerm: string) => {
    setHeaderSearchTerm(spokenTerm);
    executeSearch(spokenTerm);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5EBE6] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between min-h-[80px] sm:min-h-[88px] py-1.5 gap-2 sm:gap-3">
          
          {/* Mobile Menu Button (Left on mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-xl text-[#07552F] hover:bg-[#E9F6EC] transition-colors cursor-pointer"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Logo: Centralizado em Mobile, Alinhado à Esquerda em Desktop */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer flex items-center justify-center flex-1 md:flex-none md:justify-start py-2"
          >
            <Logo size="md" />
          </div>

          {/* Desktop Navigation Links (Inter Medium, links em verde escuro #00553A) */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-2 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                    isActive 
                      ? 'text-[#00A86B] font-semibold' 
                      : 'text-[#00553A] hover:text-[#00A86B]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A86B] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Unified Desktop Search Bar with Voice Search Button */}
          <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm mx-2 lg:mx-3">
            <form onSubmit={handleSearchSubmit} className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-[#586B60] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={headerSearchTerm}
                onChange={e => setHeaderSearchTerm(e.target.value)}
                placeholder="Buscar lojas, serviços ou falar..."
                className="w-full pl-9 pr-9 py-2 text-xs bg-[#F6FAF7] border border-[#E2ECE5] rounded-full focus:bg-white focus:border-[#00A86B] text-[#12221A] placeholder-[#586B60] transition-colors"
              />
              <div className="absolute right-1.5 flex items-center">
                <VoiceSearchButton
                  variant="input-inline"
                  onClick={() => setIsVoiceModalOpen(true)}
                  title="Buscar por voz em Mairiporã"
                />
              </div>
            </form>
          </div>

          {/* Right actions: Voice Button (Mobile), Cadastrar Loja, Entrar and Cart Button */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Direct Voice Search Circle button on Mobile Header */}
            <VoiceSearchButton
              variant="header-circle"
              className="md:hidden"
              onClick={() => setIsVoiceModalOpen(true)}
              title="Buscar por voz em Mairiporã"
            />

            {/* Merchant CTA button: Enlarged size with large + symbol, triggers 'Cadastre aqui seu comércio' popup */}
            <button
              onClick={onOpenRegisterModal ? onOpenRegisterModal : () => handleNavClick('register-business')}
              className="hidden lg:inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-full text-sm font-bold text-white bg-[#00A86B] hover:bg-[#00553A] shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 group cursor-pointer border border-[#00A86B]"
              title="Cadastre aqui seu comércio - 100% Gratuito"
            >
              <div className="w-6 h-6 rounded-full bg-[#FFD700] text-[#12221A] flex items-center justify-center font-black text-xl leading-none shrink-0 group-hover:scale-110 group-hover:rotate-90 transition-transform shadow-xs">
                +
              </div>
              <span className="tracking-tight whitespace-nowrap">Cadastrar Loja</span>
            </button>

            {/* Quick mobile button for Cadastrar Loja with prominent + */}
            <button
              onClick={onOpenRegisterModal ? onOpenRegisterModal : () => handleNavClick('register-business')}
              className="lg:hidden flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#EBF8F2] hover:bg-[#00A86B] text-[#00A86B] hover:text-white border border-[#00A86B]/30 font-bold text-xs transition-all active:scale-95 cursor-pointer"
              title="Cadastre seu comércio em Mairiporã"
            >
              <div className="w-5 h-5 rounded-full bg-[#00A86B] text-[#FFD700] flex items-center justify-center font-black text-base shrink-0 leading-none">
                +
              </div>
              <span className="hidden xs:inline font-bold">Cadastrar</span>
            </button>

            {/* Entrar Button */}
            <button
              onClick={isAdminLoggedIn ? () => handleNavClick('admin') : onOpenLoginModal}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-xs cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-[#00553A] text-white hover:bg-[#00A86B]'
                  : 'bg-[#00A86B] hover:bg-[#00553A] text-white'
              }`}
            >
              <User className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{isAdminLoggedIn ? 'Painel Admin' : 'Entrar'}</span>
              <span className="sm:hidden">{isAdminLoggedIn ? 'Admin' : 'Entrar'}</span>
            </button>

            {/* Cart / Sacola Button with Sapphire and Gold Accent */}
            <button
              onClick={onOpenSavedBag}
              className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#E2ECE5] bg-white hover:bg-[#EBF8F2] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              title="Sacola / Lojas e Itens Salvos"
              aria-label="Minha Sacola"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 3H5L6.68 14.39C6.77 15.01 7.31 15.48 7.94 15.48H18.5C19.11 15.48 19.64 15.03 19.74 14.42L21 6.5H6"
                  stroke="#0F52BA"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9" cy="20" r="1.5" fill="#FFD700" />
                <circle cx="18" cy="20" r="1.5" fill="#FFD700" />
              </svg>

              <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1 text-[11px] font-bold text-white bg-[#00A86B] rounded-full shadow-xs">
                {savedItemsCount}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5EBE6] bg-white px-4 pt-4 pb-6 shadow-xl animate-in fade-in">
          {/* Mobile search bar with Voice Search Button */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#68746C] absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={headerSearchTerm}
                onChange={e => setHeaderSearchTerm(e.target.value)}
                placeholder="O que você procura em Mairiporã?"
                className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F7F9F7] border border-[#E5EBE6] rounded-full focus:bg-white focus:border-[#07843B] text-[#17251D] placeholder-[#68746C]"
              />
              <div className="absolute right-2 flex items-center">
                <VoiceSearchButton
                  variant="input-inline"
                  onClick={() => setIsVoiceModalOpen(true)}
                  title="Falar busca por voz"
                />
              </div>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1.5">
            {navItems.map(item => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#E9F6EC] text-[#07552F] font-semibold'
                      : 'text-[#07552F] hover:bg-[#F7F9F7]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#07843B]" />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-3 border-t border-[#E2ECE5] space-y-2 mt-2">
              {/* Cadastrar Loja CTA with large + symbol */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRegisterModal) {
                    onOpenRegisterModal();
                  } else {
                    handleNavClick('register-business');
                  }
                }}
                className="flex items-center justify-center gap-3 w-full py-3.5 px-4 rounded-xl bg-[#00A86B] hover:bg-[#00553A] text-white font-bold text-sm shadow-md transition-all cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-[#FFD700] text-[#12221A] flex items-center justify-center font-black text-xl leading-none shadow-xs group-hover:rotate-90 transition-transform shrink-0">
                  +
                </div>
                <span>Cadastre Aqui Seu Comércio Grátis</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (isAdminLoggedIn) {
                    onNavigate('admin');
                  } else {
                    onOpenLoginModal();
                  }
                }}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#00553A] hover:bg-[#00A86B] text-white font-semibold text-sm shadow-xs"
              >
                <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
                {isAdminLoggedIn ? 'Painel Administrativo' : 'Entrar na Plataforma'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Search Modal Popup */}
      <VoiceSearchModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onSearch={handleVoiceSearchResult}
        initialQuery={headerSearchTerm}
      />
    </header>
  );
};
