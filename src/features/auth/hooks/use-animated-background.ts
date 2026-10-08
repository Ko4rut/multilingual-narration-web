"use client";

import { useEffect, useRef } from "react";

/** Animate decorative layers directly, without re-rendering the form. */
export function useAnimatedBackground() {
  const backgroundRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = backgroundRef.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let previousTime = 0;
    let elapsed = 0;
    let targetX = 0;
    let targetY = 0;
    let pointerX = 0;
    let pointerY = 0;

    function resetPointer() {
      targetX = 0;
      targetY = 0;
    }

    function onPointerMove(event: PointerEvent) {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType !== "mouse") return;
      targetX = (event.clientX / window.innerWidth - 0.5) * 2;
      targetY = (event.clientY / window.innerHeight - 0.5) * 2;
    }

    function animate(time: number) {
      const delta = previousTime ? Math.min(time - previousTime, 64) : 0;
      previousTime = time;
      elapsed += delta / 1000;
      const smoothing = 1 - Math.exp(-delta / 180);
      pointerX += (targetX - pointerX) * smoothing;
      pointerY += (targetY - pointerY) * smoothing;

      // Layered waves avoid a repetitive straight-line drift.
      const amplitude = Math.min(1, window.innerWidth / 900);
      const x = Math.sin(elapsed * 0.42) * 95 + Math.sin(elapsed * 0.79) * 28;
      const y = Math.sin(elapsed * 0.35) * 72 + Math.sin(elapsed * 0.67) * 24;
      element!.style.setProperty("--drift-x", `${(x + pointerX * 85) * amplitude}px`);
      element!.style.setProperty("--drift-y", `${(y + pointerY * 65) * amplitude}px`);
      element!.style.setProperty("--second-x", `${(Math.sin(elapsed * 0.31) * 115 - pointerX * 100) * amplitude}px`);
      element!.style.setProperty("--second-y", `${(Math.sin(elapsed * 0.53) * 85 - pointerY * 75) * amplitude}px`);
      element!.style.setProperty("--glow-scale", `${1 + Math.sin(elapsed * 0.56) * 0.12}`);
      element!.style.setProperty("--second-scale", `${1 + Math.sin(elapsed * 0.39) * 0.15}`);
      element!.style.setProperty("--orbit-turn", `${Math.sin(elapsed * 0.28) * 9 + pointerX * 4}deg`);
      frame = window.requestAnimationFrame(animate);
    }

    function syncMotion() {
      window.cancelAnimationFrame(frame);
      previousTime = 0;
      resetPointer();
      if (reducedMotion.matches) {
        pointerX = pointerY = elapsed = 0;
        element!.style.removeProperty("--drift-x");
        element!.style.removeProperty("--drift-y");
        element!.style.removeProperty("--glow-scale");
        for (const property of ["--second-x", "--second-y", "--second-scale", "--orbit-turn"]) {
          element!.style.removeProperty(property);
        }
      } else if (!document.hidden) {
        frame = window.requestAnimationFrame(animate);
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", resetPointer);
    window.addEventListener("blur", resetPointer);
    document.addEventListener("visibilitychange", syncMotion);
    reducedMotion.addEventListener("change", syncMotion);
    finePointer.addEventListener("change", resetPointer);
    syncMotion();

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("blur", resetPointer);
      document.removeEventListener("visibilitychange", syncMotion);
      reducedMotion.removeEventListener("change", syncMotion);
      finePointer.removeEventListener("change", resetPointer);
    };
  }, []);

  return backgroundRef;
}
