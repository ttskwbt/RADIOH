import { MessageSquare, Plus } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData, Program } from "@/lib/types";

interface ProgramDetailViewProps {
  program: Program;
  data: AppData;
}

const iconBtn =
  "flex shrink-0 cursor-pointer items-center self-stretch px-3 text-sm no-underline touch-manipulation text-violet-400 hover:bg-violet-600/10";

export function ProgramDetailView({ program, data }: ProgramDetailViewProps) {
  const corners = data.corners.filter((c) => c.programId === program.id);

  return (
    <div className="space-y-4 p-4">
      <a
        href={toHash(paths.cornerFormNew(program.id))}
        data-nav={paths.cornerFormNew(program.id)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-900/50 py-3 text-sm text-zinc-400 no-underline transition touch-manipulation hover:border-violet-600/50 hover:text-violet-400"
      >
        <Plus className="h-4 w-4" />
        コーナーを追加
      </a>

      {corners.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          「ふつおた」「リアタイ実況用」などコーナーを作りましょう
        </p>
      ) : (
        <ul className="space-y-3">
          {corners.map((corner) => (
            <li key={corner.id}>
              <ListRow
                navHref={paths.editor(program.id, corner.id)}
                action={
                  <a
                    href={toHash(paths.cornerFormEdit(program.id, corner.id))}
                    data-nav={paths.cornerFormEdit(program.id, corner.id)}
                    className={iconBtn}
                  >
                    編集
                  </a>
                }
              >
                <h2 className="flex items-center gap-2 font-semibold text-zinc-50">
                  <MessageSquare className="h-4 w-4 text-violet-400" />
                  {corner.name}
                </h2>
                <p className="mt-1 text-xs text-zinc-500">{corner.subjectLine}</p>
                {corner.template && (
                  <p className="mt-2 line-clamp-2 text-xs text-zinc-600">
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
