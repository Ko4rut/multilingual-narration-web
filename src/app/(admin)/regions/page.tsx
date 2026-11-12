import type { Metadata } from "next";
import { RegionOverview } from "@/features/regions/components/RegionOverview";

export const metadata: Metadata = {
  title: "Regions | MANS Admin",
  description: "View the region catalog used to organize points of interest.",
};

export default function RegionsPage() {
  return <RegionOverview />;
}
