"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { CornerForm } from "@/components/forms/CornerForm";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { ProgramForm } from "@/components/forms/ProgramForm";
import { Header } from "@/components/Header";
import { EditorView } from "@/components/views/EditorView";
import { HistoryView } from "@/components/views/HistoryView";
import { ProfilesView } from "@/components/views/ProfilesView";
import { ProgramDetailView } from "@/components/views/ProgramDetailView";
import { ProgramsView } from "@/components/views/ProgramsView";
import { useHashNav } from "@/hooks/useHashNav";
import { useNavClick } from "@/hooks/useNavClick";
import { useRadioStore } from "@/hooks/useRadioStore";
import { applyViewPanels } from "@/lib/panelSync";
import { paths } from "@/lib/hashNav";
import type { Corner, Profile, Program, Submission } from "@/lib/types";

export function RadioApp() {
  const store = useRadioStore();
  const { data } = store;
  const { route, navigate, hash } = useHashNav();
  useNavClick();

  useEffect(() => {
    applyViewPanels();
  }, [data, hash]);

  const [draftProgram, setDraftProgram] = useState<Program | null>(null);
  const [draftCorner, setDraftCorner] = useState<Corner | null>(null);
  const [draftProfile, setDraftProfile] = useState<Profile | null>(null);

  const draftProgramKey = useRef<string | null>(null);
  const draftCornerKey = useRef<string | null>(null);
  const draftProfileKey = useRef<string | null>(null);

  const selectedProgram = route.programId
    ? data.programs.find((p) => p.id === route.programId)
    : undefined;
  const formProgram = route.programId
    ? data.programs.find((p) => p.id === route.programId)
    : undefined;
  const selectedCorner = route.cornerId
    ? data.corners.find((c) => c.id === route.cornerId)
    : undefined;
  const editingSubmission = route.submissionId
    ? data.submissions.find((s) => s.id === route.submissionId)
    : undefined;

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sync draft forms from hash route */
    if (route.view !== "program-form") {
      setDraftProgram(null);
      draftProgramKey.current = null;
      return;
    }
    const key = route.formId ?? "new";
    if (draftProgramKey.current === key) return;

    draftProgramKey.current = key;
    if (key === "new") {
      const profileId = data.profiles[0]?.id ?? "";
      setDraftProgram(store.createEmptyProgram(profileId));
    } else {
      setDraftProgram(data.programs.find((p) => p.id === key) ?? null);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [route.view, route.formId, data.programs, data.profiles, store]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (route.view !== "corner-form" || !route.programId) {
      setDraftCorner(null);
      draftCornerKey.current = null;
      return;
    }
    const key = `${route.programId}:${route.formId ?? "new"}`;
    if (draftCornerKey.current === key) return;

    draftCornerKey.current = key;
    if (route.formId === "new" || !route.formId) {
      setDraftCorner(store.createEmptyCorner(route.programId));
    } else {
      setDraftCorner(data.corners.find((c) => c.id === route.formId) ?? null);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [route.view, route.programId, route.formId, data.corners, store]);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (route.view !== "profile-form") {
      setDraftProfile(null);
      draftProfileKey.current = null;
      return;
    }
    const key = route.formId ?? "new";
    if (draftProfileKey.current === key) return;

    draftProfileKey.current = key;
    if (key === "new") {
      setDraftProfile(store.createEmptyProfile());
    } else {
      setDraftProfile(data.profiles.find((p) => p.id === key) ?? null);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [route.view, route.formId, data.profiles, store]);

  const handleSaveSubmission = useCallback(
    (body: string, status: Submission["status"]) => {
      if (!route.cornerId || !route.programId) return;
      if (editingSubmission) {
        store.upsertSubmission({ ...editingSubmission, body, status });
      } else {
        store.upsertSubmission(
          store.createSubmission(route.cornerId, body, status),
        );
      }
    },
    [route.cornerId, route.programId, editingSubmission, store],
  );

  const headerConfig = (): {
    title: string;
    subtitle?: string;
    backHref?: string;
  } => {
    switch (route.view) {
      case "programs":
        return { title: "ハガキ職人", subtitle: "ラジオ投稿アシスタント" };
      case "program-detail":
        return {
          title: selectedProgram?.title ?? "番組",
          subtitle: "コーナーを選択",
          backHref: paths.programs(),
        };
      case "editor":
        return {
          title: "メール作成",
          subtitle: selectedCorner?.name,
          backHref: route.programId
            ? paths.program(route.programId)
            : paths.programs(),
        };
      case "history":
        return { title: "履歴・ネタ帳", subtitle: "過去の投稿" };
      case "profiles":
        return { title: "プロフィール", subtitle: "ラジオネーム・連絡先" };
      case "program-form":
        return {
          title: draftProgram?.title ? "番組を編集" : "番組を追加",
          backHref:
            route.formId !== "new" && route.formId
              ? paths.program(route.formId)
              : paths.programs(),
        };
      case "corner-form":
        return {
          title: draftCorner?.name ? "コーナーを編集" : "コーナーを追加",
          backHref: route.programId
            ? paths.program(route.programId)
            : paths.programs(),
        };
      case "profile-form":
        return {
          title: draftProfile?.name ? "プロフィール編集" : "プロフィール追加",
          backHref: paths.profiles(),
        };
      default:
        return { title: "ハガキ職人" };
    }
  };

  const { title, subtitle, backHref } = headerConfig();
  const showBottomNav = ["programs", "history", "profiles"].includes(route.view);

  return (
    <div className="relative mx-auto min-h-dvh max-w-lg bg-zinc-950 text-zinc-100">
      <Header title={title} subtitle={subtitle} backHref={backHref} />

      <main className="pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        <section data-panel="programs">
          <ProgramsView data={data} />
        </section>

        <section data-panel="program-detail" hidden>
          {data.programs.map((program) => (
            <div key={program.id} data-panel-program={program.id} hidden>
              <ProgramDetailView program={program} data={data} />
            </div>
          ))}
        </section>

        <section data-panel="editor" hidden>
          {data.programs.map((program) =>
            data.corners
              .filter((c) => c.programId === program.id)
              .map((corner) => (
                <div
                  key={`${program.id}-${corner.id}`}
                  data-panel-editor={`${program.id}/${corner.id}`}
                  hidden
                >
                  <EditorView
                    program={program}
                    corner={corner}
                    data={data}
                    initialBody={
                      route.submissionId &&
                      route.programId === program.id &&
                      route.cornerId === corner.id
                        ? data.submissions.find((s) => s.id === route.submissionId)
                            ?.body
                        : corner.template
                    }
                    submissionId={
                      route.submissionId &&
                      route.programId === program.id &&
                      route.cornerId === corner.id
                        ? route.submissionId
                        : undefined
                    }
                    onSave={handleSaveSubmission}
                  />
                </div>
              )),
          )}
        </section>

        <section data-panel="history" hidden>
          <HistoryView
            data={data}
            onStatusChange={store.updateSubmissionStatus}
            onDelete={store.deleteSubmission}
          />
        </section>

        <section data-panel="profiles" hidden>
          <ProfilesView
            data={data}
            onDelete={store.deleteProfile}
            onResetSeed={store.resetToSeed}
          />
        </section>

        <section data-panel="program-form" hidden>
          {draftProgram && (
            <ProgramForm
              data={data}
              program={draftProgram}
              onSave={(p) => {
                store.upsertProgram(p);
                navigate(paths.program(p.id));
              }}
              onDelete={
                data.programs.some((x) => x.id === draftProgram.id)
                  ? (id) => {
                      store.deleteProgram(id);
                      navigate(paths.programs());
                    }
                  : undefined
              }
              onCancel={() => {
                navigate(
                  route.formId !== "new" && route.formId
                    ? paths.program(route.formId)
                    : paths.programs(),
                );
              }}
            />
          )}
        </section>

        <section data-panel="corner-form" hidden>
          {draftCorner && formProgram && (
            <CornerForm
              corner={draftCorner}
              onSave={(c) => {
                store.upsertCorner(c);
                navigate(paths.program(formProgram.id));
              }}
              onDelete={
                data.corners.some((x) => x.id === draftCorner.id)
                  ? (id) => {
                      store.deleteCorner(id);
                      navigate(paths.program(formProgram.id));
                    }
                  : undefined
              }
              onCancel={() => navigate(paths.program(formProgram.id))}
            />
          )}
        </section>

        <section data-panel="profile-form" hidden>
          {draftProfile && (
            <ProfileForm
              profile={draftProfile}
              onSave={(p) => {
                store.upsertProfile(p);
                navigate(paths.profiles());
              }}
              onCancel={() => navigate(paths.profiles())}
            />
          )}
        </section>
      </main>

      <div data-panel-nav-bar hidden={!showBottomNav}>
        <BottomNav active={route.view} />
      </div>
    </div>
  );
}
