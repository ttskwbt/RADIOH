import type { AppData } from "./types";

export const SEED_DATA: AppData = {
  profiles: [
    {
      id: "profile-1",
      name: "東京のタカシ",
      realName: "山田 隆",
      postalCode: "100-0001",
      address: "東京都千代田区千代田1-1",
      tel: "090-1234-5678",
    },
    {
      id: "profile-2",
      name: "深夜のリスナー",
      realName: "鈴木 花子",
      postalCode: "150-0001",
      address: "東京都渋谷区神宮前1-1",
      tel: "080-9876-5432",
    },
  ],
  programs: [
    {
      id: "program-1",
      title: "オールナイトニッポン",
      email: "ann@example-radio.jp",
      profileId: "profile-1",
    },
    {
      id: "program-2",
      title: "ミュージックソン",
      email: "music@example-radio.jp",
      profileId: "profile-1",
    },
    {
      id: "program-3",
      title: "週末ワイド",
      email: "weekend@example-radio.jp",
      profileId: "profile-2",
    },
  ],
  corners: [
    {
      id: "corner-1",
      programId: "program-1",
      name: "ふつおた",
      subjectLine: "【ふつおた】",
      template: "今夜の放送、〇〇の話が面白かったです！",
    },
    {
      id: "corner-2",
      programId: "program-1",
      name: "リアタイ実況用",
      subjectLine: "【リアタイ】",
      template: "",
    },
    {
      id: "corner-3",
      programId: "program-1",
      name: "お悩み相談",
      subjectLine: "【お悩み】",
      template: "最近、〇〇で悩んでいます。アドバイスをお願いします。",
    },
    {
      id: "corner-4",
      programId: "program-2",
      name: "リクエスト",
      subjectLine: "【リクエスト】",
      template: "〇〇の曲をかけてください！",
    },
    {
      id: "corner-5",
      programId: "program-3",
      name: "週末のひとこと",
      subjectLine: "【週末ひとこと】",
      template: "今週末は〇〇を楽しみました。",
    },
  ],
  submissions: [
    {
      id: "sub-1",
      cornerId: "corner-1",
      body: "今夜のゲストトーク、最高でした！また聴きます。",
      status: "sent",
      createdAt: "2026-05-10T22:30:00.000Z",
    },
    {
      id: "sub-2",
      cornerId: "corner-2",
      body: "今のネタ、ウケてますね！",
      status: "accepted",
      createdAt: "2026-05-12T01:15:00.000Z",
    },
    {
      id: "sub-3",
      cornerId: "corner-3",
      body: "仕事の人間関係で悩んでいます…",
      status: "draft",
      createdAt: "2026-05-15T20:00:00.000Z",
    },
  ],
};
