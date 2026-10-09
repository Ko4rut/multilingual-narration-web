"use client";

import Link from "next/link";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { ModulePlaceholderProps } from "@/types/shared/module-placeholder.types";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "./PageLayout";

/** Trang chờ dùng cho module đã có route nhưng chưa triển khai luồng nghiệp vụ. */
export function ModulePlaceholder({ title, description }: ModulePlaceholderProps) {
  const { t } = usePreferences();

  return (
    <PageLayout>
      {/* Tiêu đề và mô tả của module. */}
      <PageLayoutHeader title={title} description={description} />
      {/* Empty state hướng dẫn quay về dashboard trong lúc chờ phát triển. */}
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
