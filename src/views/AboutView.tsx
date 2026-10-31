import React from 'react';
import { Logo } from '../components/common/Logo';
import { ActiveTab } from '../types';
import { 
  HeartHandshake, 
  MapPin, 
  Store, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  ArrowRight 
} from 'lucide-react';

interface AboutViewProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Hero section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <Logo size="lg" showSubtitle={true} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#17251D]">
          O comércio local mais perto de você
        </h1>
        <p className="text-base sm:text-lg text-[#07552F] font-semibold max-w-2xl mx-auto italic">
          &ldquo;Juntos, o comércio local fica mais forte.&rdquo;
        </p>
      </div>

      {/* Main Story & Purpose */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-[#E5EBE6] space-y-6 text-sm sm:text-base text-[#17251D] leading-relaxed">
        <h2 className="text-2xl font-bold text-[#17251D]">
          Nossa Missão em Mairiporã
        </h2>
        <p className="text-[#68746C]">
          O <strong className="text-[#17251D]">Conecta Mairiporã</strong> nasceu com um propósito claro e transformador: conectar os moradores de Mairiporã aos comerciantes, artesãos, prestadores de serviços e empreendedores que movimentam nossa cidade todos os dias.
        </p>
        <p className="text-[#68746C]">
          Mairiporã é uma cidade acolhedora, cercada pela exuberância da Serra da Cantareira e com bairros vibrantes — do Centro a Terra Preta, do Jardim Capim Branco ao Lavapés, Saboó e Rio Abaixo. No entanto, muitas vezes os moradores deixavam de consumir no próprio município por falta de um canal digital centralizado e confiável onde encontrar produtos, orçamentos e serviços.
        </p>
        <p className="text-[#68746C]">
          Nossa plataforma elimina essa barreira: apresentamos vitrines virtuais completas e conectamos o consumidor diretamente ao WhatsApp oficial de cada loja, sem taxas ocultas, intermediários ou comissões sobre as vendas.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE6] shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#E9F6EC] text-[#07843B] flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#17251D]">Valorização da Economia Local</h3>
          <p className="text-xs text-[#68746C] mt-2 leading-relaxed">
            Cada compra feita no comércio de Mairiporã gera empregos, incentiva pequenas famílias e mantém a renda circulando dentro da nossa própria comunidade.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE6] shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#E9F6EC] text-[#07843B] flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#17251D]">Segurança & Curadoria</h3>
          <p className="text-xs text-[#68746C] mt-2 leading-relaxed">
            Todos os estabelecimentos cadastrados passam por moderação prévia da equipe para garantir que apenas comércios e profissionais reais estejam listados.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5EBE6] shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-[#E9F6EC] text-[#07843B] flex items-center justify-center mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#17251D]">Proximidade e Agilidade</h3>
          <p className="text-xs text-[#68746C] mt-2 leading-relaxed">
            Sem processos burocráticos de checkout. O cliente tira dúvidas e combina a entrega ou retirada direto pelo WhatsApp com o dono do estabelecimento.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="rounded-3xl bg-gradient-to-r from-[#07552F] to-[#07843B] p-8 sm:p-10 text-white text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">
          Você tem um comércio ou presta serviços em Mairiporã?
        </h3>
        <p className="text-xs sm:text-sm text-[#E9F6EC] max-w-xl mx-auto">
          Faça parte da nossa rede de lojas locais e aumente sua visibilidade junto aos moradores da cidade.
        </p>
        <button
          onClick={() => onNavigate('register-business')}
          className="px-6 py-3 bg-[#F4E500] hover:bg-[#e0d200] text-[#17251D] font-bold text-sm rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <span>Cadastre sua empresa gratuitamente</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
