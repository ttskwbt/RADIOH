"use client";

import { useCallback, useEffect, useState } from "react";
import { SEED_DATA } from "@/lib/seed";
import type {
  AppData,
  Corner,
  Profile,
  Program,
  Submission,
  SubmissionStatus,
} from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "radiolistener-data";

function loadData(): AppData {
  if (typeof window === "undefined") return SEED_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_DATA;
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.profiles?.length || !parsed.programs?.length) {
      return SEED_DATA;
    }
    return parsed;
  } catch {
    return SEED_DATA;
  }
}

function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // プライベートブラウズ等
  }
}

export function useRadioStore() {
  const [data, setData] = useState<AppData>(SEED_DATA);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load localStorage after mount
    setData(loadData());
  }, []);

  const setDataAndSave = useCallback((updater: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const resetToSeed = useCallback(() => {
    setData(SEED_DATA);
    saveData(SEED_DATA);
  }, []);

  const upsertProfile = useCallback((profile: Profile) => {
    setDataAndSave((prev) => {
      const exists = prev.profiles.some((p) => p.id === profile.id);
      return {
        ...prev,
        profiles: exists
          ? prev.profiles.map((p) => (p.id === profile.id ? profile : p))
          : [...prev.profiles, profile],
      };
    });
  }, [setDataAndSave]);

  const deleteProfile = useCallback((id: string) => {
    setDataAndSave((prev) => ({
      ...prev,
      profiles: prev.profiles.filter((p) => p.id !== id),
    }));
  }, [setDataAndSave]);

  const upsertProgram = useCallback((program: Program) => {
    setDataAndSave((prev) => {
      const exists = prev.programs.some((p) => p.id === program.id);
      return {
        ...prev,
        programs: exists
          ? prev.programs.map((p) => (p.id === program.id ? program : p))
          : [...prev.programs, program],
      };
    });
  }, [setDataAndSave]);

  const deleteProgram = useCallback((id: string) => {
    setDataAndSave((prev) => {
      const cornerIds = new Set(
        prev.corners.filter((c) => c.programId === id).map((c) => c.id),
      );
      return {
        ...prev,
        programs: prev.programs.filter((p) => p.id !== id),
        corners: prev.corners.filter((c) => c.programId !== id),
        submissions: prev.submissions.filter((s) => !cornerIds.has(s.cornerId)),
      };
    });
  }, [setDataAndSave]);

  const upsertCorner = useCallback((corner: Corner) => {
    setDataAndSave((prev) => {
      const exists = prev.corners.some((c) => c.id === corner.id);
      return {
        ...prev,
        corners: exists
          ? prev.corners.map((c) => (c.id === corner.id ? corner : c))
          : [...prev.corners, corner],
      };
    });
  }, [setDataAndSave]);

  const deleteCorner = useCallback((id: string) => {
    setDataAndSave((prev) => ({
      ...prev,
      corners: prev.corners.filter((c) => c.id !== id),
      submissions: prev.submissions.filter((s) => s.cornerId !== id),
    }));
  }, [setDataAndSave]);

  const upsertSubmission = useCallback((submission: Submission) => {
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
  }, [setDataAndSave]);

  const updateSubmissionStatus = useCallback(
    (id: string, status: SubmissionStatus) => {
      setDataAndSave((prev) => ({
        ...prev,
        submissions: prev.submissions.map((s) =>
          s.id === id ? { ...s, status } : s,
        ),
      }));
    },
    [setDataAndSave],
  );

  const deleteSubmission = useCallback((id: string) => {
    setDataAndSave((prev) => ({
      ...prev,
      submissions: prev.submissions.filter((s) => s.id !== id),
    }));
  }, [setDataAndSave]);

  const createEmptyProfile = (): Profile => ({
    id: generateId(),
    name: "",
    realName: "",
    postalCode: "",
    address: "",
    tel: "",
  });

  const createEmptyProgram = (profileId: string): Program => ({
    id: generateId(),
    title: "",
    email: "",
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
    resetToSeed,
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
