"use client";

import { useEffect } from "react";
import { navigateTo } from "@/lib/hashNav";

/** Safari: すべての data-nav タップを navigateTo に統一（hashchange 非依存） */
export function useNavClick() {
  useEffect(() => {
    const handle = (e: Event) => {
      const target = e.target;
      if (!(target instanceof Element)) return;

      const el = target.closest<HTMLElement>("[data-nav]");
      if (!el) return;

      const path = el.getAttribute("data-nav");
      if (!path) return;

      e.preventDefault();
      navigateTo(path);
    };

    document.addEventListener("click", handle, true);

    return () => {
      document.removeEventListener("click", handle, true);
    };
  }, []);
}
