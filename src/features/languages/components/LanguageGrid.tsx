"use client";

import { Edit2, Trash2, Search } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  LANGUAGE_STATUS,
  LANGUAGE_STATUS_LABELS,
} from "../constants/language.constants";
import { useLanguageGrid } from "../hooks/use-language-grid";
import type { LanguageGridProps } from "../types/language.types";

export function LanguageGrid({ 
  q, 
  languages, 
  onToggleStatus 
}: LanguageGridProps) {
  const { t, filteredLanguages, isEmpty } = useLanguageGrid({ q, languages });

  if (isEmpty) {
    return (
      <div className="card bg-surface border-border p-16 text-center rounded-xl flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4">
           <Search className="w-8 h-8 text-muted" />
        </div>
        <h3 className="text-lg font-medium text-foreground">{t("No languages found")}</h3>
        <p className="text-muted mt-2 text-sm max-w-75">
          {t("We couldn't find any language matching your search query.")}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {filteredLanguages.map(function renderCard(lang) {
        let toggleBg = "bg-muted";
        let toggleDotPosition = "translate-x-0.5";
        let statusTone: "success" | "neutral" = "neutral";

        if (lang.language_status === LANGUAGE_STATUS.SUPPORTED) {
          toggleBg = "bg-accent";
          toggleDotPosition = "translate-x-4";
          statusTone = "success";
        }

        return (
          <div key={lang.id} className="card bg-surface border-border rounded-xl p-5 flex flex-col gap-6 hover:border-muted transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 rounded bg-background border border-border flex items-center justify-center text-lg overflow-hidden">
                  <span className="font-mono text-[10px] font-semibold uppercase">
                    {lang.language_code}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-foreground leading-tight">
                    {t(lang.language_name)}
                  </h3>
                  <p className="text-muted text-xs font-medium mt-0.5">
                    {lang.id}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={function() { onToggleStatus(lang.id); }}
                className={`w-9 h-5 rounded-full relative flex items-center transition-colors cursor-pointer border-none ${toggleBg}`}
                aria-label={t("Toggle status")}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute left-0 ${toggleDotPosition}`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <StatusBadge
                label={t(LANGUAGE_STATUS_LABELS[lang.language_status])}
                tone={statusTone}
              />
              
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" className="text-muted " title={t("Edit")}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon-sm" className="text-destructive" title={t("Delete")}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
