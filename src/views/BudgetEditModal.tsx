import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useState } from 'react';
import type { BudgetSettings, CategoryItem } from '../types';

interface BudgetEditModalProps {
  onClose: () => void;
  budgetSettings: BudgetSettings;
  categoriesList: CategoryItem[];
  onSaveBudgets: (newSettings: BudgetSettings) => void;
}

export default function BudgetEditModal({
  onClose,
  budgetSettings,
  categoriesList,
  onSaveBudgets,
}: BudgetEditModalProps) {
  const [totalBudget, setTotalBudget] = useState(budgetSettings.monthlyTotalBudget.toString());
  const [catBudgets, setCatBudgets] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    categoriesList.filter((c) => c.type === 'expense').forEach((c) => {
      initial[c.name] = (budgetSettings.categoryBudgets[c.name] ?? 3000).toString();
    });
    return initial;
  });

  const handleCatChange = (catName: string, value: string) => {
    setCatBudgets((prev) => ({
      ...prev,
      [catName]: value,
    }));
  };

  const handleSave = () => {
    const parsedTotal = parseFloat(totalBudget) || 0;
    const parsedCats: Record<string, number> = {};
    Object.entries(catBudgets).forEach(([name, val]) => {
      parsedCats[name] = parseFloat(val) || 0;
    });

    onSaveBudgets({
      monthlyTotalBudget: parsedTotal,
      categoryBudgets: parsedCats,
    });
    onClose();
  };

  const expenseCategories = categoriesList.filter((c) => c.type === 'expense');

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 50,
        }}
      />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
        className="glass-panel"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '84vh',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          zIndex: 60,
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--glass-shadow)',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)' }}>
            設定預算
          </h2>
          <button 
            onClick={onClose}
            className="nordic-inset"
            style={{
              width: '34px', height: '34px', borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              color: 'var(--text-secondary)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Monthly Total Budget Field */}
        <div className="nordic-card" style={{ padding: '16px', marginBottom: '20px' }}>
          <label style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            每月總預算 ($)
          </label>
          <input
            type="number"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '24px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              background: 'var(--bg-color)',
              border: '1px solid var(--border-color)',
              outline: 'none',
            }}
          />
        </div>

        {/* Category Specific Budgets List */}
        <div style={{ marginBottom: '24px', flex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>
            各分類預算設定
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {expenseCategories.map((cat) => (
              <div key={cat.id} className="nordic-card" style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 600 }}>$</span>
                  <input
                    type="number"
                    value={catBudgets[cat.name] || ''}
                    onChange={(e) => handleCatChange(cat.name, e.target.value)}
                    style={{
                      width: '100px',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      background: 'var(--bg-color)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                      textAlign: 'right',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{
            background: 'var(--accent-color)',
            color: '#ffffff',
            padding: '14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '16px',
            fontWeight: 700,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            marginBottom: 'var(--spacing-safe-bottom)',
          }}
        >
          <Check size={18} /> 儲存預算設定
        </motion.button>
      </motion.div>
    </>
  );
}
