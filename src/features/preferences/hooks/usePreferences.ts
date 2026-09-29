"use client";
import { useContext } from "react";
import { PreferencesContext } from "../context";

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error("PreferencesProvider is required");
  return context;
}
