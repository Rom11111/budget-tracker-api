export interface Category {
  id: string;
  label: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'alimentation', label: 'Alimentation', icon: '🛒' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'logement', label: 'Logement', icon: '🏠' },
  { id: 'loisirs', label: 'Loisirs', icon: '🎮' },
  { id: 'sante', label: 'Santé', icon: '🩺' },
  { id: 'abonnements', label: 'Abonnements', icon: '📺' },
  { id: 'salaire', label: 'Salaire', icon: '💰' },
  { id: 'autre', label: 'Autre', icon: '🏷️' },
];

export function categoryById(id: string | undefined): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
