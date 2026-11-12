import type { Metadata } from "next";
import { PoiCategoryOverview } from "@/features/poi-categories/components/PoiCategoryOverview";

export const metadata: Metadata = {
  title: "POI Categories | MANS Admin",
  description: "View the categories used to classify points of interest.",
};

export default function PoiCategoriesPage() {
  return <PoiCategoryOverview />;
}
