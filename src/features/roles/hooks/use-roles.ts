"use client";

import { useEffect, useMemo, useState } from "react";
import type { ManagerUser } from "@/features/users/types/user.types";
import {
  createRoleAction,
  loadRoleManagement,
  updateRolePermissionsAction,
} from "../actions";
import { MOCK_ACTIONS } from "../mocks/actions.mock";
import { MOCK_MANAGEMENT_FUNCTIONS } from "../mocks/management-functions.mock";
import type { Permission, Role, RolePermission } from "../types/role.types";
import {
  createPermissionMatrixRows,
  createRoleDirectoryItems,
  getRoleFormValue,
} from "../utils/role.utils";

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [users, setUsers] = useState<ManagerUser[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isCreateSheetOpen, setCreateSheetOpen] = useState(false);
  const [roleFormError, setRoleFormError] = useState<string | null>(null);

  const selectedRole =
    roles.find(function findSelectedRole(role) {
      return role.id === selectedRoleId;
    }) ?? null;

  useEffect(function loadRolesFromApi() {
    let isActive = true;

    async function loadData() {
      const result = await loadRoleManagement();
      if (!isActive) return;
      if (!result.data) {
        setPageError(result.error);
        setLoading(false);
        return;
      }
      setRoles(result.data.roles);
      setPermissions(result.data.permissions);
      setRolePermissions(result.data.rolePermissions);
      setUsers(result.data.users);
      setSelectedRoleId(result.data.roles[0]?.id ?? "");
      setPageError(null);
      setLoading(false);
    }

    void loadData();
    return function cancelLoad() {
      isActive = false;
    };
  }, []);

  const directoryItems = useMemo(
    function createDirectoryItems() {
      return createRoleDirectoryItems(roles, users);
    },
    [roles, users],
  );

  const matrixRows = useMemo(
    function createMatrixRows() {
      if (!selectedRole) return [];
      return createPermissionMatrixRows(
        selectedRole.id,
        rolePermissions,
        MOCK_MANAGEMENT_FUNCTIONS,
        MOCK_ACTIONS,
        permissions,
      );
    },
    [permissions, rolePermissions, selectedRole],
  );

  function handleSelectRole(roleId: string) {
    setSelectedRoleId(roleId);
  }

  async function handlePermissionChange(permissionId: string, checked: boolean) {
    if (!selectedRole) return;
    const currentIds = rolePermissions.flatMap(function getPermissionId(mapping) {
      if (mapping.role_id !== selectedRole.id) return [];
      return [mapping.permission_id];
    });
    let nextIds = currentIds.filter(function removeChangedPermission(id) {
      return id !== permissionId;
    });
    if (checked) nextIds = [...nextIds, permissionId];

    const result = await updateRolePermissionsAction(selectedRole.id, nextIds);
    if (!result.data) {
      setPageError(result.error);
      return;
    }
    setRolePermissions(function replaceSelectedRoleMappings(currentMappings) {
      const otherRoleMappings = currentMappings.filter(function keepOtherRole(mapping) {
        return mapping.role_id !== selectedRole.id;
      });
      const updatedMappings = result.data.map(function createMapping(permission) {
        return { role_id: selectedRole.id, permission_id: permission.id };
      });
      return [...otherRoleMappings, ...updatedMappings];
    });
    setPageError(null);
  }

  function openCreateSheet() {
    setRoleFormError(null);
    setCreateSheetOpen(true);
  }

  function handleCreateSheetOpenChange(open: boolean) {
    setCreateSheetOpen(open);
    if (!open) setRoleFormError(null);
  }

  async function handleCreateRole(formData: FormData) {
    const name = getRoleFormValue(formData, "name");
    if (!name) return;
    const result = await createRoleAction({
      name,
      description: null,
      permission_ids: [],
    });
    if (!result.data) {
      setRoleFormError(result.error);
      return;
    }

    setRoles(function addRole(currentRoles) {
      return [...currentRoles, result.data];
    });
    setSelectedRoleId(result.data.id);
    setRoleFormError(null);
    setCreateSheetOpen(false);
  }

  return {
    actions: MOCK_ACTIONS,
    selectedRole,
    selectedRoleId,
    directoryItems,
    matrixRows,
    isLoading,
    pageError,
    isCreateSheetOpen,
    roleFormError,
    openCreateSheet,
    handleCreateSheetOpenChange,
    handleCreateRole,
    handleSelectRole,
    handlePermissionChange,
  };
}
