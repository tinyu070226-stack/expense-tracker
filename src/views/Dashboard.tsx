import { motion } from 'framer-motion';
import { useState, useMemo, useEffect } from 'react';
import { Utensils, Train, Home, ShoppingBag, Coffee, ChevronRight, TrendingUp, Calendar, Zap, DollarSign, Gift, HelpCircle, Sparkles, HeartPulse, Car, BookOpen, Dumbbell, Smile, Briefcase, ArrowUpRight, ArrowDownRight, BarChart2, PieChart, BarChart } from 'lucide-react';
import type { Transaction, CategoryItem } from '../types';

interface DashboardProps {
  transactions: Transaction[];
  categoriesList?: CategoryItem[];
  monthlyBalance: number;
  monthlyExpense: number;
  weeklyExpense: number;
  dailyExpense: number;
  onEditTransaction: (tx: Transaction) => void;
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

type TimeframeType = 'month' | 'week' | 'day';
type ChartModeType = 'bar' | 'pie' | 'column';

const TIMEFRAME_KEY = 'nordic_expense_app_timeframe';

export default function Dashboard({
  transactions,
  categoriesList = [],
  monthlyBalance,
  monthlyExpense,
  weeklyExpense,
  dailyExpense,
  onEditTransaction,
}: DashboardProps) {
  // Remember timeframe in localStorage
  const [timeframe, setTimeframe] = useState<TimeframeType>(() => {
    try {
      const saved = localStorage.getItem(TIMEFRAME_KEY);
      if (saved === 'month' || saved === 'week' || saved === 'day') {
        return saved;
      }
    } catch (e) {
      console.error('Failed to load timeframe', e);
    }
    return 'month';
  });

  const [txFilter, setTxFilter] = useState<'all' | 'expense' | 'income'>('all');
  const [chartMode, setChartMode] = useState<ChartModeType>('bar');

  useEffect(() => {
    try {
      localStorage.setItem(TIMEFRAME_KEY, timeframe);
    } catch (e) {
      console.error('Failed to save timeframe', e);
    }
  }, [timeframe]);

  const currentDateStr = new Date().toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  const getCategoryMeta = (catName: string) => {
    const found = categoriesList.find((c) => c.name === catName);
    if (found) {
      return {
        icon: ICON_MAP[found.iconName] || HelpCircle,
        color: found.color,
        bg: `${found.color}15`,
      };
    }
    return {
      icon: HelpCircle,
      color: '#0284c7',
      bg: 'rgba(2, 132, 199, 0.1)',
    };
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.slice(0, 7);

  const filteredByTimeframe = useMemo(() => {
    if (timeframe === 'day') {
      return transactions.filter((t) => t.date === todayStr);
    }
    if (timeframe === 'week') {
      const now = new Date();
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      const mondayStr = new Date(now.setDate(diff)).toISOString().split('T')[0];
      return transactions.filter((t) => t.date >= mondayStr);
    }
    return transactions.filter((t) => t.date.startsWith(currentMonthStr));
  }, [transactions, timeframe, todayStr, currentMonthStr]);

  const timeframeIncome = useMemo(() => {
    return filteredByTimeframe
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredByTimeframe]);

  const timeframeExpense = useMemo(() => {
    return filteredByTimeframe
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [filteredByTimeframe]);

  const timeframeBalance = timeframeIncome - timeframeExpense;

  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const expenseTxs = filteredByTimeframe.filter((t) => t.type === 'expense');
    const totals: Record<string, number> = {};
    expenseTxs.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });

    return Object.entries(totals)
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: timeframeExpense > 0 ? Math.round((amount / timeframeExpense) * 100) : 0,
        meta: getCategoryMeta(name),
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [filteredByTimeframe, timeframeExpense, categoriesList]);

  // Filtered transactions list
  const displayedTransactions = useMemo(() => {
    if (txFilter === 'all') return transactions;
    return transactions.filter((t) => t.type === txFilter);
  }, [transactions, txFilter]);

