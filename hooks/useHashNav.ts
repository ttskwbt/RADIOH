"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  getHashSnapshot,
  navigateTo,
  parseHash,
  subscribeHash,
} from "@/lib/hashNav";

export function useHashNav() {
  const hash = useSyncExternalStore(
    subscribeHash,
    getHashSnapshot,
    () => "",
  );

  const route = parseHash(hash);

  const navigate = useCallback((path: string) => {
    navigateTo(path);
  }, []);

  return { route, navigate, hash };
}
