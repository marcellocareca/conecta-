import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2 } from 'lucide-react';
import { createWhatsAppUrl } from '../utils/formatters';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#07843B]">
          Atendimento Oficial
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17251D]">
          Fale com a Equipe do Conecta Mairiporã
        </h1>
        <p className="text-sm text-[#68746C] max-w-xl mx-auto">
          Dúvidas sobre o cadastro da sua loja, sugestões ou suporte para comerciantes e moradores da cidade.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EBE6] shadow-xs space-y-6">
          <h3 className="text-lg font-bold text-[#17251D]">
            Canais de Atendimento
          </h3>

          <div className="space-y-4 text-xs sm:text-sm text-[#17251D]">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#E9F6EC] text-[#07843B] rounded-xl shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#17251D]">Endereço</strong>
                <span className="text-[#68746C]">Mairiporã - SP (Serra da Cantareira)</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#E9F6EC] text-[#07843B] rounded-xl shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#17251D]">E-mail Institucional</strong>
                <span className="text-[#68746C]">contato@conectamairipora.com.br</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-[#E9F6EC] text-[#07843B] rounded-xl shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-[#17251D]">Telefone / Horário</strong>
                <span className="text-[#68746C]">(11) 4419-0000 · Seg a Sex, das 09h às 18h</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5EBE6]">
            <a
              href={createWhatsAppUrl(
                '5511971234567',
                'Olá! Gostaria de falar com a equipe de coordenação do Conecta Mairiporã.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chamar no WhatsApp de Suporte</span>
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5EBE6] shadow-xs">
          {sent ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-[#E9F6EC] text-[#07843B] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#17251D]">Mensagem Enviada!</h3>
              <p className="text-xs text-[#68746C] max-w-xs mx-auto">
                Obrigado pelo contato! Retornaremos para o seu e-mail ou WhatsApp o mais breve possível.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs text-[#07843B] font-bold hover:underline cursor-pointer"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-bold text-[#17251D]">
                Envie uma Mensagem
              </h3>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Seu Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Seu E-mail
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Mensagem ou Dúvida
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Como podemos ajudar você ou sua empresa em Mairiporã?"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
