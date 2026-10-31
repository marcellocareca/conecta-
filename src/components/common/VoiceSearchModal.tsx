import React, { useEffect, useState } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Search, 
  AlertCircle, 
  Sparkles, 
  RotateCcw,
  Check
} from 'lucide-react';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
  initialQuery = ''
}) => {
  const [selectedTerm, setSelectedTerm] = useState('');

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    reset
  } = useVoiceSearch({
    onFinalResult: (finalText) => {
      if (finalText && finalText.trim().length > 0) {
        setSelectedTerm(finalText.trim());
        // Automatically trigger search after brief delay for natural UX
        setTimeout(() => {
          onSearch(finalText.trim());
          onClose();
        }, 1200);
      }
    }
  });

  // Start listening automatically when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedTerm('');
      reset();
      // Brief timeout to ensure modal is mounted and user has context
      const timer = setTimeout(() => {
        startListening();
      }, 250);
      return () => clearTimeout(timer);
    } else {
      stopListening();
    }
  }, [isOpen, startListening, stopListening, reset]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        stopListening();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, stopListening, onClose]);

  if (!isOpen) return null;

  const currentDisplaySpeech = selectedTerm || transcript || interimTranscript;

  const handleManualSearch = (termToSearch: string) => {
    if (termToSearch.trim()) {
      stopListening();
      onSearch(termToSearch.trim());
      onClose();
    }
  };

  const exampleSuggestions = [
    'Pizzaria',
    'Farmácia',
    'Pet Shop',
    'Materiais para Construção',
    'Restaurante',
    'Padaria',
    'Dentista',
    'Boutique de Roupas'
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-search-title"
    >
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl border border-[#E5EBE6] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5EBE6] bg-[#F7F9F7]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E9F6EC] border border-[#07843B]/20 flex items-center justify-center text-[#07843B]">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h2 id="voice-search-title" className="text-sm font-bold text-[#17251D]">
                Busca por Voz
              </h2>
              <p className="text-[11px] text-[#68746C]">Conecta Mairiporã</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              stopListening();
              onClose();
            }}
            className="w-8 h-8 rounded-full text-[#68746C] hover:text-[#17251D] hover:bg-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar busca por voz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body */}
        <div className="px-6 py-8 text-center">
          
          {/* Animated Central Microphone Pulse */}
          <div className="relative inline-flex items-center justify-center mb-6">
            {isListening && (
              <>
                <span className="absolute w-32 h-32 rounded-full bg-[#07843B]/10 animate-ping pointer-events-none" />
                <span className="absolute w-24 h-24 rounded-full bg-[#35B956]/20 animate-pulse pointer-events-none" />
              </>
            )}

            <button
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer ${
                isListening
                  ? 'bg-[#07843B] text-white scale-105 shadow-[#07843B]/30'
                  : selectedTerm
                  ? 'bg-[#35B956] text-white'
                  : 'bg-[#E9F6EC] text-[#07843B] hover:bg-[#07843B] hover:text-white'
              }`}
              title={isListening ? "Parar de ouvir" : "Clique para falar"}
            >
              {selectedTerm ? (
                <Check className="w-9 h-9 animate-in zoom-in" />
              ) : isListening ? (
                <Mic className="w-9 h-9 animate-bounce duration-700" />
              ) : (
                <MicOff className="w-8 h-8 text-[#68746C]" />
              )}
            </button>
          </div>

          {/* Equalizer Wave Bars while listening */}
          {isListening && (
            <div className="flex items-center justify-center gap-1.5 h-6 mb-4">
              <span className="w-1 bg-[#07843B] rounded-full animate-[pulse_0.6s_ease-in-out_infinite] h-3" />
              <span className="w-1 bg-[#35B956] rounded-full animate-[pulse_0.4s_ease-in-out_infinite_0.1s] h-6" />
              <span className="w-1 bg-[#07843B] rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.2s] h-4" />
              <span className="w-1 bg-[#0879D9] rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.3s] h-5" />
              <span className="w-1 bg-[#07843B] rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.15s] h-3" />
            </div>
          )}

          {/* Status Label */}
          <div className="mb-4">
            {selectedTerm ? (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F6EC] text-[#07843B] text-xs font-bold">
                <Check className="w-3.5 h-3.5" />
                <span>Termo identificado! Redirecionando...</span>
              </div>
            ) : isListening ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F6EC] text-[#07552F] text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#07843B] animate-ping" />
                <span>Ouvindo... Diga o que procura em Mairiporã</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F9F7] border border-[#E5EBE6] text-[#68746C] text-xs font-medium">
                <span>Microfone pausado</span>
              </div>
            )}
          </div>

          {/* Live Transcript / Speech Preview Box */}
          <div className="min-h-[72px] flex items-center justify-center px-4 py-3 bg-[#F7F9F7] rounded-2xl border border-[#E5EBE6] mb-5">
            {currentDisplaySpeech ? (
              <p className="text-lg sm:text-xl font-bold text-[#17251D] tracking-tight">
                "{currentDisplaySpeech}"
              </p>
            ) : (
              <p className="text-xs sm:text-sm text-[#68746C] italic font-normal">
                {isListening 
                  ? "Fale algo como: 'Pizzaria', 'Pet shop na Terra Preta', 'Dentista'..." 
                  : "Clique no botão do microfone acima para começar a falar"}
              </p>
            )}
          </div>

          {/* Error Message if any */}
          {error && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-left mb-5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Aviso de microfone:</p>
                <p className="mt-0.5">{error}</p>
                <button
                  onClick={() => startListening()}
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-[#07843B] hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Tentar novamente</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick voice suggestions */}
          <div className="mt-2 text-left">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#68746C] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#07843B]" />
              <span>Ou escolha uma busca rápida em Mairiporã:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {exampleSuggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => handleManualSearch(item)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#F7F9F7] hover:bg-[#E9F6EC] hover:text-[#07843B] text-[#17251D] border border-[#E5EBE6] hover:border-[#07843B]/30 transition-colors cursor-pointer"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#E5EBE6] bg-[#F7F9F7]">
          <button
            onClick={() => {
              if (isListening) {
                stopListening();
              } else {
                startListening();
              }
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-[#07552F] hover:bg-white border border-[#E5EBE6] transition-colors cursor-pointer"
          >
            {isListening ? (
              <>
                <MicOff className="w-3.5 h-3.5 text-red-500" />
                <span>Pausar Escuta</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 text-[#07843B]" />
                <span>Falar Novamente</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                stopListening();
                onClose();
              }}
              className="px-4 py-2 rounded-full text-xs font-medium text-[#68746C] hover:text-[#17251D] hover:bg-white transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              onClick={() => {
                const term = currentDisplaySpeech.trim();
                if (term) {
                  handleManualSearch(term);
                }
              }}
              disabled={!currentDisplaySpeech.trim()}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-white bg-[#07843B] hover:bg-[#07552F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Buscar Agora</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
