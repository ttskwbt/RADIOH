import { LogOut, Plus, Trash2 } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData } from "@/lib/types";

interface ProfilesViewProps {
  data: AppData;
  onDelete: (id: string) => void;
  /** クラウドモード時のみ表示 */
  accountEmail?: string;
  onSignOut?: () => void;
}

export function ProfilesView({
  data,
  onDelete,
  accountEmail,
  onSignOut,
}: ProfilesViewProps) {
  return (
    <div className="space-y-5 p-4">
      <a
        href={toHash(paths.profileFormNew())}
        data-nav={paths.profileFormNew()}
        className="neu-accent flex w-full cursor-pointer items-center justify-center gap-2 py-3.5 text-sm font-semibold no-underline touch-manipulation"
      >
        <Plus className="h-4 w-4" />
        プロフィールを追加
      </a>

      {data.profiles.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">
          ラジオネームを登録すると
          <br />
          メール冒頭に自動で追加されます。
        </p>
      ) : (
        <ul className="space-y-4">
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
                    className="shrink-0 cursor-pointer self-stretch px-4 text-danger touch-manipulation active:opacity-60"
                    aria-label="削除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                }
              >
                <h2 className="font-bold text-accent">{profile.name}</h2>
                {profile.signature ? (
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-xs text-muted">
                    {profile.signature}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-faint">署名なし</p>
                )}
              </ListRow>
            </li>
          ))}
        </ul>
      )}

      {accountEmail && onSignOut && (
        <div className="neu-raised space-y-3 p-4">
          <p className="text-xs text-muted">
            ログイン中: <span className="text-foreground">{accountEmail}</span>
          </p>
          <button
            type="button"
            onClick={() => {
              if (confirm("ログアウトしますか？")) onSignOut();
            }}
            className="neu-btn flex w-full cursor-pointer items-center justify-center gap-2 py-2.5 text-xs font-semibold text-muted touch-manipulation"
          >
            <LogOut className="h-3.5 w-3.5" />
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}
