import { useState, useEffect } from 'react';
import type { CategoryItem } from '../types';

const STORAGE_KEY = 'nordic_expense_app_categories';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  // Expense Categories
  { id: 'cat-1', name: '飲食', type: 'expense', iconName: 'Utensils', color: '#f43f5e', isPreset: true },
  { id: 'cat-2', name: '交通', type: 'expense', iconName: 'Train', color: '#0284c7', isPreset: true },
  { id: 'cat-3', name: '居住', type: 'expense', iconName: 'Home', color: '#0d9488', isPreset: true },
  { id: 'cat-4', name: '購物', type: 'expense', iconName: 'ShoppingBag', color: '#8b5cf6', isPreset: true },
  { id: 'cat-5', name: '娛樂', type: 'expense', iconName: 'Sparkles', color: '#ec4899', isPreset: true },
  { id: 'cat-6', name: '咖啡', type: 'expense', iconName: 'Coffee', color: '#f59e0b', isPreset: true },
  { id: 'cat-7', name: '醫療', type: 'expense', iconName: 'HeartPulse', color: '#ef4444', isPreset: true },
  { id: 'cat-8', name: '其他', type: 'expense', iconName: 'HelpCircle', color: '#64748b', isPreset: true },

  // Income Categories
  { id: 'cat-9', name: '薪資', type: 'income', iconName: 'DollarSign', color: '#10b981', isPreset: true },
  { id: 'cat-10', name: '獎金', type: 'income', iconName: 'Gift', color: '#10b981', isPreset: true },
  { id: 'cat-11', name: '理財', type: 'income', iconName: 'TrendingUp', color: '#6366f1', isPreset: true },
  { id: 'cat-12', name: '其他', type: 'income', iconName: 'HelpCircle', color: '#64748b', isPreset: true },
];

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load categories from localStorage', e);
    }
    return INITIAL_CATEGORIES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    } catch (e) {
      console.error('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  const addCategory = (newCat: Omit<CategoryItem, 'id'>) => {
    const item: CategoryItem = {
      ...newCat,
      id: `cat-${Date.now()}`,
    };
    setCategories((prev) => [...prev, item]);
  };

  const updateCategory = (id: string, updatedFields: Partial<CategoryItem>) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, ...updatedFields } : cat))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
