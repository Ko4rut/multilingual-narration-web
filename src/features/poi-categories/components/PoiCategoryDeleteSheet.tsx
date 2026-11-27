"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { PoiCategoryDeleteSheetProps } from "../types/poi-category.types";

/** Requires entering the exact immutable code before a destructive request. */
export function PoiCategoryDeleteSheet({
  open,
  category,
  confirmationCode,
  isDeleting,
  errorMessage,
  onConfirmationCodeChange,
  onOpenChange,
  onConfirm,
}: PoiCategoryDeleteSheetProps) {
  const { t } = usePreferences();
  const canDelete = category !== null &&
    confirmationCode === category.category_code && !isDeleting;

  function closeSheet() {
    onOpenChange(false);
  }

  function changeConfirmationCode(event: React.ChangeEvent<HTMLInputElement>) {
    onConfirmationCodeChange(event.target.value);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canDelete) {
      onConfirm();
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full gap-0 overflow-hidden sm:max-w-lg">
        <SheetHeader className="border-b">
          <SheetTitle>{t("Delete POI Category")}</SheetTitle>
          <SheetDescription>
            {t("Confirm the category before requesting permanent deletion.")}
          </SheetDescription>
        </SheetHeader>
        {category && (
          <form className="flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
            <div className="scrollbar-hidden flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning-bg p-3">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-warning" />
                <p className="text-xs text-foreground">
                  {t("Category deletion must be blocked by the Backend when referenced by POIs or offline packages.")}
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-sm font-medium text-foreground">{category.category_name}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {category.category_code} · {category.id}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-category-code" className="text-xs">
                  {t("Type the Category code to confirm")}
                </Label>
                <Input
                  id="confirm-category-code"
                  value={confirmationCode}
                  onChange={changeConfirmationCode}
                  placeholder={category.category_code}
                  autoCapitalize="none"
                  autoComplete="off"
                  spellCheck={false}
                  disabled={isDeleting}
                  className="font-mono"
                />
              </div>
              {errorMessage && (
                <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {t(errorMessage)}
                </p>
              )}
            </div>
            <SheetFooter className="border-t">
              <div className="flex w-full justify-end gap-2">
                <Button type="button" variant="outline" disabled={isDeleting} onClick={closeSheet}>
                  {t("Cancel")}
                </Button>
                <Button type="submit" variant="destructive" disabled={!canDelete}>
                  {isDeleting && t("Deleting Category...")}
                  {!isDeleting && t("Delete Category")}
                </Button>
              </div>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
