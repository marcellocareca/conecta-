import React from 'react';
import { Product } from '../../types';
import { formatCurrency, createProductWhatsAppUrl } from '../../utils/formatters';
import { X, MessageCircle, Store, MapPin, Tag, Heart } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onViewStore: (businessId: string) => void;
  isSaved?: boolean;
  onToggleSave?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onViewStore,
  isSaved = false,
  onToggleSave
}) => {
  if (!product) return null;

  const hasPromo = Boolean(product.promotionalPrice && product.promotionalPrice < product.price);
  const discountPercent = hasPromo && product.promotionalPrice
    ? Math.round(((product.price - product.promotionalPrice) / product.price) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-[#E5EBE6] flex flex-col md:flex-row max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Product Media Column */}
        <div className="relative md:w-1/2 bg-[#F7F9F7] h-64 md:h-auto overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {hasPromo && (
            <div className="absolute top-4 left-4 bg-[#07843B] text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-[#F4E500]" />
              <span>{discountPercent}% DE DESCONTO</span>
            </div>
          )}
        </div>

        {/* Product Content Column */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE6]">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#07843B]">
                {product.categoryName}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#68746C] hover:text-[#17251D] hover:bg-[#E9F6EC] transition-colors cursor-pointer"
                aria-label="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-[#17251D] mt-3 leading-snug">
              {product.name}
            </h3>

            {/* Store details */}
            <div className="mt-3 p-3 bg-[#F7F9F7] rounded-xl flex items-center justify-between border border-[#E5EBE6]">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#17251D] truncate">
                  <Store className="w-4 h-4 text-[#07843B] shrink-0" />
                  <span className="truncate">{product.businessName}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#68746C] mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#07843B] shrink-0" />
                  <span>{product.businessNeighborhood} - Mairiporã</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewStore(product.businessId);
                }}
                className="text-xs font-semibold text-[#07843B] hover:underline shrink-0 ml-2 cursor-pointer"
              >
                Ver loja
              </button>
            </div>

            {/* Price Box */}
            <div className="mt-4">
              <span className="text-xs text-[#68746C] block mb-1">Preço no estabelecimento:</span>
              <div className="flex items-baseline gap-2.5">
                {hasPromo && product.promotionalPrice ? (
                  <>
                    <span className="text-2xl font-bold text-[#07843B]">
                      {formatCurrency(product.promotionalPrice)}
                    </span>
                    <span className="text-sm text-[#68746C] line-through">
                      {formatCurrency(product.price)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#17251D]">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-[#17251D] uppercase tracking-wider mb-1">
                Descrição do item
              </h4>
              <p className="text-xs text-[#68746C] leading-relaxed font-normal">
                {product.description}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-[#E5EBE6] space-y-2">
            <a
              href={createProductWhatsAppUrl(
                product.businessWhatsapp,
                product.businessName,
                product.name,
                product.promotionalPrice || product.price
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#07843B] hover:bg-[#07552F] text-white font-semibold text-sm rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Consultar pelo WhatsApp</span>
            </a>

            <div className="flex items-center justify-between text-xs text-[#68746C] pt-1">
              {onToggleSave && (
                <button
                  type="button"
                  onClick={() => onToggleSave(product)}
                  className="flex items-center gap-1.5 hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{isSaved ? 'Salvo na sacola' : 'Salvar nos favoritos'}</span>
                </button>
              )}
              <span className="text-[11px] text-[#68746C]">
                Sem taxas ou intermediação
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
