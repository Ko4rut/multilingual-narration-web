"use client";
import { startTransition, useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { authContent } from "../constants/auth.constants";
import type { AuthFormValues, AuthMode } from "../types/auth.types";
import { usePreferences } from "@/features/preferences/hooks/use-preferences";

export function useAuthForm(mode: AuthMode) {
  const { t } = usePreferences();
  const [state, loginAction, pending] = useActionState(login, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const form = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const copy = authContent[mode];

  function handleSubmit(values: AuthFormValues) {
    setNotice("");

    if (mode === "reset") {
      setNotice("Password recovery is not connected yet. No email has been sent.");
      return;
    }

    const formData = new FormData();
    formData.set("email", values.email);
    formData.set("password", values.password);

    startTransition(function submitLogin() {
      loginAction(formData);
    });
  }

  function togglePassword() {
    setShowPassword(function updatePasswordVisibility(value) {
      return !value;
    });
  }

  return {
    t,
    copy,
    form,
    showPassword,
    pending,
    error: state.error,
    notice,
    togglePassword,
    onSubmit: form.handleSubmit(handleSubmit),
  };
}
