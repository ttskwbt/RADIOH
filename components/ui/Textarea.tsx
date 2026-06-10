import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className = "", id, ...props }: TextareaProps) {
  const inputId = id ?? label;
  return (
    <label className="block space-y-2" htmlFor={inputId}>
      <span className="px-1 text-xs font-semibold text-muted">{label}</span>
      <textarea
        id={inputId}
        className={[
          "neu-inset min-h-[88px] w-full resize-y border-none px-4 py-3 text-sm text-foreground placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-accent/40",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
