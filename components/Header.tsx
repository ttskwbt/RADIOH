import { ArrowLeft } from "lucide-react";
import { toHash } from "@/lib/hashNav";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, backHref, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950 px-4 py-3">
      <div className="flex items-center gap-3">
        <a
          href={backHref ? toHash(backHref) : undefined}
          data-nav={backHref ?? undefined}
          data-header-back
          hidden={!backHref}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-zinc-900 text-zinc-300 no-underline transition hover:bg-zinc-800 active:scale-95 touch-manipulation"
          aria-label="戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div className="min-w-0 flex-1">
          <h1
            data-header-title
            className="truncate text-lg font-semibold text-zinc-50"
          >
            {title}
          </h1>
          <p
            data-header-subtitle
            className="truncate text-xs text-zinc-500"
            hidden={!subtitle}
          >
            {subtitle ?? ""}
          </p>
        </div>
        {action}
      </div>
    </header>
  );
}
