import { AlertCircle, Info } from "lucide-react";
import { usePreferences } from "@/features/settings/hooks/use-preferences";
import type { AuthNotification } from "../types/auth.types";
import styles from "./AuthForm.module.css";

export function AuthNotification({ message, tone }: AuthNotification) {
  const { t } = usePreferences();
  let title = t("Notice");
  let NotificationIcon = Info;
  let notificationRole: "alert" | "status" = "status";

  if (tone === "error") {
    title = t("Sign-in failed");
    NotificationIcon = AlertCircle;
    notificationRole = "alert";
  }

  return (
    <aside
      className={styles.toast}
      data-tone={tone}
      role={notificationRole}
      aria-live="polite"
    >
      <span className={styles.toastIcon} aria-hidden="true">
        <NotificationIcon />
      </span>
      <span className={styles.toastContent}>
        <strong>{title}</strong>
        <span>{t(message)}</span>
      </span>
    </aside>
  );
}
