"use client";

import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import type { ControllerRenderProps } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import styles from "./AuthForm.module.css";
import { AuthNotification } from "./AuthNotification";
import { useAuthForm } from "../hooks/use-auth-form";
import type { AuthFormProps, AuthFormValues } from "../types/auth.types";

export function AuthForm({ defaultEmail, defaultPassword }: AuthFormProps) {
  const {
    t,
    copy,
    form,
    showPassword,
    pending,
    notification,
    togglePassword,
    onSubmit,
  } = useAuthForm(defaultEmail, defaultPassword);
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

  function renderEmailField({ field, }: { field: ControllerRenderProps<AuthFormValues, "email">; }) {
    return (
      <FormItem className={styles.formItem}>
        <InputGroup className={styles.field}>
          <InputGroupAddon className={styles.fieldIcon}>
            <Mail aria-hidden="true" />
            <FormLabel className="sr-only">Email</FormLabel>
          </InputGroupAddon>
          <FormControl>
            <InputGroupInput
              type="email"
              placeholder="Email"
              autoComplete="email"
              required
              {...field}
            />
          </FormControl>
        </InputGroup>
        <FormMessage />
      </FormItem>
    );
  }

  function renderPasswordField({
    field,
  }: {
    field: ControllerRenderProps<AuthFormValues, "password">;
  }) {
    return (
      <FormItem className={styles.formItem}>
        <InputGroup className={styles.field}>
          <InputGroupAddon className={styles.fieldIcon}>
            <LockKeyhole aria-hidden="true" />
            <FormLabel className="sr-only">{t("Password")}</FormLabel>
          </InputGroupAddon>
          <FormControl>
            <InputGroupInput
              type={passwordType}
              placeholder={t("Password")}
              autoComplete="current-password"
              required
              {...field}
            />
          </FormControl>
          <InputGroupAddon
            align="inline-end"
            className={styles.fieldAction}
          >
            <InputGroupButton
              className={styles.toggle}
              type="button"
              size="icon-sm"
              aria-label={passwordToggleLabel}
              aria-pressed={showPassword}
              onClick={togglePassword}
            >
              <PasswordVisibilityGlyph aria-hidden="true" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <section className={styles.panel} aria-labelledby="auth-title">
      <header className={styles.heading}>
        <h1 id="auth-title">{t(copy.title)}</h1>
        <p>{t(copy.subtitle)}</p>
      </header>

      <Form {...form}>
        <form onSubmit={onSubmit} className={styles.form}>
          <FormField
            control={form.control}
            name="email"
            render={renderEmailField}
          />

          <FormField
            control={form.control}
            name="password"
            render={renderPasswordField}
          />
          <Button type="submit" disabled={pending} className={styles.submit}>
            {submitLabel}
          </Button>

        </form>
      </Form>

      {notification && (
        <AuthNotification
          message={notification.message}
          tone={notification.tone}
        />
      )}
    </section>
  );
}
