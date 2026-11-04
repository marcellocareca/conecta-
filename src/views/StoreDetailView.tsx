import React, { useState } from 'react';
import { Business, Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { createWhatsAppUrl, formatPhone } from '../utils/formatters';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Clock, 
  Mail, 
  MessageCircle, 
  Share2, 
  Images, 
  Tag,
  Heart
} from 'lucide-react';

interface StoreDetailViewProps {
  store: Business;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  isSaved?: boolean;
  onToggleSaveStore?: (store: Business) => void;
  savedProductIds: Set<string>;
  onToggleSaveProduct: (product: Product) => void;
}

export const StoreDetailView: React.FC<StoreDetailViewProps> = ({
  store,
  products,
  onBack,
  onSelectProduct,
  isSaved = false,
  onToggleSaveStore,
  savedProductIds,
  onToggleSaveProduct
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'offers'>('all');
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Store products
  const storeProducts = products.filter(p => p.businessId === store.id);
  const storeOffers = storeProducts.filter(p => p.isOffer || Boolean(p.promotionalPrice));

  const displayedProducts = activeTab === 'offers' ? storeOffers : storeProducts;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="pb-20">
      
      {/* Top Back Navigation Bar */}
      <div className="bg-white border-b border-[#E5EBE6] py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#07552F] hover:text-[#07843B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para as lojas</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-[#68746C] hover:bg-[#E9F6EC] hover:text-[#07843B] transition-colors text-xs flex items-center gap-1 cursor-pointer font-medium"
              title="Copiar link da loja"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'Link copiado!' : 'Compartilhar'}</span>
            </button>
            {onToggleSaveStore && (
              <button
                onClick={() => onToggleSaveStore(store)}
                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                  isSaved
                    ? 'bg-red-50 text-red-600'
                    : 'text-[#68746C] hover:bg-[#E9F6EC] hover:text-[#07843B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden sm:inline">{isSaved ? 'Salva na Sacola' : 'Favoritar'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Cover Banner */}
      <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[#07552F] overflow-hidden">
        <img
          src={store.coverUrl || store.logoUrl}
          alt={`Capa da loja ${store.name}`}
          className="w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-[#E5EBE6] p-6 sm:p-8">
          
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            
            {/* Store Identification */}
            <div className="flex flex-col sm:flex-row items-start gap-5">
              {/* Logo */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-md border border-[#E5EBE6] overflow-hidden shrink-0 -mt-12 sm:-mt-16">
                <img
                  src={store.logoUrl}
                  alt={`Logo de ${store.name}`}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-[#07843B] uppercase tracking-wider">
                    {store.categoryName}
                  </span>
                  <span className="text-[#E5EBE6]">·</span>
                  <span className="text-xs text-[#68746C] flex items-center gap-1 font-normal">
                    <MapPin className="w-3.5 h-3.5 text-[#07843B]" />
                    {store.neighborhood}, Mairiporã - SP
                  </span>
                  {store.isDemonstration && (
                    <span className="text-[10px] bg-[#E9F6EC] text-[#07552F] px-2 py-0.5 rounded-md font-medium">
                      Exemplo demonstrativo
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#17251D]">
                  {store.name}
                </h1>
                {store.tradeName && store.tradeName !== store.name && (
                  <p className="text-xs text-[#68746C] font-medium mt-0.5">
                    Nome fantasia: {store.tradeName}
                  </p>
                )}

                <p className="text-sm text-[#68746C] mt-2 max-w-2xl leading-relaxed font-normal">
                  {store.description}
                </p>
              </div>
            </div>

            {/* Direct WhatsApp Call to Action Button */}
            <div className="shrink-0 w-full lg:w-auto">
              <a
                href={createWhatsAppUrl(
                  store.whatsapp,
                  `Olá! Vi o estabelecimento "${store.name}" no Conecta Mairiporã e gostaria de atendimento.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-extrabold text-sm sm:text-base rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                title={`Falar com ${store.name} pelo WhatsApp comercial`}
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Falar com Loja</span>
              </a>
              <p className="text-[11px] text-[#586B60] text-center mt-2 font-medium">
                Atendimento direto via WhatsApp Comercial cadastrado
              </p>
            </div>
          </div>

          {/* Quick Contact & Info Grid */}
          <div className="mt-8 pt-6 border-t border-[#E5EBE6] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EBE6]">
              <MapPin className="w-4 h-4 text-[#07843B] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[#68746C] text-[10px] uppercase font-semibold">Endereço</span>
                <span className="font-semibold text-[#17251D] truncate block">{store.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EBE6]">
              <Clock className="w-4 h-4 text-[#07843B] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[#68746C] text-[10px] uppercase font-semibold">Horário de Funcionamento</span>
                <span className="font-semibold text-[#17251D] truncate block">{store.openingHours || 'Consulte pelo WhatsApp'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EBE6]">
              <Phone className="w-4 h-4 text-[#07843B] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[#68746C] text-[10px] uppercase font-semibold">Telefone</span>
                <span className="font-semibold text-[#17251D] truncate block">{formatPhone(store.phone)}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EBE6]">
              <Mail className="w-4 h-4 text-[#07843B] shrink-0" />
              <div className="min-w-0">
                <span className="block text-[#68746C] text-[10px] uppercase font-semibold">E-mail</span>
                <span className="font-semibold text-[#17251D] truncate block">{store.email}</span>
              </div>
            </div>
          </div>

          {/* Store About Text */}
          {store.aboutText && (
            <div className="mt-6 pt-6 border-t border-[#E5EBE6]">
              <h3 className="text-sm font-semibold text-[#17251D] uppercase tracking-wider mb-2">
                Sobre o Estabelecimento
              </h3>
              <p className="text-sm text-[#68746C] leading-relaxed max-w-4xl font-normal">
                {store.aboutText}
              </p>
            </div>
          )}

          {/* Photo Gallery */}
          {store.galleryUrls && store.galleryUrls.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[#E5EBE6]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#17251D] uppercase tracking-wider mb-3">
                <Images className="w-4 h-4 text-[#07843B]" />
                <span>Fotografias do Estabelecimento</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {store.galleryUrls.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedGalleryImage(img)}
                    className="relative h-28 rounded-xl overflow-hidden bg-[#F7F9F7] cursor-pointer group border border-[#E5EBE6]"
                  >
                    <img
                      src={img}
                      alt={`Foto ${idx + 1} de ${store.name}`}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Store Catalog: Products & Offers */}
        <div className="mt-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5EBE6] pb-4">
            <div>
              <h2 className="text-2xl font-bold text-[#17251D]">
                Produtos & Serviços Cadastrados
              </h2>
              <p className="text-xs text-[#68746C] mt-0.5 font-normal">
                Consulte itens disponíveis e faça seu pedido ou tire dúvidas diretamente pelo WhatsApp.
              </p>
            </div>

            {/* Tabs filter */}
            <div className="flex items-center gap-2 p-1 bg-[#F7F9F7] rounded-xl border border-[#E5EBE6]">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-[#17251D] shadow-xs'
                    : 'text-[#68746C] hover:text-[#17251D]'
                }`}
              >
                Todos ({storeProducts.length})
              </button>
              <button
                onClick={() => setActiveTab('offers')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'offers'
                    ? 'bg-[#07843B] text-white shadow-xs'
                    : 'text-[#68746C] hover:text-[#17251D]'
                }`}
              >
                Ofertas ({storeOffers.length})
              </button>
            </div>
          </div>

          {displayedProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#E5EBE6] p-8">
              <Tag className="w-10 h-10 text-[#68746C] mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-semibold text-[#17251D]">Nenhum produto exibido nesta aba</h4>
              <p className="text-xs text-[#68746C] mt-1 font-normal">
                Fale diretamente pelo WhatsApp para consultar o catálogo completo e novidades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onViewProduct={onSelectProduct}
                  isSaved={savedProductIds.has(prod.id)}
                  onToggleSave={onToggleSaveProduct}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Gallery Lightbox Modal */}
      {selectedGalleryImage && (
        <div
          onClick={() => setSelectedGalleryImage(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <img
            src={selectedGalleryImage}
            alt="Foto ampliada"
            className="max-w-4xl max-h-[85vh] rounded-2xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Mobile Sticky Bottom CTA for Store */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#E5EBE6] p-3 shadow-lg flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-bold text-[#17251D] truncate">{store.name}</div>
          <div className="text-[11px] text-[#00A86B] font-semibold truncate">{store.neighborhood} · Mairiporã</div>
        </div>
        <a
          href={createWhatsAppUrl(
            store.whatsapp,
            `Olá! Vi o estabelecimento "${store.name}" no Conecta Mairiporã e gostaria de atendimento.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-black rounded-xl shadow-md flex items-center gap-2 shrink-0 active:scale-95 cursor-pointer"
          title={`Falar com ${store.name} pelo WhatsApp comercial`}
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Falar com Loja</span>
        </a>
      </div>
    </div>
  );
};
