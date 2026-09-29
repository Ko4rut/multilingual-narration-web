"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import styles from "./AuthForm.module.css";
import { useAuthForm } from "../hooks/useAuthForm";
import type { AuthFormProps } from "../types";

export function AuthForm({ mode }: AuthFormProps) {
  const { t, copy, email, showPassword, pending, error, notice, handleEmailChange,
    togglePassword, formAction, onSubmit } = useAuthForm(mode);

  return (
    <section className={styles.panel} aria-labelledby="auth-title">
      {/* <Link href="/login" className={styles.brand} aria-label="MANS Enterprise home">
        <span className={styles.brandMark}><Icon name="mic" /></span>
        <span><strong>MANS</strong><small>ENTERPRISE</small></span>
      </Link> */}

      <header className={styles.heading}>
        <h1 id="auth-title">{t(copy.title)}</h1>
        <p>{t(copy.subtitle)}</p>
      </header>

      <form action={formAction} onSubmit={onSubmit} className={styles.form}>
        <label className={styles.field}>
          <Icon name="mail" />
          <span className="sr-only">Email</span>
          <input name="email" type="email" placeholder="Email" autoComplete="email" value={email} onChange={handleEmailChange} required />
        </label>

        {mode !== "reset" && (
          <label className={styles.field}>
            <Icon name="lock" />
            <span className="sr-only">{t("Password")}</span>
            <input name="password" type={showPassword ? "text" : "password"} placeholder={t("Password")} autoComplete="current-password" required />
            <button className={styles.toggle} type="button" aria-label={t(showPassword ? "Hide password" : "Show password")} aria-pressed={showPassword} onClick={togglePassword}>
              <Icon name={showPassword ? "eye" : "eyeOff"} />
            </button>
          </label>
        )}

        {mode === "login" && <Link className={styles.forgot} href="/forgot-password">{t("Forgot password?")}</Link>}
        <button type="submit" disabled={pending} className={styles.submit}>{pending ? t("Signing in…") : t(copy.action)}</button>

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
