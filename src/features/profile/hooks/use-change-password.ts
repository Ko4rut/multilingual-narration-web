"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { ChangePasswordFeedback } from "../types/profile.types";

/** Điều phối trạng thái và validation của form đổi mật khẩu demo. */
export function useChangePassword() {
  const { t } = usePreferences();
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<ChangePasswordFeedback | null>(null);

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    setFeedback(null);
  }

  function handleClose() {
    handleOpenChange(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setFeedback({
        tone: "error",
        role: "alert",
        message: t("Complete all password fields."),
      });
      return;
    }

    if (newPassword.length < 8) {
      setFeedback({
        tone: "error",
        role: "alert",
        message: t("New password must contain at least 8 characters."),
      });
      return;
    }

    if (newPassword === currentPassword) {
      setFeedback({
        tone: "error",
        role: "alert",
        message: t("New password must be different from current password."),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setFeedback({
        tone: "error",
        role: "alert",
        message: t("New passwords do not match."),
      });
      return;
    }

    form.reset();
    setFeedback({
      tone: "success",
      role: "status",
      message: t("Password validated successfully. Demo data was not changed."),
    });
  }

  return {
    t,
    open,
    feedback,
    handleOpenChange,
    handleClose,
    handleSubmit,
  };
}
