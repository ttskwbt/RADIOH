import { supabase } from "./supabase";
import type {
  AppData,
  Corner,
  Profile,
  Program,
  Submission,
  SubmissionStatus,
} from "./types";
import { EMPTY_DATA } from "./types";

/** Supabase の snake_case 行 ↔ アプリの camelCase 型の変換と CRUD */

interface ProfileRow {
  id: string;
  name: string;
  signature: string;
}

interface ProgramRow {
  id: string;
  title: string;
  email: string;
  thumbnail: string | null;
  profile_id: string;
}

interface CornerRow {
  id: string;
  program_id: string;
  name: string;
  subject_line: string;
  template: string;
}

interface SubmissionRow {
  id: string;
  corner_id: string;
  body: string;
  status: SubmissionStatus;
  created_at: string;
}

export async function fetchAllData(): Promise<AppData> {
  if (!supabase) return EMPTY_DATA;

  const [profiles, programs, corners, submissions] = await Promise.all([
    supabase.from("profiles").select("id,name,signature").order("created_at"),
    supabase
      .from("programs")
      .select("id,title,email,thumbnail,profile_id")
      .order("created_at"),
    supabase
      .from("corners")
      .select("id,program_id,name,subject_line,template")
      .order("created_at"),
    supabase
      .from("submissions")
      .select("id,corner_id,body,status,created_at")
      .order("created_at", { ascending: false }),
  ]);

  const firstError =
    profiles.error ?? programs.error ?? corners.error ?? submissions.error;
  if (firstError) throw firstError;

  return {
    profiles: ((profiles.data ?? []) as ProfileRow[]).map((r) => ({
      id: r.id,
      name: r.name,
      signature: r.signature,
    })),
    programs: ((programs.data ?? []) as ProgramRow[]).map((r) => ({
      id: r.id,
      title: r.title,
      email: r.email,
      thumbnail: r.thumbnail,
      profileId: r.profile_id,
    })),
    corners: ((corners.data ?? []) as CornerRow[]).map((r) => ({
      id: r.id,
      programId: r.program_id,
      name: r.name,
      subjectLine: r.subject_line,
      template: r.template,
    })),
    submissions: ((submissions.data ?? []) as SubmissionRow[]).map((r) => ({
      id: r.id,
      cornerId: r.corner_id,
      body: r.body,
      status: r.status,
      createdAt: r.created_at,
    })),
  };
}

async function requireUserId(): Promise<string> {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw error ?? new Error("Not signed in");
  return data.user.id;
}

export async function cloudUpsertProfile(p: Profile): Promise<void> {
  if (!supabase) return;
  const userId = await requireUserId();
  const { error } = await supabase.from("profiles").upsert({
    id: p.id,
    user_id: userId,
    name: p.name,
    signature: p.signature,
  });
  if (error) throw error;
}

export async function cloudDeleteProfile(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) throw error;
}

export async function cloudUpsertProgram(p: Program): Promise<void> {
  if (!supabase) return;
  const userId = await requireUserId();
  const { error } = await supabase.from("programs").upsert({
    id: p.id,
    user_id: userId,
    title: p.title,
    email: p.email,
    thumbnail: p.thumbnail,
    profile_id: p.profileId || null,
  });
  if (error) throw error;
}

export async function cloudDeleteProgram(id: string): Promise<void> {
  if (!supabase) return;
  // corners / submissions は外部キーの ON DELETE CASCADE で削除される
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw error;
}

export async function cloudUpsertCorner(c: Corner): Promise<void> {
  if (!supabase) return;
  const userId = await requireUserId();
  const { error } = await supabase.from("corners").upsert({
    id: c.id,
    user_id: userId,
    program_id: c.programId,
    name: c.name,
    subject_line: c.subjectLine,
    template: c.template,
  });
  if (error) throw error;
}

export async function cloudDeleteCorner(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("corners").delete().eq("id", id);
  if (error) throw error;
}

export async function cloudUpsertSubmission(s: Submission): Promise<void> {
  if (!supabase) return;
  const userId = await requireUserId();
  const { error } = await supabase.from("submissions").upsert({
    id: s.id,
    user_id: userId,
    corner_id: s.cornerId,
    body: s.body,
    status: s.status,
    created_at: s.createdAt,
  });
  if (error) throw error;
}

export async function cloudDeleteSubmission(id: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("submissions").delete().eq("id", id);
  if (error) throw error;
}
