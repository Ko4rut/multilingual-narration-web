"use client";

import { useAnimatedBackground } from "../hooks/use-animated-background";
import styles from "./AuthForm.module.css";

export function AnimatedBackground() {
  const backgroundRef = useAnimatedBackground();

  return (
    <div ref={backgroundRef} className={styles.background} aria-hidden="true">
      <div className={styles.glowTop} />
      <div className={styles.glowBottom} />
      <div className={styles.orbitTop} />
      <div className={styles.orbitBottom} />
    </div>
  );
}
