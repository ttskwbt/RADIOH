import { Award } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgramThumb } from "@/components/ui/ProgramThumb";
import type { AppData } from "@/lib/types";

interface StatsViewProps {
  data: AppData;
}

export function StatsView({ data }: StatsViewProps) {
  const sent = data.submissions.filter((s) => s.status === "sent");
  const accepted = sent.filter((s) => s.accepted);
  const rate = sent.length > 0 ? Math.round((accepted.length / sent.length) * 100) : 0;

  const cornerToProgram = new Map(
    data.corners.map((c) => [c.id, c.programId] as const),
  );

  const perProgram = data.programs
    .map((program) => {
      const subs = sent.filter(
        (s) => cornerToProgram.get(s.cornerId) === program.id,
      );
      const acc = subs.filter((s) => s.accepted);
      return { program, sentCount: subs.length, acceptedCount: acc.length };
    })
    .filter((row) => row.sentCount > 0)
    .sort((a, b) => b.acceptedCount - a.acceptedCount);

  const acceptedList = [...accepted].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const resolveMeta = (cornerId: string) => {
    const corner = data.corners.find((c) => c.id === cornerId);
    const program = corner
      ? data.programs.find((p) => p.id === corner.programId)
      : undefined;
    return { corner, program };
  };

  return (
    <div className="space-y-5 p-4">
      {/* サマリー */}
      <div className="neu-raised p-5">
        <div className="flex items-center justify-around text-center">
          <div>
            <p className="text-3xl font-extrabold text-foreground">
              {sent.length}
            </p>
            <p className="mt-1 text-xs font-semibold text-muted">送信</p>
          </div>
          <div className="neu-inset flex h-24 w-24 flex-col items-center justify-center rounded-full">
            <p className="text-xl font-extrabold text-accent">{rate}%</p>
            <p className="text-[10px] font-semibold text-muted">採用率</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-success">
              {accepted.length}
            </p>
            <p className="mt-1 text-xs font-semibold text-muted">採用</p>
          </div>
        </div>
      </div>

      {/* 番組別 */}
      {perProgram.length > 0 && (
        <section className="space-y-3">
          <h2 className="px-1 text-xs font-bold text-muted">番組別の実績</h2>
          <ul className="space-y-3">
            {perProgram.map(({ program, sentCount, acceptedCount }) => (
              <li key={program.id}>
                <Card>
                  <div className="flex items-center gap-3">
                    <ProgramThumb
                      title={program.title}
                      thumbnail={program.thumbnail}
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-foreground">
                        {program.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted">
                        {sentCount}通中{" "}
                        <span className="font-bold text-success">
                          {acceptedCount}通
                        </span>{" "}
                        採用
                      </p>
                    </div>
                    <span className="neu-inset shrink-0 rounded-full px-3 py-1.5 text-xs font-bold text-accent">
                      {Math.round((acceptedCount / sentCount) * 100)}%
                    </span>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 採用メール一覧 */}
      <section className="space-y-3">
        <h2 className="flex items-center gap-1.5 px-1 text-xs font-bold text-muted">
          <Award className="h-3.5 w-3.5 text-success" />
          採用されたメール
        </h2>
        {acceptedList.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            採用されたメールはまだありません。
            <br />
            履歴の「採用された！」を押すとここに並びます。
          </p>
        ) : (
          <ul className="space-y-3">
            {acceptedList.map((sub) => {
              const { corner, program } = resolveMeta(sub.cornerId);
              const date = new Date(sub.createdAt).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "short",
                day: "numeric",
              });
              return (
                <li key={sub.id}>
                  <Card className="neu-card-accepted ring-1 ring-rose-300/60">
                    <p className="text-xs text-faint">{date}</p>
                    <h3 className="mt-0.5 text-sm font-semibold text-foreground">
                      {program?.title ?? "不明な番組"}
                      {corner && (
                        <span className="font-normal text-muted">
                          {" "}
                          · {corner.name}
                        </span>
                      )}
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted">
                      {sub.body}
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
