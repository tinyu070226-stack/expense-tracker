import { useState, useEffect, useMemo } from 'react';
import type { Transaction } from '../types';

const STORAGE_KEY = 'nordic_expense_app_transactions';
const RESET_TIME_KEY = 'nordic_expense_app_session_reset';

// Start clean with 0 transactions
const INITIAL_TRANSACTIONS: Transaction[] = [];

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load transactions from localStorage', e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [sessionResetTime, setSessionResetTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(RESET_TIME_KEY);
      if (saved) {
        const timestamp = parseInt(saved, 10);
        if (!isNaN(timestamp)) return timestamp;
      }
    } catch (e) {
      console.error('Failed to load reset timestamp', e);
    }
    return 0;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(RESET_TIME_KEY, sessionResetTime.toString());
    } catch (e) {
      console.error('Failed to save reset timestamp', e);
    }
  }, [sessionResetTime]);

  const safeTransactions = useMemo(() => {
    return Array.isArray(transactions) ? transactions : [];
  }, [transactions]);

  const addTransaction = (newTx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const item: Transaction = {
      ...newTx,
      id: Date.now().toString(),
      createdAt: Date.now(),
    };
    setTransactions((prev) => [item, ...(Array.isArray(prev) ? prev : [])]);
  };

  const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
    setTransactions((prev) =>
      (Array.isArray(prev) ? prev : []).map((tx) => (tx.id === id ? { ...tx, ...updatedFields } : tx))
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => (Array.isArray(prev) ? prev : []).filter((tx) => tx.id !== id));
  };

  const resetSessionTotal = () => {
    setSessionResetTime(Date.now());
  };

  const todayStr = useMemo(() => {
    try {
      return new Date().toISOString().split('T')[0];
    } catch {
      return new Date().toLocaleDateString('sv');
    }
  }, []);

  const sessionTotalExpense = useMemo(() => {
    return safeTransactions
      .filter((t) => t && t.type === 'expense' && (t.createdAt || 0) >= sessionResetTime)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [safeTransactions, sessionResetTime]);

  const totalExpense = useMemo(() => {
    return safeTransactions
      .filter((t) => t && t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [safeTransactions]);

  const monthlyExpense = useMemo(() => {
    const currentMonth = todayStr.slice(0, 7);
    return safeTransactions
      .filter((t) => t && t.type === 'expense' && t.date && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [safeTransactions, todayStr]);

  const monthlyIncome = useMemo(() => {
    const currentMonth = todayStr.slice(0, 7);
    return safeTransactions
      .filter((t) => t && t.type === 'income' && t.date && t.date.startsWith(currentMonth))
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [safeTransactions, todayStr]);

  const monthlyBalance = useMemo(() => {
    return monthlyIncome - monthlyExpense;
  }, [monthlyIncome, monthlyExpense]);

  const dailyExpense = useMemo(() => {
    return safeTransactions
      .filter((t) => t && t.type === 'expense' && t.date === todayStr)
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [safeTransactions, todayStr]);

  const weeklyExpense = useMemo(() => {
    try {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(now.setDate(diff));
      const startOfWeekStr = monday.toISOString().split('T')[0];
      
      return safeTransactions
        .filter((t) => t && t.type === 'expense' && t.date && t.date >= startOfWeekStr)
        .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    } catch {
      return 0;
    }
  }, [safeTransactions]);

  return {
    transactions: safeTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetSessionTotal,
    sessionTotalExpense,
    totalExpense,
    monthlyExpense,
    monthlyIncome,
    monthlyBalance,
    weeklyExpense,
    dailyExpense,
  };
}
