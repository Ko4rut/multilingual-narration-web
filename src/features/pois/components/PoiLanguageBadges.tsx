import React from "react";

interface PoiLanguageBadgesProps {
  languages: string[];
  maxDisplay?: number;
}

export function PoiLanguageBadges({
  languages,
  maxDisplay = 5,
}: PoiLanguageBadgesProps) {
  const displayLangs = languages.slice(0, maxDisplay);
  const remainingCount = languages.length - maxDisplay;

  return (
    <div className="flex flex-wrap items-center gap-1.5 max-w-[170px]">
      {displayLangs.map((lang) => (
        <span
          key={lang}
          className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-[var(--hover)] border border-border text-muted"
        >
          {lang}
        </span>
      ))}
      {remainingCount > 0 && (
        <span
          className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold rounded bg-accent/15 border border-accent/30 text-accent"
          title={languages.slice(maxDisplay).join(", ")}
        >
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
