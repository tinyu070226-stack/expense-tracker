import { Component, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: unknown) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '32px 24px',
          textAlign: 'center',
          fontFamily: 'sans-serif',
          color: '#0f172a',
          marginTop: '60px',
        }}>
          <h2>系統載入異常</h2>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '12px 0 24px' }}>
            {this.state.error?.message || '發生未知的渲染錯誤'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '12px 24px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '15px',
              cursor: 'pointer',
            }}
          >
            重置暫存並重新載入
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
