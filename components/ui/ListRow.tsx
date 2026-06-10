import { type ReactNode } from "react";
import { toHash } from "@/lib/hashNav";

interface ListRowProps {
  /** hashNav のパス（例: program/abc） */
  navHref: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

const rowBase =
  "flex w-full overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60";

const pressableBase =
  "block min-w-0 flex-1 cursor-pointer p-4 text-left no-underline text-inherit transition touch-manipulation hover:bg-zinc-900/80 active:bg-zinc-800/50";

export function ListRow({ navHref, children, action, className = "" }: ListRowProps) {
  return (
    <div className={`${rowBase} ${className}`}>
      <a href={toHash(navHref)} data-nav={navHref} className={pressableBase}>
        {children}
      </a>
      {action}
    </div>
  );
}
