"use client";

import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { isCloudEnabled, supabase } from "@/lib/supabase";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(isCloudEnabled);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    // 別アカウントのキャッシュ表示を防ぐ
    try {
      localStorage.removeItem("radioh-data");
    } catch {
      // ignore
    }
  };

  return {
    /** クラウド未設定なら常に「準備OK」扱い（ローカルモード） */
    ready: !isCloudEnabled || session !== null,
    session,
    authLoading,
    signOut,
  };
}
