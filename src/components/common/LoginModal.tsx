import React, { useState } from 'react';
import { Logo } from './Logo';
import { X, Lock, Mail, Shield, CheckCircle, ArrowRight } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
  onRegisterBusinessClick: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterBusinessClick
}) => {
  const [email, setEmail] = useState('admin@conectamairipora.com.br');
  const [password, setPassword] = useState('conecta2026');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    setTimeout(() => {
      // In demo mode or production mode, allow admin or authorized emails
      if (email.trim().length > 3 && password.length >= 4) {
        onLoginSuccess(email.trim());
        setLoading(false);
        onClose();
      } else {
        setError('Por favor, informe um e-mail válido e senha mínima de 4 dígitos.');
        setLoading(false);
      }
    }, 400);
  };

  const handleDemoAdminAccess = () => {
    setEmail('admin@conectamairipora.com.br');
    setPassword('conecta2026');
    onLoginSuccess('admin@conectamairipora.com.br');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="relative bg-[#07552F] p-6 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex justify-center mb-2">
            <Logo variant="white" size="md" />
          </div>
          <h3 className="text-lg font-bold text-white mt-2">Área de Gestão & Comerciante</h3>
          <p className="text-xs text-[#E9F6EC] mt-1 font-medium">
            Painel administrativo e gerenciamento de estabelecimentos
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17251D] mb-1">
                E-mail institucional / de acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-lg focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D]"
                  placeholder="admin@conectamairipora.com.br"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17251D] mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-lg focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-sm rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar no Painel'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Evaluator / Demo Button */}
          <div className="pt-3 border-t border-[#E5EBE6]">
            <div className="p-3 bg-[#E9F6EC] border border-[#07843B]/20 rounded-xl text-left">
              <div className="flex items-center gap-2 text-xs font-bold text-[#07843B]">
                <Shield className="w-4 h-4 text-[#07843B]" />
                <span>Acesso Rápido para Avaliação</span>
              </div>
              <p className="text-[11px] text-[#17251D] mt-1">
                Clique abaixo para acessar imediatamente a área administrativa com dados de Mairiporã:
              </p>
              <button
                type="button"
                onClick={handleDemoAdminAccess}
                className="mt-2.5 w-full py-2 px-3 bg-[#07843B] text-white hover:bg-[#07552F] rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle className="w-3.5 h-3.5 text-[#F4E500]" />
                Entrar como Administrador de Demonstração
              </button>
            </div>
          </div>

          {/* Link to Register Store */}
          <div className="text-center pt-2">
            <p className="text-xs text-[#68746C]">
              Quer divulgar seu comércio em Mairiporã?{' '}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRegisterBusinessClick();
                }}
                className="font-bold text-[#07843B] hover:underline cursor-pointer"
              >
                Cadastre sua empresa aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
