import { type ReactNode } from "react";
import { toHash } from "@/lib/hashNav";

interface ListRowProps {
  /** hashNav のパス（例: program/abc） */
  navHref: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

const pressableBase =
  "block min-w-0 flex-1 cursor-pointer p-4 text-left no-underline text-inherit touch-manipulation active:opacity-70 transition-opacity";

export function ListRow({
  navHref,
  children,
  action,
  className = "",
}: ListRowProps) {
  return (
    <div className={`neu-raised flex w-full overflow-hidden ${className}`}>
      <a href={toHash(navHref)} data-nav={navHref} className={pressableBase}>
        {children}
      </a>
      {action}
    </div>
  );
}
