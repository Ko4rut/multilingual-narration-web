import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "MANS Admin", template: "%s | MANS Admin" },
  description: "Workspace for managing places, audio guides, and visitor insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
