import type { ManagerUser } from "@/features/users/types/user.types";
import type { Locale } from "@/i18n/types";
import {
  DEFAULT_ROLE_PRESENTATION,
  ROLE_PRESENTATION,
} from "../constants/role.constants";
import type {
  ManagementFunction,
  Permission,
  PermissionMatrixRow,
  Role,
  RoleAction,
  RoleDirectoryItem,
  RolePermission,
} from "../types/role.types";

/** Đọc một trường chuỗi từ FormData và loại bỏ khoảng trắng ở hai đầu. */
export function getRoleFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

/** Tạo mã vai trò dạng role-xxxx và tránh trùng với dữ liệu hiện có. */
export function createRoleId(roles: readonly Role[]) {
  let sequence = roles.length + 1;
  let id = `role-${String(sequence).padStart(4, "0")}`;

  while (
    roles.some(function hasRole(role) {
      return role.id === id;
    })
  ) {
    sequence += 1;
    id = `role-${String(sequence).padStart(4, "0")}`;
  }

  return id;
}

/** Kiểm tra tên vai trò đã tồn tại mà không phân biệt chữ hoa, chữ thường. */
export function hasRoleName(roles: readonly Role[], name: string) {
  const normalizedName = name.toLocaleLowerCase();
  return roles.some(function matchRoleName(role) {
    return role.name.toLocaleLowerCase() === normalizedName;
  });
}

/** Kết hợp role với thông tin trình bày và số người dùng để tạo Roles Directory. */
export function createRoleDirectoryItems(
  roles: readonly Role[],
  users: readonly ManagerUser[],
): readonly RoleDirectoryItem[] {
  return roles.map(function createDirectoryItem(role) {
    const presentation =
      ROLE_PRESENTATION[role.id] ?? DEFAULT_ROLE_PRESENTATION;
    const userCount = users.filter(function countRoleUser(user) {
      return user.role_id === role.id;
    }).length;

    return {
      role,
      description: presentation.description,
      indicatorClassName: presentation.indicatorClassName,
      userCount,
    };
  });
}

/** Dựng các hàng và ô quyền của Permission Matrix cho vai trò đang được chọn. */
export function createPermissionMatrixRows(
  roleId: string,
  rolePermissions: readonly RolePermission[],
  managementFunctions: readonly ManagementFunction[],
  actions: readonly RoleAction[],
  permissions: readonly Permission[],
): readonly PermissionMatrixRow[] {
  const selectedPermissionIds = new Set(
    rolePermissions.flatMap(function getSelectedPermissionId(mapping) {
      if (mapping.role_id !== roleId) {
        return [];
      }
      return [mapping.permission_id];
    }),
  );

  return managementFunctions.map(function createMatrixRow(managementFunction) {
    const cells = actions.map(function createMatrixCell(action) {
      const permission =
        permissions.find(function findPermission(candidate) {
          return (
            candidate.function_id === managementFunction.id &&
            candidate.action_id === action.id
          );
        }) ?? null;

      return {
        action,
        permission,
        checked: Boolean(
          permission && selectedPermissionIds.has(permission.id),
        ),
      };
    });

    return { managementFunction, cells };
  });
}

/** Định dạng ngày của vai trò theo locale đang được người dùng lựa chọn. */
export function formatRoleDate(value: string, locale: Locale) {
  return new Date(value).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
