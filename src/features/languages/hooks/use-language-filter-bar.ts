import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

export function useLanguageFilterBar(initialQ: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = usePreferences();

  const [searchValue, setSearchValue] = useState(initialQ || "");

  useEffect(function syncSearchToUrl() {
    const currentQ = searchParams.get("q") || "";
    if (searchValue === currentQ) {
      return;
    }

    const timeoutId = setTimeout(function updateUrl() {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      
      if (searchValue) {
        current.set("q", searchValue);
      } else {
        current.delete("q");
      }
      
      const searchStr = current.toString();
      let query = "";
      if (searchStr) {
        query = `?${searchStr}`;
      }
      
      router.push(`${pathname}${query}`);
    }, 300);

    return function cleanup() {
      clearTimeout(timeoutId);
    };
  }, [searchValue, pathname, router, searchParams]);

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
  }

  return {
    t,
    searchValue,
    handleSearchChange
  };
}
