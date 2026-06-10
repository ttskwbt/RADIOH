import { Mail, Plus, User } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData } from "@/lib/types";

interface ProgramsViewProps {
  data: AppData;
}

const iconBtn =
  "flex shrink-0 cursor-pointer items-center self-stretch px-3 text-sm no-underline touch-manipulation";

const primaryBtn =
  "flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white no-underline shadow-lg shadow-violet-900/30 transition touch-manipulation hover:bg-violet-500 active:scale-[0.98]";

const iconOnlyBtn =
  "flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-zinc-300 no-underline transition touch-manipulation hover:bg-zinc-800";

export function ProgramsView({ data }: ProgramsViewProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex gap-2">
        <a
          href={toHash(paths.programFormNew())}
          data-nav={paths.programFormNew()}
          className={primaryBtn}
        >
          <Plus className="h-4 w-4" />
          番組を追加
        </a>
        <a
          href={toHash(paths.profiles())}
          data-nav={paths.profiles()}
          className={iconOnlyBtn}
          aria-label="プロフィール"
        >
          <User className="h-4 w-4" />
        </a>
      </div>

      {data.programs.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-500">
          番組がまだありません。追加して始めましょう。
        </p>
      ) : (
        <ul className="space-y-3">
          {data.programs.map((program) => {
            const profile = data.profiles.find((p) => p.id === program.profileId);
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
                      className={`${iconBtn} text-violet-400 hover:bg-violet-600/10`}
                    >
                      編集
                    </a>
                  }
                >
                  <h2
                    data-program-title
                    data-program-id={program.id}
                    className="font-semibold text-zinc-50"
                  >
                    {program.title}
                  </h2>
                  <p className="mt-1 flex items-center gap-1 truncate text-xs text-zinc-500">
                    <Mail className="h-3 w-3 shrink-0" />
                    {program.email}
                  </p>
                  <p className="mt-2 text-xs text-zinc-400">
                    {profile?.name ?? "プロフィール未設定"} · コーナー {cornerCount}件
                  </p>
                </ListRow>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
