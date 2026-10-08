export function AudioStatusBadge({ type }: { type: string }) {
  if (type === "Recorded") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-info/20 bg-info/10 text-info text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-info"></span>
        Recorded
      </span>
    );
  }
  
  if (type === "TTS") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-warning/20 bg-warning/10 text-warning text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
        TTS
      </span>
    );
  }

  return null;
}