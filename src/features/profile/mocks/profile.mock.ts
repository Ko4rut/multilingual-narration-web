import { mockCurrentUser } from "@/mocks/current-user.mock";
import type { EmployeeProfile } from "../types/profile.types";

// Demo only: replace this record with profile data from the authenticated session/API.
export const mockEmployeeProfile: EmployeeProfile = {
  ...mockCurrentUser,
  id: "user-150126-0001",
  phone: "+84 912 345 678",
  department: "System Administration",
  location: "Ho Chi Minh City, Vietnam",
  role: "Super Admin",
  status: "ACTIVE",
  joinedAt: "2026-01-15T08:10:00+07:00",
  lastLoginAt: "2026-10-08T08:35:00+07:00",
};
