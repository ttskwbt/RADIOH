"use client";

import { useCallback, useEffect, useState } from "react";
import {
  cloudDeleteCorner,
  cloudDeleteProfile,
  cloudDeleteProgram,
  cloudDeleteSubmission,
  cloudUpsertCorner,
  cloudUpsertProfile,
  cloudUpsertProgram,
  cloudUpsertSubmission,
  fetchAllData,
} from "@/lib/cloud";
import { isCloudEnabled } from "@/lib/supabase";
import type {
  AppData,
  Corner,
  Profile,
  Program,
  Submission,
  SubmissionStatus,
} from "@/lib/types";
import { EMPTY_DATA } from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "radioh-data";
const LEGACY_STORAGE_KEY = "radiolistener-data";

interface LegacyProfile {
  id: string;
  name: string;
  realName?: string;
  postalCode?: string;
  address?: string;
  tel?: string;
  signature?: string;
}

type LegacyData = Omit<AppData, "profiles" | "programs"> & {
  profiles: LegacyProfile[];
  programs: Array<
    Omit<Program, "thumbnail" | "days"> & {
      thumbnail?: string | null;
      days?: number[];
    }
  >;
};

/** 旧「ハガキ職人」データ（住所等が個別フィールド）を署名フリーフォーマットへ変換 */
function migrateLegacy(raw: string): AppData {
  const parsed = JSON.parse(raw) as LegacyData;
  return {
    profiles: (parsed.profiles ?? []).map((p) => ({
      id: p.id,
      name: p.name,
      signature:
        p.signature ??
        [p.realName, [p.postalCode, p.address].filter(Boolean).join(" "), p.tel]
          .filter(Boolean)
          .join("\n"),
    })),
    programs: (parsed.programs ?? []).map((p) => ({
      ...p,
      thumbnail: p.thumbnail ?? null,
      days: p.days ?? [],
    })),
    corners: parsed.corners ?? [],
    submissions: parsed.submissions ?? [],
  };
}

function loadLocal(): AppData {
  if (typeof window === "undefined") return EMPTY_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // days 追加前に保存されたデータも読めるよう migrateLegacy で正規化
    if (raw) return migrateLegacy(raw);
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) return migrateLegacy(legacy);
    return EMPTY_DATA;
  } catch {
    return EMPTY_DATA;
  }
}

function saveLocal(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // プライベートブラウズ等
  }
}

/**
 * アプリデータのストア。
 * - Supabase 設定済み: クラウドが正、localStorage は起動高速化のキャッシュ
 * - 未設定: localStorage のみ（端末内保存モード）
 * @param ready ローカルモードなら常に true、クラウドモードはログイン後に true
 */
