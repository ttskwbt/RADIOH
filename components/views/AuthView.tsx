"use client";

import { LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export function AuthView() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || busy) return;
    setBusy(true);
    setMessage(null);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          setMessage(
            "確認メールを送信しました。メール内のリンクを開いてからログインしてください。",
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setMessage(
        msg.includes("Invalid login credentials")
          ? "メールアドレスまたはパスワードが違います"
          : msg,
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center gap-8 bg-background px-6 py-12 text-foreground">
      <div className="text-center">
        <h1 className="text-logo text-4xl">RADIOH</h1>
        <p className="mt-2 text-sm text-muted">ラジオメール投稿アシスタント</p>
      </div>

      <form onSubmit={handleSubmit} className="neu-raised space-y-5 p-6">
        <Input
          label="メールアドレス"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="パスワード（6文字以上）"
          type="password"
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {message && <p className="text-xs text-danger">{message}</p>}

        <Button type="submit" fullWidth disabled={busy}>
          {mode === "signin" ? (
            <>
              <LogIn className="h-4 w-4" />
              ログイン
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              アカウント作成
            </>
          )}
        </Button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setMessage(null);
          }}
          className="w-full cursor-pointer py-1 text-center text-xs text-muted underline touch-manipulation"
        >
          {mode === "signin"
            ? "はじめての方はこちら（アカウント作成）"
            : "アカウントをお持ちの方はこちら（ログイン）"}
        </button>
      </form>
    </div>
  );
}
