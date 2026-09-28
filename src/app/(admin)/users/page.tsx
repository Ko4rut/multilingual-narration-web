import type { Metadata } from "next";
import { UsersOverview } from "@/features/users/components/UsersOverview";

export const metadata: Metadata = { title: "User Management" };

export default function Page() {
  return <UsersOverview />;
}
