import type { Metadata } from "next";

import { OfflinePackageOverview } from "@/features/offline-packages/components/OfflinePackageOverview";

export const metadata: Metadata = {
  title: "Offline Packages | MANS Admin",
  description: "Manage offline package releases and region-language-category scopes.",
};

export default function OfflinePackagesPage() {
  return <OfflinePackageOverview />;
}
