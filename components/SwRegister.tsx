"use client";

import { useEffect } from "react";

/** PWA: Service Worker を登録（インストール可能化 + 静的アセットのキャッシュ） */
export function SwRegister() {
  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch((e) => {
      console.error("SW registration failed:", e);
    });
  }, []);

  return null;
}
