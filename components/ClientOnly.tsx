"use client";

import { useEffect, useState } from "react";

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- SSR と初回描画を分けるための定石
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative mx-auto min-h-dvh max-w-lg bg-background text-foreground">
        <header className="px-4 py-4">
          <h1 className="text-logo text-xl">RADIOH</h1>
          <p className="text-xs text-muted">読み込み中…</p>
        </header>
      </div>
    );
  }

  return children;
}
