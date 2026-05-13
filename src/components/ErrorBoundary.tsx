import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh', 
          padding: '2rem', 
          textAlign: 'center', 
          backgroundColor: '#1C1926', 
          color: 'white',
          fontFamily: 'sans-serif'
        }}>
          <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '1.5rem' }}>
            <AlertTriangle size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Application Error</h2>
          <p style={{ color: '#94A3B8', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            {this.state.error?.message || 'An unexpected error occurred during rendering.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.75rem 2rem', 
              backgroundColor: '#7C3AED', 
              color: 'white', 
              fontWeight: 'bold', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={18} />
            Reload Page
          </button>
        </div>
      );
    }

    return this.children;
  }
}
