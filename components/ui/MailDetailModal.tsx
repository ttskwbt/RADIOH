"use client";

import { X } from "lucide-react";
import type { Corner, Program, Submission } from "@/lib/types";

interface MailDetailModalProps {
  submission: Submission;
  program?: Program;
  corner?: Corner;
  onClose: () => void;
}

/** 履歴カードをタップしたときの全文表示（ボトムシート） */
export function MailDetailModal({
  submission,
  program,
  corner,
  onClose,
}: MailDetailModalProps) {
  const date = new Date(submission.createdAt).toLocaleString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/25 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="neu-raised max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-b-none rounded-t-3xl bg-background p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-faint">{date}</p>
            <h2 className="mt-0.5 font-bold text-foreground">
              {program?.title ?? "不明な番組"}
              {corner && (
                <span className="font-normal text-muted"> · {corner.name}</span>
              )}
            </h2>
            <div className="mt-2 flex gap-1.5">
              <span
                className={[
                  "neu-inset rounded-full px-3 py-1 text-xs font-bold",
                  submission.status === "draft" ? "text-muted" : "text-accent",
                ].join(" ")}
              >
                {submission.status === "draft" ? "下書き" : "送信済"}
              </span>
              {submission.accepted && (
                <span className="neu-inset rounded-full px-3 py-1 text-xs font-bold text-rose-500">
                  採用
                </span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="neu-btn flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl text-muted touch-manipulation"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-foreground">
          {submission.body}
        </p>
      </div>
    </div>
  );
}
