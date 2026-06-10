"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgramThumb } from "@/components/ui/ProgramThumb";
import { Select } from "@/components/ui/Select";
import { fileToThumbnail } from "@/lib/image";
import type { AppData, Program } from "@/lib/types";

interface ProgramFormProps {
  data: AppData;
  program: Program;
  onSave: (program: Program) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export function ProgramForm({
  data,
  program,
  onSave,
  onDelete,
  onCancel,
}: ProgramFormProps) {
  const [form, setForm] = useState(program);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.email.trim()) return;
    onSave(form);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const thumbnail = await fileToThumbnail(file);
      setForm((prev) => ({ ...prev, thumbnail }));
    } catch {
      alert("画像の読み込みに失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      <div className="space-y-2">
        <span className="px-1 text-xs font-semibold text-muted">サムネイル</span>
        <div className="flex items-center gap-4">
          <ProgramThumb title={form.title} thumbnail={form.thumbnail} size="lg" />
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="neu-btn flex cursor-pointer items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-accent touch-manipulation"
            >
              <ImagePlus className="h-3.5 w-3.5" />
              画像を選択
            </button>
            {form.thumbnail && (
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, thumbnail: null }))}
                className="neu-btn flex cursor-pointer items-center px-3 py-2.5 text-muted touch-manipulation"
                aria-label="サムネイルを削除"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </div>
      </div>

      <Input
        label="番組名"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        placeholder="例: オールナイトニッポン"
        required
      />
      <Input
        label="宛先メールアドレス"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="ann@example-radio.jp"
        required
      />
      {data.profiles.length > 0 && (
        <Select
          label="デフォルトプロフィール"
          value={form.profileId}
          onChange={(e) => setForm({ ...form, profileId: e.target.value })}
        >
          {data.profiles.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name || "（名前未設定）"}
            </option>
          ))}
        </Select>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" fullWidth>
          保存
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>

      {onDelete && (
        <Button
          type="button"
          variant="danger"
          fullWidth
          onClick={() => {
            if (
              confirm("この番組と紐づくコーナーも削除されます。よろしいですか？")
            ) {
              onDelete(form.id);
            }
          }}
        >
          番組を削除
        </Button>
      )}
    </form>
  );
}
