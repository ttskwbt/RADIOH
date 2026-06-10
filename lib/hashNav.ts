import { applyViewPanels } from "@/lib/panelSync";
import type { View } from "@/lib/types";

export interface AppRoute {
  view: View;
  programId: string | null;
  cornerId: string | null;
  submissionId: string | null;
  formId: string | null;
}

const hashListeners = new Set<() => void>();

function onWindowHashEvent(): void {
  emitHashChange();
}

/** React / モバイル向け: ハッシュ変更を購読者に通知 + DOM パネル切替 */
export function emitHashChange(): void {
  applyViewPanels();
  hashListeners.forEach((listener) => listener());
}

export function subscribeHash(callback: () => void): () => void {
  hashListeners.add(callback);

  let lastHash = getHashSnapshot();
  let pollId: ReturnType<typeof setInterval> | undefined;

  if (typeof window !== "undefined") {
    window.addEventListener("hashchange", onWindowHashEvent);
    window.addEventListener("popstate", onWindowHashEvent);
    window.addEventListener("pageshow", onWindowHashEvent);

    // モバイル: URL だけ変わり hashchange が来ない場合の保険
    pollId = setInterval(() => {
      const current = getHashSnapshot();
      if (current !== lastHash) {
        lastHash = current;
        emitHashChange();
      }
    }, 120);
  }

  return () => {
    hashListeners.delete(callback);
    if (pollId) clearInterval(pollId);
    if (typeof window !== "undefined") {
      window.removeEventListener("hashchange", onWindowHashEvent);
      window.removeEventListener("popstate", onWindowHashEvent);
      window.removeEventListener("pageshow", onWindowHashEvent);
    }
  };
}

export function getHashSnapshot(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash;
}

export const paths = {
  programs: () => "programs",
  history: () => "history",
  stats: () => "stats",
  profiles: () => "profiles",
  program: (programId: string) => `program/${programId}`,
  editor: (programId: string, cornerId: string, submissionId?: string) =>
    submissionId
      ? `editor/${programId}/${cornerId}/${submissionId}`
      : `editor/${programId}/${cornerId}`,
  programFormNew: () => "program-form/new",
  programFormEdit: (id: string) => `program-form/${id}`,
  cornerFormNew: (programId: string) => `corner-form/${programId}/new`,
  cornerFormEdit: (programId: string, cornerId: string) =>
    `corner-form/${programId}/${cornerId}`,
  profileFormNew: () => "profile-form/new",
  profileFormEdit: (id: string) => `profile-form/${id}`,
};

export function parseHash(hash: string): AppRoute {
  const raw = hash.replace(/^#\/?/, "").trim() || paths.programs();
  const parts = raw.split("/").filter(Boolean);
  const [head, a, b, c] = parts;

  const empty: AppRoute = {
    view: "programs",
    programId: null,
    cornerId: null,
    submissionId: null,
    formId: null,
  };

  switch (head) {
    case "programs":
      return { ...empty, view: "programs" };
    case "history":
      return { ...empty, view: "history" };
    case "stats":
      return { ...empty, view: "stats" };
    case "profiles":
      return { ...empty, view: "profiles" };
    case "program":
      return { ...empty, view: "program-detail", programId: a ?? null };
    case "editor":
      return {
        ...empty,
        view: "editor",
        programId: a ?? null,
        cornerId: b ?? null,
        submissionId: c ?? null,
      };
    case "program-form":
      return { ...empty, view: "program-form", formId: a ?? "new" };
    case "corner-form":
      return {
        ...empty,
        view: "corner-form",
        programId: a ?? null,
        formId: b ?? "new",
      };
    case "profile-form":
      return { ...empty, view: "profile-form", formId: a ?? "new" };
    default:
      return empty;
  }
}

export function toHash(path: string): string {
  return `#${path.replace(/^#\/?/, "")}`;
}

export function navigateTo(path: string): void {
  if (typeof window === "undefined") return;

  const clean = path.replace(/^#\/?/, "");
  const next = `#${clean}`;

  if (window.location.hash !== next) {
    window.location.hash = clean;
  }

  // iOS Safari は hashchange を発火しないことがあるため常に通知
  emitHashChange();
  queueMicrotask(() => emitHashChange());
}
