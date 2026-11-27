/** UI validation, repeated at the authenticated server boundary. */
import type { PoiCategory, PoiCategoryCreatePayload } from "../types/poi-category.types";
export const CATEGORY_CODE_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function parseCategoryForm(formData: FormData): PoiCategoryCreatePayload {
  const name = formData.get("category_name");
  const code = formData.get("category_code");
  let categoryName = "";
  let categoryCode = "";
  if (typeof name === "string") {
    categoryName = name.trim();
  }
  if (typeof code === "string") {
    categoryCode = code.trim();
  }
  return { category_name: categoryName, category_code: categoryCode };
}
export function getCategoryFormError(payload: PoiCategoryCreatePayload): string | null {
  if (!payload.category_name || !payload.category_code) {
    return "Complete the category name and code.";
  }
  if (payload.category_name.length > 120) {
    return "Category name must be 120 characters or fewer.";
  }
  if (payload.category_code.length > 30 || !CATEGORY_CODE_PATTERN.test(payload.category_code)) {
    return "Category code must use lowercase letters, digits and hyphens (max 30).";
  }
  return null;
}
export function hasDuplicateCategory(
  categories: readonly PoiCategory[],
  payload: PoiCategoryCreatePayload,
  excludingId: string | null,
): boolean {
  const lowerName = payload.category_name.toLowerCase();
  return categories.some(function isDuplicate(category) {
    if (category.id === excludingId) {
      return false;
    }
    return category.category_code === payload.category_code ||
      category.category_name.trim().toLowerCase() === lowerName;
  });
}
