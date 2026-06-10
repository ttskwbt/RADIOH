import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, className = "", id, children, ...props }: SelectProps) {
  const selectId = id ?? label;
  return (
    <label className="block space-y-1.5" htmlFor={selectId}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <select
        id={selectId}
        className={[
          "w-full rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
