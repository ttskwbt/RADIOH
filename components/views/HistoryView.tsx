"use client";

import { Pencil, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData, SubmissionStatus } from "@/lib/types";
import { SUBMISSION_STATUS_LABELS } from "@/lib/types";

interface HistoryViewProps {
  data: AppData;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}

type Filter = "all" | SubmissionStatus;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "sent", label: "送信済" },
  { id: "accepted", label: "採用" },
  { id: "draft", label: "下書き" },
];

const STATUS_CYCLE: SubmissionStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
];

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: "text-muted",
  sent: "text-accent",
  accepted: "text-success",
  rejected: "text-danger",
};

export function HistoryView({ data, onStatusChange, onDelete }: HistoryViewProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const sorted = [...data.submissions]
    .filter((s) => filter === "all" || s.status === filter)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const resolveMeta = (cornerId: string) => {
    const corner = data.corners.find((c) => c.id === cornerId);
    const program = corner
      ? data.programs.find((p) => p.id === corner.programId)
      : undefined;
    return { corner, program };
  };

  const cycleStatus = (current: SubmissionStatus): SubmissionStatus => {
    const idx = STATUS_CYCLE.indexOf(current);
    return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={[
              "flex-1 cursor-pointer rounded-xl py-2 text-xs font-semibold touch-manipulation transition-colors",
              filter === id ? "neu-inset text-accent" : "neu-btn text-muted",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          {filter === "all"
            ? "履歴はまだ空です。メールを書くとここに残ります。"
            : "該当するメールはありません。"}
        </p>
      ) : (
        <ul className="space-y-4">
          {sorted.map((sub) => {
            const { corner, program } = resolveMeta(sub.cornerId);
            const date = new Date(sub.createdAt).toLocaleString("ja-JP", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            const editHref =
              corner && program
                ? paths.editor(program.id, corner.id, sub.id)
                : null;

            return (
              <li key={sub.id}>
                <Card>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs text-faint">{date}</p>
                        <h2 className="mt-0.5 font-semibold text-foreground">
                          {program?.title ?? "不明な番組"}
                          {corner && (
                            <span className="font-normal text-muted">
                              {" "}
                              · {corner.name}
                            </span>
                          )}
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(sub.id, cycleStatus(sub.status))
                        }
                        className={[
                          "neu-inset shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-xs font-bold touch-manipulation",
                          STATUS_COLORS[sub.status],
                        ].join(" ")}
                        title="タップでステータス変更"
                      >
                        {SUBMISSION_STATUS_LABELS[sub.status]}
                      </button>
                    </div>

                    <p className="line-clamp-3 text-sm text-muted">{sub.body}</p>

                    <div className="flex gap-2.5">
                      {sub.status === "sent" && (
                        <button
                          type="button"
                          onClick={() => onStatusChange(sub.id, "accepted")}
                          className="neu-btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-success touch-manipulation"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          採用された！
                        </button>
                      )}
                      {editHref ? (
                        <a
                          href={toHash(editHref)}
                          data-nav={editHref}
                          className="neu-btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-foreground no-underline touch-manipulation"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          編集
                        </a>
                      ) : (
                        <span className="flex flex-1 items-center justify-center py-2.5 text-xs text-faint">
                          編集不可
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("このメールを履歴から削除しますか？")) {
                            onDelete(sub.id);
                          }
                        }}
                        className="neu-btn flex cursor-pointer items-center justify-center px-3.5 py-2.5 text-danger touch-manipulation"
                        aria-label="削除"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
