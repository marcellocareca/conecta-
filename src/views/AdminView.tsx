import React, { useState } from 'react';
import { Business, Product, Category, BusinessStatus } from '../types';
import { DataService } from '../services/dataService';
import { MAIRIPORA_NEIGHBORHOODS } from '../data/categories';
import { formatCurrency, formatPhone } from '../utils/formatters';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Edit3, 
  Star, 
  Plus, 
  ShoppingBag, 
  Layers, 
  BarChart3, 
  ShieldCheck, 
  Database, 
  LogOut, 
  AlertCircle,
  ExternalLink,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
  Film
} from 'lucide-react';
import { AdminMediaTab } from '../components/admin/AdminMediaTab';
import { MediaUploader } from '../components/admin/MediaUploader';
import { MEDIA_LIMITS } from '../services/mediaService';

interface AdminViewProps {
  businesses: Business[];
  products: Product[];
  categories: Category[];
  onLogout: () => void;
  onRefresh: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  businesses,
  products,
  categories,
  onLogout,
  onRefresh
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'businesses' | 'products' | 'categories' | 'media' | 'stats' | 'firebase'>('businesses');
  const [businessStatusFilter, setBusinessStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // New/Edit Product Form
  const [productForm, setProductForm] = useState({
    businessId: businesses[0]?.id || '',
    name: '',
    description: '',
    price: 0,
    promotionalPrice: '',
    isOffer: false,
    categoryId: categories[0]?.id || 'alimentacao',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
  });

  // New Category Form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    icon: 'Store'
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Metrics
  const metrics = DataService.getDashboardMetrics();

  // Filtered businesses
  const filteredBusinesses = businesses.filter(b => {
    if (businessStatusFilter !== 'all' && b.status !== businessStatusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const inName = b.name.toLowerCase().includes(q);
      const inContact = b.contactPerson.toLowerCase().includes(q);
      const inNeighborhood = b.neighborhood.toLowerCase().includes(q);
      if (!inName && !inContact && !inNeighborhood) return false;
    }
    return true;
  });

  // Actions
  const handleApprove = async (id: string) => {
    await DataService.updateBusinessStatus(id, 'approved');
    showNotification('Empresa aprovada com sucesso! Agora visível na plataforma.');
    onRefresh();
  };

  const handleReject = async (id: string) => {
    await DataService.updateBusinessStatus(id, 'rejected');
    showNotification('Empresa rejeitada.', 'error');
    onRefresh();
  };

  const handleToggleFeatured = async (id: string) => {
    await DataService.toggleBusinessFeatured(id);
    showNotification('Destaque na página inicial atualizado.');
    onRefresh();
  };

  const handleDeleteBusiness = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o estabelecimento "${name}"? Esta ação removerá a loja e seus produtos.`)) {
      await DataService.deleteBusiness(id);
      showNotification('Estabelecimento excluído com sucesso.');
      onRefresh();
    }
  };

  const handleSaveBusinessEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBusiness) return;

    await DataService.updateBusiness(editingBusiness.id, editingBusiness);
    setEditingBusiness(null);
    showNotification('Dados da empresa atualizados com sucesso.');
    onRefresh();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.businessId) {
      alert('Informe o nome do produto e a loja.');
      return;
    }

    const selectedStore = businesses.find(b => b.id === productForm.businessId);
    const selectedCat = categories.find(c => c.id === productForm.categoryId);

    const promoPriceNum = productForm.promotionalPrice ? parseFloat(productForm.promotionalPrice) : undefined;

    if (editingProduct) {
      await DataService.updateProduct(editingProduct.id, {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        promotionalPrice: promoPriceNum,
        isOffer: productForm.isOffer || Boolean(promoPriceNum && promoPriceNum < productForm.price),
        categoryId: productForm.categoryId,
        categoryName: selectedCat ? selectedCat.name : 'Geral',
        imageUrl: productForm.imageUrl,
        businessId: productForm.businessId,
        businessName: selectedStore ? selectedStore.name : 'Loja Local',
        businessWhatsapp: selectedStore ? selectedStore.whatsapp : '',
        businessNeighborhood: selectedStore ? selectedStore.neighborhood : 'Centro'
      });
      showNotification('Produto atualizado com sucesso.');
    } else {
      await DataService.createProduct({
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        promotionalPrice: promoPriceNum,
        isOffer: productForm.isOffer || Boolean(promoPriceNum && promoPriceNum < productForm.price),
        categoryId: productForm.categoryId,
        categoryName: selectedCat ? selectedCat.name : 'Geral',
        imageUrl: productForm.imageUrl,
        businessId: productForm.businessId,
        businessName: selectedStore ? selectedStore.name : 'Loja Local',
        businessWhatsapp: selectedStore ? selectedStore.whatsapp : '',
        businessNeighborhood: selectedStore ? selectedStore.neighborhood : 'Centro'
      });
      showNotification('Novo produto cadastrado com sucesso!');
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    onRefresh();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Excluir o produto "${name}"?`)) {
      await DataService.deleteProduct(id);
      showNotification('Produto excluído.');
      onRefresh();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) return;

    await DataService.addCategory({
      name: categoryForm.name.trim(),
      slug: categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
      icon: categoryForm.icon,
      description: categoryForm.description.trim() || `Comércios de ${categoryForm.name} em Mairiporã`
    });

    setIsCategoryModalOpen(false);
    setCategoryForm({ name: '', description: '', icon: 'Store' });
    showNotification('Nova categoria criada com sucesso!');
    onRefresh();
  };

  const handleResetData = () => {
    if (confirm('Deseja restaurar os dados de demonstração originais de Mairiporã?')) {
      DataService.resetDemoData();
      showNotification('Dados de demonstração restaurados.');
      onRefresh();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E5EBE6] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F6EC] text-[#07843B] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Painel Administrativo Oficial · Conecta Mairiporã</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#17251D]">
            Gestão da Plataforma
          </h1>
          <p className="text-xs sm:text-sm text-[#68746C] mt-1">
            Moderação de comércios, controle de catálogo, ofertas e monitoramento.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Admin</span>
          </button>
        </div>
      </div>

      {/* Toast notification */}
      {notification && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
          notification.type === 'success' ? 'bg-[#E9F6EC] text-[#07843B] border border-[#07843B]/30' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* 4 Indicadores principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Empresas */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs">
          <div className="flex items-center justify-between text-[#68746C] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total de Empresas</span>
            <Building2 className="w-5 h-5 text-[#07843B]" />
          </div>
          <div className="text-3xl font-extrabold text-[#17251D]">
            {metrics.totalBusinesses}
          </div>
          <span className="text-[11px] text-[#68746C] mt-1 block">
            {metrics.approvedBusinesses} ativas e aprovadas
          </span>
        </div>

        {/* Empresas Aguardando Aprovação (ALERTA) */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-colors ${
          metrics.pendingApproval > 0 
            ? 'bg-amber-50/60 border-amber-300' 
            : 'bg-white border-[#E5EBE6]'
        }`}>
          <div className="flex items-center justify-between text-[#68746C] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Aguardando Aprovação
            </span>
            <AlertCircle className={`w-5 h-5 ${metrics.pendingApproval > 0 ? 'text-amber-600 animate-bounce' : 'text-gray-400'}`} />
          </div>
          <div className="text-3xl font-extrabold text-amber-900">
            {metrics.pendingApproval}
          </div>
          <span className="text-[11px] text-amber-700 mt-1 block">
            {metrics.pendingApproval > 0 ? 'Requer moderação da equipe' : 'Todos cadastros revisados'}
          </span>
        </div>

        {/* Produtos Cadastrados */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs">
          <div className="flex items-center justify-between text-[#68746C] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Produtos Cadastrados</span>
            <ShoppingBag className="w-5 h-5 text-[#0879D9]" />
          </div>
          <div className="text-3xl font-extrabold text-[#17251D]">
            {metrics.totalProducts}
          </div>
          <span className="text-[11px] text-[#68746C] mt-1 block">
            Em vitrine no catálogo local
          </span>
        </div>

        {/* Ofertas Publicadas */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5EBE6] shadow-xs">
          <div className="flex items-center justify-between text-[#68746C] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Ofertas Ativas</span>
            <Sparkles className="w-5 h-5 text-[#F4E500]" />
          </div>
          <div className="text-3xl font-extrabold text-[#07843B]">
            {metrics.totalOffers}
          </div>
          <span className="text-[11px] text-[#68746C] mt-1 block">
            Com preços promocionais
          </span>
        </div>

      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E5EBE6] overflow-x-auto scrollbar-none pb-1">
        {[
          { id: 'businesses', label: `Empresas & Moderação (${businesses.length})`, icon: Building2 },
          { id: 'products', label: `Produtos & Ofertas (${products.length})`, icon: ShoppingBag },
          { id: 'categories', label: `Categorias (${categories.length})`, icon: Layers },
          { id: 'media', label: 'Mídias da Página & Vídeos', icon: Film },
          { id: 'stats', label: 'Métricas & Bairros', icon: BarChart3 },
          { id: 'firebase', label: 'Conexão Firebase & Dados', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-[#07843B] text-[#07843B]'
                  : 'border-transparent text-[#68746C] hover:text-[#17251D]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.id === 'businesses' && metrics.pendingApproval > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                  {metrics.pendingApproval}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUSINESSES & MODERATION */}
      {activeAdminTab === 'businesses' && (
        <div className="space-y-6">
          {/* Filtering bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-[#E5EBE6]">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-[#68746C] shrink-0">Filtrar por status:</span>
              {(['all', 'pending', 'approved', 'rejected'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setBusinessStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                    businessStatusFilter === st
                      ? 'bg-[#07843B] text-white shadow-xs'
                      : 'bg-[#F7F9F7] text-[#68746C] hover:bg-gray-100'
                  }`}
                >
                  {st === 'all' ? 'Todos' : st === 'pending' ? `Pendentes (${metrics.pendingApproval})` : st === 'approved' ? 'Aprovadas' : 'Rejeitadas'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#68746C] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar empresa ou responsável..."
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#F7F9F7] border border-[#E5EBE6] rounded-lg focus:bg-white focus:border-[#07843B] text-[#17251D]"
              />
            </div>
          </div>

          {/* Business Table */}
          <div className="bg-white rounded-2xl border border-[#E5EBE6] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#68746C]">
                <thead className="bg-[#F7F9F7] border-b border-[#E5EBE6] text-[#17251D] font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Estabelecimento</th>
                    <th className="py-3 px-4">Categoria & Bairro</th>
                    <th className="py-3 px-4">Contato & Resp.</th>
                    <th className="py-3 px-4">Status Atual</th>
                    <th className="py-3 px-4 text-center">Destaque Home</th>
                    <th className="py-3 px-4 text-right">Ações de Moderação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EBE6]">
                  {filteredBusinesses.map(bus => (
                    <tr key={bus.id} className="hover:bg-[#F7F9F7]/70 transition-colors">
                      {/* Name & Logo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={bus.logoUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-[#E5EBE6] shrink-0"
                          />
                          <div>
                            <span className="font-bold text-[#17251D] text-xs block">
                              {bus.name}
                            </span>
                            <span className="text-[11px] text-[#68746C]">
                              CNPJ: {bus.cnpj || 'Não informado'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Neighborhood */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-[#17251D] block">
                          {bus.categoryName}
                        </span>
                        <span className="text-[11px] text-[#68746C]">
                          {bus.neighborhood}
                        </span>
                      </td>

                      {/* Contact & Person */}
                      <td className="py-3.5 px-4">
                        <span className="text-[#17251D] block font-medium">
                          {bus.contactPerson}
                        </span>
                        <span className="text-[11px] text-[#07843B] font-medium">
                          WA: {formatPhone(bus.whatsapp)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {bus.status === 'pending' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            Aguardando Aprovação
                          </span>
                        )}
                        {bus.status === 'approved' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-[#E9F6EC] text-[#07843B] border border-[#07843B]/30">
                            Aprovado & Ativo
                          </span>
                        )}
                        {bus.status === 'rejected' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-red-100 text-red-800 border border-red-300">
                            Rejeitado
                          </span>
                        )}
                      </td>

                      {/* Featured toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleFeatured(bus.id)}
                          title="Alternar destaque na página inicial"
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            bus.isFeatured 
                              ? 'text-[#F4E500] bg-amber-50 hover:bg-amber-100' 
                              : 'text-gray-300 hover:text-[#F4E500] hover:bg-gray-100'
                          }`}
                        >
                          <Star className={`w-4 h-4 ${bus.isFeatured ? 'fill-[#F4E500] text-[#e0d200]' : ''}`} />
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {bus.status !== 'approved' && (
                            <button
                              onClick={() => handleApprove(bus.id)}
                              className="px-2.5 py-1 bg-[#07843B] hover:bg-[#07552F] text-white font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Aprovar e publicar"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Aprovar
                            </button>
                          )}

                          {bus.status !== 'rejected' && (
                            <button
                              onClick={() => handleReject(bus.id)}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold rounded-lg text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                              title="Rejeitar cadastro"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rejeitar
                            </button>
                          )}

                          <button
                            onClick={() => setEditingBusiness(bus)}
                            className="p-1.5 text-[#68746C] hover:text-[#17251D] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar estabelecimento"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteBusiness(bus.id, bus.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir estabelecimento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & OFFERS */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#17251D]">
              Catálogo de Produtos & Promoções
            </h3>
            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  businessId: businesses[0]?.id || '',
                  name: '',
                  description: '',
                  price: 0,
                  promotionalPrice: '',
                  isOffer: false,
                  categoryId: categories[0]?.id || 'alimentacao',
                  imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
                });
                setIsProductModalOpen(true);
              }}
              className="px-4 py-2 bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Produto</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(prod => (
              <div
                key={prod.id}
                className="bg-white p-4 rounded-2xl border border-[#E5EBE6] shadow-xs flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <img
                    src={prod.imageUrl}
                    alt=""
                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 shrink-0 border border-[#E5EBE6]"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-[#07843B] uppercase">
                      {prod.categoryName}
                    </span>
                    <h4 className="text-xs font-bold text-[#17251D] line-clamp-1 mt-0.5">
                      {prod.name}
                    </h4>
                    <p className="text-[11px] text-[#68746C] line-clamp-1">
                      Loja: {prod.businessName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {prod.promotionalPrice ? (
                        <>
                          <span className="text-xs font-extrabold text-[#07843B]">
                            {formatCurrency(prod.promotionalPrice)}
                          </span>
                          <span className="text-[10px] text-gray-400 line-through">
                            {formatCurrency(prod.price)}
                          </span>
                          <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 text-[9px] font-bold rounded">
                            OFERTA
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-bold text-[#17251D]">
                          {formatCurrency(prod.price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E5EBE6] flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct(prod);
                      setProductForm({
                        businessId: prod.businessId,
                        name: prod.name,
                        description: prod.description,
                        price: prod.price,
                        promotionalPrice: prod.promotionalPrice ? String(prod.promotionalPrice) : '',
                        isOffer: prod.isOffer,
                        categoryId: prod.categoryId,
                        imageUrl: prod.imageUrl
                      });
                      setIsProductModalOpen(true);
                    }}
                    className="p-1.5 text-[#68746C] hover:text-[#17251D] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(prod.id, prod.name)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORIES */}
      {activeAdminTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#17251D]">
              Categorias do Conecta Mairiporã ({categories.length})
            </h3>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="px-4 py-2 bg-[#07843B] hover:bg-[#07552F] text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Categoria</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(c => {
              const count = businesses.filter(b => b.categoryId === c.id).length;
              return (
                <div
                  key={c.id}
                  className="bg-white p-4 rounded-2xl border border-[#E5EBE6] shadow-xs flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#17251D]">
                      {c.name}
                    </h4>
                    <p className="text-xs text-[#68746C] mt-0.5">
                      {count} estabelecimentos cadastrados
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#07843B] bg-[#E9F6EC] px-2.5 py-1 rounded-lg">
                    {c.icon}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: MEDIA & VIDEOS (REELS, BANNERS, STORE LOGOS & COVERS) */}
      {activeAdminTab === 'media' && (
        <AdminMediaTab
          businesses={businesses}
          onNotification={showNotification}
          onRefresh={onRefresh}
        />
      )}

      {/* TAB 4: METRICS & NEIGHBORHOODS */}
      {activeAdminTab === 'stats' && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#17251D]">
            Distribuição do Comércio Local por Bairro de Mairiporã
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E5EBE6]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#68746C] mb-4">
                Estabelecimentos por Bairro
              </h4>
              <div className="space-y-3">
                {MAIRIPORA_NEIGHBORHOODS.map(nh => {
                  const count = businesses.filter(b => b.neighborhood === nh).length;
                  const percent = businesses.length ? Math.round((count / businesses.length) * 100) : 0;
                  return (
                    <div key={nh}>
                      <div className="flex justify-between text-xs font-semibold text-[#17251D] mb-1">
                        <span>{nh}</span>
                        <span className="text-[#68746C]">{count} ({percent}%)</span>
                      </div>
                      <div className="w-full bg-[#F7F9F7] h-2 rounded-full overflow-hidden border border-[#E5EBE6]">
                        <div
                          className="bg-[#07843B] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E5EBE6]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#68746C] mb-4">
                Resumo Operacional da Plataforma
              </h4>
              <ul className="space-y-3 text-xs text-[#68746C]">
                <li className="flex justify-between p-3 bg-[#F7F9F7] rounded-xl border border-[#E5EBE6]">
                  <span>Taxa de Aprovação de Lojas:</span>
                  <strong className="text-[#07843B]">
                    {businesses.length ? Math.round((metrics.approvedBusinesses / businesses.length) * 100) : 0}%
                  </strong>
                </li>
                <li className="flex justify-between p-3 bg-[#F7F9F7] rounded-xl border border-[#E5EBE6]">
                  <span>Lojas em Destaque na Home:</span>
                  <strong className="text-amber-700">
                    {businesses.filter(b => b.isFeatured).length} lojas
                  </strong>
                </li>
                <li className="flex justify-between p-3 bg-[#F7F9F7] rounded-xl border border-[#E5EBE6]">
                  <span>Média de Produtos por Loja:</span>
                  <strong className="text-[#0879D9]">
                    {(products.length / (metrics.approvedBusinesses || 1)).toFixed(1)} itens
                  </strong>
                </li>
                <li className="flex justify-between p-3 bg-[#F7F9F7] rounded-xl border border-[#E5EBE6]">
                  <span>Canal de Vendas:</span>
                  <strong className="text-[#17251D]">
                    WhatsApp Direto (100% sem comissão)
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FIREBASE STATUS & INSTRUCTIONS */}
      {activeAdminTab === 'firebase' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E5EBE6] space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EBE6]">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${DataService.isConfiguredWithFirebase() ? 'bg-[#07843B]' : 'bg-amber-500 animate-pulse'}`} />
                <h3 className="text-base font-bold text-[#17251D]">
                  Status da Conexão Firebase: {DataService.isConfiguredWithFirebase() ? 'Conectado (Cloud Firestore Ativo)' : 'Modo de Demonstração Interativo'}
                </h3>
              </div>
              <button
                onClick={handleResetData}
                className="px-3 py-1.5 text-xs font-bold text-[#68746C] hover:text-red-600 bg-[#F7F9F7] hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer border border-[#E5EBE6]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar Dados Padrão de Mairiporã
              </button>
            </div>

            <p className="text-xs text-[#68746C] leading-relaxed">
              No modo de demonstração, todas as alterações (aprovações de novas empresas, novos produtos, ofertas e edições) funcionam instantaneamente e persistem no armazenamento local (LocalStorage), garantindo navegação completa sem erros.
            </p>

            <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EBE6] text-xs space-y-2">
              <h4 className="font-bold text-[#17251D]">Como conectar seu projeto Firebase em produção:</h4>
              <p className="text-[#68746C]">
                1. No console do Firebase (<code>console.firebase.google.com</code>), crie um projeto e adicione um aplicativo Web.
              </p>
              <p className="text-[#68746C]">
                2. Configure as seguintes variáveis no seu arquivo <code>.env</code> ou painel de Secrets:
              </p>
              <pre className="p-3 bg-gray-900 text-emerald-400 rounded-lg font-mono text-[11px] overflow-x-auto">
{`VITE_FIREBASE_API_KEY="seu_api_key_aqui"
VITE_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu_projeto_id"
VITE_FIREBASE_STORAGE_BUCKET="seu_projeto.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_messaging_sender_id"
VITE_FIREBASE_APP_ID="seu_app_id"`}
              </pre>
              <p className="text-[#68746C]">
                3. O arquivo <code>firestore.rules</code> já está criado na raiz do projeto com as regras de segurança oficiais (leitura pública, escrita de novos cadastros como <em>pending</em> e moderação restrita ao administrador).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STORE MODAL */}
      {editingBusiness && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6] max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-[#E5EBE6] flex items-center justify-between bg-[#F7F9F7]">
              <h3 className="text-base font-bold text-[#17251D]">
                Editar Estabelecimento: {editingBusiness.name}
              </h3>
              <button
                onClick={() => setEditingBusiness(null)}
                className="text-[#68746C] hover:text-[#17251D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBusinessEdit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Nome da Empresa</label>
                  <input
                    type="text"
                    required
                    value={editingBusiness.name}
                    onChange={e => setEditingBusiness({ ...editingBusiness, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Responsável</label>
                  <input
                    type="text"
                    required
                    value={editingBusiness.contactPerson}
                    onChange={e => setEditingBusiness({ ...editingBusiness, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={editingBusiness.whatsapp}
                    onChange={e => setEditingBusiness({ ...editingBusiness, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Bairro</label>
                  <select
                    value={editingBusiness.neighborhood}
                    onChange={e => setEditingBusiness({ ...editingBusiness, neighborhood: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D] cursor-pointer"
                  >
                    {MAIRIPORA_NEIGHBORHOODS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Endereço</label>
                  <input
                    type="text"
                    value={editingBusiness.address}
                    onChange={e => setEditingBusiness({ ...editingBusiness, address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Descrição</label>
                  <textarea
                    rows={2}
                    value={editingBusiness.description}
                    onChange={e => setEditingBusiness({ ...editingBusiness, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#E5EBE6]">
                  <MediaUploader
                    label="Logotipo do Comércio"
                    mediaType="image"
                    maxSizeBytes={MEDIA_LIMITS.LOGO_MAX_BYTES}
                    aspectRatioHint="Quadrado 1:1"
                    currentUrl={editingBusiness.logoUrl}
                    onMediaSelected={(url) => setEditingBusiness({ ...editingBusiness, logoUrl: url })}
                  />

                  <MediaUploader
                    label="Foto de Capa / Fachada"
                    mediaType="image"
                    maxSizeBytes={MEDIA_LIMITS.IMAGE_MAX_BYTES}
                    aspectRatioHint="Panorâmico 16:9"
                    currentUrl={editingBusiness.coverUrl}
                    onMediaSelected={(url) => setEditingBusiness({ ...editingBusiness, coverUrl: url })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5EBE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingBusiness(null)}
                  className="px-4 py-2 bg-gray-100 text-[#68746C] font-bold text-xs rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#07843B] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#07552F] cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6]">
            <div className="p-5 border-b border-[#E5EBE6] flex items-center justify-between bg-[#F7F9F7]">
              <h3 className="text-base font-bold text-[#17251D]">
                {editingProduct ? 'Editar Produto / Oferta' : 'Cadastrar Novo Produto ou Oferta'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#68746C] hover:text-[#17251D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Loja vinculada *</label>
                <select
                  required
                  value={productForm.businessId}
                  onChange={e => setProductForm({ ...productForm, businessId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D] cursor-pointer"
                >
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>{b.name} ({b.neighborhood})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Nome do item *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Ex: Cesta de Pães Coloniais"
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Preço Normal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={productForm.price || ''}
                    onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    placeholder="29.90"
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#17251D] mb-1">Preço Promocional (Opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.promotionalPrice}
                    onChange={e => setProductForm({ ...productForm, promotionalPrice: e.target.value })}
                    placeholder="24.90"
                    className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Categoria</label>
                <select
                  value={productForm.categoryId}
                  onChange={e => setProductForm({ ...productForm, categoryId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D] cursor-pointer"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Descrição do produto</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Detalhes sobre ingredientes, tamanho, modelo ou garantia..."
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">URL da Imagem do Produto</label>
                <input
                  type="url"
                  value={productForm.imageUrl}
                  onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div className="pt-4 border-t border-[#E5EBE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-[#68746C] font-bold text-xs rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#07843B] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#07552F] cursor-pointer"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E5EBE6]">
            <div className="p-5 border-b border-[#E5EBE6] flex items-center justify-between bg-[#F7F9F7]">
              <h3 className="text-base font-bold text-[#17251D]">Nova Categoria</h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-[#68746C] hover:text-[#17251D] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Ex: Farmácias & Saúde"
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Descrição</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Breve descrição dos estabelecimentos desta categoria..."
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#17251D] mb-1">Ícone</label>
                <select
                  value={categoryForm.icon}
                  onChange={e => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-[#E5EBE6] rounded-lg focus:border-[#07843B] text-[#17251D] cursor-pointer"
                >
                  <option value="Store">Store (Padrão)</option>
                  <option value="ShoppingCart">Supermercado / Compras</option>
                  <option value="UtensilsCrossed">Restaurante</option>
                  <option value="Coffee">Alimentação / Café</option>
                  <option value="Shirt">Moda / Roupas</option>
                  <option value="Home">Casa & Decoração</option>
                  <option value="Sparkles">Beleza / Saúde</option>
                  <option value="PawPrint">Pet Shop</option>
                </select>
              </div>

              <div className="pt-4 border-t border-[#E5EBE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-[#68746C] font-bold text-xs rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#07843B] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#07552F] cursor-pointer"
                >
                  Criar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
