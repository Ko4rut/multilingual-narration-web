"use server";

/** Mọi thao tác Admin đi qua server action với phiên và Bearer token. */
import { isAxiosError } from "axios";
import { getAccessToken } from "@/features/auth/session";
import { getApiErrorMessage } from "@/service/api";

import {
  getOfflinePackageItems,
  getOfflinePackageManagement,
  registerOfflinePackageScope,
} from "./api/offline-packages.api";
import type {
  OfflinePackageItem,
  OfflinePackageManagementData,
  PackageScopePayload,
} from "./types";

interface ActionResult<T> {
  data: T | null;
  error: string | null;
}

const EXPIRED_SESSION = "Your API session has expired. Please sign in again.";

export async function loadOfflinePackageManagementAction(): Promise<
  ActionResult<OfflinePackageManagementData>
> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return { data: null, error: EXPIRED_SESSION };
    }
    return { data: await getOfflinePackageManagement(token), error: null };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to load offline packages."),
    };
  }
}

export async function loadOfflinePackageItemsAction(
  packageId: string,
): Promise<ActionResult<OfflinePackageItem[]>> {
  if (!packageId || packageId.length > 50) {
    return { data: null, error: "Invalid package ID." };
  }
  try {
    const token = await getAccessToken();
    if (!token) {
      return { data: null, error: EXPIRED_SESSION };
    }
    return { data: await getOfflinePackageItems(token, packageId), error: null };
  } catch (error) {
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to load package items."),
    };
  }
}

/**
 * Không sửa category_id trên package đã publish: category là một phần package_key.
 * Chỉ đăng ký scope mới; Backend worker chịu trách nhiệm xây dựng và publish.
 */
export async function registerOfflinePackageScopeAction(
  payload: PackageScopePayload,
): Promise<ActionResult<boolean>> {
  if (
    typeof payload.region_id !== "string" ||
    typeof payload.language_id !== "string" ||
    !payload.region_id.trim() ||
    !payload.language_id.trim() ||
    payload.region_id.length > 50 ||
    payload.language_id.length > 50 ||
    (payload.category_id !== null && (
      typeof payload.category_id !== "string" ||
      !payload.category_id.trim() ||
      payload.category_id.length > 50
    ))
  ) {
    return { data: null, error: "Select a valid region, language and category." };
  }

  try {
    const token = await getAccessToken();
    if (!token) {
      return { data: null, error: EXPIRED_SESSION };
    }

    // Không tin ID được gửi từ client; kiểm tra catalog thực tế trên server.
    const catalog = await getOfflinePackageManagement(token);
    const regionExists = catalog.regions.some(function isRegion(item) {
      return item.id === payload.region_id;
    });
    const languageExists = catalog.languages.some(function isLanguage(item) {
      return item.id === payload.language_id && item.language_status === "SUPPORTED";
    });
    let categoryExists = payload.category_id === null;
    if (!categoryExists) {
      categoryExists = catalog.categories.some(function isCategory(item) {
        return item.id === payload.category_id;
      });
    }
    if (!regionExists || !languageExists || !categoryExists) {
      return { data: null, error: "Select a valid region, language and category." };
    }
    const alreadyExists = catalog.packages.some(function sameScope(item) {
      return item.region_id === payload.region_id &&
        item.language_id === payload.language_id &&
        item.category_id === payload.category_id;
    });
    if (alreadyExists) {
      return { data: null, error: "A package for this scope already exists." };
    }
    await registerOfflinePackageScope(token, payload);
    return { data: true, error: null };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      return {
        data: null,
        error: "The Backend does not support category package registration yet.",
      };
    }
    return {
      data: null,
      error: getApiErrorMessage(error, "Unable to register the package scope."),
    };
  }
}
