import { motion } from 'framer-motion';
import { X, Trash2, Utensils, Train, Home, ShoppingBag, Coffee, Sparkles, HeartPulse, DollarSign, Gift, TrendingUp, HelpCircle, Car, BookOpen, Dumbbell, Smile, Briefcase } from 'lucide-react';
import { useState } from 'react';
import type { CategoryItem, TransactionType } from '../types';

interface CategoryEditModalProps {
  onClose: () => void;
  onSave: (cat: Omit<CategoryItem, 'id'>) => void;
  onUpdate?: (id: string, cat: Partial<CategoryItem>) => void;
  onDelete?: (id: string) => void;
  initialCategory?: CategoryItem | null;
}

const AVAILABLE_ICONS = [
  { name: 'Utensils', icon: Utensils },
  { name: 'Train', icon: Train },
  { name: 'Home', icon: Home },
  { name: 'ShoppingBag', icon: ShoppingBag },
  { name: 'Coffee', icon: Coffee },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'HeartPulse', icon: HeartPulse },
  { name: 'DollarSign', icon: DollarSign },
  { name: 'Gift', icon: Gift },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Car', icon: Car },
  { name: 'BookOpen', icon: BookOpen },
  { name: 'Dumbbell', icon: Dumbbell },
  { name: 'Smile', icon: Smile },
  { name: 'Briefcase', icon: Briefcase },
  { name: 'HelpCircle', icon: HelpCircle },
];

const COLOR_PALETTE = [
  '#0284c7', // Fjord Blue
  '#0d9488', // Teal
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#10b981', // Emerald
  '#6366f1', // Indigo
  '#3b82f6', // Royal Blue
  '#64748b', // Slate Gray
];

export default function CategoryEditModal({
  onClose,
  onSave,
  onUpdate,
  onDelete,
  initialCategory,
}: CategoryEditModalProps) {
  const isEditing = Boolean(initialCategory);

  const [type, setType] = useState<TransactionType>(initialCategory?.type || 'expense');
  const [name, setName] = useState(initialCategory?.name || '');
  const [iconName, setIconName] = useState(initialCategory?.iconName || 'Utensils');
  const [color, setColor] = useState(initialCategory?.color || '#0284c7');

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (isEditing && initialCategory && onUpdate) {
      onUpdate(initialCategory.id, {
        name: name.trim(),
        type,
        iconName,
        color,
      });
    } else {
      onSave({
        name: name.trim(),
        type,
        iconName,
        color,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (initialCategory && onDelete) {
      onDelete(initialCategory.id);
      onClose();
    }
  };

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
          height: '82vh',
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
            {isEditing ? '編輯分類' : '新增自訂分類'}
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

        {/* Type Toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-color)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)',
          marginBottom: '20px',
        }}>
          <button
            onClick={() => setType('expense')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              background: type === 'expense' ? 'var(--accent-color)' : 'transparent',
              color: type === 'expense' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            支出分類
          </button>
          <button
            onClick={() => setType('income')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontSize: '13px',
              fontWeight: 600,
              background: type === 'income' ? '#10b981' : 'transparent',
              color: type === 'income' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
            }}
          >
            收入分類
          </button>
        </div>

        {/* Category Name Input */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            分類名稱
          </label>
          <input
            type="text"
            placeholder="請輸入分類名稱（例如：寵物、健身）"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="nordic-card"
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '15px',
              fontWeight: 600,
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
        </div>

        {/* Icon Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            選擇圖示
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
            {AVAILABLE_ICONS.map((item) => {
              const IconComponent = item.icon;
              const isSelected = iconName === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => setIconName(item.name)}
                  className="nordic-card"
                  style={{
                    height: '46px',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? color : 'var(--text-secondary)',
                    borderColor: isSelected ? color : 'var(--border-color)',
                    background: isSelected ? 'rgba(2, 132, 199, 0.08)' : 'var(--surface-solid)',
                    borderWidth: isSelected ? '2px' : '1px',
                  }}
                >
                  <IconComponent size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
            選擇色彩
          </label>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
            {COLOR_PALETTE.map((hex) => {
              const isSelected = color === hex;
              return (
                <button
                  key={hex}
                  onClick={() => setColor(hex)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: hex,
                    border: isSelected ? '3px solid var(--surface-solid)' : 'none',
                    boxShadow: isSelected ? `0 0 0 2px ${hex}` : 'none',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingBottom: 'var(--spacing-safe-bottom)' }}>
          {isEditing && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleDelete}
              style={{
                background: 'var(--danger-color)',
                color: 'var(--danger-text)',
                padding: '14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '15px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                flex: '0 0 80px',
              }}
            >
              <Trash2 size={18} />
            </motion.button>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            style={{
              background: 'var(--accent-color)',
              color: '#ffffff',
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '16px',
              fontWeight: 700,
              flex: 1,
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
            }}
          >
            {isEditing ? '儲存分類修改' : '建立自訂分類'}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
