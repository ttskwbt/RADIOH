"use client";

import { useEffect, useState } from "react";

export function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative mx-auto min-h-dvh max-w-lg bg-zinc-950 text-zinc-100">
        <header className="border-b border-zinc-800/80 px-4 py-3">
          <h1 className="text-lg font-semibold text-zinc-50">ハガキ職人</h1>
          <p className="text-xs text-zinc-500">読み込み中…</p>
        </header>
      </div>
    );
  }

  return children;
}
