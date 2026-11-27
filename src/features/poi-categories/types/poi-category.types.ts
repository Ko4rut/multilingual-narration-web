/** POI Category is shared reference data for POI and offline packages. */
export interface PoiCategory {
  id: string;
  category_name: string;
  category_code: string;
}
export interface PoiCategoryCreatePayload {
  category_name: string;
  category_code: string;
}
export interface PoiCategoryUpdatePayload { category_name: string; }
export type PoiCategorySheetMode = "create" | "edit" | "view";
export interface PoiCategoriesTableProps {
  categories: readonly PoiCategory[];
  selectedCategoryId: string | null;
  onViewCategory(category: PoiCategory): void;
  onEditCategory(category: PoiCategory): void;
  onDeleteCategory(category: PoiCategory): void;
}
export interface PoiCategoryFormSheetProps {
  open: boolean;
  mode: PoiCategorySheetMode;
  category: PoiCategory | null;
  isSaving: boolean;
  errorMessage: string | null;
  onOpenChange(open: boolean): void;
  onEdit(): void;
  onSubmit(formData: FormData): void;
}
export interface PoiCategoryDeleteSheetProps {
  open: boolean;
  category: PoiCategory | null;
  confirmationCode: string;
  isDeleting: boolean;
  errorMessage: string | null;
  onConfirmationCodeChange(value: string): void;
  onOpenChange(open: boolean): void;
  onConfirm(): void;
}
