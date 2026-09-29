"use client";
import { createContext } from "react";
import type { PreferencesContextValue } from "./types";

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
