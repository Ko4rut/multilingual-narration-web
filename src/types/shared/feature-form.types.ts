import type { ReactNode } from "react";

/** Các chế độ thao tác được hỗ trợ bởi form sheet dùng chung. */
export type FeatureFormMode = "create" | "edit" | "view";

/** Thuộc tính điều khiển sheet tạo mới, chỉnh sửa hoặc xem dữ liệu. */
export type FeatureFormSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FeatureFormMode;
  entityLabel: string;
  description: string;
  children: ReactNode;
  onSubmit?: (formData: FormData) => void;
  canEdit?: boolean;
  onEdit?: () => void;
};

/** Thuộc tính cho một field gồm label, nội dung nhập và hướng dẫn. */
export type FormFieldProps = {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
};

/** Một lựa chọn giá trị và nhãn hiển thị trong combobox. */
export type FormComboboxOption = {
  value: string;
  label: string;
};

/** Thuộc tính cấu hình combobox dùng trong các feature form. */
export type FormComboboxProps = {
  id?: string;
  name: string;
  options: readonly FormComboboxOption[];
  defaultValue?: string | null;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
};
