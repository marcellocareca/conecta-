import React, { useState } from 'react';
import { Category } from '../../types';
import { MAIRIPORA_NEIGHBORHOODS } from '../../data/categories';
import { DataService } from '../../services/dataService';
import { 
  X, 
  Plus, 
  Store, 
  User, 
  Phone, 
  MapPin, 
  Layers, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Building2,
  Clock
} from 'lucide-react';
import { LogoUploader } from './LogoUploader';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess?: (businessId: string) => void;
  onNavigateToFullForm?: () => void;
}

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSuccess,
  onNavigateToFullForm
}) => {
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [neighborhood, setNeighborhood] = useState(MAIRIPORA_NEIGHBORHOODS[0] || 'Centro');
  const [categoryId, setCategoryId] = useState(categories[0]?.id || 'supermercados');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedStore, setSubmittedStore] = useState<{ id: string; name: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Format WhatsApp phone input as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    setWhatsapp(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, informe o nome do seu comércio.');
      return;
    }
    if (!contactPerson.trim()) {
      setErrorMessage('Por favor, informe o nome do responsável.');
      return;
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setErrorMessage('Por favor, informe um WhatsApp válido com DDD.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCategory = categories.find(c => c.id === categoryId);
      const categoryName = selectedCategory ? selectedCategory.name : 'Comércio Geral';

      const created = await DataService.createBusiness({
        name: name.trim(),
        tradeName: name.trim(),
        contactPerson: contactPerson.trim(),
        categoryId,
        categoryName,
        description: description.trim() || `Comércio em Mairiporã especializado em ${categoryName.toLowerCase()}, com atendimento de qualidade e compromisso local.`,
        aboutText: `Seja muito bem-vindo ao ${name.trim()}! Atuamos com dedicação em Mairiporã, levando as melhores opções em ${categoryName.toLowerCase()} para nossos clientes. Entre em contato pelo WhatsApp e saiba mais!`,
        address: address.trim() || `${neighborhood}, Mairiporã - SP`,
        neighborhood,
        city: 'Mairiporã - SP',
        phone: whatsapp.trim(),
        whatsapp: whatsapp.trim(),
        email: 'contato@conectamairipora.com.br',
        openingHours: 'Segunda a Sábado: horário comercial',
        logoUrl: logoUrl.trim() || 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?w=300&auto=format&fit=crop&q=80',
        coverUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
        galleryUrls: [
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80'
        ],
        isFeatured: false
      });

      setSubmittedStore({ id: created.id, name: created.name });
      if (onSuccess) {
        onSuccess(created.id);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Ocorreu um erro ao cadastrar. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setContactPerson('');
    setWhatsapp('');
    setDescription('');
    setAddress('');
    setLogoUrl('');
    setSubmittedStore(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleResetAndClose();
      }}
    >
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-[#E5EBE6] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-register-title"
      >
        {/* Header with Conecta Mairiporã Brand Accents (Jade Ascent & Dark) */}
        <div className="relative bg-gradient-to-r from-[#00553A] via-[#00A86B] to-[#00553A] text-white p-5 sm:p-6 shrink-0">
          {/* Decorative subtle pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FFD700_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fechar popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FFD700] text-[#12221A] shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#00553A]" />
              100% GRATUITO
            </span>
            <span className="text-xs font-semibold text-[#EBF8F2]">
              Mairiporã - SP
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-8 h-8 rounded-full bg-[#FFD700] flex items-center justify-center text-[#00553A] font-black text-2xl shadow-xs">
                +
              </div>
            </div>
            <div>
              <h2 id="modal-register-title" className="text-xl sm:text-2xl font-black text-white leading-tight">
                Cadastre Seu Negócio Aqui
              </h2>
              <p className="text-xs sm:text-sm text-[#EBF8F2] mt-0.5 font-medium">
                Conecte seu negócio a milhares de clientes e moradores locais!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-[#17251D]">
          {submittedStore ? (
            /* Success confirmation screen */
            <div className="py-6 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-[#E9F6EC] border-4 border-[#35B956]/40 flex items-center justify-center mx-auto text-[#07843B] shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-[#E9F6EC] text-[#07843B] text-xs font-bold rounded-full mb-2">
                  Registro Enviado com Sucesso!
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-[#17251D]">
                  Parabéns, {submittedStore.name}!
                </h3>
                <p className="text-sm text-[#68746C] max-w-md mx-auto mt-2 leading-relaxed">
                  Seu comércio foi cadastrado no <strong>Conecta Mairiporã</strong>. Nosso sistema já registrou seus dados para exibição nas buscas locais.
                </p>
              </div>

              <div className="bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl p-4 max-w-md mx-auto text-left text-xs text-[#68746C] space-y-2">
                <div className="flex items-center gap-2 text-[#07552F] font-semibold">
                  <ShieldCheck className="w-4 h-4 text-[#07843B]" />
                  <span>O que acontece agora?</span>
                </div>
                <p>
                  • Moradores de Mairiporã já poderão encontrar sua loja por nome, bairro e categoria.
                </p>
                <p>
                  • Seu botão de WhatsApp direto está configurado para receber novos pedidos e contatos.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Concluir e Voltar ao Início
                </button>
                {onNavigateToFullForm && (
                  <button
                    type="button"
                    onClick={() => {
                      handleResetAndClose();
                      onNavigateToFullForm();
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#07843B] text-[#07843B] hover:bg-[#E9F6EC] font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Personalizar Fotos e Produtos
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Fast-track Registration Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Highlight benefits banner */}
              <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#E9F6EC]/70 rounded-xl border border-[#07843B]/20 text-center">
                <div className="flex flex-col items-center">
                  <span className="text-base">🚀</span>
                  <span className="text-[11px] font-bold text-[#07552F] mt-0.5">Mais Clientes</span>
                </div>
                <div className="flex flex-col items-center border-x border-[#07843B]/20">
                  <span className="text-base">💬</span>
                  <span className="text-[11px] font-bold text-[#07552F] mt-0.5">Zap Direto</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-base">⭐</span>
                  <span className="text-[11px] font-bold text-[#07552F] mt-0.5">Zero Custo</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-xl animate-in fade-in">
                  {errorMessage}
                </div>
              )}

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Nome do Comércio / Estabelecimento <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Store className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Padaria Serra Verde, Bella Vista Pizzaria..."
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] focus:ring-2 focus:ring-[#07843B]/10 outline-none text-[#17251D] placeholder-[#68746C] transition-all"
                  />
                </div>
              </div>

              {/* Responsible Person & WhatsApp in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Nome do Responsável <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="Ex: Carlos Oliveira"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] focus:ring-2 focus:ring-[#07843B]/10 outline-none text-[#17251D] placeholder-[#68746C] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    WhatsApp do Comércio <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={handlePhoneChange}
                      placeholder="(11) 99999-9999"
                      maxLength={15}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] focus:ring-2 focus:ring-[#07843B]/10 outline-none text-[#17251D] placeholder-[#68746C] transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Neighborhood in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Categoria Principal <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Layers className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] outline-none text-[#17251D] appearance-none transition-all cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">
                    Bairro em Mairiporã <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] outline-none text-[#17251D] appearance-none transition-all cursor-pointer"
                    >
                      {MAIRIPORA_NEIGHBORHOODS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Breve Descrição do que você Vende ou Oferece
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-[#68746C] absolute left-3.5 top-3 pointer-events-none" />
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Fabricação própria de pães artesanais, bolos, café colonial e encomendas para festas."
                    className="w-full pl-10 pr-3.5 py-2 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] outline-none text-[#17251D] placeholder-[#68746C] transition-all resize-none"
                  />
                </div>
              </div>

              {/* Address / Location note */}
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">
                  Endereço ou Referência (Opcional)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Av. Tabelião Passarella, 250 - Centro (ou 'Delivery em domicílio')"
                  className="w-full px-3.5 py-2 text-sm bg-[#F7F9F7] border border-[#E5EBE6] rounded-xl focus:bg-white focus:border-[#07843B] outline-none text-[#17251D] placeholder-[#68746C] transition-all"
                />
              </div>

              {/* Logo Upload with Maximum Allowed Size (2 MB) */}
              <div className="pt-1">
                <LogoUploader
                  value={logoUrl}
                  onChange={setLogoUrl}
                  maxSizeMB={2}
                  label="Logotipo da Loja / Foto do Estabelecimento"
                />
              </div>

              {/* Big Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full group flex items-center justify-center gap-3 py-3.5 px-6 rounded-2xl bg-[#00A86B] hover:bg-[#00553A] text-white font-bold text-base shadow-lg shadow-[#00A86B]/20 transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#FFD700] text-[#12221A] flex items-center justify-center font-black text-xl shadow-xs group-hover:scale-110 group-hover:rotate-90 transition-transform">
                    +
                  </div>
                  <span>{isSubmitting ? 'Cadastrando seu comércio...' : 'Cadastrar Meu Comércio Agora'}</span>
                </button>
              </div>

              {/* Link to full form */}
              {onNavigateToFullForm && (
                <div className="pt-1 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      handleResetAndClose();
                      onNavigateToFullForm();
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#07843B] hover:text-[#07552F] underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <span>Quer cadastrar fotos de capa, catálogo e CNPJ? Abrir formulário completo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
