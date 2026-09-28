import styles from "@/features/auth/components/AuthForm.module.css";
import { AnimatedBackground } from "@/features/auth/components/AnimatedBackground";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className={styles.screen}><AnimatedBackground />{children}</main>;
}
