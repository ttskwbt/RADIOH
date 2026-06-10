"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import type { Profile } from "@/lib/types";

interface ProfileFormProps {
  profile: Profile;
  onSave: (profile: Profile) => void;
  onCancel: () => void;
}

export function ProfileForm({ profile, onSave, onCancel }: ProfileFormProps) {
  const [form, setForm] = useState(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-4">
      <Input
        label="ラジオネーム"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="例: 東京のタカシ"
        required
      />
      <div className="space-y-2">
        <Textarea
          label="署名（メール末尾に自動追加）"
          value={form.signature}
          onChange={(e) => setForm({ ...form, signature: e.target.value })}
          placeholder={"例:\n山田 隆\n〒100-0001 東京都千代田区…\n090-XXXX-XXXX"}
          rows={5}
        />
        <p className="px-1 text-xs text-faint">
          本名・住所・電話番号など、番組に伝えたい情報を自由な形式で書けます。
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" fullWidth>
          保存
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
