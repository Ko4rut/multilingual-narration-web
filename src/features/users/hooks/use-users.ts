"use client";

import { useMemo, useState } from "react";

import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { MOCK_ROLES } from "../mocks/roles.mock";
import { MOCK_MANAGER_USERS } from "../mocks/users.mock";
import type { ManagerUser } from "../types/user.types";
import {
  createUserId,
  createUsersOverviewSummary,
  getUserFormValue,
  parseUserRoleId,
  parseUserStatus,
} from "../utils/user.utils";

export function useUsers() {
  const [users, setUsers] = useState<ManagerUser[]>(function initializeUsers() {
    return [...MOCK_MANAGER_USERS];
  });
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const selectedUser = users.find(function findSelectedUser(user) {
    return user.id === selectedUserId;
  }) ?? null;
  const overviewSummary = useMemo(function getOverviewSummary() {
    return createUsersOverviewSummary(users);
  }, [users]);

  function openCreateSheet() {
    setSelectedUserId(null);
    setSheetMode("create");
    setSheetOpen(true);
    setFormError(null);
  }

  function openViewSheet(user: ManagerUser) {
    setSelectedUserId(user.id);
    setSheetMode("view");
    setSheetOpen(true);
    setFormError(null);
  }

  function openEditSheet(user: ManagerUser) {
    setSelectedUserId(user.id);
    setSheetMode("edit");
    setSheetOpen(true);
    setFormError(null);
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
      setFormError(null);
    }
  }

  function handleSubmit(formData: FormData) {
    const fullName = getUserFormValue(formData, "full_name");
    const email = getUserFormValue(formData, "email");
    const roleId = parseUserRoleId(
      getUserFormValue(formData, "role_id"),
      MOCK_ROLES,
    );
    const status = parseUserStatus(
      getUserFormValue(formData, "user_status"),
    );

    if (!fullName || !email || !roleId) {
      return;
    }

    const creationDate = new Date();
    const timestamp = creationDate.toISOString();

    if (sheetMode === "create") {
      const password = getUserFormValue(formData, "password");
      const passwordConfirmation = getUserFormValue(
        formData,
        "password_confirmation",
      );
      if (password.length < 8) {
        setFormError("Initial password must contain at least 8 characters.");
        return;
      }
      if (password !== passwordConfirmation) {
        setFormError("Initial passwords do not match.");
        return;
      }
      setFormError(null);
      setUsers(function addUser(currentUsers) {
        const user: ManagerUser = {
          id: createUserId(currentUsers, creationDate),
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
    formError,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedUser,
    handleSheetOpenChange,
    handleSubmit,
  };
}
