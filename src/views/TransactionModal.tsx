import { motion } from 'framer-motion';
import { X, Utensils, Train, Home, ShoppingBag, Coffee, Trash2, Wallet, CreditCard, Landmark, DollarSign, Gift, TrendingUp, HelpCircle, Sparkles, HeartPulse, Car, BookOpen, Dumbbell, Smile, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { Transaction, TransactionType, AccountType, CategoryItem } from '../types';

interface TransactionModalProps {
  categoriesList?: CategoryItem[];
  onClose: () => void;
  onSave: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onUpdate?: (id: string, tx: Partial<Transaction>) => void;
  onDelete?: (id: string) => void;
  initialTransaction?: Transaction | null;
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

const DEFAULT_EXPENSE_CATS: CategoryItem[] = [
  { id: '1', name: '飲食', type: 'expense', iconName: 'Utensils', color: '#f43f5e' },
  { id: '2', name: '交通', type: 'expense', iconName: 'Train', color: '#0284c7' },
  { id: '3', name: '居住', type: 'expense', iconName: 'Home', color: '#0d9488' },
  { id: '4', name: '購物', type: 'expense', iconName: 'ShoppingBag', color: '#8b5cf6' },
  { id: '5', name: '娛樂', type: 'expense', iconName: 'Sparkles', color: '#ec4899' },
  { id: '6', name: '咖啡', type: 'expense', iconName: 'Coffee', color: '#f59e0b' },
  { id: '7', name: '其他', type: 'expense', iconName: 'HelpCircle', color: '#64748b' },
];

const DEFAULT_INCOME_CATS: CategoryItem[] = [
  { id: '8', name: '薪資', type: 'income', iconName: 'DollarSign', color: '#10b981' },
  { id: '9', name: '獎金', type: 'income', iconName: 'Gift', color: '#10b981' },
  { id: '10', name: '理財', type: 'income', iconName: 'TrendingUp', color: '#6366f1' },
  { id: '11', name: '其他', type: 'income', iconName: 'HelpCircle', color: '#64748b' },
];

const ACCOUNTS: { label: AccountType; icon: typeof Wallet }[] = [
  { label: '現金', icon: Wallet },
  { label: '信用卡', icon: CreditCard },
  { label: '銀行帳戶', icon: Landmark },
];

export default function TransactionModal({
  categoriesList,
  onClose,
  onSave,
  onUpdate,
  onDelete,
  initialTransaction,
}: TransactionModalProps) {
  const isEditing = Boolean(initialTransaction);

  const [type, setType] = useState<TransactionType>(initialTransaction?.type || 'expense');
  const [amountStr, setAmountStr] = useState(initialTransaction ? initialTransaction.amount.toString() : '0');
  const [category, setCategory] = useState(initialTransaction?.category || '飲食');
  const [account, setAccount] = useState<AccountType>(initialTransaction?.account || '現金');
  
  const todayStr = new Date().toISOString().split('T')[0];
  const nowTimeStr = new Date().toTimeString().slice(0, 5);

  const [date, setDate] = useState(initialTransaction?.date || todayStr);
  const [time, setTime] = useState(initialTransaction?.time || nowTimeStr);
  const [note, setNote] = useState(initialTransaction?.note || '');

  const availableCategories = (categoriesList && categoriesList.length > 0)
    ? categoriesList.filter((c) => c.type === type)
    : (type === 'expense' ? DEFAULT_EXPENSE_CATS : DEFAULT_INCOME_CATS);

  useEffect(() => {
    if (!initialTransaction && availableCategories.length > 0) {
      setCategory(availableCategories[0].name);
    }
  }, [type, initialTransaction]);

  const handleNumClick = (num: string) => {
    if (amountStr === '0') setAmountStr(num);
    else setAmountStr(amountStr + num);
  };

  const handleDeleteNum = () => {
    if (amountStr.length > 1) setAmountStr(amountStr.slice(0, -1));
    else setAmountStr('0');
  };

  const handleSubmit = () => {
    const numericAmount = parseFloat(amountStr) || 0;
    if (numericAmount <= 0) return;

    if (isEditing && initialTransaction && onUpdate) {
      onUpdate(initialTransaction.id, {
        type,
        amount: numericAmount,
        category,
        account,
        date,
        time,
        note,
      });
    } else {
      onSave({
        type,
        amount: numericAmount,
        category,
        account,
        date,
        time,
        note,
      });
    }
    onClose();
  };

  const handleDeleteItem = () => {
    if (initialTransaction && onDelete) {
      onDelete(initialTransaction.id);
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
      
      {/* Bottom Sheet Modal */}
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
          height: '88vh',
          borderTopLeftRadius: 'var(--radius-lg)',
          borderTopRightRadius: 'var(--radius-lg)',
          zIndex: 60,
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--glass-shadow)',
          overflowY: 'auto',
        }}
      >
        {/* Header with Type Selector */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          
          {/* Segmented Control [ 支出 | 收入 ] */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-color)',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)',
          }}>
            <button
              onClick={() => setType('expense')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 600,
                background: type === 'expense' ? 'var(--accent-color)' : 'transparent',
                color: type === 'expense' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              支出
            </button>
            <button
              onClick={() => setType('income')}
              style={{
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontSize: '13px',
                fontWeight: 600,
                background: type === 'income' ? '#10b981' : 'transparent',
                color: type === 'income' ? '#ffffff' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              收入
            </button>
          </div>

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

        {/* Amount Display */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '2px' }}>
            {isEditing ? '編輯金額' : '輸入金額'}
          </div>
          <div style={{ 
            fontSize: '42px', 
            fontWeight: 800, 
            letterSpacing: '-0.04em', 
            color: type === 'expense' ? 'var(--text-primary)' : '#10b981' 
          }}>
            {type === 'expense' ? '-' : '+'}$ {Number(amountStr).toLocaleString()}
          </div>
        </div>

        {/* Category & Account Selectors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
          
          {/* Category Selector */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              選擇分類
            </div>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {availableCategories.map((cat) => {
                const Icon = ICON_MAP[cat.iconName] || HelpCircle;
                const isCatActive = category === cat.name;
                return (
                  <button 
                    key={cat.id}
                    onClick={() => setCategory(cat.name)}
                    className={isCatActive ? 'nordic-card' : 'nordic-inset'}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: isCatActive ? 600 : 500,
                      color: isCatActive ? (type === 'expense' ? cat.color : '#10b981') : 'var(--text-secondary)',
                      borderColor: isCatActive ? (type === 'expense' ? cat.color : '#10b981') : 'var(--border-color)',
                      background: isCatActive ? `${cat.color}15` : 'var(--surface-solid)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={16} />
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Account Selector */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
              選擇帳戶
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                const isAccActive = account === acc.label;
                return (
                  <button
                    key={acc.label}
                    onClick={() => setAccount(acc.label)}
                    className="nordic-card"
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      fontSize: '12.5px',
                      fontWeight: isAccActive ? 600 : 500,
                      color: isAccActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      borderColor: isAccActive ? 'var(--accent-color)' : 'var(--border-color)',
                      background: isAccActive ? 'rgba(2, 132, 199, 0.08)' : 'var(--surface-solid)',
                    }}
                  >
                    <Icon size={15} />
                    {acc.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Time & Note Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                日期
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="nordic-inset"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                時間
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="nordic-inset"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '12.5px',
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="備註（可選，例如：壽司晚餐）"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="nordic-inset"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '13px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          </div>

        </div>

        {/* Numpad */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '10px',
          marginBottom: '16px'
        }}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <motion.button
              key={num}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNumClick(num.toString())}
              className="nordic-card"
              style={{ padding: '12px', fontSize: '20px', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
            >
              {num}
            </motion.button>
          ))}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumClick('00')}
            className="nordic-card"
            style={{ padding: '12px', fontSize: '16px', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
          >
            00
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNumClick('0')}
            className="nordic-card"
            style={{ padding: '12px', fontSize: '20px', fontWeight: 600, borderRadius: 'var(--radius-md)' }}
          >
            0
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDeleteNum}
            className="nordic-inset"
            style={{ padding: '12px', fontSize: '18px', fontWeight: 600, borderRadius: 'var(--radius-md)', color: 'var(--danger-color)' }}
          >
            ⌫
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingBottom: 'var(--spacing-safe-bottom)' }}>
          {isEditing && (
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={handleDeleteItem}
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
              background: type === 'expense' ? 'var(--accent-color)' : '#10b981',
              color: '#ffffff',
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '16px',
              fontWeight: 700,
              flex: 1,
              boxShadow: type === 'expense' ? '0 4px 14px rgba(2, 132, 199, 0.3)' : '0 4px 14px rgba(16, 185, 129, 0.3)',
            }}
          >
            {isEditing ? '儲存修改' : '儲存紀錄'}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
