import type { AudioStatusBadgeProps } from "../types";

export function AudioStatusBadge({ type }: AudioStatusBadgeProps) {
  if (type === "Recorded") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-info/20 bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
        <span className="size-1.5 rounded-full bg-info" />
        Recorded
      </span>
    );
  }

  if (type === "TTS") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-warning/20 bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">
        <span className="size-1.5 rounded-full bg-warning" />
        TTS
      </span>
    );
  }

  return null;
}
