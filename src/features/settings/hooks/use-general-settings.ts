import { useState } from "react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { Locale } from "@/i18n/types";
import type { Theme } from "@/features/settings/types/settings.types";
import type { SettingsOverviewProps } from "../types/settings.types";

export function useGeneralSettings(props: SettingsOverviewProps) {
  const { t, theme, locale, setTheme, setLocale } = usePreferences();

  const [formData, setFormData] = useState({
    autoPublish: false,
    requireApproval: true,
    triggerRadius: 150,
    language: locale, 
    theme: theme      
  });

  function toggleAutoPublish() {
    setFormData(function updatePublish(prev) {
      return { ...prev, autoPublish: !prev.autoPublish };
    });
  }

  function toggleApproval() {
    setFormData(function updateApproval(prev) {
      return { ...prev, requireApproval: !prev.requireApproval };
    });
  }

  function handleRadiusChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = parseInt(e.target.value, 10);
    setFormData(function updateRadius(prev) {
      return { ...prev, triggerRadius: newValue };
    });
  }

  function handleLanguageChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = e.target.value as Locale; 
    setFormData(function updateLanguage(prev) {
      return { ...prev, language: newValue };
    });
  }

  function handleThemeChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newValue = e.target.value as Theme; 
    setFormData(function updateTheme(prev) {
      return { ...prev, theme: newValue };
    });
  }

  function handleSave() {
    setTheme(formData.theme); 
    setLocale(formData.language);
  }

  return {
    t,
    formData,
    toggleAutoPublish,
    toggleApproval,
    handleRadiusChange,
    handleLanguageChange,
    handleThemeChange,
    handleSave
  };
}
