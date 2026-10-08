"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePeriodFilter } from "../hooks/use-period-filter";
import type { PeriodFilterProps } from "../types";

export function PeriodFilter({ period }: PeriodFilterProps) {
  const { t, pending, statusMessage, changePeriod } = usePeriodFilter();

  return (
    <div className="period-filter">
      <Select value={period} disabled={pending} onValueChange={changePeriod}>
        <SelectTrigger
          aria-label={t("Reporting period")}
          aria-busy={pending}
          className="min-w-36 bg-surface"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" align="end">
          <SelectItem value="7">
            {t("Last 7 Days")}
          </SelectItem>
          <SelectItem value="30">
            {t("Last 30 Days")}
          </SelectItem>
          <SelectItem value="90">
            {t("Last 90 Days")}
          </SelectItem>
        </SelectContent>
      </Select>
      <span role="status" className="sr-only">
        {statusMessage}
      </span>
    </div>
  );
}
