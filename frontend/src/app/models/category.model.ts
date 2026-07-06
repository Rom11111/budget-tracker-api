export interface Category {
  id: string;
  label: string;
  icon: string;
}

// Le champ icon est un nom d'icône Lucide (classe CSS icon-<nom>, voir lucide.dev/icons)
export const CATEGORIES: Category[] = [
  { id: 'alimentation', label: 'Alimentation', icon: 'shopping-cart' },
  { id: 'transport', label: 'Transport', icon: 'car' },
  { id: 'logement', label: 'Logement', icon: 'house' },
  { id: 'loisirs', label: 'Loisirs', icon: 'gamepad-2' },
  { id: 'sante', label: 'Santé', icon: 'stethoscope' },
  { id: 'abonnements', label: 'Abonnements', icon: 'tv' },
  { id: 'salaire', label: 'Salaire', icon: 'wallet' },
  { id: 'autre', label: 'Autre', icon: 'tag' },
];

export function categoryById(id: string | undefined): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
