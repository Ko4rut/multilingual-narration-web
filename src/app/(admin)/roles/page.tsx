import type { Metadata } from "next";
import { RolesOverview } from "@/features/roles/components/RolesOverview";

export const metadata: Metadata = { title: "Role-Based Access" };

export default function Page() {
  return <RolesOverview />;
}
