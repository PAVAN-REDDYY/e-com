import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * App-level error boundary. Catches render-time crashes so a single broken
 * component never shows the user a blank white screen. In production you would
 * also forward `error`/`info` to Sentry or similar here.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Centralised place to wire telemetry later.
    console.error('[ErrorBoundary] Uncaught error:', error, info);
  }

  private handleReset = () => {
    this.setState({ error: null });
    window.location.assign('/');
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bone px-6 text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-clay">Something broke</p>
          <h1 className="text-2xl font-semibold text-ink">This page hit an unexpected error</h1>
          <p className="max-w-md text-stone-500">
            We've logged it. Try heading back to the store — your cart is safe.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bone transition hover:bg-stone-700"
          >
            Back to store
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
