import { motion } from 'framer-motion';
import { Settings, AlertTriangle, AlertCircle, CheckCircle2, Utensils, Train, Home, ShoppingBag, Coffee, Sparkles, HeartPulse, HelpCircle, DollarSign, Gift, TrendingUp, Car, BookOpen, Dumbbell, Smile, Briefcase } from 'lucide-react';
import type { BudgetSettings, Transaction, CategoryItem } from '../types';

interface BudgetViewProps {
  budgetSettings: BudgetSettings;
  transactions: Transaction[];
  categoriesList: CategoryItem[];
  onOpenEditModal: () => void;
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

export default function BudgetView({
  budgetSettings,
  transactions,
  categoriesList,
  onOpenEditModal,
}: BudgetViewProps) {
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  // Monthly spent
  const monthlySpent = transactions
    .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonthStr))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBudget = budgetSettings.monthlyTotalBudget;
  const totalRemaining = totalBudget - monthlySpent;
  const totalPercentage = totalBudget > 0 ? Math.min(Math.round((monthlySpent / totalBudget) * 100), 100) : 0;
  const isTotalOver = monthlySpent > totalBudget;
  const isTotalWarning = !isTotalOver && totalPercentage >= 80;

  // Category spent calculations
  const expenseCategories = categoriesList.filter((c) => c.type === 'expense');

  const categorySpending = expenseCategories.map((cat) => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && t.category === cat.name && t.date.startsWith(currentMonthStr))
      .reduce((sum, t) => sum + t.amount, 0);

    const budget = budgetSettings.categoryBudgets[cat.name] ?? 3000;
    const remaining = budget - spent;
    const percentage = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
    const isOver = spent > budget;
    const isWarn = !isOver && percentage >= 80;

    return {
      cat,
      budget,
      spent,
      remaining,
      percentage,
      isOver,
      isWarn,
    };
  });

  const overbudgetCategories = categorySpending.filter((c) => c.isOver);

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.03em' }}>預算管理</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px', fontWeight: 500 }}>
            設定總預算與分類額度
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenEditModal}
          style={{
            background: 'var(--surface-solid)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <Settings size={15} /> 設定預算
        </motion.button>
      </motion.div>

      {/* Global Overbudget Warning Banner if any */}
      {(isTotalOver || overbudgetCategories.length > 0) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'var(--danger-color)',
          }}
        >
          <AlertCircle size={22} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 700 }}>
              {isTotalOver ? '🚨 本月總預算已超支！' : '⚠️ 部分分類預算已超支！'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
              {isTotalOver 
                ? `已超出總預算 $${(monthlySpent - totalBudget).toLocaleString()}`
                : `${overbudgetCategories.map(c => c.cat.name).join('、')} 已超過預定額度`}
            </div>
          </div>
        </motion.div>
      )}

      {/* Monthly Total Budget Hero Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="nordic-card"
        style={{
          padding: '22px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            本月總預算
          </span>
          <span style={{ 
            color: isTotalOver ? 'var(--danger-color)' : isTotalWarning ? '#f59e0b' : 'var(--accent-color)', 
            fontSize: '12px', 
            fontWeight: 600,
            background: isTotalOver ? 'rgba(239, 68, 68, 0.1)' : isTotalWarning ? 'rgba(245, 158, 11, 0.1)' : 'rgba(2, 132, 199, 0.1)',
            padding: '3px 9px',
            borderRadius: 'var(--radius-full)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {isTotalOver ? <AlertTriangle size={13} /> : isTotalWarning ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
            {isTotalOver ? '已超支' : isTotalWarning ? '接近預算' : '控制良好'}
          </span>
        </div>

        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            剩餘可用預算
          </div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.04em', color: isTotalOver ? 'var(--danger-color)' : 'var(--text-primary)', marginTop: '2px' }}>
            ${totalRemaining.toLocaleString()}
          </h2>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div style={{ width: '100%', height: '8px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div 
              style={{ 
                height: '100%', 
                width: `${totalPercentage}%`, 
                background: isTotalOver ? 'var(--danger-color)' : isTotalWarning ? '#f59e0b' : 'var(--accent-color)', 
                borderRadius: 'var(--radius-full)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '8px' }}>
            <span>已支出 ${monthlySpent.toLocaleString()} ({totalPercentage}%)</span>
            <span>總預算 ${totalBudget.toLocaleString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Category Budgets Breakdown List */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '14px' }}>
          各分類預算進度
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {categorySpending.map((item, i) => {
            const IconComponent = ICON_MAP[item.cat.iconName] || HelpCircle;
            const barColor = item.isOver ? '#ef4444' : item.isWarn ? '#f59e0b' : item.cat.color;

            return (
              <motion.div
                key={item.cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 + 0.1 }}
                className="nordic-card"
                style={{ padding: '16px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: 'var(--radius-sm)',
                      background: `${item.cat.color}15`, color: item.cat.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.cat.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                        預算 ${item.budget.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14.5px', fontWeight: 700, color: item.isOver ? 'var(--danger-color)' : 'var(--text-primary)' }}>
                      ${item.spent.toLocaleString()}
                    </div>
                    <div style={{ 
                      fontSize: '11.5px', 
                      fontWeight: 600, 
                      color: item.isOver ? 'var(--danger-color)' : item.isWarn ? '#f59e0b' : 'var(--text-secondary)' 
                    }}>
                      {item.isOver ? `超支 $${Math.abs(item.remaining).toLocaleString()}` : `剩餘 $${item.remaining.toLocaleString()}`}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${item.percentage}%`, height: '100%', background: barColor, borderRadius: 'var(--radius-full)', transition: 'width 0.3s ease' }} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
