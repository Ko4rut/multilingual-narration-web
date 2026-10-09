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
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from "../constants/user.constants";
import type { ManagerUser, UsersTableProps } from "../types/user.types";
import { UserRoleBadge } from "./UserRoleBadge";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserTimestamp } from "./UserTimestamp";

export function UsersTable({ users, onViewUser, onEditUser }: UsersTableProps) {
  const { t } = usePreferences();

  const columns: readonly DataTableColumn<ManagerUser>[] = [
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
    {
      id: "role_id",
      header: t("Role"),
      accessor: "role_id",
      cell: function renderRole(user) {
        return <UserRoleBadge roleId={user.role_id} />;
      },
    },
    {
      id: "user_status",
      header: t("Account status"),
      accessor: "user_status",
      cell: function renderStatus(user) {
        return <UserStatusBadge status={user.user_status} />;
      },
    },
    {
      id: "last_updated_at",
      header: t("Last updated at"),
      accessor: "last_updated_at",
      cell: function renderLastUpdatedAt(user) {
        return <UserTimestamp value={user.last_updated_at} />;
      },
    },
    {
      id: "last_login_at",
      header: t("Last login at"),
      accessor: "last_login_at",
      cell: function renderLastLoginAt(user) {
        return <UserTimestamp value={user.last_login_at} />;
      },
    },
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
      options: USER_ROLE_OPTIONS,
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
      initialPageSize={10}
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
