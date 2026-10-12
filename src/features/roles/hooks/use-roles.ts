"use client";

import { useMemo, useState } from "react";
import { MOCK_MANAGER_USERS } from "@/features/users/mocks/users.mock";
import { MOCK_ACTIONS } from "../mocks/actions.mock";
import { MOCK_MANAGEMENT_FUNCTIONS } from "../mocks/management-functions.mock";
import { MOCK_PERMISSIONS } from "../mocks/permissions.mock";
import { MOCK_ROLE_PERMISSIONS } from "../mocks/role-permissions.mock";
import { MOCK_ROLES } from "../mocks/roles.mock";
import type { Role, RolePermission } from "../types/role.types";
import {
  createPermissionMatrixRows,
  createRoleDirectoryItems,
  createRoleId,
  getRoleFormValue,
  hasRoleName,
} from "../utils/role.utils";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>(function initializeRoles() {
    return [...MOCK_ROLES];
  });
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(
    function initializeRolePermissions() {
      return [...MOCK_ROLE_PERMISSIONS];
    },
  );
  const [selectedRoleId, setSelectedRoleId] = useState(MOCK_ROLES[0].id);
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [roleFormError, setRoleFormError] = useState<string | null>(null);

  const selectedRole =
    roles.find(function findSelectedRole(role) {
      return role.id === selectedRoleId;
    }) ?? roles[0];

  const directoryItems = useMemo(
    function createDirectoryItems() {
      return createRoleDirectoryItems(roles, MOCK_MANAGER_USERS);
    },
    [roles],
  );

  const matrixRows = useMemo(
    function createMatrixRows() {
      return createPermissionMatrixRows(
        selectedRole.id,
        rolePermissions,
        MOCK_MANAGEMENT_FUNCTIONS,
        MOCK_ACTIONS,
        MOCK_PERMISSIONS,
      );
    },
    [rolePermissions, selectedRole.id],
  );

  function handleSelectRole(roleId: string) {
    setSelectedRoleId(roleId);
  }

  function handlePermissionChange(permissionId: string, checked: boolean) {
    setRolePermissions(function updateRolePermissions(currentMappings) {
      const mappingExists = currentMappings.some(function findMapping(mapping) {
        return (
          mapping.role_id === selectedRole.id &&
          mapping.permission_id === permissionId
        );
      });

      if (checked && !mappingExists) {
        return [
          ...currentMappings,
          { role_id: selectedRole.id, permission_id: permissionId },
        ];
      }

      if (!checked && mappingExists) {
        return currentMappings.filter(function keepMapping(mapping) {
          return !(
            mapping.role_id === selectedRole.id &&
            mapping.permission_id === permissionId
          );
        });
      }

      return currentMappings;
    });
  }

  function openCreateSheet() {
    setRoleFormError(null);
    setCreateSheetOpen(true);
  }

  function handleCreateSheetOpenChange(open: boolean) {
    setCreateSheetOpen(open);
    if (!open) {
      setRoleFormError(null);
    }
  }

  function handleCreateRole(formData: FormData) {
    const name = getRoleFormValue(formData, "name");
    if (!name) {
      return;
    }
    if (hasRoleName(roles, name)) {
      setRoleFormError("A role with this name already exists.");
      return;
    }

    const id = createRoleId(roles);
    const timestamp = new Date().toISOString();
    const role: Role = {
      id,
      name,
      created_at: timestamp,
      last_updated_at: null,
    };

    setRoles(function addRole(currentRoles) {
      return [...currentRoles, role];
    });
    setSelectedRoleId(id);
    setRoleFormError(null);
    setCreateSheetOpen(false);
  }

  return {
    actions: MOCK_ACTIONS,
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
  };
}
