"use client";
import { PreferencesContext } from "../context";
import { usePreferenceState } from "../hooks/usePreferenceState";
import type { PreferencesProviderProps } from "../types";

export function PreferencesProvider({ children, ...initial }: PreferencesProviderProps) {
  const value = usePreferenceState(initial);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
