import type { Metadata } from "next";
import { ProfileOverview } from "@/features/profile/components/ProfileOverview";
import { getCurrentUser } from "@/features/auth/current-user";
import { getUserInitials } from "@/features/auth/utils/auth-user.utils";

export const metadata: Metadata = {
  title: "Profile",
  description: "View personal information and employee account details.",
};

export default async function Page() {
  const user = await getCurrentUser();
  return (
    <ProfileOverview
      profile={{
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        initials: getUserInitials(user.full_name),
        role: user.role_id,
        status: user.user_status,
        joinedAt: user.created_at,
        updatedAt: user.last_updated_at,
        lastLoginAt: user.last_login_at,
      }}
    />
  );
}
