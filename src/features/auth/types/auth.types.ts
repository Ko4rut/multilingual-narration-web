export type AuthMode = "login" | "reset";
export type AuthFormProps = { mode: AuthMode };
export type AuthFormValues = { email: string; password: string };
export type AuthCopy = { title: string; subtitle: string; action: string };
export type LoginState = { error: string };
export type MockCredentials = { email: string; password: string };
