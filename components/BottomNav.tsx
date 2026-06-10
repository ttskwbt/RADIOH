import { BookOpen, Radio, User } from "lucide-react";
import { paths, toHash } from "@/lib/hashNav";
import type { View } from "@/lib/types";

interface BottomNavProps {
  active: View;
}

const tabs: { id: View; label: string; icon: typeof Radio; path: string }[] = [
  { id: "programs", label: "番組", icon: Radio, path: paths.programs() },
  { id: "history", label: "履歴", icon: BookOpen, path: paths.history() },
  { id: "profiles", label: "プロフィール", icon: User, path: paths.profiles() },
];

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav
      data-panel="nav"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-zinc-800/80 bg-zinc-950 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
    >
      <div className="mx-auto flex max-w-lg gap-1">
        {tabs.map(({ id, label, icon: Icon, path }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={toHash(path)}
              data-nav={path}
              data-nav-tab={id}
              className={[
                "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium no-underline transition touch-manipulation",
                isActive
                  ? "bg-violet-600/20 text-violet-400"
                  : "text-zinc-500 hover:text-zinc-300",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" />
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
