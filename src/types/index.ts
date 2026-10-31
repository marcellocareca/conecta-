export type BusinessStatus = 'pending' | 'approved' | 'rejected';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export interface Business {
  id: string;
  name: string;
  tradeName?: string;
  categoryId: string;
  categoryName: string;
  description: string;
  aboutText?: string;
  address: string;
  neighborhood: string; // Ex: Centro, Terra Preta, Jardim Capim Branco, etc.
  city: string; // "Mairiporã - SP"
  phone: string;
  whatsapp: string; // Número limpo e formatado para link wa.me
  email: string;
  openingHours: string;
  logoUrl: string;
  coverUrl: string;
  galleryUrls?: string[];
  isFeatured: boolean;
  status: BusinessStatus;
  contactPerson: string;
  cnpj?: string;
  createdAt: string;
  isDemonstration?: boolean;
  featuredOrder?: number;
  rating?: number;
  segmentSubtitle?: string;
}

export interface Product {
  id: string;
  businessId: string;
  businessName: string;
  businessWhatsapp: string;
  businessNeighborhood: string;
  name: string;
  description: string;
  price: number;
  promotionalPrice?: number;
  isOffer: boolean;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'moderator';
}

export type ActiveTab = 
  | 'home'
  | 'stores'
  | 'categories'
  | 'offers'
  | 'store-detail'
  | 'register-business'
  | 'about'
  | 'contact'
  | 'admin'
  | 'privacy'
  | 'terms';
