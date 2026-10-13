"use client";

import {
  DataTable,
  DataTableContent,
  DataTableFilters,
  DataTablePanel,
  DataTablePagination,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
} from "@/components/shared/DataTable";
import { MoreMenu } from "@/components/shared/MoreMenu";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type {
  DataTableColumn,
  DataTableFilter,
} from "@/types/shared/data-table.types";
import { USER_STATUS_OPTIONS } from "../constants/user.constants";
import { MOCK_ROLES } from "../mocks/roles.mock";
import type { ManagerUser, UsersTableProps } from "../types/user.types";
import { formatUserTimestamp, getUserRoleName } from "../utils/user.utils";
import { UserStatusBadge } from "./UserStatusBadge";

export function UsersTable({ users, onViewUser, onEditUser }: UsersTableProps) {
  const { t, locale } = usePreferences();
  const roleOptions = MOCK_ROLES.map(function createRoleOption(role) {
    return { value: role.id, label: role.name };
  });

  const columns: readonly DataTableColumn<ManagerUser>[] = [
    // Column User
    {
      id: "user",
      header: t("User"),
      searchValue: function getUserSearchValue(user) {
        return `${user.full_name} ${user.email} ${user.id}`;
      },
      cell: function renderUser(user) {
        return (
          <div className="flex min-w-52 flex-col gap-1">
            <span className="text-sm font-normal text-foreground dark:text-white">
              {user.full_name}
            </span>
            <span className="text-xs font-normal text-success">
              {user.email}
            </span>
          </div>
        );
      },
    },
    // Column Role
    {
      id: "role_id",
      header: t("Role"),
      accessor: "role_id",
      cell: function renderRole(user) {
        const roleName = getUserRoleName(user.role_id, MOCK_ROLES);

        return (
          <div className="flex min-w-44 flex-col gap-1">
            <span className="text-sm font-medium text-foreground">
              {t(roleName)}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {user.role_id}
            </span>
          </div>
        );
      },
    },
    // Column Account status
    {
      id: "user_status",
      header: t("Account status"),
      accessor: "user_status",
      cell: function renderStatus(user) {
        return <UserStatusBadge status={user.user_status} />;
      },
    },
    // Column Timestamps
    {
      id: "timestamps",
      header: t("Timestamps"),
      cell: function renderTimestamps(user) {
        return (
          <div className="flex min-w-64 flex-col gap-1 text-xs">
            <span>
              {t("Created")}: {formatUserTimestamp(user.created_at, locale)}
            </span>
            <span>
              {t("Updated")}: {formatUserTimestamp(user.last_updated_at, locale)}
            </span>
            <span>
              {t("Last login at")}: {formatUserTimestamp(
                user.last_login_at,
                locale,
              )}
            </span>
          </div>
        );
      },
    },
    // Column Actions
    {
      id: "actions",
      header: <span className="sr-only">{t("Actions")}</span>,
      headerClassName: "w-12 text-right",
      className: "w-12 text-right",
      cell: function renderActions(user) {
        return (
          <MoreMenu
            onView={function handleView() {
              onViewUser(user);
            }}
            onEdit={function handleEdit() {
              onEditUser(user);
            }}
            onDelete={function handleDelete() {
              return user.id;
            }}
          />
        );
      },
    },
  ];

  const filters: readonly DataTableFilter<ManagerUser>[] = [
    {
      id: "user_status",
      label: "Account status",
      allLabel: "All account statuses",
      options: USER_STATUS_OPTIONS,
      getValue: function getUserStatus(user) {
        return user.user_status;
      },
    },
    {
      id: "role_id",
      label: "Role",
      allLabel: "All roles",
      options: roleOptions,
      getValue: function getRoleId(user) {
        return user.role_id;
      },
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      filters={filters}
      getRowId={function getUserId(user) {
        return user.id;
      }}
    >
      <DataTablePanel>
        <DataTableToolbar>
          <DataTableSearch placeholder="Search users by name, email or ID..." />
          <DataTableToolbarActions>
            <DataTableFilters />
          </DataTableToolbarActions>
        </DataTableToolbar>

        <DataTableContent
          emptyMessage="No administrator users match your filters."
          className="min-w-[1040px]"
        />

        <DataTablePagination
          itemLabel="administrator users"
          pageSizeOptions={[10]}
        />
      </DataTablePanel>
    </DataTable>
  );
}
