"use client";

import { CalendarDays, Clock3, IdCard, Mail, ShieldCheck, UserRound } from "lucide-react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { EmployeeProfile, ProfileInfoItem } from "../types/profile.types";

/** Chuẩn bị dữ liệu backend đã dịch và định dạng cho màn hình hồ sơ. */
export function useProfileOverview(profile: EmployeeProfile) {
  const { locale, t } = usePreferences();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  let lastLogin = "—";
  if (profile.lastLoginAt) {
    lastLogin = dateFormatter.format(new Date(profile.lastLoginAt));
  }

  const personalItems: readonly ProfileInfoItem[] = [
    { id: "full-name", label: t("Full name"), value: profile.fullName, icon: UserRound },
    { id: "email", label: t("Email address"), value: profile.email, icon: Mail },
  ];
  const accountItems: readonly ProfileInfoItem[] = [
    { id: "employee-id", label: t("Employee ID"), value: profile.id, icon: IdCard },
    { id: "role", label: t("Access role"), value: profile.role, icon: ShieldCheck },
    { id: "joined-at", label: t("Member since"), value: dateFormatter.format(new Date(profile.joinedAt)), icon: CalendarDays },
    { id: "last-login", label: t("Last sign in"), value: lastLogin, icon: Clock3 },
  ];

  let statusLabel = t("Inactive");
  if (profile.status === "ACTIVE") {
    statusLabel = t("Active");
  }
  return { t, profile, personalItems, accountItems, statusLabel };
}
