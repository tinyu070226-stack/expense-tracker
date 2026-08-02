import { Home, PieChart, Wallet, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomTabBarProps {
  activeTab: string;
  isDarkMode?: boolean;
  onTabChange: (tab: string) => void;
  onAddClick: () => void;
}

export default function BottomTabBar({ activeTab, isDarkMode = false, onTabChange, onAddClick }: BottomTabBarProps) {
  const tabs = [
    { id: 'home', icon: Home, label: '首頁' },
    { id: 'categories', icon: PieChart, label: '分類' },
    { id: 'add', icon: Plus, label: '新增', isMain: true },
    { id: 'budget', icon: Wallet, label: '預算' },
    { id: 'settings', icon: Settings, label: '設定' },
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 'calc(76px + var(--spacing-safe-bottom))',
        paddingBottom: 'var(--spacing-safe-bottom)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8px',
        borderTopLeftRadius: 'var(--radius-lg)',
        borderTopRightRadius: 'var(--radius-lg)',
        zIndex: 40,
        // Light Mode: Pure white translucent (no gray background, no gray shadow)
        // Dark Mode: Deep polar night translucent (no light slate background, no jarring light top line)
        background: isDarkMode ? 'rgba(11, 15, 25, 0.88)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(226, 232, 240, 0.6)',
        boxShadow: isDarkMode ? '0 -6px 20px rgba(0, 0, 0, 0.35)' : '0 -4px 16px rgba(15, 23, 42, 0.03)',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isMain) {
          return (
            <div key={tab.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 4px' }}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onAddClick}
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: isDarkMode ? '#0f172a' : '#ffffff',
                  background: 'var(--accent-color)',
                  marginTop: '-28px',
                  border: 'none',
                  boxShadow: '0 8px 18px -3px rgba(2, 132, 199, 0.45)',
                  cursor: 'pointer',
                }}
              >
                <Icon size={28} />
              </motion.button>
            </div>
          );
        }

        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.92 }}
            onClick={() => onTabChange(tab.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              color: isActive ? 'var(--accent-color)' : isDarkMode ? '#94a3b8' : '#64748b',
              flex: 1,
              minWidth: 0,
              padding: '4px 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <motion.div
              animate={{ 
                scale: isActive ? 1.08 : 1,
                y: isActive ? -3 : 0
              }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: isActive ? 'rgba(2, 132, 199, 0.12)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.25s ease',
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            </motion.div>
            <span style={{ 
              fontSize: '10.5px', 
              fontWeight: isActive ? 700 : 500,
              opacity: isActive ? 1 : 0.65,
              whiteSpace: 'nowrap'
            }}>
              {tab.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
