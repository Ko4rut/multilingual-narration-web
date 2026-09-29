"use client";
import { useActionState, useState, type ChangeEvent, type FormEvent } from "react";
import { login } from "../actions";
import { authContent } from "../constants";
import type { AuthMode } from "../types";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

export function useAuthForm(mode: AuthMode) {
  const { t } = usePreferences();
  const [state, loginAction, pending] = useActionState(login, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const copy = authContent[mode];

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
  }
  function togglePassword() { setShowPassword((value) => !value); }
  function handleResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice("Password recovery is not connected yet. No email has been sent.");
  }

  return {
    t, copy, email, showPassword, pending, error: state.error, notice,
    handleEmailChange, togglePassword,
    formAction: mode === "login" ? loginAction : undefined,
    onSubmit: mode === "reset" ? handleResetSubmit : undefined,
  };
}
