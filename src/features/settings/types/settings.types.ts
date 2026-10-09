import type { ReactNode } from "react";
import type { Locale } from "@/i18n/types";

export type Theme = "dark" | "light";

export type PreferenceState = {
  initialLocale: Locale;
  savedLocale?: Locale;
  savedTheme?: Theme;
};

export type PreferencesProviderProps = PreferenceState & {
  children: ReactNode;
};

export type PreferencesContextValue = {
  locale: Locale;
  theme: Theme;
  t: (key: string) => string;
  setLocale: (value: Locale) => void;
  setTheme: (value: Theme) => void;
};

export type SettingsTab = "general" | "account" | "appearance" | "notifications";
export type SettingsPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type SettingsOverviewProps = {
  tab: SettingsTab;
};

export type ApplicationDefaultsProps = {
  language: string;
  theme: string;
  onLanguageChange(e: React.ChangeEvent<HTMLSelectElement>): void;
  onThemeChange(e: React.ChangeEvent<HTMLSelectElement>): void;
};

export type ContentWorkflowProps = {
  autoPublish: boolean;
  requireApproval: boolean;
  onTogglePublish(): void;
  onToggleApproval(): void;
};

export type GeofenceConfigProps = {
  triggerRadius: number;
  onRadiusChange(e: React.ChangeEvent<HTMLInputElement>): void;
};
