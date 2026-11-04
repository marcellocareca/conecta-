import React from 'react';
import { Product } from '../../types';
import { formatCurrency, createProductWhatsAppUrl } from '../../utils/formatters';
import { MessageCircle, Eye, Heart, Store, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onViewStore?: (businessId: string) => void;
  isSaved?: boolean;
  onToggleSave?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewProduct,
  onViewStore,
  isSaved = false,
  onToggleSave
}) => {
  const hasPromo = Boolean(product.promotionalPrice && product.promotionalPrice < product.price);
  const discountPercent = hasPromo && product.promotionalPrice
    ? Math.round(((product.price - product.promotionalPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-2xl border border-[#E5EBE6] shadow-xs hover:border-[#07843B] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image */}
      <div 
        className="relative h-48 w-full bg-[#F7F9F7] overflow-hidden cursor-pointer"
        onClick={() => onViewProduct(product)}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
          loading="lazy"
        />

        {/* Promotional Tag */}
        {hasPromo && (
          <div className="absolute top-3 left-3 bg-[#07843B] text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
            <Tag className="w-3 h-3 text-[#F4E500]" />
            <span>-{discountPercent}% OFF</span>
          </div>
        )}

        {/* Save to interest list */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(product);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-[#68746C] hover:bg-white hover:text-red-500'
            }`}
            aria-label={isSaved ? 'Remover dos favoritos' : 'Salvar produto'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Category tag */}
        <div className="absolute bottom-2 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-md">
          {product.categoryName}
        </div>
      </div>

      {/* Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Store Name */}
          <div className="flex items-center gap-1 text-xs text-[#68746C] mb-1">
            <Store className="w-3.5 h-3.5 text-[#07843B] shrink-0" />
            <button
              type="button"
              onClick={() => onViewStore && onViewStore(product.businessId)}
              className="hover:text-[#07843B] hover:underline transition-colors truncate font-medium cursor-pointer"
            >
              {product.businessName}
            </button>
            <span className="text-[#E5EBE6]">·</span>
            <span className="truncate">{product.businessNeighborhood}</span>
          </div>

          {/* Product Name (Inter SemiBold) */}
          <h4
            onClick={() => onViewProduct(product)}
            className="text-sm font-semibold text-[#17251D] hover:text-[#07843B] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h4>

          {/* Description */}
          <p className="text-xs text-[#68746C] mt-1 line-clamp-2 font-normal">
            {product.description}
          </p>
        </div>

        {/* Pricing */}
        <div className="mt-3 pt-3 border-t border-[#E5EBE6]">
          <div className="flex items-baseline gap-2 mb-3">
            {hasPromo && product.promotionalPrice ? (
              <>
                <span className="text-lg font-bold text-[#07843B]">
                  {formatCurrency(product.promotionalPrice)}
                </span>
                <span className="text-xs text-[#68746C] line-through">
                  {formatCurrency(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-[#17251D]">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onViewProduct(product)}
              className="py-2.5 px-2 bg-white border border-[#E5EBE6] hover:bg-[#E9F6EC] text-[#17251D] hover:text-[#07843B] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#68746C]" />
              <span className="truncate">Ver produto</span>
            </button>

            <a
              href={createProductWhatsAppUrl(
                product.businessWhatsapp,
                product.businessName,
                product.name,
                product.promotionalPrice || product.price
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-1.5"
              title={`Falar com ${product.businessName} pelo WhatsApp`}
            >
              <MessageCircle className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">Falar com Loja</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
