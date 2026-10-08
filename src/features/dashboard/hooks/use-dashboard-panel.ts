"use client";

import { useId } from "react";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { DashboardPanelProps } from "../types";

export function useDashboardPanel({ title, description }: DashboardPanelProps) {
  const { t } = usePreferences();
  const titleId = useId();

  return {
    titleId,
    titleLabel: t(title),
    descriptionLabel: t(description),
  };
}
