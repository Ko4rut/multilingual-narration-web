"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

export function usePeriodFilter() {
  const { t } = usePreferences();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function changePeriod(value: string) {
    if (value !== "7" && value !== "30" && value !== "90") {
      return;
    }

    startTransition(function navigateToPeriod() {
      router.replace(`/dashboard?period=${value}`, { scroll: false });
    });
  }

  let statusMessage = "";

  if (pending) {
    statusMessage = t("Updating dashboard");
  }

  return {
    t,
    pending,
    statusMessage,
    changePeriod,
  };
}
