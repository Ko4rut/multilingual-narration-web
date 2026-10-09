"use client";

import {
  Building2,
  CalendarDays,
  Clock3,
  IdCard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import { mockEmployeeProfile } from "../mocks/profile.mock";
import type { ProfileInfoItem } from "../types/profile.types";

/** Chuẩn bị dữ liệu đã dịch và định dạng cho màn hình hồ sơ cá nhân. */
export function useProfileOverview() {
  const { locale, t } = usePreferences();
  const profile = mockEmployeeProfile;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const personalItems: readonly ProfileInfoItem[] = [
    {
      id: "email",
      label: t("Email address"),
      value: profile.email,
      icon: Mail,
    },
    {
      id: "phone",
      label: t("Phone number"),
      value: profile.phone,
      icon: Phone,
    },
    {
      id: "department",
      label: t("Department"),
      value: t(profile.department),
      icon: Building2,
    },
    {
      id: "location",
      label: t("Location"),
      value: t(profile.location),
      icon: MapPin,
    },
  ];

  const accountItems: readonly ProfileInfoItem[] = [
    {
      id: "employee-id",
      label: t("Employee ID"),
      value: profile.id,
      icon: IdCard,
    },
    {
      id: "role",
      label: t("Access role"),
      value: t(profile.role),
      icon: ShieldCheck,
    },
    {
      id: "joined-at",
      label: t("Member since"),
      value: dateFormatter.format(new Date(profile.joinedAt)),
      icon: CalendarDays,
    },
    {
      id: "last-login",
      label: t("Last sign in"),
      value: dateFormatter.format(new Date(profile.lastLoginAt)),
      icon: Clock3,
    },
  ];

  let statusLabel = t("Disabled");
  if (profile.status === "ACTIVE") {
    statusLabel = t("Active");
  }

  return {
    t,
    profile,
    personalItems,
    accountItems,
    statusLabel,
  };
}
