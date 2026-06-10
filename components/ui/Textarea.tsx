import { type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export function Textarea({ label, className = "", id, ...props }: TextareaProps) {
  const inputId = id ?? label;
  return (
    <label className="block space-y-1.5" htmlFor={inputId}>
      <span className="text-xs font-medium text-zinc-400">{label}</span>
      <textarea
        id={inputId}
        className={[
          "w-full resize-y rounded-xl border border-zinc-700/80 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 min-h-[88px]",
          className,
        ].join(" ")}
        {...props}
      />
    </label>
  );
}
