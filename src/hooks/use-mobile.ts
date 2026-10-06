import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribeMobile(notify: () => void) {
  const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mediaQuery.addEventListener("change", notify)
  return () => mediaQuery.removeEventListener("change", notify)
}

function getMobileSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

function getMobileServerSnapshot() {
  return false
}

export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getMobileServerSnapshot
  )
}
