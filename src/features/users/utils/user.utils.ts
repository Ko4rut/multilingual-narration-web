import type { Locale } from "@/i18n/types";
import { USER_STATUS } from "../constants/user.constants";
import type {
  ManagerRole,
  ManagerUser,
  ManagerUserRoleId,
  ManagerUserStatus,
  UsersOverviewSummary,
} from "../types/user.types";

/** Đọc một trường chuỗi từ FormData và loại bỏ khoảng trắng ở hai đầu. */
export function getUserFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

/** Tạo mã người dùng dạng user-ddmmyy-xxxx và tránh trùng với dữ liệu hiện có. */
export function createUserId(
  users: readonly ManagerUser[],
  creationDate: Date,
) {
  const day = String(creationDate.getDate()).padStart(2, "0");
  const month = String(creationDate.getMonth() + 1).padStart(2, "0");
  const year = String(creationDate.getFullYear()).slice(-2);
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

/** Chuẩn hóa giá trị trạng thái form về một trạng thái tài khoản hợp lệ. */
export function parseUserStatus(value: string): ManagerUserStatus {
  if (value === USER_STATUS.DISABLED) {
    return USER_STATUS.DISABLED;
  }
  return USER_STATUS.ACTIVE;
}

/** Kiểm tra mã vai trò có tồn tại trong danh sách role trước khi gán cho user. */
export function parseUserRoleId(
  value: string,
  roles: readonly ManagerRole[],
): ManagerUserRoleId | null {
  const role = roles.find(function findRole(candidate) {
    return candidate.id === value;
  });
  if (role) {
    return role.id;
  }
  return null;
}

/** Lấy tên hiển thị của vai trò và dùng role ID làm giá trị dự phòng. */
export function getUserRoleName(
  roleId: ManagerUserRoleId,
  roles: readonly ManagerRole[],
) {
  const role = roles.find(function findRole(candidate) {
    return candidate.id === roleId;
  });
  return role?.name ?? roleId;
}

/** Định dạng timestamp theo locale hiện tại hoặc trả về dấu gạch khi chưa có dữ liệu. */
export function formatUserTimestamp(value: string | null, locale: Locale) {
  if (!value) {
    return "—";
  }
  return new Date(value).toLocaleString(locale);
}

/** Tổng hợp số lượng, tỷ lệ hoạt động, role và lượt đăng nhập gần nhất của users. */
export function createUsersOverviewSummary(
  users: readonly ManagerUser[],
): UsersOverviewSummary {
  const activeUsers = users.filter(function findActiveUser(user) {
    return user.user_status === USER_STATUS.ACTIVE;
  }).length;
  const assignedRoles = new Set(
    users.map(function getRoleId(user) {
      return user.role_id;
    }),
  ).size;
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
