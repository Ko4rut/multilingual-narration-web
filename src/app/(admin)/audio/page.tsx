import type { Metadata } from "next";
import { AudioOverview } from "@/features/audio/components/AudioOverview";

export const metadata: Metadata = { title: "Audio Management" };

export default function Page() {
  return <AudioOverview />;
}
