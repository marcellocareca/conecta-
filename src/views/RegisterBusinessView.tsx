import React, { useState } from 'react';
import { Category, Business } from '../types';
import { MAIRIPORA_NEIGHBORHOODS } from '../data/categories';
import { DataService } from '../services/dataService';
import { 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertCircle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { LogoUploader } from '../components/common/LogoUploader';

interface RegisterBusinessViewProps {
  categories: Category[];
  onNavigateHome: () => void;
  onNavigateAdmin: () => void;
}

export const RegisterBusinessView: React.FC<RegisterBusinessViewProps> = ({
  categories,
  onNavigateHome,
  onNavigateAdmin
}) => {
  const [formData, setFormData] = useState({
    contactPerson: '',
    name: '',
    tradeName: '',
    cnpj: '',
    categoryId: categories[0]?.id || 'supermercados',
    description: '',
    aboutText: '',
    address: '',
    neighborhood: MAIRIPORA_NEIGHBORHOODS[0] || 'Centro',
    phone: '',
    whatsapp: '',
    email: '',
    openingHours: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 13h',
    logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=300&auto=format&fit=crop&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.contactPerson.trim() || !formData.whatsapp.trim()) {
      setErrorMessage('Por favor, preencha os campos obrigatórios (Responsável, Nome da Empresa e WhatsApp).');
      setIsSubmitting(false);
      return;
    }

    try {
      const selectedCategory = categories.find(c => c.id === formData.categoryId);
      const categoryName = selectedCategory ? selectedCategory.name : 'Outros';

      await DataService.createBusiness({
        name: formData.name.trim(),
        tradeName: formData.tradeName.trim() || formData.name.trim(),
        contactPerson: formData.contactPerson.trim(),
        cnpj: formData.cnpj.trim() || undefined,
        categoryId: formData.categoryId,
        categoryName,
        description: formData.description.trim() || 'Comércio local atendendo a cidade de Mairiporã com produtos de qualidade e atendimento personalizado.',
        aboutText: formData.aboutText.trim() || undefined,
        address: formData.address.trim() || 'Mairiporã - SP',
        neighborhood: formData.neighborhood,
        city: 'Mairiporã - SP',
        phone: formData.phone.trim() || formData.whatsapp.trim(),
        whatsapp: formData.whatsapp.trim(),
        email: formData.email.trim() || 'contato@mairipora.com.br',
        openingHours: formData.openingHours.trim(),
        logoUrl: formData.logoUrl.trim() || 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=300&auto=format&fit=crop&q=80',
        coverUrl: formData.coverUrl.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
        galleryUrls: [
          formData.coverUrl.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'
        ],
        isFeatured: false
      });

      setIsSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocorreu um erro ao registrar sua empresa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmittedSuccess) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-[#E5EBE6]">
          <div className="w-20 h-20 bg-[#E9F6EC] text-[#07843B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#17251D]">
            Cadastro recebido!
          </h2>
          <p className="mt-3 text-base text-[#17251D] font-normal">
            Nossa equipe analisará suas informações antes da publicação.
          </p>

          <div className="mt-6 p-4 rounded-2xl bg-[#E9F6EC] border border-[#07843B]/20 text-[#07552F] text-xs text-left max-w-lg mx-auto flex gap-3">
            <ShieldAlert className="w-5 h-5 text-[#07843B] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Aprovação Administrativa Obrigatória</p>
              <p className="mt-0.5 text-[#07552F]">
                Para manter a alta qualidade e segurança do Conecta Mairiporã, novas empresas não são publicadas automaticamente. O cadastro está com status <strong>Pendente</strong> no painel de moderação.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onNavigateHome}
              className="w-full sm:w-auto px-6 py-3 bg-[#07843B] hover:bg-[#07552F] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs cursor-pointer"
            >
              Voltar para a Página Inicial
            </button>
            <button
              onClick={onNavigateAdmin}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-[#E5EBE6] hover:bg-[#F7F9F7] text-[#17251D] font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              Ver no Painel de Moderação (Admin)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header text */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E9F6EC] text-[#07843B] text-xs font-semibold mb-3 border border-[#E5EBE6]">
          <Building2 className="w-3.5 h-3.5" />
          <span>Portal do Comerciante de Mairiporã</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#17251D]">
          Cadastre sua empresa
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#68746C] leading-relaxed font-normal">
          Faça parte do Conecta Mairiporã e mostre seus produtos, serviços e ofertas para toda a cidade.
        </p>
      </div>

      {/* Main Form Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xs border border-[#E5EBE6]">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Responsible & Legal Details */}
          <div>
            <h3 className="text-sm font-semibold text-[#17251D] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5EBE6] flex items-center gap-2">
              <User className="w-4 h-4 text-[#07843B]" />
              <span>1. Identificação do Responsável e Estabelecimento</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Nome do responsável *
                </label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                  placeholder="Ex: Carlos Eduardo de Souza"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Nome da empresa (Razão Social ou Nome Principal) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Padaria & Empório Cantareira"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Nome fantasia (Como a loja é conhecida)
                </label>
                <input
                  type="text"
                  value={formData.tradeName}
                  onChange={e => setFormData({ ...formData, tradeName: e.target.value })}
                  placeholder="Ex: Cantareira Pães"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  CNPJ (quando aplicável)
                </label>
                <input
                  type="text"
                  value={formData.cnpj}
                  onChange={e => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0001-00"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Categoria comercial *
                </label>
                <select
                  value={formData.categoryId}
                  onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D] cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} — {cat.description}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Localization & Contacts */}
          <div>
            <h3 className="text-sm font-semibold text-[#17251D] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5EBE6] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#07843B]" />
              <span>2. Localização e Canais de Contato</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Bairro em Mairiporã *
                </label>
                <select
                  value={formData.neighborhood}
                  onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] transition-colors text-[#17251D] cursor-pointer"
                >
                  {MAIRIPORA_NEIGHBORHOODS.map(nh => (
                    <option key={nh} value={nh}>
                      {nh}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Endereço completo (Rua, Número, Referência) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Ex: Av. Tabelião Passarella, 320"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  WhatsApp da Loja (para receber clientes) *
                </label>
                <div className="relative">
                  <MessageCircle className="w-4 h-4 text-[#07843B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    placeholder="11971234567"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                  />
                </div>
                <span className="text-[10px] text-[#68746C] mt-0.5 block">
                  Número com DDD (ex: 11987654321) que abrirá a conversa automática.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Telefone fixo ou comercial
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 4419-0000"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  E-mail de contato
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@minhaloja.com.br"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Horário de funcionamento
                </label>
                <div className="relative">
                  <Clock className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={e => setFormData({ ...formData, openingHours: e.target.value })}
                    placeholder="Seg a Sáb: 08h às 19h"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Description & Images */}
          <div>
            <h3 className="text-sm font-semibold text-[#17251D] uppercase tracking-wider mb-4 pb-2 border-b border-[#E5EBE6] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#07843B]" />
              <span>3. Apresentação e Imagens</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  Descrição resumida (aparece no cartão da loja) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Padaria tradicional com pães artesanais, café especial e doces finos na entrada do centro."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  História ou detalhes adicionais (Sobre a loja)
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutText}
                  onChange={e => setFormData({ ...formData, aboutText: e.target.value })}
                  placeholder="Conte um pouco sobre sua trajetória, especialidades e diferenciais para os moradores de Mairiporã."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                />
              </div>

              {/* Logo Upload with Maximum Allowed Size (2 MB) */}
              <div className="bg-[#F7F9F7] p-4 rounded-2xl border border-[#E5EBE6]">
                <LogoUploader
                  value={formData.logoUrl}
                  onChange={(newLogo) => setFormData({ ...formData, logoUrl: newLogo })}
                  maxSizeMB={2}
                  label="Logotipo da Loja / Foto de Perfil"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#17251D] mb-1">
                  URL da Fotografia / Fachada da Loja
                </label>
                <div className="relative">
                  <ImageIcon className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
                  <input
                    type="url"
                    value={formData.coverUrl}
                    onChange={e => setFormData({ ...formData, coverUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] text-[#17251D] transition-colors"
                  />
                </div>
                <span className="text-[10px] text-[#68746C]">Foto nítida e acolhedora da fachada ou vitrine da loja</span>
              </div>
            </div>
          </div>

          {/* Submission Notice & Button */}
          <div className="pt-4 border-t border-[#E5EBE6] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#68746C] leading-relaxed max-w-md font-normal">
              Ao clicar em <strong>Enviar cadastro</strong>, suas informações serão encaminhadas para verificação prévia pela equipe do Conecta Mairiporã.
            </p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#07843B] hover:bg-[#07552F] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Enviando cadastro...' : 'Enviar cadastro'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
