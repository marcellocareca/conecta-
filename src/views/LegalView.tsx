import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';

interface LegalViewProps {
  type: 'privacy' | 'terms';
}

export const LegalView: React.FC<LegalViewProps> = ({ type }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xs border border-[#E5EBE6] space-y-8">
        
        <div className="border-b border-[#E5EBE6] pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F6EC] text-[#07843B] text-xs font-bold mb-3">
            {isPrivacy ? <ShieldCheck className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            <span>{isPrivacy ? 'Privacidade & Dados (LGPD)' : 'Regulamento de Uso'}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#17251D]">
            {isPrivacy ? 'Política de Privacidade' : 'Termos de Uso da Plataforma'}
          </h1>
          <p className="text-xs text-[#68746C] mt-1 font-medium">
            CONECTA MAIRIPORÃ · Atualizado em 2026
          </p>
        </div>

        {isPrivacy ? (
          <div className="space-y-6 text-xs sm:text-sm text-[#17251D] leading-relaxed">
            <section>
              <h3 className="text-base font-bold text-[#17251D] mb-2">1. Coleta de Informações</h3>
              <p className="text-[#68746C]">
                O Conecta Mairiporã coleta exclusivamente as informações fornecidas voluntariamente pelos comerciantes no formulário de cadastro (como nome do responsável, nome fantasia, CNPJ, telefone, WhatsApp, endereço e e-mail) com o objetivo de divulgar o comércio local aos moradores de Mairiporã.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-[#17251D] mb-2">2. Uso e Transparência</h3>
              <p className="text-[#68746C]">
                Os dados de contato público do estabelecimento (telefone, WhatsApp, endereço e redes) tornam-se visíveis na plataforma para facilitar o contato direto de clientes interessados. Dados privados de administração não são comercializados ou cedidos a terceiros.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-[#17251D] mb-2">3. Direitos do Titular (LGPD)</h3>
              <p className="text-[#68746C]">
                O responsável pelo estabelecimento pode solicitar a retificação, atualização ou exclusão de seu cadastro a qualquer momento através do e-mail oficial de contato ou pelos canais de moderação da plataforma.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-6 text-xs sm:text-sm text-[#17251D] leading-relaxed">
            <section>
              <h3 className="text-base font-bold text-[#17251D] mb-2">1. Objetivo da Plataforma</h3>
              <p className="text-[#68746C]">
                O Conecta Mairiporã atua como guia e vitrine digital do comércio local e prestadores de serviços de Mairiporã - SP. A plataforma conecta moradores e estabelecimentos via link direto para conversas no WhatsApp.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-[#17251D] mb-2">2. Ausência de Intermediação Financeira</h3>
              <p className="text-[#68746C]">
                Nesta versão, a plataforma não realiza cobranças de pagamentos, transações bancárias ou taxas sobre vendas. Todas as negociações de preço, pagamento, entrega ou retirada de produtos são acordadas de forma livre e direta entre o consumidor e o comerciante local.
              </p>
            </section>

            <section>
              <h3 className="text-base font-bold text-[#17251D] mb-2">3. Moderação e Responsabilidade</h3>
              <p className="text-[#68746C]">
                Todos os cadastros enviados passam por análise e aprovação prévia da equipe administrativa antes da publicação. Os estabelecimentos cadastrados são os únicos responsáveis pela exatidão de suas ofertas, preços e qualidade dos serviços prestados.
              </p>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};
