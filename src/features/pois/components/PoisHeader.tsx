import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoisHeaderProps } from "../types";

export function PoisHeader({ onAddClick }: PoisHeaderProps) {
  const { t } = usePreferences();

  return (
    <div className="page-header">
      <div>
        <h1>{t("Point of Interest Management")}</h1>
        <p>
          {t("Manage point of interest listings, GPS coordinates, geofence trigger radiuses, and automated audio assets.")}
        </p>
      </div>
      <div>
        <Button
          type="button"
          onClick={onAddClick}
          className="cursor-pointer"
          title={t("Add POI")}
        >
          <Plus aria-hidden="true" />
          <span>{t("Add POI")}</span>
        </Button>
      </div>
    </div>
  );
}
