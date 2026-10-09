"use client";

import { Clock3, ShieldCheck, UserCheck, UserPlus, UsersRound } from "lucide-react";
import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
  PageLayoutOverview,
  PageLayoutStat,
} from "@/components/shared/PageLayout";
import { Button } from "@/components/ui/button";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { useUsers } from "../hooks/use-users";
import { UserFormSheet } from "./UserFormSheet";
import { UsersTable } from "./UsersTable";

export function UsersOverview() {
  const { t, locale } = usePreferences();
  const {
    users,
    overviewSummary,
    selectedUser,
    sheetMode,
    isSheetOpen,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedUser,
    handleSheetOpenChange,
    handleSubmit,
  } = useUsers();

  let sheetKey = "create";
  if (selectedUser) {
    sheetKey = `${sheetMode}-${selectedUser.id}`;
  }

  return (
    <PageLayout>
      {/* --- PageHeader --- */}
      <PageLayoutHeader title={t("User Management")} description={t("Manage administrator accounts, roles and access status.")}>
        <Button type="button" onClick={openCreateSheet}>
          <UserPlus aria-hidden="true" />
          {t("Add User")}
        </Button>
      </PageLayoutHeader>

      {/* --- PageOvervview --- */}
      <PageLayoutOverview aria-label={t("User overview")}>
        <PageLayoutStat
          label="Total Users"
          value={overviewSummary.totalUsers.toLocaleString(locale)}
          description="Administrator accounts"
          icon={<UsersRound />}
          iconClassName="bg-info/10 text-info"
        />
        <PageLayoutStat
          label="Active"
          value={overviewSummary.activeUsers.toLocaleString(locale)}
          description={`${overviewSummary.activeRate}% ${t("of all users")}`}
          icon={<UserCheck />}
          iconClassName="bg-success/10 text-success"
        />
        <PageLayoutStat
          label="Roles Assigned"
          value={overviewSummary.assignedRoles.toLocaleString(locale)}
          description="RBAC coverage"
          icon={<ShieldCheck />}
        />
        <PageLayoutStat
          label="Online Today"
          value={overviewSummary.onlineToday.toLocaleString(locale)}
          description="Last 24 hours"
          icon={<Clock3 />}
          iconClassName="bg-info/10 text-info"
        />
      </PageLayoutOverview>

      {/* --- PageContent --- */}
      <PageLayoutContent>
        <UsersTable
          users={users}
          onViewUser={openViewSheet}
          onEditUser={openEditSheet}
        />
      </PageLayoutContent>

      {/* --- Sheet --- */}
      <UserFormSheet
        key={sheetKey}
        open={isSheetOpen}
        mode={sheetMode}
        user={selectedUser}
        onOpenChange={handleSheetOpenChange}
        onSubmit={handleSubmit}
        onEdit={editSelectedUser}
      />
    </PageLayout>
  );
}
