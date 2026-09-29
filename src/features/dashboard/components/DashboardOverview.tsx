"use client";
import { useState } from "react";
import { usePreferences } from "@/features/preferences/hooks/usePreferences";
import { TrendChart, VisitsChart } from "./DashboardCharts";
import { StatCard } from "./StatCard";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/shared/PageHeader";
import { PeriodFilter } from "./PeriodFilter";
import type { DashboardData, Period } from "../types";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DashboardOverview({ data, period }: { data: DashboardData; period: Period }) {
  const { t, locale } = usePreferences();
  const [replay, setReplay] = useState(0);
  return <>
    <PageHeader title="Dashboard Overview" description="System health and global visitor activities"><div className="dashboard-actions"><button className="button" onClick={() => setReplay(replay + 1)}>{t("Replay animation")}</button><PeriodFilter period={period} /></div></PageHeader>
    <div className="stats-grid">{data.stats.map((stat) => <StatCard stat={stat} key={stat.label} />)}</div>
    <div className="dashboard-grid">
      <Card title="Listening Duration Trends" description="Total listening time in minutes" action={<strong className="accent metric">{data.minutes.toLocaleString(locale)} {t("minutes")}</strong>}>
        <TrendChart key={`${period}-${replay}`} values={data.trend} />
      </Card>
      <Card title="Most Popular POIs (Plays)" description="Highest played Vietnamese landmark guides"><ol className="popular-list">{data.popularPois.map((poi, index) => <li key={poi.name}><div><span><b className="accent">0{index + 1}</b>{poi.name}</span><small>{poi.plays.toLocaleString(locale)} {t("plays")}</small></div><div className="progress-track"><div style={{ width: `${poi.plays / Math.max(1, ...data.popularPois.map((item) => item.plays)) * 100}%` }} /></div></li>)}</ol></Card>
    </div>
    <div className="dashboard-bottom">
      <Card title="Visitor Heatmap" description="Peak visitor activity distribution"><div className="heatmap">{data.heatmap.map((row, day) => <div className="heatmap-row" key={day}><span>{t(days[day])}</span>{row.map((level, hour) => <span key={hour} className={`heat-cell level-${level}`} title={`${t(days[day])}, ${hour + 8}:00 — ${t("Activity")} ${level}/4`} />)}</div>)}</div><div className="chart-labels"><span>08:00</span><span>12:00</span><span>16:00</span><span>22:00</span></div><div className="heat-legend"><span>{t("Less")}</span>{[0, 1, 2, 3, 4].map((level) => <span key={level} className={`heat-cell level-${level}`} />)}<span>{t("More")}</span></div></Card>
      <Card title="Peak Visiting Time" description="Hourly visitor volume distribution"><VisitsChart key={`${period}-${replay}`} values={data.hourlyVisits} /></Card>
    </div><footer className="dashboard-footer"><span className="status-dot" />{t("Demo workspace · All metrics are sample data")}</footer>
  </>;
}
