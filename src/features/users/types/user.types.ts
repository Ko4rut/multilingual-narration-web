import type { FeatureFormMode } from "@/types/shared/feature-form.types";
import type { USER_STATUS } from "../constants/user.constants";

/** Tập giá trị trạng thái hợp lệ của tài khoản quản trị. */
export type ManagerUserStatus =
  (typeof USER_STATUS)[keyof typeof USER_STATUS];

/** Dữ liệu vai trò được dùng để gán quyền cho người dùng quản trị. */
export interface ManagerRole {
  id: string;
  name: string;
  created_at: string;
  last_updated_at: string | null;
}

/** Kiểu mã định danh của vai trò quản trị. */
export type ManagerUserRoleId = ManagerRole["id"];

/** Bản ghi người dùng quản trị tuân theo cấu trúc bảng Management_Users. */
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

/** Thuộc tính hiển thị badge trạng thái của người dùng. */
export interface UserStatusBadgeProps {
  status: ManagerUserStatus;
}

/** Thuộc tính của bảng danh sách người dùng và các thao tác trên từng hàng. */
export interface UsersTableProps {
  users: readonly ManagerUser[];
  onViewUser: (user: ManagerUser) => void;
  onEditUser: (user: ManagerUser) => void;
}

/** Thuộc tính điều khiển sheet tạo mới, xem và chỉnh sửa người dùng. */
export interface UserFormSheetProps {
  open: boolean;
  mode: FeatureFormMode;
  user: ManagerUser | null;
  errorMessage: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (formData: FormData) => void;
  onEdit: () => void;
}

/** Các chỉ số tổng quan được tính từ danh sách người dùng hiện tại. */
export interface UsersOverviewSummary {
  totalUsers: number;
  activeUsers: number;
  activeRate: number;
  assignedRoles: number;
  onlineToday: number;
}
