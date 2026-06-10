"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <Input
        label="ラジオネーム"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        placeholder="例: 東京のタカシ"
        required
      />
      <Input
        label="本名"
        value={form.realName}
        onChange={(e) => setForm({ ...form, realName: e.target.value })}
      />
      <Input
        label="郵便番号"
        value={form.postalCode}
        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
        placeholder="100-0001"
      />
      <Input
        label="住所"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />
      <Input
        label="電話番号"
        type="tel"
        value={form.tel}
        onChange={(e) => setForm({ ...form, tel: e.target.value })}
      />

      <div className="flex gap-2 pt-2">
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
