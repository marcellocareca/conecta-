import React, { useState, useEffect } from 'react';
import { 
  Store, 
  Sparkles, 
  X, 
  ArrowRight, 
  CheckCircle2, 
  Building2,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

interface RegisterBusinessPromptPopupProps {
  onOpenRegisterModal: () => void;
}

export const RegisterBusinessPromptPopup: React.FC<RegisterBusinessPromptPopupProps> = ({
  onOpenRegisterModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Check if the user already dismissed it this session
    const dismissed = sessionStorage.getItem('conecta_dismissed_register_prompt');
    if (!dismissed) {
      // Pop up gently after 2.5 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setIsMinimized(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    setIsMinimized(true);
    sessionStorage.setItem('conecta_dismissed_register_prompt', 'true');
  };

  const handleOpenRegistration = () => {
    setIsOpen(false);
    setIsMinimized(true);
    onOpenRegisterModal();
  };

  return (
    <>
      {/* 1. EXPANDED POPUP CARD (Bottom-Left / Bottom-Center on mobile) */}
      {isOpen && (
        <div 
          className="fixed bottom-4 left-3 right-3 sm:right-auto sm:left-6 sm:bottom-6 z-45 max-w-sm sm:max-w-md w-auto animate-in slide-in-from-bottom-5 fade-in duration-300"
          role="dialog"
          aria-label="Cadastre seu negócio aqui"
        >
          <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border-2 border-[#00A86B]/30 overflow-hidden text-[#17251D]">
            {/* Top gradient highlight strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#00553A] via-[#00A86B] to-[#FFD700]" />

            <div className="p-4 sm:p-5">
              {/* Header with badge and close */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF8F2] border border-[#00A86B]/30 text-[#00553A] text-[11px] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#00A86B]" />
                  <span>100% GRATUITO · MAIRIPORÃ</span>
                </div>

                <button
                  onClick={handleDismiss}
                  className="w-7 h-7 rounded-full bg-[#F6FAF7] hover:bg-gray-200 text-[#586B60] hover:text-[#12221A] flex items-center justify-center transition-colors cursor-pointer"
                  title="Fechar"
                  aria-label="Fechar pop-up"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Title & Icon */}
              <div className="flex items-start gap-3 mb-2.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#00A86B] to-[#00553A] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Store className="w-6 h-6 text-[#FFD700]" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#12221A] leading-tight">
                    Cadastre seu negócio aqui!
                  </h3>
                  <p className="text-xs text-[#586B60] mt-0.5 font-medium leading-relaxed">
                    Divulgue sua loja, comércio ou prestação de serviços para milhares de moradores de Mairiporã.
                  </p>
                </div>
              </div>

              {/* Bullet points */}
              <div className="bg-[#F6FAF7] rounded-xl p-2.5 mb-3.5 border border-[#E2ECE5] space-y-1.5 text-xs text-[#586B60]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                  <span>Pedidos diretamente no seu <strong>WhatsApp</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                  <span>Destaque por <strong>bairro e categoria</strong> em Mairiporã</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                  <span><strong>Zero comissão</strong> e sem taxas mensais</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenRegistration}
                  className="flex-1 py-2.5 px-4 bg-[#00A86B] hover:bg-[#00553A] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Cadastrar Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleDismiss}
                  className="py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-[#586B60] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Mais tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MINIMIZED FLOATING PILL (Always available in bottom-left) */}
      {!isOpen && isMinimized && (
        <div className="fixed bottom-4 left-3 sm:left-6 z-40 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-[#EBF8F2] text-[#00553A] border-2 border-[#00A86B] rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 cursor-pointer"
            title="Cadastre seu negócio aqui no Conecta Mairiporã"
          >
            <div className="relative">
              <div className="w-7 h-7 rounded-full bg-[#00A86B] text-white flex items-center justify-center shadow-xs">
                <Store className="w-4 h-4 text-[#FFD700]" />
              </div>
              {/* Pulsing indicator dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00A86B] border border-white"></span>
              </span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-bold text-[#00A86B] uppercase tracking-wider leading-none">
                100% Gratuito
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-[#12221A] leading-tight group-hover:text-[#00553A]">
                Cadastre seu negócio aqui
              </span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};
