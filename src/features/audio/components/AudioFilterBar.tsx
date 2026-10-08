"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAudioFilterBar } from "../hooks/useAudioFilterBar";
import type { AudioFilterBarProps } from "../types";

export function AudioFilterBar(props: AudioFilterBarProps) { 
  const { 
    t, 
    searchValue, 
    selectedSource, 
    selectedField, 
    handleSearchChange, 
    handleSourceChange, 
    handleFieldChange 
  } = useAudioFilterBar(props);

  return (
    <div className="card mb-4 bg-surface border-border flex flex-wrap items-center gap-3 p-3 rounded-lg">
      <div className="flex-1 min-w-62.5 relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input 
          type="text" 
          value={searchValue}
          onChange={handleSearchChange}
          placeholder={t("Search by audio file, POI name...")} 
          className="w-full bg-background border border-border rounded-md py-2 pl-9 pr-3 text-sm focus-visible:outline-accent"
        />
      </div>
      
      <select 
        value={selectedSource}
        onChange={handleSourceChange}
        className="bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground cursor-pointer"
      >
        <option value="all">{t("Source: All Sources")}</option>
        <option value="Recorded">{t("Recorded")}</option>
        <option value="TTS">{t("TTS")}</option>
      </select>
      
      <select 
        value={selectedField}
        onChange={handleFieldChange}
        className="bg-background border border-border rounded-md py-2 px-3 text-sm text-foreground cursor-pointer"
      >
        <option value="all">{t("Search In: All Fields")}</option>
        <option value="name">{t("Audio File")}</option>
        <option value="poi">{t("Linked POI")}</option>
        <option value="lang">{t("Language")}</option>
        <option value="duration">{t("Duration")}</option>
        <option value="checksum">{t("Checksum")}</option>
        <option value="date">{t("Uploaded At")}</option>
      </select>
      
      <Button variant="outline">
        <SlidersHorizontal className="w-4 h-4 text-muted mr-2" />
        {t("Advanced Filters")}
      </Button>
    </div>
  );
}