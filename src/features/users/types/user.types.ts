import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { USER_ROLE, USER_STATUS } from "../constants/user.constants";

export type ManagerUserStatus =
  (typeof USER_STATUS)[keyof typeof USER_STATUS];

export type ManagerUserRoleId =
  (typeof USER_ROLE)[keyof typeof USER_ROLE];

export interface ManagerUser {
  id: string;
  role_id: ManagerUserRoleId;
  email: string;
  password_hash: string;
  full_name: string;
  user_status: ManagerUserStatus;
  created_at: string;
  last_updated_at: string | null;
  last_login_at: string | null;
}

export interface UserStatusBadgeProps {
  status: ManagerUserStatus;
}

export interface UserRoleBadgeProps {
  roleId: ManagerUserRoleId;
}

export interface UserTimestampProps {
  value: string | null;
}

export interface UsersTableProps {
  users: readonly ManagerUser[];
  onViewUser: (user: ManagerUser) => void;
  onEditUser: (user: ManagerUser) => void;
}

export interface UserFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  user: ManagerUser | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}

export interface UsersOverviewSummary {
  totalUsers: number;
  activeUsers: number;
  activeRate: number;
  assignedRoles: number;
  onlineToday: number;
}
