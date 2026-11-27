"use client";

import { useEffect, useState } from "react";
import {
  createPoiCategoryAction,
  deletePoiCategoryAction,
  loadPoiCategories,
  updatePoiCategoryAction,
} from "../actions";
import type {
  PoiCategory,
  PoiCategorySheetMode,
} from "../types/poi-category.types";
import {
  getCategoryFormError,
  hasDuplicateCategory,
  parseCategoryForm,
} from "../utils/poi-category.utils";

/** Điều phối dữ liệu từ API, form CRUD và xác nhận xóa. Không dùng dữ liệu giả. */
export function usePoiCategories() {
  const [categories, setCategories] = useState<PoiCategory[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<PoiCategory | null>(null);
  const [sheetMode, setSheetMode] = useState<PoiCategorySheetMode>("create");
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setSaving] = useState(false);

  const [deleteCategory, setDeleteCategory] = useState<PoiCategory | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteConfirmationCode, setDeleteConfirmationCode] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setDeleting] = useState(false);

  useEffect(function loadCategoryRecords() {
    let active = true;

    void loadPoiCategories()
      .then(function receive(result) {
        if (!active) {
          return;
        }
        if (result.data === null) {
          setErrorMessage(result.error ?? "Unable to load POI categories.");
          return;
        }
        setCategories(result.data);
        setErrorMessage(null);
      })
      .catch(function failedToLoad() {
        if (active) {
          setErrorMessage("Unable to load POI categories.");
        }
      })
      .finally(function finishLoad() {
        if (active) {
          setLoading(false);
        }
      });

    return function cancelLoad() {
      active = false;
    };
  }, [reloadVersion]);

  function reload() {
    setLoading(true);
    setErrorMessage(null);
    setReloadVersion(function increment(current) {
      return current + 1;
    });
  }

  function openCreateSheet() {
    setSelectedCategory(null);
    setSheetMode("create");
    setFormError(null);
    setFeedback(null);
    setSheetOpen(true);
  }

  function openViewSheet(category: PoiCategory) {
    setSelectedCategory(category);
    setSheetMode("view");
    setFormError(null);
    setSheetOpen(true);
  }

  function openEditSheet(category: PoiCategory) {
    setSelectedCategory(category);
    setSheetMode("edit");
    setFormError(null);
    setFeedback(null);
    setSheetOpen(true);
  }

  function editSelectedCategory() {
    if (selectedCategory !== null) {
      setSheetMode("edit");
      setFormError(null);
    }
  }

  function changeSheetOpen(open: boolean) {
    if (isSaving) {
      return;
    }
    setSheetOpen(open);
    if (!open) {
      setFormError(null);
    }
  }

  async function submitForm(formData: FormData) {
    if (isSaving || sheetMode === "view") {
      return;
    }
    const payload = parseCategoryForm(formData);
    const validationError = getCategoryFormError(payload);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    if (hasDuplicateCategory(categories, payload, selectedCategory?.id ?? null)) {
      setFormError("Category name or code already exists.");
      return;
    }
    if (sheetMode === "edit" && selectedCategory?.category_name === payload.category_name) {
      setFormError("No Category changes to save.");
      return;
    }
    if (sheetMode === "edit" && selectedCategory === null) {
      setFormError("No Category was selected.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      if (sheetMode === "create") {
        const result = await createPoiCategoryAction(payload);
        if (result.data === null) {
          setFormError(result.error ?? "Unable to create Category.");
          return;
        }
        const created = result.data;
        setCategories(function addCategory(existing) {
          return [...existing, created];
        });
        setFeedback("Category created successfully.");
      } else if (selectedCategory !== null) {
        const result = await updatePoiCategoryAction(selectedCategory.id, {
          category_name: payload.category_name,
        });
        if (result.data === null) {
          setFormError(result.error ?? "Unable to update Category.");
          return;
        }
        const updated = result.data;
        setCategories(function replaceCategory(existing) {
          return existing.map(function replaceItem(item) {
            if (item.id === updated.id) {
              return updated;
            }
            return item;
          });
        });
        setFeedback("Category updated successfully.");
      }
      setSheetOpen(false);
      reload();
    } catch {
      setFormError("Unable to save Category.");
    } finally {
      setSaving(false);
    }
  }

  function openDeleteSheet(category: PoiCategory) {
    setDeleteCategory(category);
    setDeleteConfirmationCode("");
    setDeleteError(null);
    setFeedback(null);
    setDeleteOpen(true);
  }

  function changeDeleteOpen(open: boolean) {
    if (isDeleting) {
      return;
    }
    setDeleteOpen(open);
    if (!open) {
      setDeleteError(null);
      setDeleteConfirmationCode("");
    }
  }

  async function confirmDelete() {
    if (isDeleting || deleteCategory === null) {
      return;
    }
    if (deleteConfirmationCode !== deleteCategory.category_code) {
      setDeleteError("Enter the Category code exactly to confirm deletion.");
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      const result = await deletePoiCategoryAction(deleteCategory.id);
      if (!result.data) {
        setDeleteError(result.error ?? "Unable to delete Category.");
        return;
      }
      setCategories(function removeCategory(existing) {
        return existing.filter(function keepCategory(item) {
          return item.id !== deleteCategory.id;
        });
      });
      setDeleteOpen(false);
      setDeleteCategory(null);
      setDeleteConfirmationCode("");
      setFeedback("Category deleted successfully.");
      reload();
    } catch {
      setDeleteError("Unable to delete Category.");
    } finally {
      setDeleting(false);
    }
  }

  return {
    categories,
    isLoading,
    errorMessage,
    feedback,
    reload,
    selectedCategory,
    sheetMode,
    isSheetOpen,
    isSaving,
    formError,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedCategory,
    changeSheetOpen,
    submitForm,
    deleteCategory,
    isDeleteOpen,
    deleteConfirmationCode,
    deleteError,
    isDeleting,
    openDeleteSheet,
    changeDeleteOpen,
    setDeleteConfirmationCode,
    confirmDelete,
  };
}
