import type { Metadata } from "next";
import { PoiCategoryOverview } from "@/features/poi-categories/components/PoiCategoryOverview";

export const metadata: Metadata = {
  title: "POI Categories | MANS Admin",
  description: "Manage categories used to classify POIs and build offline packages.",
};

export default function PoiCategoriesPage() {
  return <PoiCategoryOverview />;
}
