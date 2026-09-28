"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "@/components/ui/Icon";
import styles from "./AuthForm.module.css";

const content = {
  login: { title: "Welcome Back", subtitle: "Sign in to continue to MANS Enterprise", action: "Sign In" },
  register: { title: "Create Account", subtitle: "Get started with MANS Enterprise", action: "Register" },
  reset: { title: "Forgot Password?", subtitle: "Enter your email to reset your password", action: "Send Reset Link" },
};

export function AuthForm({ mode }: { mode: keyof typeof content }) {
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState("");
  const copy = content[mode];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice(mode === "login"
      ? "Sign in is not connected yet. You can explore the demo dashboard below."
      : mode === "register"
        ? "Registration is not connected yet. No account has been created."
        : "Password recovery is not connected yet. No email has been sent.");
  }

  return (
    <section className={styles.panel} aria-labelledby="auth-title">
      <Link href="/login" className={styles.brand} aria-label="MANS Enterprise home">
        <span className={styles.brandMark}><Icon name="mic" /></span>
        <span><strong>MANS</strong><small>ENTERPRISE</small></span>
      </Link>

      <header className={styles.heading}>
        <h1 id="auth-title">{copy.title}</h1>
        <p>{copy.subtitle}</p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label className={styles.field}>
          <Icon name="mail" />
          <span className="sr-only">Email</span>
          <input name="email" type="email" placeholder="Email" autoComplete="email" required />
        </label>

        {mode !== "reset" && (
          <label className={styles.field}>
            <Icon name="lock" />
            <span className="sr-only">Password</span>
            <input name="password" type={showPassword ? "text" : "password"} placeholder="Password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : undefined} />
            <button className={styles.toggle} type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye" : "eyeOff"} />
            </button>
          </label>
        )}

        {mode === "login" && <Link className={styles.forgot} href="/forgot-password">Forgot password?</Link>}
        <button type="submit" className={styles.submit}>{copy.action}</button>

        {notice && (
          <div className={styles.notice} role="status">
            <p>{notice}</p>
            {mode === "login" && <Link href="/dashboard">Explore demo dashboard →</Link>}
          </div>
        )}
      </form>

      <div className={styles.divider}><span>OR</span></div>
      <p className={styles.footer}>
        {mode === "login" ? <>Don&apos;t have an account? <Link href="/register">Register</Link></> : <>Already have an account? <Link href="/login">Sign In</Link></>}
      </p>
    </section>
  );
}
