"use client";

import React from "react";
import { usePoiContent } from "../hooks/usePoiContent";
import { PoiContentHeader } from "./PoiContentHeader";
import { PoiContentFilterBar } from "./PoiContentFilterBar";
import { PoiContentTable } from "./PoiContentTable";
import { PoiContentPagination } from "./PoiContentPagination";

export function PoiContentOverview() {
  const {
    contents,
    languages,
    searchQuery,
    setSearchQuery,
    languageFilter,
    setLanguageFilter,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    totalItems,
    totalPages,
  } = usePoiContent();

  return (
    <div className="w-full">
      {/* Header */}
      <PoiContentHeader />

      {/* Filter Toolbar */}
      <PoiContentFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        languages={languages}
        selectedLanguage={languageFilter}
        onLanguageChange={setLanguageFilter}
        selectedStatus={statusFilter}
        onStatusChange={setStatusFilter}
      />

      {/* Content Table */}
      <PoiContentTable contents={contents} />

      {/* Pagination */}
      <PoiContentPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
