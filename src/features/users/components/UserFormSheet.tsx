"use client";

import { Eye, EyeOff } from "lucide-react";
import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { USER_STATUS } from "../constants/user.constants";
import { useUserFormSheet } from "../hooks/use-user-form-sheet";
import type { UserFormSheetProps } from "../types/user.types";

export function UserFormSheet({
  open,
  mode,
  user,
  errorMessage,
  onOpenChange,
  onSubmit,
  onEdit,
}: UserFormSheetProps) {
  const {
    t,
    roleOptions,
    statusOptions,
    description,
    showPassword,
    showPasswordConfirmation,
    togglePasswordVisibility,
    togglePasswordConfirmationVisibility,
  } = useUserFormSheet(mode);
  const isViewMode = mode === "view";
  let passwordType = "password";
  let passwordToggleLabel = t("Show password");
  let PasswordVisibilityIcon = Eye;
  let passwordConfirmationType = "password";
  let passwordConfirmationToggleLabel = t("Show password");
  let PasswordConfirmationVisibilityIcon = Eye;

  if (showPassword) {
    passwordType = "text";
    passwordToggleLabel = t("Hide password");
    PasswordVisibilityIcon = EyeOff;
  }

  if (showPasswordConfirmation) {
    passwordConfirmationType = "text";
    passwordConfirmationToggleLabel = t("Hide password");
    PasswordConfirmationVisibilityIcon = EyeOff;
  }

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode={mode}
      entityLabel={t("User")}
      description={description}
      onSubmit={onSubmit}
      canEdit={isViewMode}
      onEdit={onEdit}
    >
      <FormField label={t("Full name")} htmlFor="user-full-name" required>
        <Input
          id="user-full-name"
          name="full_name"
          defaultValue={user?.full_name ?? ""}
          placeholder={t("Enter full name")}
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField label={t("Email")} htmlFor="user-email" required>
        <Input
          id="user-email"
          name="email"
          type="email"
          defaultValue={user?.email ?? ""}
          placeholder={t("Enter email address")}
          disabled={isViewMode}
          required
        />
      </FormField>

      {mode === "create" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label={t("Initial password")}
              htmlFor="user-password"
              hint={t("Use at least 8 characters.")}
              required
            >
              <InputGroup>
                <InputGroupInput
                  id="user-password"
                  name="password"
                  type={passwordType}
                  placeholder={t("Enter an initial password")}
                  autoComplete="new-password"
                  minLength={8}
                  aria-invalid={Boolean(errorMessage)}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    aria-label={passwordToggleLabel}
                    aria-pressed={showPassword}
                    onClick={togglePasswordVisibility}
                  >
                    <PasswordVisibilityIcon aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </FormField>

            <FormField
              label={t("Confirm initial password")}
              htmlFor="user-password-confirmation"
              required
            >
              <InputGroup>
                <InputGroupInput
                  id="user-password-confirmation"
                  name="password_confirmation"
                  type={passwordConfirmationType}
                  placeholder={t("Re-enter the initial password")}
                  autoComplete="new-password"
                  minLength={8}
                  aria-invalid={Boolean(errorMessage)}
                  required
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupButton
                    type="button"
                    size="icon-sm"
                    aria-label={passwordConfirmationToggleLabel}
                    aria-pressed={showPasswordConfirmation}
                    onClick={togglePasswordConfirmationVisibility}
                  >
                    <PasswordConfirmationVisibilityIcon aria-hidden="true" />
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </FormField>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
            >
              {t(errorMessage)}
            </p>
          )}
        </>
      )}

      <FormField label={t("Role")} htmlFor="user-role" required>
        <FormCombobox
          id="user-role"
          name="role_id"
          options={roleOptions}
          defaultValue={user?.role_id ?? null}
          placeholder="Select a role"
          disabled={isViewMode}
          required
        />
      </FormField>

      <FormField label={t("Account status")} htmlFor="user-status" required>
        <FormCombobox
          id="user-status"
          name="user_status"
          options={statusOptions}
          defaultValue={user?.user_status ?? USER_STATUS.ACTIVE}
          placeholder="Select an account status"
          disabled={isViewMode}
          required
        />
      </FormField>
    </FeatureFormSheet>
  );
}
