import type { Metadata } from "next";
import { LanguageOverview } from "@/features/languages/components/LanguagesOverview";

export const metadata: Metadata = {
  title: "Language Management | MANS Admin",
  description: "Manage system languages and translation progress.",
};

export default function LanguagePage() {
  return <LanguageOverview />;
}
