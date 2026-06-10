import { Plus, Trash2 } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData } from "@/lib/types";

interface ProfilesViewProps {
  data: AppData;
  onDelete: (id: string) => void;
  onResetSeed: () => void;
}

const primaryBtn =
  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-medium text-white no-underline shadow-lg shadow-violet-900/30 transition touch-manipulation hover:bg-violet-500";

export function ProfilesView({ data, onDelete, onResetSeed }: ProfilesViewProps) {
  return (
    <div className="space-y-4 p-4">
      <a
        href={toHash(paths.profileFormNew())}
        data-nav={paths.profileFormNew()}
        className={primaryBtn}
      >
        <Plus className="h-4 w-4" />
        プロフィールを追加
      </a>

      <ul className="space-y-3">
        {data.profiles.map((profile) => (
          <li key={profile.id}>
            <ListRow
              navHref={paths.profileFormEdit(profile.id)}
              action={
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`「${profile.name}」を削除しますか？`)) {
                      onDelete(profile.id);
                    }
                  }}
                  className="shrink-0 cursor-pointer self-stretch px-3 touch-manipulation text-red-400 hover:bg-red-900/30"
                  aria-label="削除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              }
            >
              <h2 className="font-semibold text-violet-300">{profile.name}</h2>
              <p className="mt-1 text-sm text-zinc-400">{profile.realName}</p>
              <p className="mt-2 text-xs text-zinc-600">
                〒{profile.postalCode} {profile.address}
              </p>
              <p className="text-xs text-zinc-600">{profile.tel}</p>
            </ListRow>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          if (confirm("サンプルデータに戻しますか？現在のデータは上書きされます。")) {
            onResetSeed();
          }
        }}
        className="w-full cursor-pointer py-2 text-center text-xs text-zinc-600 underline touch-manipulation hover:text-zinc-400"
      >
        サンプルデータにリセット
      </button>
    </div>
  );
}
