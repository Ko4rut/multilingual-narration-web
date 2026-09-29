import type { Metadata } from "next";
import "@/styles/tokens.css";
import "./globals.css";
import { cookies, headers } from "next/headers";
import { PreferencesProvider } from "@/features/preferences/components/PreferencesProvider";
import { localeFromHeader, parseLocale, parseTheme } from "@/features/preferences/utils/preferences";

export const metadata: Metadata = {
  title: { default: "MANS Admin", template: "%s | MANS Admin" },
  description: "Workspace for managing places, audio guides, and visitor insights.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const savedLocale = parseLocale(store.get("locale")?.value);
  const savedTheme = parseTheme(store.get("theme")?.value);
  const locale = savedLocale ?? localeFromHeader((await headers()).get("accept-language") ?? "");
  return <html lang={locale} data-theme={savedTheme ?? "system"}><body><PreferencesProvider initialLocale={locale} savedLocale={savedLocale} savedTheme={savedTheme}>{children}</PreferencesProvider></body></html>;
}
