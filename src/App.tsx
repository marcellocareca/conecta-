import React, { useState, useEffect } from 'react';
import { ActiveTab, Business, Product, Category } from './types';
import { DataService, subscribeDataChanges } from './services/dataService';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { StoresView } from './views/StoresView';
import { StoreDetailView } from './views/StoreDetailView';
import { CategoriesView } from './views/CategoriesView';
import { OffersView } from './views/OffersView';
import { RegisterBusinessView } from './views/RegisterBusinessView';
import { AdminView } from './views/AdminView';
import { AboutView } from './views/AboutView';
import { ContactView } from './views/ContactView';
import { LegalView } from './views/LegalView';
import { ProductDetailModal } from './components/products/ProductDetailModal';
import { InterestBagModal } from './components/common/InterestBagModal';
import { LoginModal } from './components/common/LoginModal';
import { RegisterBusinessModal } from './components/common/RegisterBusinessModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<ActiveTab>('home');
  const [tabParams, setTabParams] = useState<{ search?: string; categoryId?: string }>({});
  
  // Selected Store for StoreDetailView
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Selected Product for ProductDetailModal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Bag / Saved items modal
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Data states
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Saved items in localStorage
  const [savedStoreIds, setSavedStoreIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('conecta_mairipora_saved_stores');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [savedProductIds, setSavedProductIds] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('conecta_mairipora_saved_products');
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // Load all data
  const loadData = async () => {
    try {
      const [cats, bus, prods] = await Promise.all([
        DataService.getCategories(),
        DataService.getBusinesses({ status: 'all' }),
        DataService.getProducts()
      ]);
      setCategories(cats);
      setBusinesses(bus);
      setProducts(prods);
    } catch (err) {
      console.error('Error loading Conecta Mairiporã data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeDataChanges(() => {
      loadData();
    });
    return () => unsubscribe();
  }, []);

  // Save changes to localStorage for favorites
  useEffect(() => {
    try {
      localStorage.setItem('conecta_mairipora_saved_stores', JSON.stringify(Array.from(savedStoreIds)));
    } catch (e) {
      console.error(e);
    }
  }, [savedStoreIds]);

  useEffect(() => {
    try {
      localStorage.setItem('conecta_mairipora_saved_products', JSON.stringify(Array.from(savedProductIds)));
    } catch (e) {
      console.error(e);
    }
  }, [savedProductIds]);

  // Navigation helper
  const handleNavigate = (tab: ActiveTab, params?: any) => {
    setCurrentTab(tab);
    if (params) {
      setTabParams(params);
    } else {
      setTabParams({});
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open store details
  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    setCurrentTab('store-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open product details modal
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  // Toggle favorite store
  const handleToggleSaveStore = (store: Business) => {
    setSavedStoreIds(prev => {
      const next = new Set(prev);
      if (next.has(store.id)) {
        next.delete(store.id);
      } else {
        next.add(store.id);
      }
      return next;
    });
  };

  // Toggle favorite product
  const handleToggleSaveProduct = (product: Product) => {
    setSavedProductIds(prev => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
      } else {
        next.add(product.id);
      }
      return next;
    });
  };

  // Saved items list for modal
  const savedStoresList = businesses.filter(b => savedStoreIds.has(b.id));
  const savedProductsList = products.filter(p => savedProductIds.has(p.id));
  const totalSavedCount = savedStoreIds.size + savedProductIds.size;

  // Selected store object for detail view
  const activeStore = businesses.find(b => b.id === selectedStoreId) || null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F9F7] text-[#17251D] selection:bg-[#07843B] selection:text-white">
      {/* Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        savedItemsCount={totalSavedCount}
        onOpenSavedBag={() => setIsBagOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onSearch={(query) => handleNavigate('stores', { search: query })}
      />

      {/* Main View Container */}
      <main className="flex-1">
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#07843B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-bold text-[#68746C]">Carregando Conecta Mairiporã...</p>
          </div>
        ) : (
          <>
            {currentTab === 'home' && (
              <HomeView
                categories={categories}
                businesses={businesses}
                products={products}
                onNavigate={handleNavigate}
                onSelectStore={handleSelectStore}
                onSelectProduct={handleSelectProduct}
                savedStoreIds={savedStoreIds}
                savedProductIds={savedProductIds}
                onToggleSaveStore={handleToggleSaveStore}
                onToggleSaveProduct={handleToggleSaveProduct}
                onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
              />
            )}

            {currentTab === 'stores' && (
              <StoresView
                businesses={businesses}
                categories={categories}
                initialSearch={tabParams.search}
                initialCategoryId={tabParams.categoryId}
                onSelectStore={handleSelectStore}
                savedStoreIds={savedStoreIds}
                onToggleSaveStore={handleToggleSaveStore}
              />
            )}

            {currentTab === 'store-detail' && activeStore && (
              <StoreDetailView
                store={activeStore}
                products={products}
                onBack={() => handleNavigate('stores')}
                onSelectProduct={handleSelectProduct}
                isSaved={savedStoreIds.has(activeStore.id)}
                onToggleSaveStore={handleToggleSaveStore}
                savedProductIds={savedProductIds}
                onToggleSaveProduct={handleToggleSaveProduct}
              />
            )}

            {currentTab === 'categories' && (
              <CategoriesView
                categories={categories}
                businesses={businesses}
                onSelectStore={handleSelectStore}
                savedStoreIds={savedStoreIds}
                onToggleSaveStore={handleToggleSaveStore}
              />
            )}

            {currentTab === 'offers' && (
              <OffersView
                products={products}
                categories={categories}
                onSelectProduct={handleSelectProduct}
                onSelectStore={handleSelectStore}
                savedProductIds={savedProductIds}
                onToggleSaveProduct={handleToggleSaveProduct}
              />
            )}

            {currentTab === 'register-business' && (
              <RegisterBusinessView
                categories={categories}
                onNavigateHome={() => handleNavigate('home')}
                onNavigateAdmin={() => {
                  setIsAdminLoggedIn(true);
                  handleNavigate('admin');
                }}
              />
            )}

            {currentTab === 'admin' && (
              <AdminView
                businesses={businesses}
                products={products}
                categories={categories}
                onLogout={() => {
                  setIsAdminLoggedIn(false);
                  handleNavigate('home');
                }}
                onRefresh={loadData}
              />
            )}

            {currentTab === 'about' && (
              <AboutView onNavigate={handleNavigate} />
            )}

            {currentTab === 'contact' && (
              <ContactView />
            )}

            {(currentTab === 'privacy' || currentTab === 'terms') && (
              <LegalView type={currentTab} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer 
        onNavigate={handleNavigate} 
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onViewStore={(storeId) => {
          setSelectedProduct(null);
          handleSelectStore(storeId);
        }}
        isSaved={selectedProduct ? savedProductIds.has(selectedProduct.id) : false}
        onToggleSave={handleToggleSaveProduct}
      />

      {/* Interest Bag Modal */}
      <InterestBagModal
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        savedProducts={savedProductsList}
        savedStores={savedStoresList}
        onRemoveProduct={(id) => {
          setSavedProductIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
        onRemoveStore={(id) => {
          setSavedStoreIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
        onViewStore={handleSelectStore}
      />

      {/* Login / Admin Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          handleNavigate('admin');
        }}
        onRegisterBusinessClick={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Cadastre Aqui Seu Comércio Popup Modal */}
      <RegisterBusinessModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        categories={categories}
        onSuccess={() => {
          loadData();
        }}
        onNavigateToFullForm={() => {
          setIsRegisterModalOpen(false);
          handleNavigate('register-business');
        }}
      />
    </div>
  );
}
