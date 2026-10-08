"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import styles from "./AuthForm.module.css";
import { useAuthForm } from "../hooks/useAuthForm";
import type { AuthFormProps } from "../types";

export function AuthForm({ mode }: AuthFormProps) {
  const { t, copy, email, showPassword, pending, error, notice, handleEmailChange,
    togglePassword, formAction, onSubmit } = useAuthForm(mode);
  let passwordType = "password";
  let passwordToggleLabel = t("Show password");
  let PasswordVisibilityGlyph = Eye;
  let submitLabel = t(copy.action);

  if (showPassword) {
    passwordType = "text";
    passwordToggleLabel = t("Hide password");
    PasswordVisibilityGlyph = EyeOff;
  }

  if (pending) {
    submitLabel = t("Signing in…");
  }

  return (
    <section className={styles.panel} aria-labelledby="auth-title">
      <header className={styles.heading}>
        <h1 id="auth-title">{t(copy.title)}</h1>
        <p>{t(copy.subtitle)}</p>
      </header>

      <form action={formAction} onSubmit={onSubmit} className={styles.form}>
        <label className={styles.field}>
          <Mail aria-hidden="true" />
          <span className="sr-only">Email</span>
          <input name="email" type="email" placeholder="Email" autoComplete="email" value={email} onChange={handleEmailChange} required />
        </label>

        {mode !== "reset" && (
          <label className={styles.field}>
            <LockKeyhole aria-hidden="true" />
            <span className="sr-only">{t("Password")}</span>
            <input name="password" type={passwordType} placeholder={t("Password")} autoComplete="current-password" required />
            <button className={styles.toggle} type="button" aria-label={passwordToggleLabel} aria-pressed={showPassword} onClick={togglePassword}>
              <PasswordVisibilityGlyph aria-hidden="true" />
            </button>
          </label>
        )}

        {mode === "login" && <Link className={styles.forgot} href="/forgot-password">{t("Forgot password?")}</Link>}
        <button type="submit" disabled={pending} className={styles.submit}>{submitLabel}</button>

        {mode === "login" && <p className={styles.footer}>Demo: admin@mans.vn / admin123</p>}
        {error && <p className={styles.notice} role="alert">{t(error)}</p>}
        {notice && (
          <div className={styles.notice} role="status">
            <p>{t(notice)}</p>
          </div>
        )}
      </form>

      {mode === "reset" && <p className={styles.footer}><Link href="/login">{t("Sign In")}</Link></p>}
    </section>
  );
}
