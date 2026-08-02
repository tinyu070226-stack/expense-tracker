import { motion } from 'framer-motion';
import { X, PieChart, ChevronRight, RotateCcw } from 'lucide-react';
import type { Transaction } from '../../types';

interface TotalBreakdownModalProps {
  onClose: () => void;
  transactions: Transaction[];
  sessionTotalExpense: number;
  onResetSessionTotal: () => void;
  onEditTransaction: (tx: Transaction) => void;
}

export default function TotalBreakdownModal({
  onClose,
  transactions,
  sessionTotalExpense,
  onResetSessionTotal,
  onEditTransaction,
}: TotalBreakdownModalProps) {
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  // Group by category
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryList = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: sessionTotalExpense > 0 ? Math.round((amount / sessionTotalExpense) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const handleResetConfirm = () => {
    if (window.confirm('確定要把當前「總額」歸零並開始新一輪累計嗎？（不會刪除歷史明細紀錄）')) {
      onResetSessionTotal();
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

      {/* Modal Sheet */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PieChart size={20} style={{ color: 'var(--accent-color)' }} />
            <h2 style={{ fontSize: '19px', fontWeight: 700, color: 'var(--text-primary)' }}>總額分析明細</h2>
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

        {/* Total Banner with Reset Button */}
        <div className="nordic-card" style={{ padding: '20px', textAlign: 'center', marginBottom: '24px', position: 'relative' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>
            當前累計總額
          </div>
          <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            $ {sessionTotalExpense.toLocaleString()}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleResetConfirm}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--danger-color)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '12.5px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} /> 結算歸零 ($0)
            </motion.button>
          </div>
        </div>

        {/* Category Percentages Breakdown */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
            分類支出佔比
          </h3>

          {categoryList.length === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
              暫無支出紀錄
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoryList.map((item) => (
                <div key={item.category} className="nordic-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', fontWeight: 600, marginBottom: '8px' }}>
                    <span>{item.category}</span>
                    <span>${item.amount.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percentage}%`, height: '100%', background: 'var(--accent-color)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Itemized Transaction List */}
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
            所有明細清單
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingBottom: 'calc(20px + var(--spacing-safe-bottom))' }}>
            {expenseTransactions.map((t) => (
              <motion.div
                key={t.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  onEditTransaction(t);
                }}
                className="nordic-card"
                style={{
                  padding: '12px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t.note || t.category}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {t.category} · {t.account} · {t.date} {t.time}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)' }}>
                  -${t.amount.toLocaleString()}
                  <ChevronRight size={14} style={{ color: 'var(--text-secondary)' }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
