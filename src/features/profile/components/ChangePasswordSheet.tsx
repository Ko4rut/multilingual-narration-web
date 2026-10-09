"use client";

import { KeyRound } from "lucide-react";
import { FormField } from "@/components/shared/FeatureFormSheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useChangePassword } from "../hooks/use-change-password";

/** Hiển thị nút và sheet đổi mật khẩu của người dùng hiện tại. */
export function ChangePasswordSheet() {
  const {
    t,
    open,
    feedback,
    handleOpenChange,
    handleClose,
    handleSubmit,
  } = useChangePassword();

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          <KeyRound aria-hidden="true" />
          {t("Change password")}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full gap-0 overflow-hidden sm:max-w-md">
        <SheetHeader className="border-b">
          <SheetTitle>{t("Change password")}</SheetTitle>
          <SheetDescription className="text-xs">
            {t("Choose a strong password for your employee account.")}
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex min-h-0 flex-1 flex-col"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 space-y-5 overflow-y-auto p-4">
            <div className="rounded-lg border border-warning/30 bg-warning-bg p-3 text-xs text-warning">
              {t("Demo mode: password changes are not persisted.")}
            </div>
            <FormField
              label={t("Current password")}
              htmlFor="current-password"
              required
            >
              <Input
                id="current-password"
                name="currentPassword"
                type="password"
                autoComplete="current-password"
                required
              />
            </FormField>
            <FormField
              label={t("New password")}
              htmlFor="new-password"
              required
              hint={t("Use at least 8 characters.")}
            >
              <Input
                id="new-password"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </FormField>
            <FormField
              label={t("Confirm new password")}
              htmlFor="confirm-password"
              required
            >
              <Input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </FormField>
            {feedback && (
              <p
                role={feedback.role}
                data-tone={feedback.tone}
                className="rounded-lg border p-3 text-xs data-[tone=error]:border-destructive/30 data-[tone=error]:bg-destructive/10 data-[tone=error]:text-destructive data-[tone=success]:border-success/30 data-[tone=success]:bg-success/10 data-[tone=success]:text-success"
              >
                {feedback.message}
              </p>
            )}
          </div>
          <SheetFooter className="border-t">
            <div className="flex w-full justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                {t("Cancel")}
              </Button>
              <Button type="submit">{t("Change password")}</Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
