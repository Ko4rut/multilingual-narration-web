"use client";

import { useMemo, useState } from "react";

import type { FeatureFormMode } from "@/types/components";
import { USER_ROLE, USER_STATUS } from "../constants/user.constants";
import { MOCK_MANAGER_USERS } from "../mocks/users.mock";
import type {
  ManagerUser,
  ManagerUserRoleId,
  ManagerUserStatus,
  UsersOverviewSummary,
} from "../types/user.types";

function getFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function createUserId(users: readonly ManagerUser[]) {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  let sequence = users.length + 1;
  let id = `user-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;

  while (
    users.some(function hasUser(candidate) {
      return candidate.id === id;
    })
  ) {
    sequence += 1;
    id = `user-${day}${month}${year}-${String(sequence).padStart(4, "0")}`;
  }

  return id;
}

function parseStatus(value: string): ManagerUserStatus {
  if (value === USER_STATUS.DISABLED) {
    return USER_STATUS.DISABLED;
  }
  return USER_STATUS.ACTIVE;
}

function parseRoleId(value: string): ManagerUserRoleId | null {
  if (value === USER_ROLE.SUPER_ADMIN) {
    return USER_ROLE.SUPER_ADMIN;
  }
  if (value === USER_ROLE.CONTENT_MANAGER) {
    return USER_ROLE.CONTENT_MANAGER;
  }
  if (value === USER_ROLE.AUDIO_EDITOR) {
    return USER_ROLE.AUDIO_EDITOR;
  }
  if (value === USER_ROLE.VIEWER) {
    return USER_ROLE.VIEWER;
  }
  return null;
}

function createOverviewSummary(
  users: readonly ManagerUser[],
): UsersOverviewSummary {
  const activeUsers = users.filter(function findActiveUser(user) {
    return user.user_status === USER_STATUS.ACTIVE;
  }).length;
  const assignedRoles = new Set(users.map(function getRoleId(user) {
    return user.role_id;
  })).size;
  const loginTimes = users.flatMap(function getLoginTime(user) {
    if (!user.last_login_at) {
      return [];
    }
    return [new Date(user.last_login_at).getTime()];
  });
  let onlineToday = 0;
  if (loginTimes.length > 0) {
    const latestLoginTime = Math.max(...loginTimes);
    const oneDayBefore = latestLoginTime - 24 * 60 * 60 * 1000;
    onlineToday = loginTimes.filter(function isWithinLastDay(loginTime) {
      return loginTime >= oneDayBefore;
    }).length;
  }
  let activeRate = 0;
  if (users.length > 0) {
    activeRate = Math.round((activeUsers / users.length) * 100);
  }

  return {
    totalUsers: users.length,
    activeUsers,
    activeRate,
    assignedRoles,
    onlineToday,
  };
}

export function useUsers() {
  const [users, setUsers] = useState<ManagerUser[]>(function initializeUsers() {
    return [...MOCK_MANAGER_USERS];
  });
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);

  const selectedUser = users.find(function findSelectedUser(user) {
    return user.id === selectedUserId;
  }) ?? null;
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createOverviewSummary(users);
  }, [users]);

  function openCreateSheet() {
    setSelectedUserId(null);
    setSheetMode("create");
    setSheetOpen(true);
  }

  function openViewSheet(user: ManagerUser) {
    setSelectedUserId(user.id);
    setSheetMode("view");
    setSheetOpen(true);
  }

  function openEditSheet(user: ManagerUser) {
    setSelectedUserId(user.id);
    setSheetMode("edit");
    setSheetOpen(true);
  }

  function editSelectedUser() {
    if (!selectedUser) {
      return;
    }
    setSheetMode("edit");
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSelectedUserId(null);
    }
  }

  function handleSubmit(formData: FormData) {
    const fullName = getFormValue(formData, "full_name");
    const email = getFormValue(formData, "email");
    const roleId = parseRoleId(getFormValue(formData, "role_id"));
    const status = parseStatus(getFormValue(formData, "user_status"));

    if (!fullName || !email || !roleId) {
      return;
    }

    const timestamp = new Date().toISOString();

    if (sheetMode === "create") {
      setUsers(function addUser(currentUsers) {
        const user: ManagerUser = {
          id: createUserId(currentUsers),
          role_id: roleId,
          email,
          password_hash: "[REDACTED]",
          full_name: fullName,
          user_status: status,
          created_at: timestamp,
          last_updated_at: timestamp,
          last_login_at: null,
        };
        return [user, ...currentUsers];
      });
      setSheetOpen(false);
      return;
    }

    if (!selectedUser) {
      return;
    }

    setUsers(function updateUsers(currentUsers) {
      return currentUsers.map(function updateUser(user) {
        if (user.id !== selectedUser.id) {
          return user;
        }
        return {
          ...user,
          role_id: roleId,
          email,
          full_name: fullName,
          user_status: status,
          last_updated_at: timestamp,
        };
      });
    });
    setSheetOpen(false);
  }

  return {
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
  };
}
