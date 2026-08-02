import { useState, useEffect } from 'react';
import type { BudgetSettings } from '../types';

const STORAGE_KEY = 'nordic_expense_app_budget';

const DEFAULT_BUDGET: BudgetSettings = {
  monthlyTotalBudget: 35000,
  categoryBudgets: {
    飲食: 10000,
    交通: 3000,
    居住: 12000,
    購物: 5000,
    娛樂: 3000,
    咖啡: 1500,
    醫療: 2000,
    其他: 2500,
  },
};

export function useBudget() {
  const [budgetSettings, setBudgetSettings] = useState<BudgetSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed.monthlyTotalBudget === 'number') {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load budget from localStorage', e);
    }
    return DEFAULT_BUDGET;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgetSettings));
    } catch (e) {
      console.error('Failed to save budget to localStorage', e);
    }
  }, [budgetSettings]);

  const updateMonthlyTotalBudget = (amount: number) => {
    setBudgetSettings((prev) => ({
      ...prev,
      monthlyTotalBudget: amount,
    }));
  };

  const updateCategoryBudget = (categoryName: string, amount: number) => {
    setBudgetSettings((prev) => ({
      ...prev,
      categoryBudgets: {
        ...prev.categoryBudgets,
        [categoryName]: amount,
      },
    }));
  };

  const updateAllBudgets = (newSettings: BudgetSettings) => {
    setBudgetSettings(newSettings);
  };

  return {
    budgetSettings,
    updateMonthlyTotalBudget,
    updateCategoryBudget,
    updateAllBudgets,
  };
}
