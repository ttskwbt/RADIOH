"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-zinc-950 p-6 text-center text-zinc-100">
          <p className="text-lg font-semibold">読み込みエラー</p>
          <p className="text-sm text-zinc-400">
            ページを再読み込みしてください。
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-medium touch-manipulation"
          >
            再読み込み
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
