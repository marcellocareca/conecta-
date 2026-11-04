import React from 'react';
import { Product, Business } from '../../types';
import { formatCurrency, createProductWhatsAppUrl, createWhatsAppUrl } from '../../utils/formatters';
import { X, Trash2, MessageCircle, ExternalLink, ShoppingBag, Store } from 'lucide-react';

interface InterestBagModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedProducts: Product[];
  savedStores: Business[];
  onRemoveProduct: (id: string) => void;
  onRemoveStore: (id: string) => void;
  onViewStore: (businessId: string) => void;
}

export const InterestBagModal: React.FC<InterestBagModalProps> = ({
  isOpen,
  onClose,
  savedProducts,
  savedStores,
  onRemoveProduct,
  onRemoveStore,
  onViewStore
}) => {
  if (!isOpen) return null;

  const totalSaved = savedProducts.length + savedStores.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E5EBE6] bg-[#F7F9F7]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#E9F6EC] text-[#07843B] rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 id="modal-title" className="text-base font-bold text-[#17251D]">
                Minha Lista de Interesses
              </h3>
              <p className="text-xs text-[#68746C]">
                {totalSaved} {totalSaved === 1 ? 'item salvo' : 'itens salvos'} em Mairiporã
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#68746C] hover:text-[#17251D] hover:bg-gray-200/60 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {totalSaved === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-16 h-16 bg-[#E9F6EC] text-[#07843B] rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="text-base font-semibold text-[#17251D]">Sua lista está vazia</h4>
              <p className="text-xs text-[#68746C] mt-1 max-w-xs mx-auto">
                Explore as lojas e produtos de Mairiporã e clique no ícone de coração ou sacola para guardá-los aqui e falar rápido pelo WhatsApp.
              </p>
            </div>
          ) : (
            <>
              {/* Saved Products */}
              {savedProducts.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#07843B] mb-3">
                    Produtos & Ofertas ({savedProducts.length})
                  </h4>
                  <div className="space-y-3">
                    {savedProducts.map(prod => (
                      <div
                        key={prod.id}
                        className="flex gap-3 p-3 rounded-xl border border-[#E5EBE6] bg-white shadow-xs hover:border-[#07843B]/40 transition-colors"
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0 border border-[#E5EBE6]"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#17251D] line-clamp-1">
                            {prod.name}
                          </h5>
                          <p className="text-[11px] text-[#68746C] line-clamp-1">
                            {prod.businessName} · {prod.businessNeighborhood}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            {prod.promotionalPrice ? (
                              <>
                                <span className="text-xs font-extrabold text-[#07843B]">
                                  {formatCurrency(prod.promotionalPrice)}
                                </span>
                                <span className="text-[10px] text-gray-400 line-through">
                                  {formatCurrency(prod.price)}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-[#17251D]">
                                {formatCurrency(prod.price)}
                              </span>
                            )}
                          </div>
                          
                          {/* Actions */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5EBE6]/60">
                            <a
                              href={createProductWhatsAppUrl(
                                prod.businessWhatsapp,
                                prod.businessName,
                                prod.name,
                                prod.promotionalPrice || prod.price
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#07843B] hover:text-[#07552F]"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-current" />
                              Falar com Loja
                            </a>
                            <button
                              onClick={() => onRemoveProduct(prod.id)}
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Stores */}
              {savedStores.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#07843B] mb-3">
                    Lojas Favoritas ({savedStores.length})
                  </h4>
                  <div className="space-y-3">
                    {savedStores.map(store => (
                      <div
                        key={store.id}
                        className="flex gap-3 p-3 rounded-xl border border-[#E5EBE6] bg-white shadow-xs hover:border-[#07843B]/40 transition-colors"
                      >
                        <img
                          src={store.logoUrl}
                          alt={store.name}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100 shrink-0 border border-[#E5EBE6]"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#17251D] line-clamp-1">
                            {store.name}
                          </h5>
                          <p className="text-[11px] text-[#68746C]">
                            {store.categoryName} · {store.neighborhood}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E5EBE6]/60">
                            <div className="flex items-center gap-3">
                              <a
                                href={createWhatsAppUrl(store.whatsapp)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#07843B] hover:text-[#07552F]"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                Falar com Loja
                              </a>
                              <button
                                onClick={() => {
                                  onViewStore(store.id);
                                  onClose();
                                }}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#68746C] hover:text-[#17251D] cursor-pointer"
                              >
                                <Store className="w-3.5 h-3.5" />
                                Ver Loja
                              </button>
                            </div>
                            <button
                              onClick={() => onRemoveStore(store.id)}
                              className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-[#E5EBE6] bg-[#F7F9F7] text-center">
          <p className="text-[11px] text-[#68746C]">
            O Conecta Mairiporã conecta você direto ao comerciante pelo WhatsApp oficial.
          </p>
        </div>
      </div>
    </div>
  );
};
