import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label;
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="px-1 text-xs font-semibold text-muted">{label}</span>
      <input
        id={inputId}
        className={[
          "neu-inset w-full border-none px-4 py-3 text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent/40",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
