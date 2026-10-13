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
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  DataTableColumn,
  DataTableFilter,
} from "@/types/shared/data-table.types";
import { CONTENT_STATUS_OPTIONS } from "../constants/poi-content.constants";
import { MOCK_LANGUAGES } from "../mocks/languages.mock";
import { MOCK_POIS } from "../mocks/poi.mock";
import type {
  PoiContent,
  PoiContentTableProps,
} from "../types/poi-content.types";
import {
  createLanguageFilterOptions,
  createPoiFilterOptions,
  findPoiContentLanguage,
  findPoiContentPoi,
} from "../utils/poi-content.utils";
import { PoiContentStatusBadge } from "./PoiContentStatusBadge";
import { PoiContentWorkflowAction } from "./PoiContentWorkflowAction";

export function PoiContentTable({
  contents,
  onViewContent,
  onEditContent,
  onCopyContent,
  onDeleteContent,
  onSubmitContent,
  onReviewContent,
  onPublishContent,
}: PoiContentTableProps) {
  const { t } = usePreferences();
  const languageOptions = createLanguageFilterOptions(MOCK_LANGUAGES);
  const poiOptions = createPoiFilterOptions(MOCK_POIS);
  const columns: readonly DataTableColumn<PoiContent>[] = [
    // Column Narration Content
    {
      id: "content",
      header: t("Narration content"),
      searchValue: function getContentSearchValue(content) {
        return `${content.id} ${content.narration_title} ${content.narration_script}`;
      },
      cell: function renderContent(content) {
        return (
          <div className="flex min-w-80 max-w-96 flex-col gap-1">
            <span className="font-medium text-foreground">
              {content.narration_title}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {content.narration_script}
            </span>
            <span className="font-mono text-xs text-success">
              {content.id}
            </span>
          </div>
        );
      },
    },
    // Column References
    {
      id: "references",
      header: t("References"),
      searchValue: function getReferenceSearchValue(content) {
        const language = findPoiContentLanguage(
          content.language_id,
          MOCK_LANGUAGES,
        );
        const poi = findPoiContentPoi(content.poi_id, MOCK_POIS);
        return `${content.poi_id} ${poi?.poi_name ?? ""} ${content.language_id} ${language?.language_code ?? ""} ${language?.language_name ?? ""}`;
      },
      cell: function renderReferences(content) {
        const language = findPoiContentLanguage(
          content.language_id,
          MOCK_LANGUAGES,
        );
        const poi = findPoiContentPoi(content.poi_id, MOCK_POIS);
        return (
          <div className="flex min-w-52 flex-col gap-1 font-mono text-xs">
            <span>
              {t("POI")}: {poi?.poi_name ?? content.poi_id}
            </span>
            <span>
              {t("Language")}: {t(language?.language_name ?? content.language_id)}
            </span>
          </div>
        );
      },
    },
    // Column Version
    {
      id: "content_version",
      header: t("Version"),
      accessor: "content_version",
      cell: function renderVersion(content) {
        return `v${content.content_version}`;
      },
    },
    // Column Content Status
    {
      id: "content_status",
      header: t("Content status"),
      accessor: "content_status",
      cell: function renderStatus(content) {
        return <PoiContentStatusBadge status={content.content_status} />;
      },
    },
    // Column Workflow
    {
      id: "workflow",
      header: t("Workflow"),
      className: "min-w-44",
      cell: function renderWorkflow(content) {
        return (
          <PoiContentWorkflowAction
            content={content}
            onSubmit={onSubmitContent}
            onReview={onReviewContent}
            onPublish={onPublishContent}
          />
        );
      },
    },
    // Column Actions
    {
      id: "actions",
      header: <span className="sr-only">{t("Actions")}</span>,
      headerClassName: "w-12 text-right",
      className: "w-12 text-right",
      cell: function renderActions(content) {
        return (
          <MoreMenu
            onCopy={function handleCopy() {
              onCopyContent(content);
            }}
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
      id: "poi_id",
      label: "POI",
      allLabel: "All POIs",
      options: poiOptions,
      searchable: true,
      searchPlaceholder: "Search POIs by name or ID...",
      emptyMessage: "No POIs found.",
      getValue: function getPoiId(content) {
        return content.poi_id;
      },
    },
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
          className="min-w-[1000px]"
        />
        <DataTablePagination
          itemLabel="content records"
          pageSizeOptions={[10]}
        />
      </DataTablePanel>
    </DataTable>
  );
}
