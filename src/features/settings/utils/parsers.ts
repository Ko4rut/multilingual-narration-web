import { DEFAULT_SETTINGS_TAB, SETTINGS_TABS } from "../constants/settings.constants";
import type { SettingsTab } from "../types/settings.types";

export function parseSettingsTab(value: string | string[] | undefined): SettingsTab {
  let val: string | undefined;
  
  if (Array.isArray(value)) {
    val = value[0];
  } else {
    val = value;
  }
  
  if (!val) {
    return DEFAULT_SETTINGS_TAB as SettingsTab;
  }
  
  if (SETTINGS_TABS.includes(val)) {
    return val as SettingsTab;
  }
  
  return DEFAULT_SETTINGS_TAB as SettingsTab;
}