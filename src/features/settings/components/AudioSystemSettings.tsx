"use client";

import { Volume2 } from "lucide-react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

export function AudioSystemSettings() {
  const { t } = usePreferences();

  return (
    <div className="card bg-surface border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <Volume2 className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-lg text-foreground">{t("Audio System Settings")}</h2>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted">{t("Max Audio File Size")}</label>
        <input type="text" defaultValue={t("10 MB")} className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent" />
      </div>

      <div className="flex flex-col gap-2 my-1">
        <label className="text-sm font-medium text-muted">{t("Supported Format Standards")}</label>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-background border border-border rounded-md text-xs font-bold text-foreground">MP3</span>
          <span className="px-3 py-1 bg-background border border-border rounded-md text-xs font-bold text-foreground">WAV</span>
          <span className="px-3 py-1 bg-background border border-border rounded-md text-xs font-bold text-foreground">OGG</span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted">{t("TTS Provider Engine")}</label>
        <select className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent cursor-pointer">
          <option>{t("Google Cloud TTS")}</option>
        </select>
      </div>
    </div>
  );
}