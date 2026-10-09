import type { Metadata } from "next";
import { SettingsOverview } from "@/features/settings/components/SettingsOverview";
import { parseSettingsTab } from "@/features/settings/utils/parsers";
import type { SettingsPageProps } from "@/features/settings/types/settings.types";

export const metadata: Metadata = {
  title: "Settings | MANS Admin",
  description: "Configure system preferences and account settings.",
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const tab = parseSettingsTab(params.tab);

  return (
    <SettingsOverview tab={tab} />
  );
}