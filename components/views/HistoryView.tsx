import { Pencil, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData, SubmissionStatus } from "@/lib/types";
import { SUBMISSION_STATUS_LABELS } from "@/lib/types";

interface HistoryViewProps {
  data: AppData;
  onStatusChange: (id: string, status: SubmissionStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_CYCLE: SubmissionStatus[] = [
  "draft",
  "sent",
  "accepted",
  "rejected",
];

const STATUS_COLORS: Record<SubmissionStatus, string> = {
  draft: "bg-zinc-700 text-zinc-300",
  sent: "bg-blue-900/50 text-blue-300",
  accepted: "bg-emerald-900/50 text-emerald-300",
  rejected: "bg-red-900/40 text-red-300",
};

export function HistoryView({ data, onStatusChange, onDelete }: HistoryViewProps) {
  const sorted = [...data.submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

  if (sorted.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-zinc-500">
        履歴・ネタ帳はまだ空です。メールを書くとここに残ります。
      </p>
    );
  }

  return (
    <ul className="space-y-3 p-4">
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
                    <p className="text-xs text-zinc-500">{date}</p>
                    <h2 className="mt-0.5 font-medium text-zinc-100">
                      {program?.title ?? "不明な番組"}
                      {corner && (
                        <span className="text-zinc-500"> · {corner.name}</span>
                      )}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      onStatusChange(sub.id, cycleStatus(sub.status))
                    }
                    className={[
                      "shrink-0 cursor-pointer rounded-full px-2.5 py-1 text-xs font-medium transition touch-manipulation active:scale-95",
                      STATUS_COLORS[sub.status],
                    ].join(" ")}
                    title="タップでステータス変更"
                  >
                    {SUBMISSION_STATUS_LABELS[sub.status]}
                  </button>
                </div>

                <p className="line-clamp-3 text-sm text-zinc-400">{sub.body}</p>

                <div className="flex gap-2">
                  {editHref ? (
                    <a
                      href={toHash(editHref)}
                      data-nav={editHref}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-zinc-800 py-2 text-xs text-zinc-300 no-underline touch-manipulation hover:bg-zinc-700"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      編集
                    </a>
                  ) : (
                    <span className="flex flex-1 items-center justify-center py-2 text-xs text-zinc-600">
                      編集不可
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(sub.id)}
                    className="flex cursor-pointer items-center justify-center rounded-lg bg-red-900/30 px-3 py-2 touch-manipulation text-red-400 hover:bg-red-900/50"
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
  );
}
