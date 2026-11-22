import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props { children: ReactNode }
interface State { error: Error | null }

/** Shows a readable message instead of a blank page if something crashes while rendering. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State { return { error }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ToolNest render error:', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div role="alert" className="mx-auto max-w-xl py-16 text-center">
        <h1 className="text-2xl font-bold text-navy dark:text-white">Something went wrong</h1>
        <p className="mt-2 text-muted">This page could not be displayed. Reloading usually fixes it.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button type="button" className="btn-primary" onClick={() => window.location.reload()}>Reload page</button>
          <a className="btn-secondary" href="/">Go to homepage</a>
        </div>
        <p className="mt-6 break-words rounded-lg bg-surface p-3 text-left font-mono text-xs text-muted dark:bg-slate-800">{error.message}</p>
      </div>
    );
  }
}
