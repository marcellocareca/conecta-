import React from 'react';
import {
  ShoppingCart,
  UtensilsCrossed,
  Coffee,
  Shirt,
  Footprints,
  Home,
  Hammer,
  Smartphone,
  Glasses,
  Wrench,
  Sparkles,
  Dumbbell,
  PawPrint,
  Armchair,
  Sprout,
  Briefcase,
  Layers,
  Store,
  Tag,
  Car
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = 'w-5 h-5', size = 20 }) => {
  switch (name) {
    case 'ShoppingCart':
      return <ShoppingCart className={className} size={size} />;
    case 'UtensilsCrossed':
      return <UtensilsCrossed className={className} size={size} />;
    case 'Coffee':
      return <Coffee className={className} size={size} />;
    case 'Shirt':
      return <Shirt className={className} size={size} />;
    case 'Footprints':
      return <Footprints className={className} size={size} />;
    case 'Home':
      return <Home className={className} size={size} />;
    case 'Hammer':
      return <Hammer className={className} size={size} />;
    case 'Smartphone':
      return <Smartphone className={className} size={size} />;
    case 'Glasses':
      return <Glasses className={className} size={size} />;
    case 'Wrench':
      return <Wrench className={className} size={size} />;
    case 'Car':
      return <Car className={className} size={size} />;
    case 'Sparkles':
      return <Sparkles className={className} size={size} />;
    case 'Dumbbell':
      return <Dumbbell className={className} size={size} />;
    case 'PawPrint':
      return <PawPrint className={className} size={size} />;
    case 'Armchair':
      return <Armchair className={className} size={size} />;
    case 'Sprout':
      return <Sprout className={className} size={size} />;
    case 'Briefcase':
      return <Briefcase className={className} size={size} />;
    case 'Layers':
      return <Layers className={className} size={size} />;
    case 'Tag':
      return <Tag className={className} size={size} />;
    default:
      return <Store className={className} size={size} />;
  }
};
