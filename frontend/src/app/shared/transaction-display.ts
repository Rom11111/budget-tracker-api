import { Transaction } from '../models/transaction.model';
import { categoryById } from '../models/category.model';

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
