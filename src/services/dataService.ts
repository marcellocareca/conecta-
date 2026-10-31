import { Business, Product, Category, BusinessStatus } from '../types';
import { INITIAL_BUSINESSES, INITIAL_PRODUCTS } from '../data/mockData';
import { INITIAL_CATEGORIES } from '../data/categories';
import { isFirebaseConfigured, db } from './firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

const STORAGE_KEYS = {
  BUSINESSES: 'conecta_mairipora_businesses_v1',
  PRODUCTS: 'conecta_mairipora_products_v1',
  CATEGORIES: 'conecta_mairipora_categories_v1'
};

// Listeners for reactive updates across components
type ChangeListener = () => void;
const listeners = new Set<ChangeListener>();

export const subscribeDataChanges = (callback: ChangeListener) => {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
};

const notifyDataChanged = () => {
  listeners.forEach(fn => fn());
};

// In-Memory / LocalStorage Storage Helpers
const getStoredBusinesses = (): Business[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
      return INITIAL_BUSINESSES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_BUSINESSES;
  }
};

const saveStoredBusinesses = (data: Business[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(data));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving businesses to localStorage:', e);
  }
};

const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_PRODUCTS;
  }
};

const saveStoredProducts = (data: Product[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving products to localStorage:', e);
  }
};

const getStoredCategories = (): Category[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CATEGORIES;
  }
};

const saveStoredCategories = (data: Category[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data));
    notifyDataChanged();
  } catch (e) {
    console.error('Error saving categories to localStorage:', e);
  }
};

// --- DATA ACCESS METHODS ---

