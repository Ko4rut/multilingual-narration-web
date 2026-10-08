import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type { AudioFilterBarProps } from "../types";

export function useAudioFilterBar({ initialQ, initialSource, initialField }: AudioFilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = usePreferences();
  
  const [searchValue, setSearchValue] = useState(initialQ || "");

  useEffect(function syncSearchToUrl() {
    const currentQ = searchParams.get("q") || "";
    if (searchValue === currentQ) return;

    const timeoutId = setTimeout(function updateUrl() {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (searchValue) { 
        current.set("q", searchValue); 
      } else { 
        current.delete("q"); 
      }
      
      current.delete("page"); 
      
      const searchStr = current.toString();
      router.push(searchStr ? `${pathname}?${searchStr}` : pathname);
    }, 300);

    return function cleanup() { clearTimeout(timeoutId); };
  }, [searchValue, pathname, router, searchParams]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  function handleSourceChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value && value !== "all") { 
      current.set("source", value); 
    } else { 
      current.delete("source"); 
    }
    
    current.delete("page"); 
    
    const searchStr = current.toString();
    router.push(searchStr ? `${pathname}?${searchStr}` : pathname);
  }

  function handleFieldChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    
    if (value && value !== "all") { 
      current.set("field", value); 
    } else { 
      current.delete("field"); 
    }
    
    current.delete("page");
    
    const searchStr = current.toString();
    router.push(searchStr ? `${pathname}?${searchStr}` : pathname);
  }

  const selectedSource = initialSource || "all";
  const selectedField = initialField || "all";

  return {
    t,
    searchValue,
    selectedSource,
    selectedField,
    handleSearchChange,
    handleSourceChange,
    handleFieldChange
  };
}
