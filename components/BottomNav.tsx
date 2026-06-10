import { Award, Radio, Send, User } from "lucide-react";
import { paths, toHash } from "@/lib/hashNav";
import type { View } from "@/lib/types";

interface BottomNavProps {
  active: View;
}

const tabs: { id: View; label: string; icon: typeof Radio; path: string }[] = [
  { id: "programs", label: "番組", icon: Radio, path: paths.programs() },
  { id: "history", label: "履歴", icon: Send, path: paths.history() },
  { id: "stats", label: "実績", icon: Award, path: paths.stats() },
  { id: "profiles", label: "プロフ", icon: User, path: paths.profiles() },
];

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-background/90 px-3 pb-[max(0.6rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-sm">
      <div className="mx-auto flex max-w-lg gap-2">
        {tabs.map(({ id, label, icon: Icon, path }) => {
          const isActive = active === id;
          return (
            <a
              key={id}
              href={toHash(path)}
              data-nav={path}
              data-nav-tab={id}
              className={[
                "flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-2xl py-2.5 text-[11px] font-semibold no-underline touch-manipulation transition-colors",
                isActive ? "neu-inset text-accent" : "text-muted",
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
