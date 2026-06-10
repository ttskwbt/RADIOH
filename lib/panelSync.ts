import { parseHash } from "@/lib/hashNav";

const NAV_VIEWS = ["programs", "history", "stats", "profiles"];

let lastAppliedHash: string | null = null;

/** React に依存せず、モバイルで画面パネルを切り替える */
export function applyViewPanels(): void {
  if (typeof document === "undefined") return;

  const route = parseHash(window.location.hash);

  // 画面遷移時はスクロールを先頭へ（パネル切替なので位置が持ち越されてしまう）
  // データ更新等による再適用（ハッシュ不変）ではスクロールしない
  const currentHash = window.location.hash;
  if (lastAppliedHash !== null && lastAppliedHash !== currentHash) {
    window.scrollTo(0, 0);
  }
  lastAppliedHash = currentHash;

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

  const showNav = NAV_VIEWS.includes(route.view);
  document.querySelectorAll<HTMLElement>("[data-panel-nav-bar]").forEach((el) => {
    el.hidden = !showNav;
  });

  document.querySelectorAll<HTMLElement>("[data-nav-tab]").forEach((el) => {
    const tab = el.getAttribute("data-nav-tab");
    const active = tab === route.view;
    el.classList.toggle("neu-inset", active);
    el.classList.toggle("text-accent", active);
    el.classList.toggle("text-muted", !active);
  });

  const headerTitle = document.querySelector<HTMLElement>("[data-header-title]");
  const headerSubtitle = document.querySelector<HTMLElement>(
    "[data-header-subtitle]",
  );
  if (headerTitle) {
    headerTitle.textContent = getHeaderTitle(route);
    const isLogo = route.view === "programs";
    headerTitle.classList.toggle("text-logo", isLogo);
    headerTitle.classList.toggle("text-foreground", !isLogo);
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
      return "RADIOH";
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
      return "送信履歴";
    case "stats":
      return "採用実績";
    case "profiles":
      return "プロフィール";
    case "program-form":
      return "番組";
    case "corner-form":
      return "コーナー";
    case "profile-form":
      return "プロフィール";
    default:
      return "RADIOH";
  }
}

function getHeaderSubtitle(route: ReturnType<typeof parseHash>): string {
  switch (route.view) {
    case "programs":
      return "ラジオメール投稿アシスタント";
    case "program-detail":
      return "コーナーを選択";
    case "history":
      return "送ったメール・下書き";
    case "stats":
      return "採用されたメール";
    case "profiles":
      return "ラジオネーム・署名";
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
