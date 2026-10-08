"use client";

import { Monitor } from "lucide-react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { ApplicationDefaultsProps } from "../types";

export function ApplicationDefaults({
  language,
  theme,
  onLanguageChange,
  onThemeChange
}: ApplicationDefaultsProps) {
  const { t } = usePreferences();

  return (
    <div className="card bg-surface border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <Monitor className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-lg text-foreground">{t("Application Defaults")}</h2>
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-muted">{t("Default Narration Language")}</label>
        <select 
          value={language} 
          onChange={onLanguageChange}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent cursor-pointer"
        >
          <option value="vi">{t("Vietnamese (VI)")}</option>
          <option value="en">{t("English (EN)")}</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">{t("Theme Mode")}</label>
          <select 
            value={theme}
            onChange={onThemeChange}
            className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent cursor-pointer"
          >
            <option value="dark">{t("Dark Theme")}</option>
            <option value="light">{t("Light Theme")}</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted">{t("System Version")}</label>
          <input type="text" readOnly value="v2.4.1 (Stable)" className="bg-background border border-border rounded-md px-3 py-2 text-sm text-muted cursor-not-allowed" />
        </div>
      </div>
    </div>
  );
}