export const DataService = {
  isConfiguredWithFirebase(): boolean {
    return isFirebaseConfigured;
  },

  // Reset to initial demo data
  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    notifyDataChanged();
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<Category[]> {
    if (isFirebaseConfigured && db) {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        if (!snap.empty) {
          return snap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
        }
      } catch (err) {
        console.warn('Fallback to local categories:', err);
      }
    }
    return getStoredCategories();
  },

  async addCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'categories'), categoryData);
        newCategory.id = docRef.id;
      } catch (err) {
        console.warn('Firebase write failed, using local:', err);
      }
    }

    const current = getStoredCategories();
    saveStoredCategories([...current, newCategory]);
    return newCategory;
  },

  // --- BUSINESSES ---
  async getBusinesses(options?: {
    status?: BusinessStatus | 'all';
    categoryId?: string;
    featuredOnly?: boolean;
    neighborhood?: string;
    searchTerm?: string;
  }): Promise<Business[]> {
    let list: Business[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const businessesRef = collection(db, 'businesses');
        let q = query(businessesRef);
        if (options?.status && options.status !== 'all') {
          q = query(businessesRef, where('status', '==', options.status));
        }
        const snap = await getDocs(q);
        if (!snap.empty) {
          list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Business));
        }
      } catch (err) {
        console.warn('Firebase query failed, using local businesses:', err);
        list = getStoredBusinesses();
      }
    } else {
      list = getStoredBusinesses();
    }

    // Client-side filtering
    return list.filter(b => {
      // Status filter: defaults to 'approved' if not 'all' or specific
      const targetStatus = options?.status || 'approved';
      if (targetStatus !== 'all' && b.status !== targetStatus) {
        return false;
      }

      if (options?.featuredOnly && !b.isFeatured) {
        return false;
      }

      if (options?.categoryId && b.categoryId !== options.categoryId) {
        return false;
      }

      if (options?.neighborhood && options.neighborhood !== 'all' && b.neighborhood !== options.neighborhood) {
        return false;
      }

      if (options?.searchTerm) {
        const queryTerm = options.searchTerm.toLowerCase().trim();
        const inName = b.name.toLowerCase().includes(queryTerm);
        const inTradeName = b.tradeName?.toLowerCase().includes(queryTerm) || false;
        const inDesc = b.description.toLowerCase().includes(queryTerm);
        const inCategory = b.categoryName.toLowerCase().includes(queryTerm);
        const inNeighborhood = b.neighborhood.toLowerCase().includes(queryTerm);
        if (!inName && !inTradeName && !inDesc && !inCategory && !inNeighborhood) {
          return false;
        }
      }

      return true;
    });
  },

  async getBusinessById(id: string): Promise<Business | null> {
    if (isFirebaseConfigured && db) {
      try {
        const docSnap = await getDoc(doc(db, 'businesses', id));
        if (docSnap.exists()) {
          return { id: docSnap.id, ...docSnap.data() } as Business;
        }
      } catch (err) {
        console.warn('Firebase getBusinessById failed:', err);
      }
    }
    const current = getStoredBusinesses();
    return current.find(b => b.id === id) || null;
  },

  async createBusiness(businessData: Omit<Business, 'id' | 'createdAt' | 'status'>): Promise<Business> {
    const newBusiness: Business = {
      ...businessData,
      id: `emp-${Date.now()}`,
      status: 'pending', // Submissions always start as pending for review!
      createdAt: new Date().toISOString(),
      isDemonstration: false
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'businesses'), {
          ...newBusiness,
          status: 'pending'
        });
        newBusiness.id = docRef.id;
      } catch (err) {
        console.warn('Firebase addDoc failed:', err);
      }
    }

    const current = getStoredBusinesses();
    saveStoredBusinesses([newBusiness, ...current]);
    return newBusiness;
  },

  async updateBusinessStatus(id: string, status: BusinessStatus): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'businesses', id), { status });
      } catch (err) {
        console.warn('Firebase updateDoc failed:', err);
      }
    }

    const current = getStoredBusinesses();
    const index = current.findIndex(b => b.id === id);
    if (index >= 0) {
      current[index] = { ...current[index], status };
      saveStoredBusinesses([...current]);
      return true;
    }
    return false;
  },

  async toggleBusinessFeatured(id: string): Promise<boolean> {
    const current = getStoredBusinesses();
    const index = current.findIndex(b => b.id === id);
    if (index >= 0) {
      const nextFeatured = !current[index].isFeatured;
      current[index] = { ...current[index], isFeatured: nextFeatured };
      
      if (isFirebaseConfigured && db) {
        try {
          await updateDoc(doc(db, 'businesses', id), { isFeatured: nextFeatured });
        } catch (err) {
          console.warn('Firebase toggle featured failed:', err);
        }
      }

      saveStoredBusinesses([...current]);
      return true;
    }
    return false;
  },

  async updateBusiness(id: string, updates: Partial<Business>): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'businesses', id), updates);
      } catch (err) {
        console.warn('Firebase updateBusiness failed:', err);
      }
    }

    const current = getStoredBusinesses();
    const index = current.findIndex(b => b.id === id);
    if (index >= 0) {
      current[index] = { ...current[index], ...updates };
      saveStoredBusinesses([...current]);
      return true;
    }
    return false;
  },

  async deleteBusiness(id: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'businesses', id));
      } catch (err) {
        console.warn('Firebase deleteDoc failed:', err);
      }
    }

    const current = getStoredBusinesses();
    const filtered = current.filter(b => b.id !== id);
    saveStoredBusinesses(filtered);

    // Also delete associated products
    const products = getStoredProducts().filter(p => p.businessId !== id);
    saveStoredProducts(products);

    return true;
  },

  // --- PRODUCTS & OFFERS ---
  async getProducts(options?: {
    businessId?: string;
    onlyOffers?: boolean;
    categoryId?: string;
    searchTerm?: string;
  }): Promise<Product[]> {
    let list: Product[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const prodRef = collection(db, 'products');
        const snap = await getDocs(prodRef);
        if (!snap.empty) {
          list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Product));
        }
      } catch (err) {
        console.warn('Firebase getProducts failed:', err);
        list = getStoredProducts();
      }
    } else {
      list = getStoredProducts();
    }

    return list.filter(p => {
      if (options?.businessId && p.businessId !== options.businessId) {
        return false;
      }
      if (options?.onlyOffers && !p.isOffer) {
        return false;
      }
      if (options?.categoryId && p.categoryId !== options.categoryId) {
        return false;
      }
      if (options?.searchTerm) {
        const term = options.searchTerm.toLowerCase().trim();
        const inName = p.name.toLowerCase().includes(term);
        const inDesc = p.description.toLowerCase().includes(term);
        const inStore = p.businessName.toLowerCase().includes(term);
        if (!inName && !inDesc && !inStore) {
          return false;
        }
      }
      return true;
    });
  },

  async createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'products'), productData);
        newProduct.id = docRef.id;
      } catch (err) {
        console.warn('Firebase addDoc for product failed:', err);
      }
    }

    const current = getStoredProducts();
    saveStoredProducts([newProduct, ...current]);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'products', id), updates);
      } catch (err) {
        console.warn('Firebase updateProduct failed:', err);
      }
    }

    const current = getStoredProducts();
    const index = current.findIndex(p => p.id === id);
    if (index >= 0) {
      current[index] = { ...current[index], ...updates };
      saveStoredProducts([...current]);
      return true;
    }
    return false;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err) {
        console.warn('Firebase deleteProduct failed:', err);
      }
    }

    const current = getStoredProducts();
    saveStoredProducts(current.filter(p => p.id !== id));
    return true;
  },

  // --- STATS & METRICS ---
  getDashboardMetrics(): {
    totalBusinesses: number;
    pendingApproval: number;
    approvedBusinesses: number;
    totalProducts: number;
    totalOffers: number;
  } {
    const businesses = getStoredBusinesses();
    const products = getStoredProducts();

    return {
      totalBusinesses: businesses.length,
      pendingApproval: businesses.filter(b => b.status === 'pending').length,
      approvedBusinesses: businesses.filter(b => b.status === 'approved').length,
      totalProducts: products.length,
      totalOffers: products.filter(p => p.isOffer).length
    };
  }
};
