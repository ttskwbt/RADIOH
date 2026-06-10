import { type KeyboardEvent, type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Card({ children, onClick, className = "" }: CardProps) {
  const base = "neu-raised w-full p-4 text-left";

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
        className={`${base} neu-btn cursor-pointer touch-manipulation ${className}`}
      >
        {children}
      </div>
    );
  }

  return <div className={`${base} ${className}`}>{children}</div>;
}
