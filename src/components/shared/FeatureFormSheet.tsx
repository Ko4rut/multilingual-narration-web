"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FORM_COMBOBOX_DEFAULT_PLACEHOLDER } from "@/constants/components";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";
import type {
  FeatureFormSheetProps,
  FormComboboxOption,
  FormComboboxProps,
  FormFieldProps,
} from "@/types/components";

/**
 * Sheet dùng chung cho các form tạo mới, chỉnh sửa và xem chi tiết dữ liệu.
 * Các nút hành động ở footer được hiển thị dựa trên `mode` và quyền chỉnh sửa.
 */
export function FeatureFormSheet({
  open,
  onOpenChange,
  mode,
  entityLabel,
  description,
  children,
  onSubmit,
  canEdit,
  onEdit,
}: FeatureFormSheetProps) {
  const { t } = usePreferences();
  let modeLabel = t("Add");
  let dismissLabel = t("Cancel");
  let submitLabel = t("Create");

  if (mode === "edit") {
    modeLabel = t("Edit");
    submitLabel = t("Save changes");
  }

  if (mode === "view") {
    modeLabel = t("View");
    dismissLabel = t("Close");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.(new FormData(event.currentTarget));
  }

  function handleClose() {
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-hidden sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>
            {modeLabel} {entityLabel}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {description}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {children}
          </div>
          <SheetFooter className="border-t">
            <div className="flex w-full justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>
                {dismissLabel}
              </Button>
              {mode === "view" && canEdit && onEdit && (
                <Button type="button" onClick={onEdit}>
                  {t("Edit")}
                </Button>
              )}
              {mode !== "view" && (
                <Button type="submit">{submitLabel}</Button>
              )}
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

/** Bọc label, nội dung field và phần hướng dẫn để các form có bố cục thống nhất. */
export function FormField({
  label,
  htmlFor,
  required,
  children,
  hint,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/** Combobox dùng chung cho các trường lựa chọn trong feature form. */
export function FormCombobox({
  id,
  name,
  options,
  defaultValue,
  disabled,
  required,
  placeholder = FORM_COMBOBOX_DEFAULT_PLACEHOLDER,
}: FormComboboxProps) {
  const { t } = usePreferences();
  const translatedPlaceholder = t(placeholder);

  function renderValue(value: unknown) {
    if (typeof value !== "string") {
      return translatedPlaceholder;
    }

    const selectedOption = options.find(function findSelectedOption(option) {
      return option.value === value;
    });

    return selectedOption?.label ?? translatedPlaceholder;
  }

  function renderOption(option: FormComboboxOption) {
    return (
      <ComboboxItem
        key={option.value}
        value={option.value}
        className="text-xs"
      >
        {option.label}
      </ComboboxItem>
    );
  }

  return (
    <Combobox
      name={name}
      defaultValue={defaultValue ?? null}
      disabled={disabled}
      required={required}
    >
      <ComboboxTrigger
        id={id}
        disabled={disabled}
        aria-required={required}
        className="flex h-8 w-full items-center justify-between rounded-lg border border-input bg-background px-2.5 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <ComboboxValue placeholder={translatedPlaceholder}>
          {renderValue}
        </ComboboxValue>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxList>{options.map(renderOption)}</ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
