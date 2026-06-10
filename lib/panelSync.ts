import { parseHash } from "@/lib/hashNav";

/** React に依存せず、モバイルで画面パネルを切り替える */
export function applyViewPanels(): void {
  if (typeof document === "undefined") return;

  const route = parseHash(window.location.hash);

  document.querySelectorAll<HTMLElement>("[data-panel]").forEach((el) => {
    const panel = el.getAttribute("data-panel");
    if (!panel) return;
    el.hidden = panel !== route.view;
  });

  document.querySelectorAll<HTMLElement>("[data-panel-program]").forEach((el) => {
    const id = el.getAttribute("data-panel-program");
    el.hidden =
      route.view !== "program-detail" || id !== (route.programId ?? "");
  });

  document.querySelectorAll<HTMLElement>("[data-panel-editor]").forEach((el) => {
    const key = el.getAttribute("data-panel-editor");
    const expected = `${route.programId ?? ""}/${route.cornerId ?? ""}`;
    el.hidden = route.view !== "editor" || key !== expected;
  });

  const showNav = ["programs", "history", "profiles"].includes(route.view);
  document.querySelectorAll<HTMLElement>("[data-panel-nav-bar]").forEach((el) => {
    el.hidden = !showNav;
  });

  document.querySelectorAll<HTMLElement>("[data-nav-tab]").forEach((el) => {
    const tab = el.getAttribute("data-nav-tab");
    const active = tab === route.view;
    el.classList.toggle("bg-violet-600/20", active);
    el.classList.toggle("text-violet-400", active);
    el.classList.toggle("text-zinc-500", !active);
  });

  const headerTitle = document.querySelector<HTMLElement>("[data-header-title]");
  const headerSubtitle = document.querySelector<HTMLElement>(
    "[data-header-subtitle]",
  );
  if (headerTitle) {
    headerTitle.textContent = getHeaderTitle(route);
  }
  if (headerSubtitle) {
    const sub = getHeaderSubtitle(route);
    headerSubtitle.textContent = sub;
    headerSubtitle.hidden = !sub;
  }

  const backBtn = document.querySelector<HTMLElement>("[data-header-back]");
  if (backBtn) {
    const href = getBackHref(route);
    backBtn.hidden = !href;
    if (href) backBtn.setAttribute("data-nav", href);
  }
}

function getHeaderTitle(route: ReturnType<typeof parseHash>): string {
  switch (route.view) {
    case "programs":
      return "ハガキ職人";
    case "program-detail":
      return (
        document
          .querySelector(
            `[data-program-title][data-program-id="${route.programId}"]`,
          )
          ?.textContent?.trim() || "番組"
      );
    case "editor":
      return "メール作成";
    case "history":
      return "履歴・ネタ帳";
    case "profiles":
      return "プロフィール";
    case "program-form":
      return "番組";
    case "corner-form":
      return "コーナー";
    case "profile-form":
      return "プロフィール";
    default:
      return "ハガキ職人";
  }
}

function getHeaderSubtitle(route: ReturnType<typeof parseHash>): string {
  switch (route.view) {
    case "programs":
      return "ラジオ投稿アシスタント";
    case "program-detail":
      return "コーナーを選択";
    case "history":
      return "過去の投稿";
    case "profiles":
      return "ラジオネーム・連絡先";
    default:
      return "";
  }
}

function getBackHref(route: ReturnType<typeof parseHash>): string | null {
  switch (route.view) {
    case "program-detail":
      return "programs";
    case "editor":
      return route.programId ? `program/${route.programId}` : "programs";
    case "program-form":
      return route.formId && route.formId !== "new"
        ? `program/${route.formId}`
        : "programs";
    case "corner-form":
      return route.programId ? `program/${route.programId}` : "programs";
    case "profile-form":
      return "profiles";
    default:
      return null;
  }
}
