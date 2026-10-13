"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
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
import {
  COMBOBOX_MATCH_TRIGGER_WIDTH_CLASS,
  FORM_COMBOBOX_DEFAULT_PLACEHOLDER,
} from "@/constants/components";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  FeatureFormSheetProps,
  FormComboboxOption,
  FormComboboxProps,
  FormFieldProps,
  FormMultiComboboxProps,
} from "@/types/shared/feature-form.types";

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

  function handleInteractOutside(event: Event) {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (target.closest('[data-slot="combobox-content"]')) {
      event.preventDefault();
    }
  }

  function handleFocusOutside(event: Event) {
    event.preventDefault();
  }

  return (
    <Sheet modal={false} open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="w-full gap-0 overflow-hidden sm:max-w-lg"
        onFocusOutside={handleFocusOutside}
        onInteractOutside={handleInteractOutside}
      >
        {/* Tiêu đề và mô tả thay đổi theo chế độ của form. */}
        <SheetHeader className="border-b">
          <SheetTitle>
            {modeLabel} {entityLabel}
          </SheetTitle>
          <SheetDescription className="text-xs">
            {description}
          </SheetDescription>
        </SheetHeader>

        {/* Form giữ vùng field có thể cuộn và footer hành động cố định. */}
        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* Nội dung field được feature truyền vào qua children. */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {children}
          </div>
          {/* Các hành động đóng, chỉnh sửa hoặc gửi form theo mode. */}
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
      {/* Nhãn field và dấu bắt buộc. */}
      <Label className="text-xs" htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {/* Control nhập liệu do feature cung cấp. */}
      {children}
      {/* Hướng dẫn bổ sung tùy chọn cho field. */}
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
        <span className="min-w-0 flex-1 truncate">{option.label}</span>
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
      {/* Trigger hiển thị lựa chọn hiện tại hoặc placeholder. */}
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
      {/* Danh sách các lựa chọn được chuẩn hóa từ options. */}
      <ComboboxContent
        className={COMBOBOX_MATCH_TRIGGER_WIDTH_CLASS}
      >
        <ComboboxList className="scrollbar-hidden">
          {options.map(renderOption)}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

/** Combobox chọn nhiều giá trị và gửi mỗi lựa chọn bằng cùng một FormData key. */
export function FormMultiCombobox({
  id,
  name,
  options,
  defaultValue = [],
  disabled,
  placeholder = FORM_COMBOBOX_DEFAULT_PLACEHOLDER,
}: FormMultiComboboxProps) {
  const { t } = usePreferences();
  const anchor = useComboboxAnchor();
  const translatedPlaceholder = t(placeholder);
  const [selectedOptions, setSelectedOptions] = useState<
    FormComboboxOption[]
  >(function initializeSelectedOptions() {
    return options.filter(function isInitiallySelected(option) {
      return defaultValue.includes(option.value);
    });
  });

  function handleValueChange(value: FormComboboxOption[]) {
    setSelectedOptions(value);
  }

  function renderSelectedValues(value: FormComboboxOption[]) {
    let inputPlaceholder = "";
    if (value.length === 0) {
      inputPlaceholder = translatedPlaceholder;
    }

    return (
      <>
        {value.map(function renderSelectedOption(option) {
          return (
            <ComboboxChip
              key={option.value}
              aria-label={option.label}
              showRemove={!disabled}
            >
              {option.label}
            </ComboboxChip>
          );
        })}
        <ComboboxChipsInput
          id={id}
          disabled={disabled}
          placeholder={inputPlaceholder}
          aria-label={translatedPlaceholder}
        />
      </>
    );
  }

  function renderOption(option: FormComboboxOption) {
    return (
      <ComboboxItem
        key={option.value}
        value={option}
        className="text-xs"
      >
        <span className="min-w-0 flex-1 truncate">{option.label}</span>
      </ComboboxItem>
    );
  }

  function renderHiddenInput(option: FormComboboxOption) {
    return (
      <input
        key={option.value}
        type="hidden"
        name={name}
        value={option.value}
        disabled={disabled}
      />
    );
  }

  return (
    <Combobox
      items={options}
      multiple
      value={selectedOptions}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <ComboboxChips
        ref={anchor}
        className="min-h-8 rounded-lg px-2 py-1 text-xs"
      >
        <ComboboxValue>{renderSelectedValues}</ComboboxValue>
        <ComboboxTrigger
          disabled={disabled}
          aria-label={translatedPlaceholder}
          className="ml-auto shrink-0"
        />
      </ComboboxChips>
      <ComboboxContent
        anchor={anchor}
        className={COMBOBOX_MATCH_TRIGGER_WIDTH_CLASS}
      >
        <ComboboxList className="scrollbar-hidden">
          {options.map(renderOption)}
        </ComboboxList>
      </ComboboxContent>
      {selectedOptions.map(renderHiddenInput)}
    </Combobox>
  );
}
