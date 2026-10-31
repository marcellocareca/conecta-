import React from 'react';
import { Business } from '../../types';
import { createWhatsAppUrl } from '../../utils/formatters';
import { MapPin, MessageCircle, Star, Heart } from 'lucide-react';

interface StoreCardProps {
  store: Business;
  onSelect: (storeId: string) => void;
  isSaved?: boolean;
  onToggleSave?: (store: Business) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  onSelect,
  isSaved = false,
  onToggleSave
}) => {
  return (
    <div 
      onClick={() => onSelect(store.id)}
      className="group bg-white rounded-2xl border border-[#E5EBE6] shadow-xs hover:border-[#07843B] hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Photo Container */}
      <div className="relative h-44 sm:h-48 w-full bg-[#F7F9F7] overflow-hidden">
        <img
          src={store.coverUrl || store.logoUrl}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-200"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(store);
            }}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-[#68746C] hover:bg-white hover:text-red-500'
            }`}
            aria-label={isSaved ? 'Remover dos favoritos' : 'Salvar loja'}
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Rating Badge in #07843B */}
        {store.rating && (
          <div className="absolute bottom-2.5 right-2.5 bg-[#07843B] text-white text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            <Star className="w-3 h-3 fill-current text-[#F4E500]" />
            <span>{store.rating.toFixed(1).replace('.', ',')}</span>
          </div>
        )}
      </div>

      {/* Card Info (Inter SemiBold para títulos, #17251D e #68746C) */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-[#17251D] group-hover:text-[#07843B] transition-colors line-clamp-1">
            {store.name}
          </h3>

          <p className="text-xs text-[#68746C] font-normal mt-0.5">
            {store.segmentSubtitle || store.categoryName}
          </p>

          <div className="flex items-center gap-1 text-[11px] text-[#68746C] mt-2 truncate">
            <MapPin className="w-3 h-3 text-[#07843B] shrink-0" />
            <span className="truncate">{store.neighborhood} · Mairiporã</span>
          </div>
        </div>

        {/* Actions bar (WhatsApp button in #07843B hover #07552F) */}
        <div className="mt-3 pt-2.5 border-t border-[#E5EBE6] flex items-center justify-between">
          <a
            href={createWhatsAppUrl(
              store.whatsapp,
              `Olá! Encontrei o estabelecimento "${store.name}" no Conecta Mairiporã e gostaria de mais informações.`
            )}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#07843B] hover:text-[#07552F] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>Falar no WhatsApp</span>
          </a>

          <span className="text-[10px] text-[#68746C] font-medium">
            Ver detalhes →
          </span>
        </div>
      </div>
    </div>
  );
};
