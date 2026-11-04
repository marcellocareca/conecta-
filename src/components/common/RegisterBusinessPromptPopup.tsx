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
      {/* 1. EXPANDED FLOATING POPUP CARD (IN RADIANT YELLOW) */}
      {isOpen && (
        <div 
          className="fixed bottom-4 left-3 right-3 sm:right-auto sm:left-6 sm:bottom-6 z-45 max-w-sm sm:max-w-md w-auto animate-in slide-in-from-bottom-5 fade-in duration-300"
          role="dialog"
          aria-label="Cadastre seu negócio aqui"
        >
          <div className="relative bg-gradient-to-b from-[#FFFDF0] via-[#FEFCE8] to-[#FEF08A] rounded-2xl sm:rounded-3xl shadow-2xl border-3 border-[#FFD700] overflow-hidden text-[#12221A] ring-4 ring-[#FFD700]/25">
            {/* Top yellow-to-green radiant bar */}
            <div className="h-2 w-full bg-gradient-to-r from-[#FFD700] via-[#F4E500] to-[#00A86B]" />

            <div className="p-4 sm:p-5">
              {/* Header with badge and close */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00553A] text-[#FFD700] text-[11px] font-extrabold shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
                  <span>100% GRATUITO · MAIRIPORÃ</span>
                </div>

                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-[#12221A] flex items-center justify-center transition-colors cursor-pointer"
                  title="Fechar"
                  aria-label="Fechar pop-up"
                >
                  <X className="w-4 h-4 font-bold" />
                </button>
              </div>

              {/* Title & Icon in bright yellow accent */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-[#FFD700] border-2 border-[#12221A]/10 text-[#00553A] flex items-center justify-center shrink-0 shadow-md">
                  <Store className="w-6 h-6 text-[#00553A]" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#12221A] leading-tight">
                    Cadastre seu negócio aqui!
                  </h3>
                  <p className="text-xs sm:text-sm text-[#384A3E] mt-0.5 font-medium leading-relaxed">
                    Divulgue sua loja, comércio ou serviços para milhares de moradores de Mairiporã.
                  </p>
                </div>
              </div>

              {/* Bullet points on soft yellow pill */}
              <div className="bg-white/90 backdrop-blur-xs rounded-xl p-3 mb-3.5 border border-[#FFD700]/60 shadow-xs space-y-1.5 text-xs text-[#2A3B30]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span>Pedidos diretamente no seu <strong>WhatsApp</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span>Destaque por <strong>bairro e categoria</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#00A86B] shrink-0" />
                  <span><strong>Zero comissão</strong> e sem taxas mensais</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenRegistration}
                  className="flex-1 py-3 px-4 bg-[#00553A] hover:bg-[#003D2A] text-white hover:text-[#FFD700] text-xs sm:text-sm font-black rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Cadastrar Agora</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD700]" />
                </button>

                <button
                  onClick={handleDismiss}
                  className="py-3 px-3 bg-black/10 hover:bg-black/15 text-[#12221A] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Mais tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MINIMIZED FLOATING PILL (IN VIBRANT YELLOW) */}
      {!isOpen && isMinimized && (
        <div className="fixed bottom-4 left-3 sm:left-6 z-40 animate-in fade-in zoom-in-95 duration-200">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-[#FFD700] hover:bg-[#FFE033] text-[#12221A] border-2 border-[#12221A]/20 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer ring-3 ring-[#FFD700]/40"
            title="Cadastre seu negócio aqui no Conecta Mairiporã"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#00553A] text-[#FFD700] flex items-center justify-center shadow-xs">
                <Store className="w-4.5 h-4.5" />
              </div>
              {/* Pulsing indicator dot */}
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-600 border-2 border-white"></span>
              </span>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black text-[#00553A] uppercase tracking-wider leading-none">
                100% Gratuito
              </span>
              <span className="text-xs sm:text-sm font-black text-[#12221A] leading-tight">
                Cadastre seu negócio aqui
              </span>
            </div>
          </button>
        </div>
      )}
    </>
  );
};
