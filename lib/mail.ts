import type { Corner, Profile, Program } from "./types";

export function buildMailBody(profile: Profile, body: string): string {
  const parts = [`ラジオネーム：${profile.name}`, "", "", body];
  if (profile.signature.trim()) {
    parts.push("", "---", profile.signature);
  }
  return parts.join("\n");
}

export function buildMailtoUrl(
  program: Program,
  corner: Corner,
  profile: Profile,
  body: string,
): string {
  const mailBody = buildMailBody(profile, body);
  const params = new URLSearchParams({
    subject: corner.subjectLine,
    body: mailBody,
  });
  return `mailto:${program.email}?${params.toString()}`;
}

export function buildClipboardText(
  program: Program,
  corner: Corner,
  profile: Profile,
  body: string,
): string {
  const mailBody = buildMailBody(profile, body);
  return `宛先: ${program.email}
件名: ${corner.subjectLine}

${mailBody}`;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  }
}

export function openMailer(url: string): void {
  window.location.href = url;
}
