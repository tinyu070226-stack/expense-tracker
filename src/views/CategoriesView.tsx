import { motion } from 'framer-motion';
import { useState } from 'react';
import { Plus, Utensils, Train, Home, ShoppingBag, Coffee, Sparkles, HeartPulse, DollarSign, Gift, TrendingUp, HelpCircle, Car, BookOpen, Dumbbell, Smile, Briefcase } from 'lucide-react';
import type { CategoryItem, TransactionType } from '../types';

interface CategoriesViewProps {
  categories: CategoryItem[];
  onAddCategory: () => void;
  onEditCategory: (cat: CategoryItem) => void;
}

const ICON_MAP: Record<string, typeof Utensils> = {
  Utensils,
  Train,
  Home,
  ShoppingBag,
  Coffee,
  Sparkles,
  HeartPulse,
  DollarSign,
  Gift,
  TrendingUp,
  Car,
  BookOpen,
  Dumbbell,
  Smile,
  Briefcase,
  HelpCircle,
};

export default function CategoriesView({
  categories,
  onAddCategory,
  onEditCategory,
}: CategoriesViewProps) {
  const [activeType, setActiveType] = useState<TransactionType>('expense');

  const filteredCategories = categories.filter((c) => c.type === activeType);

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.03em' }}>分類管理</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px', fontWeight: 500 }}>
            可自訂圖示與色彩
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAddCategory}
          style={{
            background: 'var(--accent-color)',
            color: '#ffffff',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
          }}
        >
          <Plus size={16} /> 新增分類
        </motion.button>
      </motion.div>

      {/* Segmented Control [ 支出分類 | 收入分類 ] */}
      <div style={{
        display: 'flex',
        background: 'var(--surface-solid)',
        padding: '4px',
        borderRadius: 'var(--radius-full)',
        border: '1px solid var(--border-color)',
        marginBottom: '24px',
      }}>
        <button
          onClick={() => setActiveType('expense')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            background: activeType === 'expense' ? 'var(--accent-color)' : 'transparent',
            color: activeType === 'expense' ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          支出分類 ({categories.filter((c) => c.type === 'expense').length})
        </button>
        <button
          onClick={() => setActiveType('income')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            background: activeType === 'income' ? '#10b981' : 'transparent',
            color: activeType === 'income' ? '#ffffff' : 'var(--text-secondary)',
            transition: 'all 0.2s ease',
          }}
        >
          收入分類 ({categories.filter((c) => c.type === 'income').length})
        </button>
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {filteredCategories.map((cat, i) => {
          const IconComponent = ICON_MAP[cat.iconName] || HelpCircle;
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 + 0.1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEditCategory(cat)}
              className="nordic-card"
              style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              {/* Icon badge with custom color */}
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: `${cat.color}15`,
                color: cat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IconComponent size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {cat.name}
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {cat.isPreset ? '預設分類' : '自訂分類'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
