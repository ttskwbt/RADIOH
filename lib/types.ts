export type SubmissionStatus = "draft" | "sent" | "accepted" | "rejected";

export interface Profile {
  id: string;
  name: string;
  realName: string;
  postalCode: string;
  address: string;
  tel: string;
}

export interface Program {
  id: string;
  title: string;
  email: string;
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

export type View =
  | "programs"
  | "program-detail"
  | "editor"
  | "history"
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
