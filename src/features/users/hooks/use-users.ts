"use client";

import { useEffect, useMemo, useState } from "react";
import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import { createUser, loadUserManagement, updateUser } from "../actions";
import type { ManagerRole, ManagerUser } from "../types/user.types";
import {
  createUsersOverviewSummary,
  getUserSecretFormValue,
  getUserFormValue,
  parseUserRoleId,
  parseUserStatus,
} from "../utils/user.utils";

export function useUsers() {
  const [users, setUsers] = useState<ManagerUser[]>([]);
  const [roles, setRoles] = useState<ManagerRole[]>([]);
  const [selectedUser, setSelectedUser] = useState<ManagerUser | null>(null);
  const [sheetMode, setSheetMode] = useState<FeatureFormMode>("create");
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(function loadUsersFromApi() {
    let active = true;
    async function load() {
      try {
        const result = await loadUserManagement();
        if (active) {
          if (result.data) {
            setUsers(result.data.users);
            setRoles(result.data.roles);
          }
          setLoadError(result.error);
        }
      } catch (error) {
        if (active) {
          let message = "Unable to load users.";
          if (error instanceof Error) {
            message = error.message;
          }
          setLoadError(message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    void load();
    return function cancelLoad() {
      active = false;
    };
  }, []);

  const overviewSummary = useMemo(function summarizeUsers() {
    return createUsersOverviewSummary(users);
  }, [users]);

  function openViewSheet(user: ManagerUser) {
    setSelectedUser(user);
    setSheetMode("view");
    setSheetOpen(true);
    setFormError(null);
  }

  function openEditSheet(user: ManagerUser) {
    setSelectedUser(user);
    setSheetMode("edit");
    setSheetOpen(true);
    setFormError(null);
  }

  function openCreateSheet() {
    setSelectedUser(null);
    setSheetMode("create");
    setSheetOpen(true);
    setFormError(null);
  }

  function editSelectedUser() {
    if (selectedUser) {
      setSheetMode("edit");
    }
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setSelectedUser(null);
      setFormError(null);
    }
  }

  async function handleSubmit(formData: FormData) {
    const fullName = getUserFormValue(formData, "full_name");
    const email = getUserFormValue(formData, "email");
    const roleId = parseUserRoleId(getUserFormValue(formData, "role_id"), roles);
    const userStatus = parseUserStatus(getUserFormValue(formData, "user_status"));
    if (!fullName || !email || !roleId) {
      setFormError("Please provide all required user fields.");
      return;
    }

    try {
      if (sheetMode === "create") {
        const password = getUserSecretFormValue(formData, "password");
        const confirmation = getUserSecretFormValue(formData, "password_confirmation");
        if (password.length < 8) {
          setFormError("Initial password must contain at least 8 characters.");
          return;
        }
        if (password !== confirmation) {
          setFormError("Initial passwords do not match.");
          return;
        }
        const result = await createUser({
          role_id: roleId,
          email,
          password,
          full_name: fullName,
          user_status: userStatus,
        });
        if (!result.data) {
          setFormError(result.error ?? "Unable to create manager user.");
          return;
        }
        setUsers(function addUser(currentUsers) {
          return [result.data!, ...currentUsers];
        });
      } else {
        if (!selectedUser) {
          return;
        }
        const result = await updateUser(selectedUser.id, {
          role_id: roleId,
          email,
          full_name: fullName,
          user_status: userStatus,
        });
        if (!result.data) {
          setFormError(result.error ?? "Unable to update manager user.");
          return;
        }
        const updated = result.data;
        setUsers(function replaceUser(currentUsers) {
          return currentUsers.map(function replace(candidate) {
            if (candidate.id === updated.id) {
              return updated;
            }
            return candidate;
          });
        });
      }
      setFormError(null);
      setSheetOpen(false);
    } catch (error) {
      let message = "Unable to save user.";
      if (error instanceof Error) {
        message = error.message;
      }
      setFormError(message);
    }
  }

  return {
    users,
    roles,
    overviewSummary,
    selectedUser,
    sheetMode,
    isSheetOpen,
    formError,
    loadError,
    isLoading,
    openCreateSheet,
    openViewSheet,
    openEditSheet,
    editSelectedUser,
    handleSheetOpenChange,
    handleSubmit,
  };
}
