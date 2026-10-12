"use client";

import {
  FeatureFormSheet,
  FormField,
} from "@/components/shared/FeatureFormSheet";
import { Input } from "@/components/ui/input";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { RoleFormSheetProps } from "../types/role.types";

export function RoleFormSheet({
  open,
  errorMessage,
  onOpenChange,
  onSubmit,
}: RoleFormSheetProps) {
  const { t } = usePreferences();

  return (
    <FeatureFormSheet
      open={open}
      onOpenChange={onOpenChange}
      mode="create"
      entityLabel={t("Role")}
      description={t("Create a role, then configure its permissions in the matrix.")}
      onSubmit={onSubmit}
    >
      <FormField label={t("Role name")} htmlFor="role-name" required>
        <Input
          id="role-name"
          name="name"
          placeholder={t("Enter a unique role name")}
          required
        />
      </FormField>
      {errorMessage && (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
        >
          {t(errorMessage)}
        </p>
      )}
    </FeatureFormSheet>
  );
}
