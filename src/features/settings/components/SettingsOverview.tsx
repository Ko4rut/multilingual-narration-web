"use client";

import { Button } from "@/components/ui/button";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { useGeneralSettings } from "../hooks/use-general-settings";
import type { SettingsOverviewProps } from "../types";

import { ApplicationDefaults } from "./ApplicationDefaults";
import { GeofenceConfig } from "./GeofenceConfig";
import { SecurityMaintenance } from "./SecurityMaintenance";
import { AudioSystemSettings } from "./AudioSystemSettings";
import { ContentWorkflow } from "./ContentWorkflow";

export function SettingsOverview(props: SettingsOverviewProps) {
  const {
    t,
    formData,
    toggleAutoPublish,
    toggleApproval,
    handleRadiusChange,
    handleLanguageChange,
    handleThemeChange,
    handleSave,
  } = useGeneralSettings(props);

  return (
    <PageLayout>
      <PageLayoutHeader
        title={t("General Settings")}
        description={t(
          "Configure system-wide settings and operational parameters",
        )}
      />

      <PageLayoutContent>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* CỘT TRÁI */}
          <div className="flex flex-col gap-6">
            <ApplicationDefaults
              language={formData.language}
              theme={formData.theme}
              onLanguageChange={handleLanguageChange}
              onThemeChange={handleThemeChange}
            />
            <GeofenceConfig
              triggerRadius={formData.triggerRadius}
              onRadiusChange={handleRadiusChange}
            />
            <SecurityMaintenance />
          </div>

          {/* CỘT PHẢI */}
          <div className="flex flex-col gap-6">
            <AudioSystemSettings />
            <ContentWorkflow
              autoPublish={formData.autoPublish}
              requireApproval={formData.requireApproval}
              onTogglePublish={toggleAutoPublish}
              onToggleApproval={toggleApproval}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center justify-end gap-3">
          <Button type="button" variant="outline">
            {t("Reset to Defaults")}
          </Button>
          <Button type="button" onClick={handleSave}>
            {t("Save Changes")}
          </Button>
        </div>
      </PageLayoutContent>
    </PageLayout>
  );
}
