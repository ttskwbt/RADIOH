import { type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({
  label,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  const selectId = id ?? label;
  return (
    <label className="block space-y-2" htmlFor={selectId}>
      <span className="px-1 text-xs font-semibold text-muted">{label}</span>
      <select
        id={selectId}
        className={[
          "neu-inset w-full appearance-none border-none px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40",
          className,
        ].join(" ")}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
