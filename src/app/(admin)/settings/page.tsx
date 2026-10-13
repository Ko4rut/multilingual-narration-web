import type { Metadata } from "next";
import { SettingsOverview } from "@/features/settings/components/SettingsOverview";

export const metadata: Metadata = {
  title: "Settings | MANS Admin",
  description: "Configure system preferences and account settings.",
};

export default function SettingsPage() {
  return <SettingsOverview />;
}
