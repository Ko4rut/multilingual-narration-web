"use client";

import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable";
import { MoreMenu } from "@/components/shared/MoreMenu";
import { MOCK_LANGUAGES } from "@/features/languages/mocks/languages.mock";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  DataTableColumn,
  DataTableFilter,
} from "@/types/shared/data-table.types";
import { CONTENT_STATUS_OPTIONS } from "../constants/poi-content.constants";
import type {
  PoiContent,
  PoiContentTableProps,
} from "../types/poi-content.types";
import { PoiContentStatusBadge } from "./PoiContentStatusBadge";

function formatTimestamp(value: string | null, locale: string) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString(locale);
}

export function PoiContentTable({
  contents,
  onViewContent,
  onEditContent,
  onDeleteContent,
}: PoiContentTableProps) {
  const { t, locale } = usePreferences();
  const languageOptions = MOCK_LANGUAGES.map(function createLanguageOption(
    language,
  ) {
    return { value: language.id, label: language.language_name };
  });
  const columns: readonly DataTableColumn<PoiContent>[] = [
    {
      id: "content",
      header: t("Narration content"),
      searchValue: function getContentSearchValue(content) {
        return `${content.id} ${content.narration_title} ${content.narration_script}`;
      },
      cell: function renderContent(content) {
        return (
          <div className="flex min-w-80 max-w-112 flex-col gap-1">
            <span className="font-medium text-foreground">
              {content.narration_title}
            </span>
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {content.narration_script}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {content.id}
            </span>
          </div>
        );
      },
    },
    {
      id: "references",
      header: t("References"),
      searchValue: function getReferenceSearchValue(content) {
        const language = MOCK_LANGUAGES.find(function findLanguage(candidate) {
          return candidate.id === content.language_id;
        });
        return `${content.poi_id} ${content.language_id} ${language?.language_code ?? ""} ${language?.language_name ?? ""}`;
      },
      cell: function renderReferences(content) {
        const language = MOCK_LANGUAGES.find(function findLanguage(candidate) {
          return candidate.id === content.language_id;
        });
        return (
          <div className="flex min-w-52 flex-col gap-1 font-mono text-xs">
            <span>
              {t("POI")}: {content.poi_id}
            </span>
            <span>
              {t("Language")}: {t(language?.language_name ?? content.language_id)}
            </span>
          </div>
        );
      },
    },
    {
      id: "content_version",
      header: t("Version"),
      accessor: "content_version",
      cell: function renderVersion(content) {
        return `v${content.content_version}`;
      },
    },
    {
      id: "content_status",
      header: t("Content status"),
      accessor: "content_status",
      cell: function renderStatus(content) {
        return <PoiContentStatusBadge status={content.content_status} />;
      },
    },
    {
      id: "workflow_users",
      header: t("Workflow users"),
      searchValue: function getWorkflowUserSearchValue(content) {
        return [
          content.created_by,
          content.approved_by,
          content.published_by,
        ].join(" ");
      },
      cell: function renderWorkflowUsers(content) {
        return (
          <div className="flex min-w-52 flex-col gap-1 text-xs">
            <span>
              {t("Created by")}: {content.created_by}
            </span>
            <span>
              {t("Approved by")}: {content.approved_by ?? "—"}
            </span>
            <span>
              {t("Published by")}: {content.published_by ?? "—"}
            </span>
          </div>
        );
      },
    },
    {
      id: "workflow_timestamps",
      header: t("Workflow timestamps"),
      searchValue: function getWorkflowTimestampSearchValue(content) {
        return [
          content.created_at,
          content.approved_at,
          content.published_at,
        ].join(" ");
      },
      cell: function renderWorkflowTimestamps(content) {
        return (
          <div className="flex min-w-64 flex-col gap-1 text-xs">
            <span>
              {t("Created")}: {formatTimestamp(content.created_at, locale)}
            </span>
            <span>
              {t("Approved")}: {formatTimestamp(content.approved_at, locale)}
            </span>
            <span>
              {t("Published")}: {formatTimestamp(content.published_at, locale)}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: <span className="sr-only">{t("Actions")}</span>,
      headerClassName: "w-12 text-right",
      className: "w-12 text-right",
      cell: function renderActions(content) {
        return (
          <MoreMenu
            onView={function handleView() {
              onViewContent(content);
            }}
            onEdit={function handleEdit() {
              onEditContent(content);
            }}
            onDelete={function handleDelete() {
              onDeleteContent(content);
            }}
          />
        );
      },
    },
  ];
  const filters: readonly DataTableFilter<PoiContent>[] = [
    {
      id: "content_status",
      label: "Content status",
      allLabel: "All content statuses",
      options: CONTENT_STATUS_OPTIONS,
      getValue: function getContentStatus(content) {
        return content.content_status;
      },
    },
    {
      id: "language_id",
      label: "Language",
      allLabel: "All languages",
      options: languageOptions,
      getValue: function getLanguageId(content) {
        return content.language_id;
      },
    },
  ];

  return (
    <DataTable
      data={contents}
      columns={columns}
      filters={filters}
      getRowId={function getContentId(content) {
        return content.id;
      }}
      initialPageSize={10}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search content by title, script, POI or ID..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>
        <DataTableContent
          emptyMessage="No POI content matches your filters."
          className="min-w-[1320px]"
        />
        <DataTablePagination
          itemLabel="content records"
          pageSizeOptions={[10]}
        />
      </DataTablePanel>
    </DataTable>
  );
}
