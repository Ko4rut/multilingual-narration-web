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
import { Switch } from "@/components/ui/switch";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  DataTableColumn,
  DataTableFilter,
} from "@/types/shared/data-table.types";
import {
  LANGUAGE_STATUS,
  LANGUAGE_STATUS_OPTIONS,
} from "../constants/language.constants";
import type {
  Language,
  LanguagesTableProps,
} from "../types/language.types";
import { getLanguageIsoStandard } from "../utils/language.utils";
import { LanguageStatusBadge } from "./LanguageStatusBadge";

/** Bảng quản lý ngôn ngữ với tìm kiếm, lọc trạng thái và thao tác từng hàng. */
export function LanguagesTable({
  languages,
  onViewLanguage,
  onEditLanguage,
  onToggleStatus,
}: LanguagesTableProps) {
  const { t } = usePreferences();
  const columns: readonly DataTableColumn<Language>[] = [
    {
      id: "language",
      header: t("Language"),
      searchValue: function getLanguageSearchValue(language) {
        return `${language.language_name} ${language.language_code} ${language.id}`;
      },
      cell: function renderLanguage(language) {
        return (
          <div className="flex min-w-56 items-center gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-mono text-xs font-semibold text-primary uppercase">
              {language.language_code}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {t(language.language_name)}
              </p>
              <p className="truncate font-mono text-xs text-success">
                {language.id}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      id: "language_code",
      header: t("ISO code"),
      accessor: "language_code",
      cell: function renderLanguageCode(language) {
        return (
          <div className="flex min-w-28 flex-col gap-1">
            <span className="font-mono text-sm font-semibold text-foreground uppercase">
              {language.language_code}
            </span>
            <span className="text-xs text-muted-foreground">
              {getLanguageIsoStandard(language.language_code)}
            </span>
          </div>
        );
      },
    },
    {
      id: "language_status",
      header: t("Status"),
      accessor: "language_status",
      cell: function renderStatus(language) {
        return <LanguageStatusBadge status={language.language_status} />;
      },
    },
    {
      id: "availability",
      header: t("Content availability"),
      cell: function renderAvailability(language) {
        const isSupported =
          language.language_status === LANGUAGE_STATUS.SUPPORTED;
        let availabilityLabel = t("New content disabled");
        if (isSupported) {
          availabilityLabel = t("Allow new content");
        }

        return (
          <div className="flex min-w-44 items-center gap-3">
            <Switch
              checked={isSupported}
              onCheckedChange={function handleStatusChange() {
                onToggleStatus(language);
              }}
              aria-label={`${t("Toggle status")}: ${t(language.language_name)}`}
            />
            <span className="text-xs text-muted-foreground">
              {availabilityLabel}
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
      cell: function renderActions(language) {
        return (
          <MoreMenu
            onView={function handleView() {
              onViewLanguage(language);
            }}
            onEdit={function handleEdit() {
              onEditLanguage(language);
            }}
          />
        );
      },
    },
  ];
  const filters: readonly DataTableFilter<Language>[] = [
    {
      id: "language_status",
      label: "Status",
      allLabel: "All language statuses",
      options: LANGUAGE_STATUS_OPTIONS,
      getValue: function getLanguageStatus(language) {
        return language.language_status;
      },
    },
  ];

  return (
    <DataTable
      data={languages}
      columns={columns}
      filters={filters}
      getRowId={function getLanguageId(language) {
        return language.id;
      }}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search language name, ISO code or ID..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>
        <DataTableContent
          emptyMessage="No languages match your filters."
          className="min-w-[900px]"
        />
        <DataTablePagination
          itemLabel="language records"
          pageSizeOptions={[10]}
        />
      </DataTablePanel>
    </DataTable>
  );
}
