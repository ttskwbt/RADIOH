import { type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30",
  secondary:
    "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
  ghost: "bg-transparent hover:bg-zinc-800/80 text-zinc-300",
  danger: "bg-red-900/40 hover:bg-red-900/60 text-red-300 border border-red-800/50",
};

export function Button({
  variant = "primary",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition touch-manipulation active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none",
        variants[variant],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
