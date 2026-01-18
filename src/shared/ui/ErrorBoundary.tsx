import React, { Component, ReactNode } from 'react';

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
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">error</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Что-то пошло не так
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Произошла непредвиденная ошибка. Попробуйте перезагрузить страницу.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Подробности ошибки
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-medium transition-colors"
            >
              Перезагрузить страницу
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
