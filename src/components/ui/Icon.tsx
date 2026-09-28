const paths = {
  mail: "M3 5h18v14H3z M3 6l9 7 9-7",
  lock: "M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  eyeOff: "M3 3l18 18 M10 5c7-2 12 7 12 7a20 20 0 0 1-4 4 M6 6a20 20 0 0 0-4 6s4 7 10 7c2 0 3-1 4-1 M10 10a3 3 0 0 0 4 4",
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z M15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  file: "M14 2H5v20h14V7Z M14 2v6h5 M8 12h8 M8 16h6",
  audio: "M9 18V5l12-2v13 M9 7l12-2 M9 18c0 4-7 4-7 1s7-4 7-1 M21 16c0 4-7 4-7 1s7-4 7-1",
  users: "M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M5 21v-3a7 7 0 0 1 14 0v3 M19 4a3 3 0 0 1 0 6 M22 20v-3a5 5 0 0 0-3-4",
  shield: "M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6Z M8 12l3 3 5-6",
  language: "M3 5h12 M9 2v3 M5 5c0 6 4 10 9 12 M13 5c0 6-4 10-10 12 M14 22l4-11 4 11 M16 18h4",
  settings: "M9 3h6l1 4 4 1v7l-4 1-1 5H9l-1-5-4-1V8l4-1Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0",
  mic: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0Z M5 10v2a7 7 0 0 0 14 0v-2 M12 19v3 M9 22h6",
} as const;

export function Icon({ name }: { name: keyof typeof paths }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
