"use client";

import Link from "next/link";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { ModulePlaceholderProps } from "@/types/components";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "./PageLayout";

export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  const { t } = usePreferences();

  return (
    <PageLayout>
      <PageLayoutHeader title={title} description={description} />
      <PageLayoutContent>
        <section className="card empty-state">
          <span className="eyebrow">{t("READY FOR DEVELOPMENT")}</span>
          <h2>{t(title)}</h2>
          <p>
            {t(
              "The route and workspace layout are ready. Connect this module to your API to add management workflows.",
            )}
          </p>
          <Link href="/dashboard" className="button">
            {t("Back to dashboard")}
          </Link>
        </section>
      </PageLayoutContent>
    </PageLayout>
  );
}
