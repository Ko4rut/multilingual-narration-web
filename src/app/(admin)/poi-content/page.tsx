import type { Metadata } from "next";
import { PoiContentOverview } from "@/features/poi-contents/components/PoiContentOverview";

export const metadata: Metadata = { title: "POIs Content Management" };

export default function Page() {
  return <PoiContentOverview />;
}
