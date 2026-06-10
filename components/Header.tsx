import { ArrowLeft } from "lucide-react";
import { toHash } from "@/lib/hashNav";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  isLogo?: boolean;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, backHref, isLogo, action }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-background/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <a
          href={backHref ? toHash(backHref) : undefined}
          data-nav={backHref ?? undefined}
          data-header-back
          hidden={!backHref}
          className="neu-btn flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-muted no-underline touch-manipulation"
          aria-label="戻る"
        >
          <ArrowLeft className="h-5 w-5" />
        </a>
        <div className="min-w-0 flex-1">
          <h1
            data-header-title
            className={[
              "truncate text-xl font-bold",
              isLogo ? "text-logo" : "text-foreground",
            ].join(" ")}
          >
            {title}
          </h1>
          <p
            data-header-subtitle
            className="truncate text-xs text-muted"
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
