"use client";

import { Mail, Plus } from "lucide-react";
import { ListRow } from "@/components/ui/ListRow";
import { ProgramThumb } from "@/components/ui/ProgramThumb";
import { paths, toHash } from "@/lib/hashNav";
import type { AppData, Program } from "@/lib/types";
import { DAY_LABELS_EN, DAY_LABELS_JA, WEEK_ORDER } from "@/lib/types";

interface ProgramsViewProps {
  data: AppData;
}

interface Section {
  key: string;
  label: string;
  sublabel?: string;
  isToday?: boolean;
  programs: Program[];
}

function buildSections(programs: Program[], today: number): Section[] {
  const sections: Section[] = [];

  const todayPrograms = programs.filter((p) => p.days.includes(today));
  if (todayPrograms.length > 0) {
    sections.push({
      key: "today",
      label: "TODAY",
      sublabel: `今日 · ${DAY_LABELS_JA[today]}曜日`,
      isToday: true,
      programs: todayPrograms,
    });
  }

  for (const day of WEEK_ORDER) {
    if (day === today) continue; // 今日の番組は TODAY に表示済み
    const dayPrograms = programs.filter((p) => p.days.includes(day));
    if (dayPrograms.length > 0) {
      sections.push({
        key: String(day),
        label: DAY_LABELS_EN[day],
        sublabel: `${DAY_LABELS_JA[day]}曜日`,
        programs: dayPrograms,
      });
    }
  }

  const unscheduled = programs.filter((p) => p.days.length === 0);
  if (unscheduled.length > 0) {
    sections.push({
      key: "unscheduled",
      label: "曜日未設定",
      programs: unscheduled,
    });
  }

  return sections;
}

function ProgramRow({ program, data, isToday }: {
  program: Program;
  data: AppData;
  isToday?: boolean;
}) {
  const cornerCount = data.corners.filter(
    (c) => c.programId === program.id,
  ).length;
  const dayText = WEEK_ORDER.filter((d) => program.days.includes(d))
    .map((d) => DAY_LABELS_JA[d])
    .join("・");

  return (
    <ListRow
      navHref={paths.program(program.id)}
      className={isToday ? "ring-2 ring-accent/35" : ""}
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
        <ProgramThumb title={program.title} thumbnail={program.thumbnail} />
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
            {dayText && <span className="text-accent">{dayText} </span>}
            コーナー {cornerCount}件
          </p>
        </div>
      </div>
    </ListRow>
  );
}

export function ProgramsView({ data }: ProgramsViewProps) {
  const today = new Date().getDay();
  const sections = buildSections(data.programs, today);

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
        sections.map((section) => (
          <section key={section.key} className="space-y-3">
            <div className="flex items-baseline gap-2 px-1 pt-1">
              <h2
                className={
                  section.isToday
                    ? "text-logo text-base"
                    : "text-xs font-bold tracking-widest text-muted"
                }
              >
                {section.label}
              </h2>
              {section.sublabel && (
                <span className="text-xs text-faint">{section.sublabel}</span>
              )}
            </div>
            <ul className="space-y-4">
              {section.programs.map((program) => (
                <li key={program.id}>
                  <ProgramRow
                    program={program}
                    data={data}
                    isToday={section.isToday}
                  />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
