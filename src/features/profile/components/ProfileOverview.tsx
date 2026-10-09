"use client";

import {
  PageLayout,
  PageLayoutContent,
  PageLayoutHeader,
} from "@/components/shared/PageLayout";
import { useProfileOverview } from "../hooks/use-profile-overview";
import { ChangePasswordSheet } from "./ChangePasswordSheet";
import { ProfileIdentityCard } from "./ProfileIdentityCard";
import { ProfileInfoCard } from "./ProfileInfoCard";

export function ProfileOverview() {
  const {
    t,
    profile,
    personalItems,
    accountItems,
    statusLabel,
  } = useProfileOverview();

  return (
    <PageLayout>
      <PageLayoutHeader
        title="Profile"
        description="View your personal information and account details."
      >
        <ChangePasswordSheet />
      </PageLayoutHeader>
      <PageLayoutContent className="space-y-6">
        <ProfileIdentityCard
          profile={profile}
          roleLabel={t(profile.role)}
          statusLabel={statusLabel}
          employeeIdLabel={t("Employee ID")}
        />
        <div className="grid gap-6 xl:grid-cols-2">
          <ProfileInfoCard
            title={t("Personal information")}
            description={t("Contact and employee details for your account.")}
            items={personalItems}
          />
          <ProfileInfoCard
            title={t("Account information")}
            description={t("Your access role and recent account activity.")}
            items={accountItems}
          />
        </div>
      </PageLayoutContent>
    </PageLayout>
  );
}
