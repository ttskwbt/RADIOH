import { Mail, Plus } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { ProgramThumb } from "@/components/ui/ProgramThumb";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData } from "@/lib/types";

interface ProgramsViewProps {
  data: AppData;
}

export function ProgramsView({ data }: ProgramsViewProps) {
  return (
    <div className="space-y-5 p-4">
      <a
        href={toHash(paths.programFormNew())}
        data-nav={paths.programFormNew()}
        className="neu-accent flex w-full cursor-pointer items-center justify-center gap-2 py-3.5 text-sm font-semibold no-underline touch-manipulation"
      >
        <Plus className="h-4 w-4" />
        番組を追加
      </a>

      {data.programs.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">
          番組がまだありません。
          <br />
          よく投稿する番組を登録しましょう。
        </p>
      ) : (
        <ul className="space-y-4">
          {data.programs.map((program) => {
            const cornerCount = data.corners.filter(
              (c) => c.programId === program.id,
            ).length;
            return (
              <li key={program.id}>
                <ListRow
                  navHref={paths.program(program.id)}
                  action={
                    <a
                      href={toHash(paths.programFormEdit(program.id))}
                      data-nav={paths.programFormEdit(program.id)}
                      className="flex shrink-0 cursor-pointer items-center self-stretch px-4 text-xs font-semibold text-accent no-underline touch-manipulation active:opacity-60"
                    >
                      編集
                    </a>
                  }
                >
                  <div className="flex items-center gap-3.5">
                    <ProgramThumb
                      title={program.title}
                      thumbnail={program.thumbnail}
                    />
                    <div className="min-w-0 flex-1">
                      <h2
                        data-program-title
                        data-program-id={program.id}
                        className="truncate font-bold text-foreground"
                      >
                        {program.title}
                      </h2>
                      <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted">
                        <Mail className="h-3 w-3 shrink-0" />
                        {program.email}
                      </p>
                      <p className="mt-1 text-xs text-faint">
                        コーナー {cornerCount}件
                      </p>
                    </div>
                  </div>
                </ListRow>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
