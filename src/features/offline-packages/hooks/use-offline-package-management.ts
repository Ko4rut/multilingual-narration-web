"use client";

/**
 * State cho danh sách, xem membership và form đăng ký package scope.
 * Đổi lựa chọn sẽ vô hiệu hóa kết quả detail request cũ.
 */
import { useCallback, useEffect, useRef, useState } from "react";

import {
  loadOfflinePackageItemsAction,
  loadOfflinePackageManagementAction,
  registerOfflinePackageScopeAction,
} from "../actions";
import type {
  OfflinePackage,
  OfflinePackageItem,
  OfflinePackageManagementData,
  PackageScopePayload,
} from "../types";
import { NO_CATEGORY_SCOPE } from "../utils";

const EMPTY_DATA: OfflinePackageManagementData = {
  packages: [],
  regions: [],
  languages: [],
  categories: [],
};

function getRequiredValue(data: FormData, name: string): string {
  const value = data.get(name);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

export function useOfflinePackageManagement() {
  const [data, setData] = useState<OfflinePackageManagementData>(EMPTY_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const [selectedPackage, setSelectedPackage] = useState<OfflinePackage | null>(null);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [items, setItems] = useState<OfflinePackageItem[]>([]);
  const [isLoadingItems, setLoadingItems] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const detailRequestId = useRef(0);

  const [isScopeOpen, setScopeOpen] = useState(false);
  const [isSavingScope, setSavingScope] = useState(false);
  const [scopeError, setScopeError] = useState<string | null>(null);

  useEffect(function loadManagement() {
    let active = true;
    setIsLoading(true);
    setLoadError(null);

    void loadOfflinePackageManagementAction()
      .then(function applyManagement(result) {
        if (!active) {
          return;
        }
        if (result.data === null) {
          setLoadError(result.error ?? "Unable to load offline packages.");
          return;
        }
        setData(result.data);
      })
      .catch(function handleManagementError() {
        if (active) {
          setLoadError("Unable to load offline packages.");
        }
      })
      .finally(function finishManagement() {
        if (active) {
          setIsLoading(false);
        }
      });

    return function cancelManagement() {
      active = false;
    };
  }, [version]);

  const refresh = useCallback(function refresh() {
    setVersion(function nextVersion(current) {
      return current + 1;
    });
  }, []);

  function openPackageDetails(packageRecord: OfflinePackage) {
    const requestId = ++detailRequestId.current;
    setSelectedPackage(packageRecord);
    setItems([]);
    setItemsError(null);
    setLoadingItems(true);
    setDetailOpen(true);

    void loadOfflinePackageItemsAction(packageRecord.id)
      .then(function applyItems(result) {
        if (requestId !== detailRequestId.current) {
          return;
        }
        if (result.data === null) {
          setItemsError(result.error ?? "Unable to load package items.");
          return;
        }
        setItems(result.data);
      })
      .catch(function handleItemsError() {
        if (requestId === detailRequestId.current) {
          setItemsError("Unable to load package items.");
        }
      })
      .finally(function finishItems() {
        if (requestId === detailRequestId.current) {
          setLoadingItems(false);
        }
      });
  }

  function changeDetailsOpen(open: boolean) {
    setDetailOpen(open);
    if (!open) {
      detailRequestId.current += 1;
      setSelectedPackage(null);
    }
  }

  function openScopeForm() {
    setScopeError(null);
    setFeedback(null);
    setScopeOpen(true);
  }

  function changeScopeOpen(open: boolean) {
    if (isSavingScope) {
      return;
    }
    setScopeOpen(open);
    if (!open) {
      setScopeError(null);
    }
  }

  async function submitScope(formData: FormData) {
    if (isSavingScope) {
      return;
    }
    const regionId = getRequiredValue(formData, "region_id");
    const languageId = getRequiredValue(formData, "language_id");
    const categoryValue = getRequiredValue(formData, "category_id");
    let categoryId: string | null = categoryValue;
    if (categoryValue === NO_CATEGORY_SCOPE || categoryValue === "") {
      categoryId = null;
    }

    if (!regionId || !languageId) {
      setScopeError("Select a valid region, language and category.");
      return;
    }

    const payload: PackageScopePayload = {
      region_id: regionId,
      language_id: languageId,
      category_id: categoryId,
    };
    const duplicate = data.packages.some(function sameScope(item) {
      return item.region_id === regionId &&
        item.language_id === languageId &&
        item.category_id === categoryId;
    });
    if (duplicate) {
      setScopeError("A package for this scope already exists.");
      return;
    }

    setSavingScope(true);
    setScopeError(null);
    try {
      const result = await registerOfflinePackageScopeAction(payload);
      if (!result.data) {
        setScopeError(result.error ?? "Unable to register the package scope.");
        return;
      }
      setScopeOpen(false);
      setFeedback("Package scope registered. The worker will publish it automatically.");
      refresh();
    } catch {
      setScopeError("Unable to register the package scope.");
    } finally {
      setSavingScope(false);
    }
  }

  return {
    data,
    isLoading,
    loadError,
    feedback,
    refresh,
    selectedPackage,
    isDetailOpen,
    items,
    isLoadingItems,
    itemsError,
    openPackageDetails,
    changeDetailsOpen,
    isScopeOpen,
    isSavingScope,
    scopeError,
    openScopeForm,
    changeScopeOpen,
    submitScope,
  };
}
