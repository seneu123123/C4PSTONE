import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Compass, RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('holiday_app_settings');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#070B0E] text-ivory flex items-center justify-center p-6 font-sans-body">
          <div className="max-w-md w-full bg-[#090E14] border border-white/15 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-sunset-coral/20 border border-sunset-coral/40 flex items-center justify-center text-sunset-coral">
              <Compass className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-sunset-coral">
                Holiday Travelers Inc.
              </span>
              <h2 className="font-serif-display text-2xl text-ivory font-semibold">
                Expedition Portal Recovery
              </h2>
              <p className="text-xs text-sand-muted leading-relaxed">
                The application encountered an unexpected interface event. Click below to refresh your session.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left">
                <p className="text-[10px] font-mono text-rose-300 break-words">
                  {this.state.error.message || 'Unknown runtime exception'}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-3 px-6 rounded-xl bg-sunset-coral hover:bg-sunset-coral/90 text-ivory font-medium text-xs font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-sunset-coral/20 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
