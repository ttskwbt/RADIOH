import { MessageSquare, Plus } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { ProgramThumb } from "@/components/ui/ProgramThumb";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData, Program } from "@/lib/types";

interface ProgramDetailViewProps {
  program: Program;
  data: AppData;
}

export function ProgramDetailView({ program, data }: ProgramDetailViewProps) {
  const corners = data.corners.filter((c) => c.programId === program.id);

  return (
    <div className="space-y-5 p-4">
      <div className="neu-raised flex items-center gap-4 p-4">
        <ProgramThumb title={program.title} thumbnail={program.thumbnail} size="lg" />
        <div className="min-w-0">
          <h2 className="truncate font-bold text-foreground">{program.title}</h2>
          <p className="mt-1 truncate text-xs text-muted">{program.email}</p>
        </div>
      </div>

      <a
        href={toHash(paths.cornerFormNew(program.id))}
        data-nav={paths.cornerFormNew(program.id)}
        className="neu-btn flex w-full cursor-pointer items-center justify-center gap-2 py-3.5 text-sm font-semibold text-accent no-underline touch-manipulation"
      >
        <Plus className="h-4 w-4" />
        コーナーを追加
      </a>

      {corners.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted">
          「ふつおた」「リクエスト」など
          <br />
          コーナーを作りましょう
        </p>
      ) : (
        <ul className="space-y-4">
          {corners.map((corner) => (
            <li key={corner.id}>
              <ListRow
                navHref={paths.editor(program.id, corner.id)}
                action={
                  <a
                    href={toHash(paths.cornerFormEdit(program.id, corner.id))}
                    data-nav={paths.cornerFormEdit(program.id, corner.id)}
                    className="flex shrink-0 cursor-pointer items-center self-stretch px-4 text-xs font-semibold text-accent no-underline touch-manipulation active:opacity-60"
                  >
                    編集
                  </a>
                }
              >
                <h2 className="flex items-center gap-2 font-bold text-foreground">
                  <MessageSquare className="h-4 w-4 text-accent" />
                  {corner.name}
                </h2>
                <p className="mt-1 text-xs text-muted">{corner.subjectLine}</p>
                {corner.template && (
                  <p className="mt-2 line-clamp-2 text-xs text-faint">
                    定型: {corner.template}
                  </p>
                )}
              </ListRow>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
