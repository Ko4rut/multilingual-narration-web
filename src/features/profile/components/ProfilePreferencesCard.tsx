"use client";

import { Languages, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { Switch } from "@/components/ui/switch";
import { useProfilePreferences } from "../hooks/use-profile-preferences";
import type { ProfileLanguageOption } from "../types/profile.types";

/** Hiển thị tùy chọn theme và ngôn ngữ tối giản trên trang hồ sơ. */
export function ProfilePreferencesCard() {
  const {
    theme,
    themeLabel,
    t,
    languageOptions,
    selectedLanguage,
    handleThemeChange,
    handleLanguageChange,
    getLanguageLabel,
  } = useProfilePreferences();
  const isDarkTheme = theme === "dark";

  function renderLanguageOption(option: ProfileLanguageOption) {
    return (
      <ComboboxItem key={option.value} value={option}>
        <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 font-mono text-[10px] font-semibold text-primary">
          {option.value.toUpperCase()}
        </span>
        <span>{option.label}</span>
      </ComboboxItem>
    );
  }

  return (
    <Card className="gap-5">
      <CardHeader>
        <CardTitle className="text-base">
          {t("Appearance and language")}
        </CardTitle>
        <CardDescription className="text-xs">
          {t("Changes are applied immediately and saved for future visits.")}
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 px-6 xl:grid-cols-2">
        <div className="flex min-w-0 items-center gap-3 rounded-lg border p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
            <Moon aria-hidden="true" className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-card-foreground">
              {t("Display appearance")}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {t(themeLabel)}
            </p>
          </div>
          <Switch
            checked={isDarkTheme}
            onCheckedChange={handleThemeChange}
            aria-label={t("Dark mode")}
          />
        </div>

        <div className="flex min-w-0 flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Languages aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-card-foreground">
                {t("Display language")}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("Choose the language used across the workspace.")}
              </p>
            </div>
          </div>

          <Combobox
            items={languageOptions}
            value={selectedLanguage}
            onValueChange={handleLanguageChange}
            itemToStringLabel={getLanguageLabel}
          >
            <ComboboxTrigger
              aria-label={t("Display language")}
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-between bg-background font-normal sm:w-44"
                />
              }
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {selectedLanguage.value.toUpperCase()}
                </span>
                <span>{selectedLanguage.label}</span>
              </span>
            </ComboboxTrigger>
            <ComboboxContent>
              <ComboboxList>{renderLanguageOption}</ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </CardContent>
    </Card>
  );
}
