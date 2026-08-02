import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Sun, Moon } from 'lucide-react';
import Dashboard from './views/Dashboard';
import CategoriesView from './views/CategoriesView';
import CategoryEditModal from './views/CategoryEditModal';
import TransactionModal from './views/TransactionModal';
import TotalBreakdownModal from './components/modals/TotalBreakdownModal';
import BudgetView from './views/BudgetView';
import BudgetEditModal from './views/BudgetEditModal';
import BottomTabBar from './components/layout/BottomTabBar';
import FloatingTotal from './components/layout/FloatingTotal';
import { useTransactions } from './hooks/useTransactions';
import { useCategories } from './hooks/useCategories';
import { useBudget } from './hooks/useBudget';
import type { Transaction, CategoryItem } from './types';

const DARKMODE_KEY = 'nordic_expense_app_darkmode';

function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem(DARKMODE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  
  // Transaction Modal State
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Total Breakdown Modal State
  const [isTotalBreakdownOpen, setIsTotalBreakdownOpen] = useState(false);

  // Category Edit Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Budget Edit Modal State
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Transaction Data & Session Reset Hook
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetSessionTotal,
    sessionTotalExpense,
    monthlyBalance,
    monthlyExpense,
    weeklyExpense,
    dailyExpense,
  } = useTransactions();

  // Category Data
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  // Budget Data
  const {
    budgetSettings,
    updateAllBudgets,
  } = useBudget();

  // Dark Mode side effects & persistence
  useEffect(() => {
    try {
      localStorage.setItem(DARKMODE_KEY, isDarkMode.toString());
    } catch (e) {
      console.error('Failed to save dark mode setting', e);
    }

    if (isDarkMode) {
      document.body.classList.add('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0b0f19');
    } else {
      document.body.classList.remove('dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#f8fafc');
    }
  }, [isDarkMode]);

  const handleOpenAddTxModal = () => {
    setEditingTransaction(null);
    setIsTxModalOpen(true);
  };

  const handleOpenEditTxModal = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsTxModalOpen(true);
  };

  const handleOpenAddCatModal = () => {
    setEditingCategory(null);
    setIsCatModalOpen(true);
  };

  const handleOpenEditCatModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setIsCatModalOpen(true);
  };

  const handleSelectTheme = (dark: boolean) => {
    // 1. Trigger horizontal left-sliding exit motion immediately
    setIsThemeOpen(false);
    
    // 2. Change dark mode state smoothly near the end of exit animation
    setTimeout(() => {
      setIsDarkMode(dark);
    }, 180);
  };

  return (
    <div className="app-container" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: 'calc(105px + var(--spacing-safe-bottom))',
      position: 'relative'
    }}>
      {/* Top Header with Horizontal Left-Unfolding Theme Handle */}
      <header style={{
        padding: 'calc(10px + env(safe-area-inset-top, 0px)) 20px 8px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          {/* Horizontal Theme Menu Box [ 淺色 | 深色 ] Unfolding to Left */}
          <AnimatePresence>
            {isThemeOpen && (
              <motion.div
                initial={{ opacity: 0, x: 14, scale: 0.88, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ 
                  opacity: 0, 
                  x: 14, 
                  scale: 0.82, 
                  filter: 'blur(8px)',
                  transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } 
                }}
                transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                className="glass-panel"
                style={{
                  position: 'absolute',
                  right: '38px',
                  padding: '5px 8px',
                  borderRadius: 'var(--radius-full)',
                  display: 'flex',
                  gap: '4px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                  zIndex: 55,
                  whiteSpace: 'nowrap',
                  transformOrigin: 'right center',
                }}
              >
                <button
                  onClick={() => handleSelectTheme(false)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: !isDarkMode ? 'var(--accent-color)' : 'transparent',
                    color: !isDarkMode ? '#ffffff' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <Sun size={13.5} /> 淺色
                </button>
                <button
                  onClick={() => handleSelectTheme(true)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '12px',
                    fontWeight: 600,
                    background: isDarkMode ? 'var(--accent-color)' : 'transparent',
                    color: isDarkMode ? '#ffffff' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    cursor: 'pointer',
                  }}
                >
                  <Moon size={13.5} /> 深色
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal Chevron '<' Handle Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsThemeOpen(!isThemeOpen)}
            className="nordic-card"
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              boxShadow: 'var(--card-shadow)',
              cursor: 'pointer',
              zIndex: 56,
            }}
            title="切換主題模式"
          >
            <motion.div
              animate={{ rotate: isThemeOpen ? 180 : 0 }}
              transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={17} />
            </motion.div>
          </motion.button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '0 20px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <Dashboard 
                transactions={transactions}
                categoriesList={categories}
                monthlyBalance={monthlyBalance}
                monthlyExpense={monthlyExpense}
                weeklyExpense={weeklyExpense}
                dailyExpense={dailyExpense}
                onEditTransaction={handleOpenEditTxModal}
              />
            </motion.div>
          )}

          {activeTab === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <CategoriesView 
                categories={categories}
                onAddCategory={handleOpenAddCatModal}
                onEditCategory={handleOpenEditCatModal}
              />
            </motion.div>
          )}

          {activeTab === 'budget' && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
            >
              <BudgetView 
                budgetSettings={budgetSettings}
                transactions={transactions}
                categoriesList={categories}
                onOpenEditModal={() => setIsBudgetModalOpen(true)}
              />
            </motion.div>
          )}
          
          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: 'easeOut' }}
              className="nordic-card"
              style={{ padding: '32px 20px', textAlign: 'center', marginTop: '40px' }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>⚙️ 設定與偏好</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px' }}>個人手機記帳 App (Nordique-Clean iOS PWA)</p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Total UI connected to bottom bar */}
      <FloatingTotal 
        amount={sessionTotalExpense} 
        isDarkMode={isDarkMode} 
        onClick={() => setIsTotalBreakdownOpen(true)}
      />

      {/* Bottom Tab Bar with explicit isDarkMode props */}
      <BottomTabBar 
        activeTab={activeTab}
        isDarkMode={isDarkMode} 
        onTabChange={setActiveTab} 
        onAddClick={handleOpenAddTxModal} 
      />

      {/* Total Breakdown Modal */}
      <AnimatePresence>
        {isTotalBreakdownOpen && (
          <TotalBreakdownModal 
            onClose={() => setIsTotalBreakdownOpen(false)}
            transactions={transactions}
            sessionTotalExpense={sessionTotalExpense}
            onResetSessionTotal={resetSessionTotal}
            onEditTransaction={handleOpenEditTxModal}
          />
        )}
      </AnimatePresence>

      {/* Transaction Modal (Add / Edit / Delete) */}
      <AnimatePresence>
        {isTxModalOpen && (
          <TransactionModal 
            categoriesList={categories}
            initialTransaction={editingTransaction}
            onClose={() => setIsTxModalOpen(false)}
            onSave={addTransaction}
            onUpdate={updateTransaction}
            onDelete={deleteTransaction}
          />
        )}
      </AnimatePresence>

      {/* Category Edit Modal */}
      <AnimatePresence>
        {isCatModalOpen && (
          <CategoryEditModal 
            initialCategory={editingCategory}
            onClose={() => setIsCatModalOpen(false)}
            onSave={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategory}
          />
        )}
      </AnimatePresence>

      {/* Budget Edit Modal */}
      <AnimatePresence>
        {isBudgetModalOpen && (
          <BudgetEditModal 
            budgetSettings={budgetSettings}
            categoriesList={categories}
            onClose={() => setIsBudgetModalOpen(false)}
            onSaveBudgets={updateAllBudgets}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