  return (
    <div style={{ paddingBottom: '120px' }}>
      {/* Top Header / Title */}
      <motion.div 
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        style={{ marginBottom: '20px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '26px', color: 'var(--text-primary)', fontWeight: 700, letterSpacing: '-0.03em' }}>總覽</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '2px', fontWeight: 500 }}>
              {currentDateStr}
            </p>
          </div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '6px 12px', 
            borderRadius: 'var(--radius-full)', 
            background: 'rgba(2, 132, 199, 0.12)', 
            color: 'var(--accent-color)',
            fontSize: '12px',
            fontWeight: 600
          }}>
            <TrendingUp size={14} /> 狀態良好
          </div>
        </div>
      </motion.div>

      {/* Timeframe Switcher [ 本月 | 本週 | 本日 ] (Sunken Dark Inset) */}
      <div style={{
        display: 'flex',
        background: 'var(--surface-inset)',
        padding: '4px',
        borderRadius: 'var(--radius-full)',
        border: 'none',
        marginBottom: '20px',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
      }}>
        {(['month', 'week', 'day'] as const).map((tf) => (
          <button
            key={tf}
            onClick={() => setTimeframe(tf)}
            style={{
              flex: 1,
              padding: '7px 0',
              borderRadius: 'var(--radius-full)',
              fontSize: '12.5px',
              fontWeight: 600,
              border: 'none',
              outline: 'none',
              background: timeframe === tf ? 'var(--accent-color)' : 'transparent',
              color: timeframe === tf ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease',
              boxShadow: timeframe === tf ? '0 4px 12px rgba(2, 132, 199, 0.35)' : 'none',
              cursor: 'pointer',
            }}
          >
            {tf === 'month' ? '本月總覽' : tf === 'week' ? '本週總覽' : '本日總覽'}
          </button>
        ))}
      </div>

      {/* Hero Financial Card (Elevated Gradient Nordic Hero) */}
      <motion.div 
        key={timeframe}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="nordic-hero"
        style={{
          padding: '24px',
          marginBottom: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '12.5px', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {timeframe === 'month' ? '本月結餘' : timeframe === 'week' ? '本週結餘' : '本日結餘'}
          </span>
          <span style={{ 
            color: timeframeBalance >= 0 ? 'var(--accent-color)' : 'var(--danger-color)', 
            fontSize: '12px', 
            fontWeight: 600,
            background: timeframeBalance >= 0 ? 'rgba(2, 132, 199, 0.15)' : 'rgba(239, 68, 68, 0.15)',
            padding: '3px 10px',
            borderRadius: 'var(--radius-full)'
          }}>
            {timeframeBalance >= 0 ? '淨盈餘' : '淨透支'}
          </span>
        </div>

        <div>
          <h2 style={{ fontSize: '38px', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
            $ {timeframeBalance.toLocaleString()}
          </h2>
        </div>
        
        {/* Income vs Expense Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px', 
          borderTop: '1px solid var(--border-color)', 
          paddingTop: '16px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'rgba(16, 185, 129, 0.15)', color: '#10b981',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ArrowDownRight size={17} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>總收入</div>
              <div style={{ fontSize: '15.5px', fontWeight: 700, color: '#10b981' }}>+${timeframeIncome.toLocaleString()}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              width: '32px', height: '32px', borderRadius: '50%', 
              background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <ArrowUpRight size={17} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500 }}>總支出</div>
              <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)' }}>-${timeframeExpense.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3 Quick Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '28px' }}>
        <div className="nordic-card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>本月支出</div>
          <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            ${monthlyExpense.toLocaleString()}
          </div>
        </div>

        <div className="nordic-card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>本週支出</div>
          <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            ${weeklyExpense.toLocaleString()}
          </div>
        </div>

        <div className="nordic-card" style={{ padding: '14px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>本日支出</div>
          <div style={{ fontSize: '15.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
            ${dailyExpense.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 📊 分類支出占比 */}
      <div className="nordic-card" style={{ padding: '22px', marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <PieChart size={18} style={{ color: 'var(--accent-color)' }} />
            <h3 style={{ fontSize: '15.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
              分類支出占比
            </h3>
          </div>

          {/* Mode Selector Buttons (Sunken Dark Inset) */}
          <div style={{ display: 'flex', gap: '3px', background: 'var(--surface-inset)', padding: '3px', borderRadius: 'var(--radius-full)', border: 'none' }}>
            <button
              onClick={() => setChartMode('bar')}
              title="條狀圖"
              style={{
                padding: '4px 9px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                outline: 'none',
                background: chartMode === 'bar' ? 'var(--accent-color)' : 'transparent',
                color: chartMode === 'bar' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '3px',
                cursor: 'pointer',
              }}
            >
              <BarChart2 size={13} /> 條狀
            </button>
            <button
              onClick={() => setChartMode('pie')}
              title="圓餅圖"
              style={{
                padding: '4px 9px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                outline: 'none',
                background: chartMode === 'pie' ? 'var(--accent-color)' : 'transparent',
                color: chartMode === 'pie' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '3px',
                cursor: 'pointer',
              }}
            >
              <PieChart size={13} /> 圓餅
            </button>
            <button
              onClick={() => setChartMode('column')}
              title="柱狀圖"
              style={{
                padding: '4px 9px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 600,
                border: 'none',
                outline: 'none',
                background: chartMode === 'column' ? 'var(--accent-color)' : 'transparent',
                color: chartMode === 'column' ? '#ffffff' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '3px',
                cursor: 'pointer',
              }}
            >
              <BarChart size={13} /> 柱狀
            </button>
          </div>
        </div>

        {categoryBreakdown.length === 0 ? (
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', textAlign: 'center', padding: '16px 0' }}>
            尚無支出紀錄
          </div>
        ) : (
          <>
            {/* Mode 1: Stacked Bar */}
            {chartMode === 'bar' && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ 
                  width: '100%', height: '10px', borderRadius: 'var(--radius-full)', 
                  background: 'var(--surface-inset)', display: 'flex', overflow: 'hidden', marginBottom: '16px' 
                }}>
                  {categoryBreakdown.map((item) => (
                    <div key={item.name} style={{ width: `${item.percentage}%`, height: '100%', background: item.meta.color }} />
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryBreakdown.slice(0, 4).map((item) => {
                    const IconComponent = item.meta.icon;
                    return (
                      <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '6px',
                            background: item.meta.bg, color: item.meta.color,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <IconComponent size={15} />
                          </div>
                          <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>{item.percentage}%</span>
                          <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)' }}>${item.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 2: Donut / Pie Chart */}
            {chartMode === 'pie' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', margin: '8px 0 12px' }}>
                <div style={{ width: '124px', height: '124px', flexShrink: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="124" height="124" viewBox="0 0 42 42">
                    <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="var(--border-color)" strokeWidth="4.8" />
                    {(() => {
                      let accumulated = 0;
                      return categoryBreakdown.map((item) => {
                        const strokeDasharray = `${item.percentage} ${100 - item.percentage}`;
                        const strokeDashoffset = 100 - accumulated + 25;
                        accumulated += item.percentage;
                        return (
                          <circle
                            key={item.name}
                            cx="21" cy="21" r="15.91549430918954"
                            fill="transparent"
                            stroke={item.meta.color}
                            strokeWidth="4.8"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                          />
                        );
                      });
                    })()}
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>總支出</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-primary)', marginTop: '1px' }}>
                      ${timeframeExpense.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {categoryBreakdown.slice(0, 4).map((item) => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.meta.color }} />
                        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                      </div>
                      <span style={{ fontSize: '12.5px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {item.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mode 3: Vertical Column Chart */}
            {chartMode === 'column' && (
              <div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-end', 
                  justifyContent: 'space-around', 
                  height: '115px', 
                  marginTop: '10px',
                  marginBottom: '16px', 
                  paddingBottom: '10px', 
                  borderBottom: '1px solid var(--border-color)' 
                }}>
                  {categoryBreakdown.slice(0, 5).map((item) => (
                    <div key={item.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '38px' }}>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                        {item.percentage}%
                      </span>
                      <div style={{ 
                        width: '18px', 
                        height: `${Math.max(item.percentage * 0.75, 10)}px`, 
                        maxHeight: '65px',
                        background: item.meta.color, 
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s ease'
                      }} />
                      <span style={{ 
                        fontSize: '11px', 
                        color: 'var(--text-primary)', 
                        fontWeight: 600, 
                        marginTop: '10px', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                      }}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {categoryBreakdown.slice(0, 4).map((item) => (
                    <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>${item.amount.toLocaleString()} ({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Recent Transactions List with Filter Tabs */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>最近交易紀錄</h3>
          
          <div style={{ display: 'flex', gap: '4px', background: 'var(--surface-inset)', padding: '3px', borderRadius: 'var(--radius-full)', border: 'none' }}>
            {(['all', 'expense', 'income'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTxFilter(f)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 600,
                  border: 'none',
                  outline: 'none',
                  background: txFilter === f ? 'var(--accent-color)' : 'transparent',
                  color: txFilter === f ? '#ffffff' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease',
                  cursor: 'pointer',
                }}
              >
                {f === 'all' ? '全部' : f === 'expense' ? '支出' : '收入'}
              </button>
            ))}
          </div>
        </div>

        {displayedTransactions.length === 0 ? (
          <div className="nordic-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            尚未有任何交易紀錄，點擊下方「＋」按鈕開始記帳！
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedTransactions.map((t) => {
              const meta = getCategoryMeta(t.category);
              const Icon = meta.icon;

              return (
                <motion.div 
                  key={t.id}
                  whileTap={{ scale: 0.985 }}
                  onClick={() => onEditTransaction(t)}
                  className="nordic-card"
                  style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: 'var(--radius-sm)', 
                    background: meta.bg,
                    color: meta.color,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Icon size={20} />
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {t.note || t.category}
                      </h4>
                      <span style={{
                        fontSize: '10.5px',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        background: 'var(--surface-inset)',
                        color: 'var(--text-secondary)',
                      }}>
                        {t.account}
                      </span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {t.category} · {t.date} {t.time}
                    </p>
                  </div>
                  
                  <div style={{ 
                    fontWeight: 700, 
                    fontSize: '15px', 
                    color: t.type === 'expense' ? 'var(--text-primary)' : '#10b981',
                    letterSpacing: '-0.01em' 
                  }}>
                    {t.type === 'expense' ? `-$${t.amount.toLocaleString()}` : `+$${t.amount.toLocaleString()}`}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
