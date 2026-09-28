import type { Metadata } from "next";
import { PoiContentOverview } from "@/features/poi-content/components/PoiContentOverview";

export const metadata: Metadata = { title: "POIs Content Management" };

export default function Page() {
  return <PoiContentOverview />;
}
