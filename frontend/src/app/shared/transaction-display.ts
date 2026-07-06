import { Transaction } from '../models/transaction.model';
import { Category, categoryById } from '../models/category.model';

export interface CategorySpending {
  category: Category;
  total: number;
  percent: number;
}

// Dépenses agrégées par catégorie, triées de la plus grosse à la plus petite.
// percent est la part de la catégorie dans le total dépensé.
export function aggregateSpendingByCategory(transactions: Transaction[]): CategorySpending[] {
  const totals = new Map<string, number>();
  let totalSpent = 0;
  for (const t of transactions) {
    const amount = Number(t.amount);
    if (amount < 0) {
      const key = t.category ?? 'autre';
      totals.set(key, (totals.get(key) ?? 0) + Math.abs(amount));
      totalSpent += Math.abs(amount);
    }
  }
  if (totalSpent === 0) {
    return [];
  }
  return [...totals.entries()]
    .map(([id, total]) => ({
      category: categoryById(id) ?? { id, label: id, icon: 'tag' },
      total,
      percent: Math.round((total / totalSpent) * 100)
    }))
    .sort((a, b) => b.total - a.total);
}

// Nom d'icône Lucide pour une transaction : celle de sa catégorie,
// sinon une icône générique selon le signe du montant
export function iconFor(transaction: Transaction): string {
  const fromCategory = categoryById(transaction.category);
  if (fromCategory) return fromCategory.icon;
  return Number(transaction.amount) < 0 ? 'credit-card' : 'banknote';
}

// Date lisible : "Aujourd'hui", "Hier", sinon jj/mm/aaaa
export function relativeDate(date: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  if (date === today) return "Aujourd'hui";
  if (date === yesterday) return 'Hier';
  const [y, m, d] = date.split('-');
  return `${d}/${m}/${y}`;
}
