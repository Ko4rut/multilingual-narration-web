import type { ComponentProps, ReactNode } from "react";

export type PageLayoutProps = ComponentProps<"section">;

export type PageLayoutHeaderProps = Omit<
  ComponentProps<"header">,
  "title"
> & {
  title: string;
  description?: string;
};

export type PageLayoutContentProps = ComponentProps<"div">;

export type PageLayoutOverviewProps = ComponentProps<"section">;

export type PageLayoutStatProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  label: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
  iconClassName?: string;
};

export interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export type FeatureFormMode = "create" | "edit" | "view";

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

export type FormFieldProps = {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
};

export type FormComboboxOption = {
  value: string;
  label: string;
};

export type FormComboboxProps = {
  id?: string;
  name: string;
  options: readonly FormComboboxOption[];
  defaultValue?: string | null;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
};

export type MoreMenuProps = {
  onView?: () => void;
  onEdit?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
};
