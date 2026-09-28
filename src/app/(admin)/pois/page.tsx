import type { Metadata } from "next";
import { PoisOverview } from "@/features/pois/components/PoisOverview";

export const metadata: Metadata = { title: "POI Management" };

export default function Page() {
  return <PoisOverview />;
}
