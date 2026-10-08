"use client";

import {
  FeatureFormSheet,
  FormCombobox,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { USER_STATUS } from "../constants/user.constants";
import { useUserFormSheet } from "../hooks/use-user-form-sheet";
import type { UserFormSheetProps } from "../types/user.types";

export function UserFormSheet({
  open,
  mode,
  user,
  onOpenChange,
  onSubmit,
  onEdit,
}: UserFormSheetProps) {
  const { t, roleOptions, statusOptions, description } = useUserFormSheet(mode);
  const isViewMode = mode === "view";

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
        <FormField label={t("Initial password")} htmlFor="user-password" required>
          <Input
            id="user-password"
            name="password"
            type="password"
            placeholder={t("Enter an initial password")}
            autoComplete="new-password"
            minLength={8}
            required
          />
        </FormField>
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
