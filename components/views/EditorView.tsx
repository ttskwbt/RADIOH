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
import { countChars } from "@/lib/utils";

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

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const handleMailto = () => {
    if (!profile) {
      showToast("プロフィールを登録してください");
      return;
    }
    const url = buildMailtoUrl(program, corner, profile, body);
    openMailer(url);
    onSave(body, "sent");
    showToast("メーラーを起動しました");
  };

  const handleCopy = async () => {
    if (!profile) {
      showToast("プロフィールを登録してください");
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
    <div className="flex flex-col gap-5 p-4 pb-8">
      <div className="neu-raised space-y-2.5 p-4 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted">番組</span>
          <span className="text-right font-semibold text-foreground">
            {program.title}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">宛先</span>
          <span className="break-all text-right text-accent">{program.email}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">件名</span>
          <span className="text-right text-foreground">{corner.subjectLine}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted">コーナー</span>
          <span className="text-right text-foreground">{corner.name}</span>
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
        <label className="block space-y-2">
          <span className="px-1 text-xs font-semibold text-muted">本文</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="ここに本文を入力…"
            className="neu-inset w-full resize-y border-none px-4 py-3 text-sm leading-7 text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
        </label>

        <p className="px-1 text-xs text-muted">
          <strong className="text-foreground">{charCount}</strong> 文字 ·
          冒頭にラジオネーム、末尾に署名が自動で付きます
        </p>
      </div>

      <div className="space-y-3">
        <Button fullWidth onClick={handleMailto} type="button">
          <Mail className="h-4 w-4" />
          メーラーを起動して送信
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
        <div className="neu-raised fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5 text-sm text-foreground">
          <Check className="h-4 w-4 text-success" />
          {toast}
        </div>
      )}
    </div>
  );
}
