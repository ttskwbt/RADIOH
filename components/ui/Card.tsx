import { type KeyboardEvent, type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({ children, onClick, className = "" }: CardProps) {
  const base =
    "w-full rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 text-left transition";

  if (onClick) {
    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        className={`${base} cursor-pointer hover:border-violet-600/50 hover:bg-zinc-900 active:scale-[0.99] touch-manipulation ${className}`}
      >
        {children}
      </div>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
