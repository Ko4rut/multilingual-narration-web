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
