import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
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
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#090E14] border border-amber-500/30 text-white space-y-4 max-w-xl mx-auto my-6 shadow-2xl relative">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h3 className="font-serif-display text-lg font-bold">
              {this.props.fallbackTitle || 'Portal Display Recovery'}
            </h3>
          </div>
          <p className="text-xs text-sand-muted leading-relaxed">
            {this.state.error?.message || 'An unexpected rendering update occurred. Click below to refresh your session state safely.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-5 py-2.5 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 text-white font-medium text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-sunset-coral/20"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Portal State</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
