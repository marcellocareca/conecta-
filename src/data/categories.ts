import { Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'supermercados',
    name: 'Supermercado',
    slug: 'supermercados',
    icon: 'ShoppingCart',
    description: 'Mercados, empórios, mercearias e hortifrutis locais de Mairiporã.'
  },
  {
    id: 'restaurantes',
    name: 'Restaurantes',
    slug: 'restaurantes',
    icon: 'UtensilsCrossed',
    description: 'Pizzarias, hamburguerias, culinária típica da serra e comida caseira.'
  },
  {
    id: 'moda',
    name: 'Moda',
    slug: 'moda',
    icon: 'Shirt',
    description: 'Roupas masculinas, femininas, infantis e moda íntima.'
  },
  {
    id: 'casa-construcao',
    name: 'Casa e Construção',
    slug: 'casa-construcao',
    icon: 'Home',
    description: 'Materiais básicos, ferramentas, elétrica, hidráulica e acabamentos.'
  },
  {
    id: 'eletronicos',
    name: 'Eletrônicos',
    slug: 'eletronicos',
    icon: 'Smartphone',
    description: 'Celulares, informática, acessórios eletrônicos e assistência técnica.'
  },
  {
    id: 'autopecas',
    name: 'Autopeças',
    slug: 'autopecas',
    icon: 'Car',
    description: 'Peças automotivas, baterias, pneus, mecânica e motopeças.'
  },
  {
    id: 'saude-beleza',
    name: 'Saúde e Beleza',
    slug: 'saude-beleza',
    icon: 'Dumbbell',
    description: 'Farmácias, academias, salões de beleza, barbearias e estética.'
  },
  {
    id: 'pet-shop',
    name: 'Pet Shop',
    slug: 'pet-shop',
    icon: 'PawPrint',
    description: 'Rações, banho e tosa, clínicas veterinárias e acessórios pet.'
  },
  {
    id: 'moveis-decoracao',
    name: 'Móveis e Decoração',
    slug: 'moveis-decoracao',
    icon: 'Armchair',
    description: 'Móveis para casa e chácara, colchões, sofás e objetos de decoração.'
  },
  {
    id: 'agro-jardim',
    name: 'Agro e Jardim',
    slug: 'agro-jardim',
    icon: 'Sprout',
    description: 'Plantas ornamentais, mudas, ferramentas de jardim e insumos rurais.'
  },
  {
    id: 'servicos-profissionais',
    name: 'Serviços Profissionais',
    slug: 'servicos-profissionais',
    icon: 'Briefcase',
    description: 'Contabilidade, engenharia, consultoria e serviços especializados.'
  },
  {
    id: 'oticas',
    name: 'Óticas',
    slug: 'oticas',
    icon: 'Glasses',
    description: 'Armações, lentes de grau, óculos solares e exames visuais.'
  },
  {
    id: 'outros',
    name: 'Outros',
    slug: 'outros',
    icon: 'Layers',
    description: 'Papelarias, presentes, livrarias e comércios diversos.'
  }
];

export const MAIRIPORA_NEIGHBORHOODS = [
  'Centro',
  'Terra Preta',
  'Jardim Capim Branco',
  'Lavapés',
  'Saboó',
  'Pirucaia',
  'Rio Abaixo',
  'Roseira',
  'Parque Suíço',
  'Mato Dentro',
  'Cantareira',
  'Barreiro',
  'Capuava'
];
