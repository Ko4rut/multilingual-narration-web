/** Bản ghi vai trò tuân theo cấu trúc bảng Roles. */
export interface Role {
  id: string;
  name: string;
  description: string | null;
  created_by: string | null;
  last_updated_by: string | null;
  created_at: string;
  last_updated_at: string | null;
}

export interface RoleCreatePayload {
  name: string;
  description: string | null;
  permission_ids: string[];
}

/** Hành động có thể cấp cho một chức năng quản trị. */
export interface RoleAction {
  id: string;
  name: string;
}

/** Chức năng quản trị xuất hiện trong ma trận phân quyền. */
export interface ManagementFunction {
  id: string;
  name: string;
}

/** Quyền kết hợp một chức năng quản trị với một hành động. */
export interface Permission {
  id: string;
  function_id: string;
  action_id: string;
}

/** Bản ghi liên kết vai trò với một quyền được cấp. */
export interface RolePermission {
  role_id: string;
  permission_id: string;
}

/** Dữ liệu đã tổng hợp để hiển thị một mục trong Roles Directory. */
export interface RoleDirectoryItem {
  role: Role;
  description: string;
  indicatorClassName: string;
  userCount: number;
}

/** Dữ liệu của một ô hành động trong Permission Matrix. */
export interface PermissionMatrixCell {
  action: RoleAction;
  permission: Permission | null;
  checked: boolean;
}

/** Dữ liệu của một hàng chức năng trong Permission Matrix. */
export interface PermissionMatrixRow {
  managementFunction: ManagementFunction;
  cells: readonly PermissionMatrixCell[];
}

/** Thuộc tính hiển thị danh sách và lựa chọn vai trò. */
export interface RoleDirectoryProps {
  items: readonly RoleDirectoryItem[];
  selectedRoleId: string;
  onSelectRole: (roleId: string) => void;
}

/** Thuộc tính hiển thị và cập nhật Permission Matrix. */
export interface PermissionMatrixProps {
  selectedRole: Role;
  actions: readonly RoleAction[];
  rows: readonly PermissionMatrixRow[];
  onPermissionChange: (permissionId: string, checked: boolean) => void;
}

/** Thuộc tính điều khiển sheet tạo vai trò mới. */
export interface RoleFormSheetProps {
  open: boolean;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void | Promise<void>;
}

export interface RoleManagementData {
  roles: Role[];
  permissions: Permission[];
  rolePermissions: RolePermission[];
  users: import("@/features/users/types/user.types").ManagerUser[];
}

export type RoleActionResult<T> = {
  data: T | null;
  error: string | null;
};
