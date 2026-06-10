"use client";

import { Pencil, Sparkles, Trash2, Undo2 } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { MailDetailModal } from "@/components/ui/MailDetailModal";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData, Submission } from "@/lib/types";

interface HistoryViewProps {
  data: AppData;
  onToggleAccepted: (id: string, accepted: boolean) => void;
  onDelete: (id: string) => void;
}

type Filter = "all" | "sent" | "accepted" | "draft";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "すべて" },
  { id: "sent", label: "送信済" },
  { id: "accepted", label: "採用" },
  { id: "draft", label: "下書き" },
];

export function HistoryView({
  data,
  onToggleAccepted,
  onDelete,
}: HistoryViewProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [viewing, setViewing] = useState<Submission | null>(null);

  const sorted = [...data.submissions]
    .filter((s) => {
      switch (filter) {
        case "sent":
          return s.status === "sent"; // 採用済みも送信済みに含む
        case "accepted":
          return s.accepted;
        case "draft":
          return s.status === "draft";
        default:
          return true;
      }
    })
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

            // 編集できるのは下書きのみ（送信済は記録として保持）
            const editHref =
              sub.status === "draft" && corner && program
                ? paths.editor(program.id, corner.id, sub.id)
                : null;

            return (
              <li key={sub.id}>
                <Card
                  className={
                    sub.accepted
                      ? "neu-card-accepted ring-1 ring-rose-300/60"
                      : ""
                  }
                >
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
                      <div className="flex shrink-0 gap-1.5">
                        <span
                          className={[
                            "neu-inset rounded-full px-3 py-1.5 text-xs font-bold",
                            sub.status === "draft"
                              ? "text-muted"
                              : "text-accent",
                          ].join(" ")}
                        >
                          {sub.status === "draft" ? "下書き" : "送信済"}
                        </span>
                        {sub.accepted && (
                          <span className="neu-inset rounded-full px-3 py-1.5 text-xs font-bold text-rose-500">
                            採用
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewing(sub)}
                      className="w-full cursor-pointer text-left touch-manipulation active:opacity-60"
                      title="タップで全文表示"
                    >
                      <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted">
                        {sub.body}
                      </p>
                    </button>

                    <div className="flex gap-2.5">
                      {sub.status === "sent" && !sub.accepted && (
                        <button
                          type="button"
                          onClick={() => onToggleAccepted(sub.id, true)}
                          className="neu-btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-success touch-manipulation"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          採用された！
                        </button>
                      )}
                      {sub.status === "sent" && sub.accepted && (
                        <button
                          type="button"
                          onClick={() => onToggleAccepted(sub.id, false)}
                          className="neu-btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-muted touch-manipulation"
                        >
                          <Undo2 className="h-3.5 w-3.5" />
                          採用を取り消す
                        </button>
                      )}
                      {editHref && (
                        <a
                          href={toHash(editHref)}
                          data-nav={editHref}
                          className="neu-btn flex flex-1 cursor-pointer items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-foreground no-underline touch-manipulation"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          編集
                        </a>
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

      {viewing && (
        <MailDetailModal
          submission={viewing}
          {...resolveMeta(viewing.cornerId)}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}
