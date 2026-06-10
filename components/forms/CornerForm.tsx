"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Corner } from "@/lib/types";

interface CornerFormProps {
  corner: Corner;
  onSave: (corner: Corner) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export function CornerForm({
  corner,
  onSave,
  onDelete,
  onCancel,
}: CornerFormProps) {
  const [form, setForm] = useState(corner);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const subjectLine =
      form.subjectLine.trim() || `【${form.name.trim()}】`;
    onSave({ ...form, subjectLine });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input
        label="コーナー名"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="例: ふつおた"
        required
      />
      <Input
        label="件名（メールのSubject）"
        value={form.subjectLine}
        onChange={(e) => setForm({ ...form, subjectLine: e.target.value })}
        placeholder="空欄なら【コーナー名】を自動設定"
      />
      <Textarea
        label="定型文（エディタ起動時に自動入力）"
        value={form.template}
        onChange={(e) => setForm({ ...form, template: e.target.value })}
        placeholder="よく使う書き出しを入れておくと便利です"
        rows={4}
      />

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
            if (confirm("このコーナーを削除しますか？")) onDelete(form.id);
          }}
        >
          コーナーを削除
        </Button>
      )}
    </form>
  );
}
