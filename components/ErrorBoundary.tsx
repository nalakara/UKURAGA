import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in application:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleClearCacheAndReset = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((reg) => reg.unregister()));
      }
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans">
          <div className="max-w-md w-full p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-2xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold">Terjadi Kendala Memuat Aplikasi</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Aplikasi mengalami kendala saat memuat data atau skrip. Anda dapat memuat ulang atau membersihkan cache.
            </p>
            {this.state.error && (
              <details className="text-left text-xs bg-slate-100 dark:bg-slate-950 p-3 rounded-lg overflow-auto max-h-32 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                <summary className="cursor-pointer font-medium text-slate-700 dark:text-slate-300">Rincian Error</summary>
                <p className="mt-2 font-mono break-all">{this.state.error.toString()}</p>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 min-h-[44px] px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-xl transition-colors"
              >
                Muat Ulang
              </button>
              <button
                type="button"
                onClick={this.handleClearCacheAndReset}
                className="flex-1 min-h-[44px] px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-xl transition-colors"
              >
                Bersihkan Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
