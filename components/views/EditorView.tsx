"use client";

import { Check, ClipboardCopy, Mail, Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  buildClipboardText,
  buildMailtoUrl,
  copyToClipboard,
  openMailer,
} from "@/lib/mail";
import type { AppData, Corner, Program, Profile, Submission } from "@/lib/types";
import { countChars, estimateLines } from "@/lib/utils";

interface EditorViewProps {
  program: Program;
  corner: Corner;
  data: AppData;
  initialBody?: string;
  submissionId?: string;
  onSave: (body: string, status: Submission["status"]) => void;
}

export function EditorView({
  program,
  corner,
  data,
  initialBody,
  submissionId,
  onSave,
}: EditorViewProps) {
  const defaultProfile =
    data.profiles.find((p) => p.id === program.profileId) ?? data.profiles[0];

  const [profileId, setProfileId] = useState(defaultProfile?.id ?? "");
  const [body, setBody] = useState(initialBody ?? corner.template);
  const [toast, setToast] = useState<string | null>(null);

  const profile = data.profiles.find((p) => p.id === profileId) as
    | Profile
    | undefined;

  const charCount = countChars(body);
  const lineEstimate = estimateLines(body);
  const charsPerLine = 28;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleMailto = () => {
    if (!profile) {
      showToast("プロフィールを選択してください");
      return;
    }
    const url = buildMailtoUrl(program, corner, profile, body);
    openMailer(url);
    onSave(body, "sent");
    showToast("メーラーを起動しました");
  };

  const handleCopy = async () => {
    if (!profile) {
      showToast("プロフィールを選択してください");
      return;
    }
    const text = buildClipboardText(program, corner, profile, body);
    const ok = await copyToClipboard(text);
    showToast(ok ? "クリップボードにコピーしました" : "コピーに失敗しました");
  };

  const handleDraft = () => {
    onSave(body, "draft");
    showToast("下書きを保存しました");
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 space-y-2 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">番組</span>
          <span className="font-medium text-zinc-100 text-right">{program.title}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">宛先</span>
          <span className="text-violet-400 text-right break-all">{program.email}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">件名</span>
          <span className="text-zinc-200 text-right">{corner.subjectLine}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-zinc-500">コーナー</span>
          <span className="text-zinc-200 text-right">{corner.name}</span>
        </div>
      </div>

      {data.profiles.length > 0 && (
        <Select
          label="ラジオネーム（プロフィール）"
          value={profileId}
          onChange={(e) => setProfileId(e.target.value)}
        >
          {data.profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name || "（名前未設定）"}
            </option>
          ))}
        </Select>
      )}

      <div className="space-y-2">
        <label className="block">
          <span className="text-xs font-medium text-zinc-400">本文</span>
          <div className="relative mt-1.5">
            <div
              className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.07]"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  transparent,
                  transparent calc(1.25rem * 2 - 1px),
                  rgb(139 92 246) calc(1.25rem * 2 - 1px),
                  rgb(139 92 246) calc(1.25rem * 2)
                )`,
              }}
              aria-hidden
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              placeholder="ここに本文を入力…"
              className="relative w-full resize-y rounded-xl border border-zinc-700/80 bg-zinc-900/90 px-3.5 py-3 text-sm leading-8 text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50"
              style={{ lineHeight: "2rem" }}
            />
          </div>
        </label>

        <div className="flex flex-wrap gap-3 text-xs text-zinc-500">
          <span>
            <strong className="text-zinc-300">{charCount}</strong> 文字
          </span>
          <span>
            約 <strong className="text-zinc-300">{lineEstimate}</strong> 行
            <span className="text-zinc-600">（1行{charsPerLine}文字目安）</span>
          </span>
        </div>

        <p className="text-[11px] text-zinc-600">
          ハガキは1行25〜30文字が目安。横線ガイドを参考にしてください。
        </p>
      </div>

      <div className="space-y-2">
        <Button fullWidth onClick={handleMailto} type="button">
          <Mail className="h-4 w-4" />
          メーラーを起動
        </Button>
        <Button fullWidth variant="secondary" onClick={handleCopy} type="button">
          <ClipboardCopy className="h-4 w-4" />
          クリップボードにコピー
        </Button>
        <Button fullWidth variant="ghost" onClick={handleDraft} type="button">
          <Save className="h-4 w-4" />
          下書き保存
          {submissionId ? "（更新）" : ""}
        </Button>
      </div>

      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-zinc-800 px-4 py-2 text-sm text-zinc-100 shadow-xl">
          <Check className="h-4 w-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
