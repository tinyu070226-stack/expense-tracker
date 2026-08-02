import { motion } from 'framer-motion';

interface FloatingTotalProps {
  amount: number;
  isDarkMode?: boolean;
  onClick?: () => void;
}

export default function FloatingTotal({ amount, isDarkMode = false, onClick }: FloatingTotalProps) {
  return (
    <>
      {/* Stage 1: Ultra-Dense Outer Gaussian Blur Diffusion Layer (60px Gaussian Kernel) */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(16px + var(--spacing-safe-bottom))',
          left: 0,
          right: 0,
          margin: '0 auto',
          width: '100%',
          maxWidth: '600px',
          height: '180px',
          zIndex: 33,
          pointerEvents: 'none',
          backdropFilter: 'blur(60px)', // Ultra-dense Gaussian Blur
          WebkitBackdropFilter: 'blur(60px)',
          maskImage: 'radial-gradient(ellipse 95% 65% at 50% 62%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.05) 82%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 95% 65% at 50% 62%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 35%, rgba(0,0,0,0.35) 60%, rgba(0,0,0,0.05) 82%, rgba(0,0,0,0) 100%)',
          background: isDarkMode
            ? 'radial-gradient(ellipse 90% 60% at 50% 62%, rgba(11, 15, 25, 0.65) 0%, rgba(11, 15, 25, 0) 80%)'
            : 'radial-gradient(ellipse 90% 60% at 50% 62%, rgba(248, 250, 252, 0.7) 0%, rgba(248, 250, 252, 0) 80%)',
          transition: 'background 0.35s ease',
        }}
      />

      {/* Stage 2: Inner Core Gaussian Density Focus Layer (35px Focus Kernel) */}
      <div
        style={{
          position: 'fixed',
          bottom: 'calc(32px + var(--spacing-safe-bottom))',
          left: 0,
          right: 0,
          margin: '0 auto',
          width: '100%',
          maxWidth: '500px',
          height: '120px',
          zIndex: 34,
          pointerEvents: 'none',
          backdropFilter: 'blur(35px)',
          WebkitBackdropFilter: 'blur(35px)',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 60%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 60%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Main Floating Total Trapezoid Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileTap={{ scale: 0.99 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        onClick={onClick}
        style={{
          position: 'fixed',
          bottom: 'calc(74px + var(--spacing-safe-bottom))',
          left: 0,
          right: 0,
          margin: '0 auto',
          width: 'calc(100% - 48px)',
          maxWidth: '430px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 35,
          cursor: 'pointer',
          pointerEvents: 'auto',
        }}
      >
        {/* Absolute SVG Rounded Trapezoid Background */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 400 40"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'visible',
            filter: isDarkMode 
              ? 'drop-shadow(0px -4px 18px rgba(0, 0, 0, 0.6))' 
              : 'drop-shadow(0px -4px 14px rgba(15, 23, 42, 0.15))',
          }}
        >
          <path
            // Top edge x=14..386, height 40px, rounded bezier top corners
            d="M 14 0 L 386 0 Q 394 0 396 9 L 400 40 L 0 40 L 4 9 Q 6 0 14 0 Z"
            // In Dark Mode: Light background (淺色底深色字)
            // In Light Mode: Dark background (深色底淺色字)
            fill={isDarkMode ? 'rgba(248, 250, 252, 0.97)' : 'rgba(15, 23, 42, 0.95)'}
            stroke={isDarkMode ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.18)'}
            strokeWidth="1.2"
            style={{
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              transition: 'fill 0.35s ease, stroke 0.35s ease',
            }}
          />
        </svg>

        {/* Foreground Content inside Trapezoid Bar */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '9px',
          width: '100%',
          height: '100%',
          padding: 0,
        }}>
          <span style={{ 
            fontSize: '12px', 
            color: isDarkMode ? '#475569' : '#94a3b8', 
            fontWeight: 600,
            letterSpacing: '0.02em',
            transition: 'color 0.35s ease',
            lineHeight: 1,
          }}>
            總額 🔍
          </span>
          <span style={{ 
            fontSize: '16.5px', 
            fontWeight: 800, 
            color: isDarkMode ? '#0f172a' : '#ffffff',
            letterSpacing: '-0.02em',
            transition: 'color 0.35s ease',
            lineHeight: 1,
          }}>
            $ {amount.toLocaleString()}
          </span>
          <span style={{ 
            fontSize: '10.5px', 
            color: isDarkMode ? '#0284c7' : '#38bdf8', 
            fontWeight: 600,
            opacity: 0.9,
            transition: 'color 0.35s ease',
            lineHeight: 1,
          }}>
            (點擊查看明細)
          </span>
        </div>
      </motion.div>
    </>
  );
}
