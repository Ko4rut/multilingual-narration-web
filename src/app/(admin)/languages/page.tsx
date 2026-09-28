import type { Metadata } from "next";
import { LanguagesOverview } from "@/features/languages/components/LanguagesOverview";

export const metadata: Metadata = { title: "Language Management" };

export default function Page() {
  return <LanguagesOverview />;
}
