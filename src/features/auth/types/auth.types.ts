export type AuthMode = "login" | "reset";
export type AuthFormProps = {
  mode: AuthMode;
  defaultEmail?: string;
  defaultPassword?: string;
};
export type AuthFormValues = { email: string; password: string };
export type AuthCopy = { title: string; subtitle: string; action: string };
export type LoginState = { error: string };

export type AuthenticatedUser = {
  id: string;
  role_id: string;
  email: string;
  full_name: string;
  user_status: "ACTIVE" | "INACTIVE";
  created_at: string;
  last_updated_at: string;
  last_login_at: string | null;
};
