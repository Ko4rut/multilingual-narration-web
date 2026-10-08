"use client";

import { GitBranch } from "lucide-react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { ContentWorkflowProps } from "../types";

export function ContentWorkflow({ 
  autoPublish, 
  requireApproval, 
  onTogglePublish, 
  onToggleApproval 
}: ContentWorkflowProps) {
  const { t } = usePreferences();

  let publishBg = "bg-muted";
  let publishDot = "translate-x-0.5";
  if (autoPublish) {
    publishBg = "bg-accent";
    publishDot = "translate-x-4";
  }

  let approvalBg = "bg-muted";
  let approvalDot = "translate-x-0.5";
  if (requireApproval) {
    approvalBg = "bg-accent";
    approvalDot = "translate-x-4";
  }

  return (
    <div className="card bg-surface border-border rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <GitBranch className="w-5 h-5 text-accent" />
        <h2 className="font-bold text-lg text-foreground">{t("Content Workflow")}</h2>
      </div>
      
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="font-bold text-sm text-foreground">{t("Auto-Publish Drafts")}</p>
          <p className="text-xs text-muted mt-0.5">{t("Publish narrations instantly upon translation completion")}</p>
        </div>
        <button 
          type="button"
          onClick={onTogglePublish}
          className={`w-9 h-5 rounded-full relative flex items-center transition-colors cursor-pointer border-none shrink-0 ${publishBg}`}
          aria-label="Toggle auto publish"
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute left-0 ${publishDot}`} />
        </button>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <p className="font-bold text-sm text-foreground">{t("Require Super Admin Approval")}</p>
          <p className="text-xs text-muted mt-0.5">{t("Quality gates active for new narration recordings")}</p>
        </div>
        <button 
          type="button"
          onClick={onToggleApproval}
          className={`w-9 h-5 rounded-full relative flex items-center transition-colors cursor-pointer border-none shrink-0 ${approvalBg}`}
          aria-label="Toggle approval"
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform absolute left-0 ${approvalDot}`} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5 mt-2">
        <label className="text-sm font-medium text-muted">{t("Max Script Character Length")}</label>
        <input type="text" defaultValue={t("5,000 Characters")} className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus-visible:outline-accent" />
      </div>
    </div>
  );
}
