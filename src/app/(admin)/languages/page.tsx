import type { Metadata } from "next";
import { LanguageOverview } from "@/features/languages/components/LanguagesOverview";
import { 
  parseLanguageSearchQuery, 
  parseLanguageStatus, 
  parseLanguagePage 
} from "@/features/languages/utils/parsers";
import type { LanguagePageProps } from "@/features/languages/types";

export const metadata: Metadata = {
  title: "Language Management | MANS Admin",
  description: "Manage system languages and translation progress.",
};

export default async function LanguagePage({ searchParams }: LanguagePageProps) {
  const params = await searchParams;

  const q = parseLanguageSearchQuery(params.q);
  const status = parseLanguageStatus(params.status);
  const page = parseLanguagePage(params.page);

  return (
    <LanguageOverview 
      q={q} 
      status={status} 
      page={page} 
    />
  );
}