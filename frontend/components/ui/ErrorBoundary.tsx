'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Granular Component Error Catch:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-red-50/70 border border-red-200 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-red-700 font-bold text-sm">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{this.props.fallbackTitle || 'Component Failed to Load'}</span>
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            This widget encountered an isolated issue. The rest of the page remains active.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Retry Component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