export function useRadioStore(ready: boolean) {
  const [data, setData] = useState<AppData>(EMPTY_DATA);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;

    // まずキャッシュで即表示
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load storage after mount
    setData(loadLocal());

    if (!isCloudEnabled) {
      setLoading(false);
      return;
    }

    fetchAllData()
      .then((fresh) => {
        if (cancelled) return;
        setData(fresh);
        saveLocal(fresh);
      })
      .catch((e) => {
        console.error("fetchAllData failed:", e);
        if (!cancelled) setSyncError("データの読み込みに失敗しました");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ready]);

  const sync = useCallback((op: () => Promise<void>) => {
    if (!isCloudEnabled) return;
    op().catch((e) => {
      console.error("cloud sync failed:", e);
      setSyncError("クラウド保存に失敗しました。通信環境をご確認ください");
      setTimeout(() => setSyncError(null), 4000);
    });
  }, []);

  const setDataAndSave = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      saveLocal(next);
      return next;
    });
  }, []);

  const upsertProfile = useCallback(
    (profile: Profile) => {
      setDataAndSave((prev) => {
        const exists = prev.profiles.some((p) => p.id === profile.id);
        return {
          ...prev,
          profiles: exists
            ? prev.profiles.map((p) => (p.id === profile.id ? profile : p))
            : [...prev.profiles, profile],
        };
      });
      sync(() => cloudUpsertProfile(profile));
    },
    [setDataAndSave, sync],
  );

  const deleteProfile = useCallback(
    (id: string) => {
      setDataAndSave((prev) => ({
        ...prev,
        profiles: prev.profiles.filter((p) => p.id !== id),
      }));
      sync(() => cloudDeleteProfile(id));
    },
    [setDataAndSave, sync],
  );

  const upsertProgram = useCallback(
    (program: Program) => {
      setDataAndSave((prev) => {
        const exists = prev.programs.some((p) => p.id === program.id);
        return {
          ...prev,
          programs: exists
            ? prev.programs.map((p) => (p.id === program.id ? program : p))
            : [...prev.programs, program],
        };
      });
      sync(() => cloudUpsertProgram(program));
    },
    [setDataAndSave, sync],
  );

  const deleteProgram = useCallback(
    (id: string) => {
      setDataAndSave((prev) => {
        const cornerIds = new Set(
          prev.corners.filter((c) => c.programId === id).map((c) => c.id),
        );
        return {
          ...prev,
          programs: prev.programs.filter((p) => p.id !== id),
          corners: prev.corners.filter((c) => c.programId !== id),
          submissions: prev.submissions.filter(
            (s) => !cornerIds.has(s.cornerId),
          ),
        };
      });
      sync(() => cloudDeleteProgram(id));
    },
    [setDataAndSave, sync],
  );

  const upsertCorner = useCallback(
    (corner: Corner) => {
      setDataAndSave((prev) => {
        const exists = prev.corners.some((c) => c.id === corner.id);
        return {
          ...prev,
          corners: exists
            ? prev.corners.map((c) => (c.id === corner.id ? corner : c))
            : [...prev.corners, corner],
        };
      });
      sync(() => cloudUpsertCorner(corner));
    },
    [setDataAndSave, sync],
  );

  const deleteCorner = useCallback(
    (id: string) => {
      setDataAndSave((prev) => ({
        ...prev,
        corners: prev.corners.filter((c) => c.id !== id),
        submissions: prev.submissions.filter((s) => s.cornerId !== id),
      }));
      sync(() => cloudDeleteCorner(id));
    },
    [setDataAndSave, sync],
  );

  const upsertSubmission = useCallback(
    (submission: Submission) => {
      setDataAndSave((prev) => {
        const exists = prev.submissions.some((s) => s.id === submission.id);
        return {
          ...prev,
          submissions: exists
            ? prev.submissions.map((s) =>
                s.id === submission.id ? submission : s,
              )
            : [...prev.submissions, submission],
        };
      });
      sync(() => cloudUpsertSubmission(submission));
    },
    [setDataAndSave, sync],
  );

  const updateSubmissionStatus = useCallback(
    (id: string, status: SubmissionStatus) => {
      const target = data.submissions.find((s) => s.id === id);
      if (!target) return;
      upsertSubmission({ ...target, status });
    },
    [data.submissions, upsertSubmission],
  );

  const deleteSubmission = useCallback(
    (id: string) => {
      setDataAndSave((prev) => ({
        ...prev,
        submissions: prev.submissions.filter((s) => s.id !== id),
      }));
      sync(() => cloudDeleteSubmission(id));
    },
    [setDataAndSave, sync],
  );

  const createEmptyProfile = (): Profile => ({
    id: generateId(),
    name: "",
    signature: "",
  });

  const createEmptyProgram = (profileId: string): Program => ({
    id: generateId(),
    title: "",
    email: "",
    thumbnail: null,
    days: [],
    profileId,
  });

  const createEmptyCorner = (programId: string): Corner => ({
    id: generateId(),
    programId,
    name: "",
    subjectLine: "",
    template: "",
  });

  const createSubmission = (
    cornerId: string,
    body: string,
    status: SubmissionStatus = "draft",
  ): Submission => ({
    id: generateId(),
    cornerId,
    body,
    status,
    createdAt: new Date().toISOString(),
  });

  return {
    data,
    loading,
    syncError,
    upsertProfile,
    deleteProfile,
    upsertProgram,
    deleteProgram,
    upsertCorner,
    deleteCorner,
    upsertSubmission,
    updateSubmissionStatus,
    deleteSubmission,
    createEmptyProfile,
    createEmptyProgram,
    createEmptyCorner,
    createSubmission,
  };
}
