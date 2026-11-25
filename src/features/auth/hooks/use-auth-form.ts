"use client";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { login } from "../actions";
import { authContent } from "../constants/auth.constants";
import type { AuthFormValues, AuthNotification } from "../types/auth.types";
import { usePreferences } from "@/features/settings/hooks/use-preferences";

const NOTIFICATION_DURATION_MS = 1_000;

export function useAuthForm(
  defaultEmail = "",
  defaultPassword = "",
) {
  const { t } = usePreferences();
  const [state, loginAction, pending] = useActionState(login, { error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [dismissedMessage, setDismissedMessage] = useState("");
  const form = useForm<AuthFormValues>({
    defaultValues: {
      email: defaultEmail,
      password: defaultPassword,
    },
  });
  const copy = authContent;
  let notification: AuthNotification | null = null;
  const activeMessage = state.error;

  if (!pending && activeMessage && activeMessage !== dismissedMessage) {
    notification = {
      message: activeMessage,
      tone: "error",
    };
  }

  useEffect(function autoDismissNotification() {
    if (pending || !activeMessage || activeMessage === dismissedMessage) {
      return;
    }

    const timeoutId = window.setTimeout(function dismissAfterDelay() {
      setDismissedMessage(activeMessage);
    }, NOTIFICATION_DURATION_MS);

    return function clearAutoDismissTimer() {
      window.clearTimeout(timeoutId);
    };
  }, [activeMessage, dismissedMessage, pending]);

  function handleSubmit(values: AuthFormValues) {
    setDismissedMessage("");

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
    notification,
    togglePassword,
    onSubmit: form.handleSubmit(handleSubmit),
  };
}
