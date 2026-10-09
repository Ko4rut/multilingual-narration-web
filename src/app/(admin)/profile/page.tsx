import type { Metadata } from "next";
import { ProfileOverview } from "@/features/profile/components/ProfileOverview";

export const metadata: Metadata = {
  title: "Profile",
  description: "View personal information and employee account details.",
};

export default function Page() {
  return <ProfileOverview />;
}
