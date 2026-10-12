"use client";

import { Plus } from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useRoles } from "../hooks/use-roles";
import { PermissionMatrix } from "./PermissionMatrix";
import { RoleDirectory } from "./RoleDirectory";
import { RoleFormSheet } from "./RoleFormSheet";

export function RolesOverview() {
  const { t } = usePreferences();
  const {
    actions,
    selectedRole,
    selectedRoleId,
    directoryItems,
    matrixRows,
    isCreateSheetOpen,
    roleFormError,
    openCreateSheet,
    handleCreateSheetOpenChange,
    handleCreateRole,
    handleSelectRole,
    handlePermissionChange,
  } = useRoles();

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Role-Based Access Control"
        description="Configure roles, permissions, and access levels for system users."
      >
        <Button type="button" onClick={openCreateSheet}>
          <Plus aria-hidden="true" />
          {t("Create New Role")}
        </Button>
      </PageLayoutHeader>

      <PageLayoutContent className="grid gap-5 lg:grid-cols-[minmax(16rem,0.75fr)_minmax(0,1.75fr)]">
        <RoleDirectory
          items={directoryItems}
          selectedRoleId={selectedRoleId}
          onSelectRole={handleSelectRole}
        />
        <PermissionMatrix
          selectedRole={selectedRole}
          actions={actions}
          rows={matrixRows}
          onPermissionChange={handlePermissionChange}
        />
      </PageLayoutContent>

      <RoleFormSheet
        open={isCreateSheetOpen}
        errorMessage={roleFormError}
        onOpenChange={handleCreateSheetOpenChange}
        onSubmit={handleCreateRole}
      />
    </PageLayout>
  );
}
