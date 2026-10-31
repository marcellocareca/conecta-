export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
};

export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
};

export const formatCNPJ = (cnpj: string): string => {
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length === 14) {
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return cnpj;
};

export const createWhatsAppUrl = (
  phoneOrWhatsapp: string,
  message?: string
): string => {
  let cleaned = phoneOrWhatsapp.replace(/\D/g, '');
  // Ensure country code 55 for Brazil if not present
  if (cleaned.length === 10 || cleaned.length === 11) {
    cleaned = `55${cleaned}`;
  }
  const defaultMsg = message 
    ? encodeURIComponent(message)
    : encodeURIComponent('Olá! Encontrei seu estabelecimento pelo Conecta Mairiporã e gostaria de mais informações.');
  return `https://wa.me/${cleaned}?text=${defaultMsg}`;
};

export const createProductWhatsAppUrl = (
  whatsapp: string,
  storeName: string,
  productName: string,
  price?: number
): string => {
  const priceText = price ? ` (${formatCurrency(price)})` : '';
  const text = `Olá! Vi o produto "${productName}"${priceText} da loja ${storeName} no Conecta Mairiporã e gostaria de saber mais informações sobre disponibilidade.`;
  return createWhatsAppUrl(whatsapp, text);
};
