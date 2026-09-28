import type { Metadata } from "next";
import { SettingsOverview } from "@/features/settings/components/SettingsOverview";

export const metadata: Metadata = { title: "General Settings" };

export default function Page() {
  return <SettingsOverview />;
}
