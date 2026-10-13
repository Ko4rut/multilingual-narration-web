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
import {
  AUDIO_MIME_TYPE_OPTIONS,
  AUDIO_SOURCE_TYPE_OPTIONS,
} from "../constants/audio.constants";
import type { AudioTableProps, ContentAudio } from "../types/audio.types";
import {
  findAudioPoiContent,
  formatAudioDuration,
} from "../utils/audio.utils";
import { AudioStatusBadge } from "./AudioStatusBadge";

export function AudioTable({
  audios,
  languages,
  contents,
  pois,
  selectedAudioId,
  onPreviewAudio,
  onEditAudio,
  onCopyAudio,
  onDeleteAudio,
}: AudioTableProps) {
  const { t, locale } = usePreferences();
  const byteFormatter = new Intl.NumberFormat(locale, {
    style: "unit",
    unit: "megabyte",
    maximumFractionDigits: 2,
  });
  const columns: readonly DataTableColumn<ContentAudio>[] = [
    {
      id: "audio",
      header: t("Audio record"),
      searchValue: function getAudioSearchValue(audio) {
        return `${audio.id} ${audio.audio_url}`;
      },
      cell: function renderAudio(audio) {
        return (
          <div className="flex min-w-80 max-w-104 flex-col gap-1">
            <span className="font-mono text-xs font-medium text-foreground">
              {audio.id}
            </span>
            <a
              href={audio.audio_url}
              target="_blank"
              rel="noreferrer"
              className="truncate text-xs text-primary hover:underline"
            >
              {audio.audio_url}
            </a>
          </div>
        );
      },
    },
    {
      id: "poi_content_id",
      header: t("Narration content"),
      searchValue: function getContentSearchValue(audio) {
        const content = findAudioPoiContent(audio.poi_content_id, contents);
        return `${audio.poi_content_id} ${content?.narration_title ?? ""}`;
      },
      cell: function renderContent(audio) {
        const content = findAudioPoiContent(audio.poi_content_id, contents);
        return (
          <div className="flex min-w-56 max-w-72 flex-col gap-1">
            <span className="truncate text-sm text-foreground">
              {content?.narration_title ?? audio.poi_content_id}
            </span>
            <span className="truncate font-mono text-xs text-success">
              {audio.poi_content_id}
            </span>
          </div>
        );
      },
    },
    {
      id: "audio_source_type",
      header: t("Source type"),
      accessor: "audio_source_type",
      cell: function renderSource(audio) {
        return <AudioStatusBadge type={audio.audio_source_type} />;
      },
    },
    {
      id: "media",
      header: t("Media details"),
      searchValue: function getMediaSearchValue(audio) {
        return `${audio.audio_mime_type} ${audio.audio_duration_sec} ${audio.audio_size}`;
      },
      cell: function renderMedia(audio) {
        return (
          <div className="flex min-w-40 flex-col gap-1 text-xs">
            <span>{audio.audio_mime_type}</span>
            <span>
              {formatAudioDuration(audio.audio_duration_sec)} ·{" "}
              {byteFormatter.format(audio.audio_size / 1_000_000)}
            </span>
          </div>
        );
      },
    },
    {
      id: "timestamps",
      header: t("Timestamps"),
      searchValue: function getTimestampSearchValue(audio) {
        return [audio.created_at, audio.last_updated_at].join(" ");
      },
      cell: function renderTimestamps(audio) {
        let updatedAt = "—";
        if (audio.last_updated_at) {
          updatedAt = new Date(audio.last_updated_at).toLocaleString(locale);
        }
        return (
          <div className="flex min-w-64 flex-col gap-1 text-xs">
            <span>
              {t("Created")}: {new Date(audio.created_at).toLocaleString(locale)}
            </span>
            <span>
              {t("Updated")}: {updatedAt}
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
      cell: function renderActions(audio) {
        return (
          <MoreMenu
            onEdit={function handleEdit() {
              onEditAudio(audio);
            }}
            onCopy={function handleCopy() {
              onCopyAudio(audio);
            }}
            onDelete={function handleDelete() {
              onDeleteAudio(audio);
            }}
          />
        );
      },
    },
  ];
  const languageOptions = languages.map(function createLanguageOption(language) {
    return {
      value: language.id,
      label: language.language_name,
    };
  });
  const poiOptions = pois.map(function createPoiOption(poi) {
    return {
      value: poi.id,
      label: poi.poi_name,
      description: poi.id,
    };
  });
  const filters: readonly DataTableFilter<ContentAudio>[] = [
    {
      id: "poi_id",
      label: "POI",
      allLabel: "All POIs",
      options: poiOptions,
      searchable: true,
      searchPlaceholder: "Search POIs by name or ID...",
      emptyMessage: "No POIs found.",
      getValue: function getPoiId(audio) {
        return findAudioPoiContent(audio.poi_content_id, contents)?.poi_id ?? "";
      },
    },
    {
      id: "language_id",
      label: "Language",
      allLabel: "All languages",
      options: languageOptions,
      getValue: function getLanguageId(audio) {
        return findAudioPoiContent(audio.poi_content_id, contents)?.language_id ?? "";
      },
    },
    {
      id: "audio_source_type",
      label: "Source type",
      allLabel: "All source types",
      options: AUDIO_SOURCE_TYPE_OPTIONS,
      getValue: function getSourceType(audio) {
        return audio.audio_source_type;
      },
    },
    {
      id: "audio_mime_type",
      label: "MIME type",
      allLabel: "All MIME types",
      options: AUDIO_MIME_TYPE_OPTIONS,
      getValue: function getMimeType(audio) {
        return audio.audio_mime_type;
      },
    },
  ];

  return (
    <DataTable
      data={audios}
      columns={columns}
      filters={filters}
      getRowId={function getAudioId(audio) {
        return audio.id;
      }}
      selectedRowId={selectedAudioId ?? undefined}
      onRowClick={onPreviewAudio}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search audio by ID, content ID or URL..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>
        <DataTableContent
          emptyMessage="No audio records match your filters."
          className="min-w-[1000px]"
        />
        <DataTablePagination
          itemLabel="audio records"
          pageSizeOptions={[10]}
        />
      </DataTablePanel>
    </DataTable>
  );
}
