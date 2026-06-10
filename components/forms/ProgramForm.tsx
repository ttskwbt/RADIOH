"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
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
      <Select
        label="デフォルトプロフィール"
        value={form.profileId}
        onChange={(e) => setForm({ ...form, profileId: e.target.value })}
      >
        {data.profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name || p.realName}
          </option>
        ))}
      </Select>

      <div className="flex gap-2 pt-2">
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
            if (confirm("この番組と紐づくコーナーも削除されます。よろしいですか？")) {
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
