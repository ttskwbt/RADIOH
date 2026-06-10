import { Radio } from "lucide-react";

interface ProgramThumbProps {
  title: string;
  thumbnail: string | null;
  size?: "md" | "lg";
}

/** 番組サムネイル。未設定時は番組名の頭文字を表示 */
export function ProgramThumb({ title, thumbnail, size = "md" }: ProgramThumbProps) {
  const dim = size === "lg" ? "h-16 w-16 rounded-2xl" : "h-12 w-12 rounded-xl";

  if (thumbnail) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Data URL のためnext/image不要
      <img
        src={thumbnail}
        alt=""
        className={`${dim} neu-raised-sm shrink-0 object-cover`}
      />
    );
  }

  const initial = title.trim().charAt(0);
  return (
    <div
      className={`${dim} neu-inset flex shrink-0 items-center justify-center text-accent`}
      aria-hidden
    >
      {initial ? (
        <span className="text-lg font-bold">{initial}</span>
      ) : (
        <Radio className="h-5 w-5" />
      )}
    </div>
  );
}
