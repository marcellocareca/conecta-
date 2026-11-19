import React, { useState, useRef } from 'react';
import { 
  Lock, 
  ArrowRight, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  KeyRound,
  AlertCircle,
  Globe
} from 'lucide-react';

interface WelcomeViewProps {
  onEnterAsGuest?: () => void;
  onOpenTour3D?: () => void;
  onLoginSuccess: (email: string) => void;
  onOpenRegisterModal?: () => void;
  totalStoresCount?: number;
  heroVideoUrl?: string;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  onOpenTour3D,
  onLoginSuccess,
  heroVideoUrl = 'https://conectamairipora.com.br/conecta1.mp4'
}) => {
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Video playback controls
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Default password or any valid password of 4+ chars
    if (adminPassword.trim() === 'conecta2026' || adminPassword.trim().length >= 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess('admin@conectamairipora.com.br');
      }, 350);
    } else {
      setErrorMessage('Senha incorreta. (Dica de teste: conecta2026)');
    }
  };

  const handleQuickDemoAccess = () => {
    setAdminPassword('conecta2026');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess('admin@conectamairipora.com.br');
    }, 250);
  };

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col justify-between overflow-hidden bg-[#F7FAF8] text-[#17251D] selection:bg-[#00A86B] selection:text-white">
      {/* 
        REFINED LIGHT GREENISH-GRAY GRADIENT BACKGROUND:
        Luminous silvery sage frost transitioning into soft mineral eucalyptus-gray
      */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#F7FAF8] via-[#E9F0EC] to-[#D8E3DC]" />
      
      {/* Soft ambient lighting nuances for depth and brilliance */}
      <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[850px] h-[500px] bg-[#66CDAA]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[550px] h-[450px] bg-[#00A86B]/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 left-1/4 w-[650px] h-[400px] bg-[#E2EBE4] rounded-full blur-3xl pointer-events-none" />

      {/* Clean Top Header: Official Brand Logo Larger & Prominent */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/conecta_oficial.png"
            alt="Conecta Mairiporã"
            className="h-16 sm:h-20 md:h-24 w-auto object-contain drop-shadow-md hover:scale-102 transition-transform duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/conecta.png';
            }}
          />
        </div>

        {/* Header Actions: Tour 3D + Discreet Admin Lock Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenTour3D && (
            <button
              onClick={onOpenTour3D}
              className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all bg-[#00A86B] hover:bg-[#008f5a] text-white shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0"
              title="Explorar o Tour 3D Interativo de Mairiporã"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Tour 3D Mairiporã</span>
            </button>
          )}

          <button
            onClick={() => {
              setIsAdminFormOpen(!isAdminFormOpen);
              setErrorMessage(null);
            }}
            className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer whitespace-nowrap shrink-0 ${
              isAdminFormOpen
                ? 'bg-[#FFD700] text-[#12221A] border-[#FFD700] shadow-md'
                : 'bg-white/90 hover:bg-white text-[#17251D] border-[#CCD8CF] hover:border-[#00A86B] shadow-xs hover:shadow-sm'
            }`}
            title="Acesso Administrativo"
          >
            <Lock className="w-3.5 h-3.5 text-[#00553A]" />
            <span>Acesso Admin</span>
          </button>
        </div>
      </header>

      {/* Main Clean Content: Em Construção + Vídeo de Apresentação */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
        
        {/* Em Construção Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#B8CABF] text-[#00553A] text-xs sm:text-sm font-extrabold tracking-wide uppercase backdrop-blur-md shadow-xs animate-pulse">
          <Sparkles className="w-4 h-4 text-[#00A86B]" />
          <span>Plataforma em Construção · Em Breve</span>
        </div>

        {/* Headline */}
        <div className="space-y-2 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black text-[#17251D] tracking-tight leading-tight">
            Conecta <span className="text-[#00A86B]">Mairiporã</span>
          </h1>
          <p className="text-sm sm:text-base text-[#485D50] font-medium leading-relaxed">
            Estamos preparando a nova plataforma de comércio, serviços e gastronomia da nossa cidade. 
            Em breve você poderá descobrir lojas locais e fazer pedidos diretamente no WhatsApp.
          </p>
        </div>

        {/* 
          CENTRAL PRESENTATION VIDEO CONTAINER:
          Clean, responsive frame prepared for the presentation video
        */}
        <div className="w-full max-w-2xl relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#CCD8CF] bg-black group aspect-video">
          <video
            ref={videoRef}
            src={heroVideoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => {
              console.warn('Presentation video playback notice');
            }}
            className="w-full h-full object-cover"
          />

          {/* Video Control Overlay on hover / tap */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end justify-between p-4">
            <button
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer"
              title={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-colors cursor-pointer"
              title={isMuted ? "Ativar som" : "Silenciar áudio"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 
          ADMIN ACCESS:
          Clean, single-field access for administrator 
        */}
        <div className="w-full max-w-md pt-2">
          {isAdminFormOpen ? (
            <div className="bg-white/95 backdrop-blur-xl border border-[#CCD8CF] rounded-2xl p-4 sm:p-5 shadow-xl text-left animate-in fade-in zoom-in-95 duration-200 text-[#17251D]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#00553A]">
                  <KeyRound className="w-4 h-4 text-[#00A86B]" />
                  <span>Acesso ao Painel de Controle</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAdminFormOpen(false)}
                  className="text-[#68746C] hover:text-[#17251D] text-xs font-semibold cursor-pointer"
                >
                  Fechar
                </button>
              </div>

              {errorMessage && (
                <div className="p-2.5 mb-3 rounded-lg bg-red-50 text-red-700 text-xs font-semibold border border-red-200 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleAdminSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Lock className="w-4 h-4 text-[#68746C] absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="password"
                    autoFocus
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Digite a senha admin..."
                    className="w-full pl-9 pr-3 py-2.5 bg-[#F6FAF7] border border-[#CCD8CF] rounded-xl text-[#17251D] placeholder-[#68746C] text-xs sm:text-sm focus:border-[#00A86B] focus:ring-2 focus:ring-[#00A86B]/20 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#008f5a] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {loading ? 'Entrando...' : 'Acessar'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Demo Access Button */}
              <div className="mt-3 pt-2.5 border-t border-[#E5EBE6] flex items-center justify-between text-[11px] text-[#68746C]">
                <span>Dica de teste: <code>conecta2026</code></span>
                <button
                  type="button"
                  onClick={handleQuickDemoAccess}
                  className="text-[#00A86B] hover:text-[#00553A] hover:underline font-bold cursor-pointer"
                >
                  Entrar com 1 clique
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdminFormOpen(true)}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#586B60] hover:text-[#17251D] transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-black/5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Acesso restrito para administradores</span>
            </button>
          )}
        </div>

      </main>

      {/* Clean Minimalist Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#586B60] border-t border-[#CCD8CF]/70 gap-2">
        <span>© {new Date().getFullYear()} Conecta Mairiporã · Todos os direitos reservados.</span>
        <span>Mairiporã, Serra da Cantareira - SP</span>
      </footer>
    </div>
  );
};
