import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label;
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <input
        id={inputId}
        className={[
          "w-full rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
