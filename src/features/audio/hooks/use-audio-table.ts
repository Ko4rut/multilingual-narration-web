import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { MOCK_AUDIO_FILES } from "../mocks/audioData";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { AUDIO_ITEMS_PER_PAGE } from "../constants";
import type { AudioTableProps } from "../types";

export function useAudioTable({ q, source, field, currentPage }: AudioTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = usePreferences();

  //  Lọc dữ liệu 
  const filteredFiles = MOCK_AUDIO_FILES.filter(function applyFilters(file) {
    let matchSearch = true;
    
    if (q) {
      const lowerQ = q.toLowerCase();
      let isMatch = false;

      if (field === "all") {
        if (file.name.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.poi.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.lang.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.langCode.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.type.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.duration.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.checksum.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.date.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }

      if (field === "name") {
        if (file.name.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }
      if (field === "poi") {
        if (file.poi.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }
      if (field === "lang") {
        if (file.lang.toLowerCase().includes(lowerQ)) { isMatch = true; }
        if (file.langCode.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }
      if (field === "duration") {
        if (file.duration.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }
      if (field === "checksum") {
        if (file.checksum.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }
      if (field === "date") {
        if (file.date.toLowerCase().includes(lowerQ)) { isMatch = true; }
      }

      if (!isMatch) {
        matchSearch = false;
      }
    }
    
    let matchSource = true;
    if (source && source !== "all") {
      if (file.type !== source) {
        matchSource = false;
      }
    }
    
    return matchSearch && matchSource;
  });

  // phân trang
  const totalItems = filteredFiles.length;
  let totalPages = Math.ceil(totalItems / AUDIO_ITEMS_PER_PAGE);
  if (totalPages === 0) {
    totalPages = 1;
  }
  
  let validPage = currentPage;
  if (validPage < 1) {
    validPage = 1;
  }
  if (validPage > totalPages) {
    validPage = totalPages;
  }

  const startIndex = (validPage - 1) * AUDIO_ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + AUDIO_ITEMS_PER_PAGE, totalItems);
  const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

  //  Hàm xử lý chuyển URL
  function handlePageChange(newPage: number) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", newPage.toString());
    router.push(`${pathname}?${current.toString()}`);
  }

  function handlePrev() {
    if (validPage > 1) {
      handlePageChange(validPage - 1);
    }
  }

  function handleNext() {
    if (validPage < totalPages) {
      handlePageChange(validPage + 1);
    }
  }

  // nút phân trang
  function getPaginationItems(current: number, total: number) {
    if (total <= 5) {
      const items = [];
      for (let i = 1; i <= total; i++) {
        items.push(i);
      }
      return items;
    }

    if (current <= 3) {
      return [1, 2, 3, "...", total];
    }

    if (current >= total - 2) {
      return [1, "...", total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
  }

  const paginationItems = getPaginationItems(validPage, totalPages);

  return {
    t,
    totalItems,
    paginatedFiles,
    startIndex,
    endIndex,
    validPage,
    totalPages,
    paginationItems,
    handlePageChange,
    handlePrev,
    handleNext
  };
}
