export type SubmissionStatus = "draft" | "sent" | "accepted" | "rejected";

export interface Profile {
  id: string;
  /** ラジオネーム（メール冒頭に自動追加） */
  name: string;
  /** メール末尾に付ける個人情報（住所など、フリーフォーマット） */
  signature: string;
}

export interface Program {
  id: string;
  title: string;
  email: string;
  /** サムネイル画像（リサイズ済み Data URL）または null */
  thumbnail: string | null;
  profileId: string;
}

export interface Corner {
  id: string;
  programId: string;
  name: string;
  subjectLine: string;
  template: string;
}

export interface Submission {
  id: string;
  cornerId: string;
  body: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface AppData {
  profiles: Profile[];
  programs: Program[];
  corners: Corner[];
  submissions: Submission[];
}

export const EMPTY_DATA: AppData = {
  profiles: [],
  programs: [],
  corners: [],
  submissions: [],
};

export type View =
  | "programs"
  | "program-detail"
  | "editor"
  | "history"
  | "stats"
  | "profiles"
  | "program-form"
  | "corner-form"
  | "profile-form";

export const SUBMISSION_STATUS_LABELS: Record<SubmissionStatus, string> = {
  draft: "下書き",
  sent: "送信済",
  accepted: "採用",
  rejected: "ボツ",
};
