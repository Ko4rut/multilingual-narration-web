"use client";

import { useId, useState } from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";

export function TrendChart({ values }: { values: number[] }) {
  const { t, locale } = usePreferences();
  const [active, setActive] = useState<number | null>(null);
  const gradient = useId();
  const max = Math.max(1, ...values);
  const x = (index: number) => 20 + index * 448 / Math.max(1, values.length - 1);
  const y = (value: number) => 170 - value / max * 135;
  const points = values.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  return <div>
    <svg className="trend-chart" viewBox="0 0 490 200" role="group" aria-label={t("Listening Duration Trends")}>
      <defs><linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" /><stop offset="100%" stopColor="var(--accent)" stopOpacity="0" /></linearGradient></defs>
      {[40, 90, 140, 190].map((line) => <line key={line} x1="0" y1={line} x2="490" y2={line} stroke="var(--border)" strokeDasharray="3 5" />)}
      <polygon points={`20,190 ${points} ${x(values.length - 1)},190`} fill={`url(#${gradient})`} />
      <polyline className="trend-line" pathLength="1" points={points} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" />
      {values.map((value, index) => <g key={index}>
        <circle cx={x(index)} cy={y(value)} r={active === index ? 6 : 3} fill="var(--accent)" />
        <circle cx={x(index)} cy={y(value)} r="12" fill="transparent" tabIndex={0} role="button" aria-label={`${t("Interval")} ${index + 1}: ${value.toLocaleString(locale)} ${t("minutes")}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setActive(index); } }} />
      </g>)}
    </svg>
    <p className="chart-readout" aria-live="polite">{active === null ? t("Total listening time in minutes") : `${t("Interval")} ${active + 1}: ${values[active].toLocaleString(locale)} ${t("minutes")}`}</p>
    <div className="chart-labels"><span>{t("Period start")}</span><span>{t("Period end")}</span></div>
  </div>;
}

export function VisitsChart({ values }: { values: number[] }) {
  const { t, locale } = usePreferences();
  const [active, setActive] = useState<number | null>(null);
  return <>
    <div className="bar-chart">{values.map((value, index) => <div className="bar-column" key={index}><button type="button" className="bar" style={{ height: `${value / Math.max(1, ...values) * 100}%`, animationDelay: `${index * 35}ms` }} aria-label={`${index + 8}:00 — ${value.toLocaleString(locale)} ${t("visits")}`} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} /></div>)}</div>
    <div className="chart-labels">{values.map((_, index) => index % 2 === 0 || index === values.length - 1 ? <span key={index}>{index + 8}:00</span> : null)}</div>
    <p className="chart-readout" aria-live="polite">{active === null ? t("Hourly visitor volume distribution") : `${active + 8}:00 — ${values[active].toLocaleString(locale)} ${t("visits")}`}</p>
  </>;
}
