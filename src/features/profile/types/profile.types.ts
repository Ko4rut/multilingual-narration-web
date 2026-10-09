/** @file Contract dữ liệu và props dành riêng cho feature hồ sơ cá nhân. */
import type { LucideIcon } from "lucide-react";

/** Trạng thái tài khoản có thể hiển thị trên hồ sơ người dùng. */
export type ProfileStatus = "ACTIVE" | "DISABLED";

/** Hồ sơ đầy đủ của nhân viên đang đăng nhập. */
export type EmployeeProfile = {
  id: string;
  fullName: string;
  email: string;
  initials: string;
  phone: string;
  department: string;
  location: string;
  role: string;
  status: ProfileStatus;
  joinedAt: string;
  lastLoginAt: string;
};

/** Một dòng thông tin có icon, nhãn và giá trị trong thẻ hồ sơ. */
export type ProfileInfoItem = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
};

/** Thuộc tính của thẻ hiển thị một nhóm thông tin hồ sơ. */
export type ProfileInfoCardProps = {
  title: string;
  description: string;
  items: readonly ProfileInfoItem[];
};

/** Thuộc tính của thẻ nhận diện người dùng ở đầu trang hồ sơ. */
export type ProfileIdentityCardProps = {
  profile: EmployeeProfile;
  roleLabel: string;
  statusLabel: string;
  employeeIdLabel: string;
};

/** Phản hồi sau khi kiểm tra form đổi mật khẩu ở chế độ demo. */
export type ChangePasswordFeedback = {
  tone: "error" | "success";
  role: "alert" | "status";
  message: string;
};
