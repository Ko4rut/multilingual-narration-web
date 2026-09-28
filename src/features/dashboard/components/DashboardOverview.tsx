import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/shared/PageHeader";
import { PeriodFilter } from "./PeriodFilter";
import type { DashboardData, Period } from "../types";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function DashboardOverview({ data, period }: { data: DashboardData; period: Period }) {
  const maxTrend = Math.max(...data.trend);
  const points = data.trend.map((value, index) => `${20 + index * 64},${170 - (value / maxTrend) * 135}`).join(" ");
  return <>
    <PageHeader title="Dashboard Overview" description="System health and global visitor activities"><PeriodFilter period={period} /></PageHeader>
    <div className="stats-grid">{data.stats.map((stat) => <section className="card stat-card" key={stat.label}><div><h2>{stat.label}</h2><span className={`change ${stat.positive ? "positive" : "negative"}`}>{stat.change}</span></div><strong>{stat.value}</strong></section>)}</div>
    <div className="dashboard-grid">
      <Card title="Listening Duration Trends" description="Total listening time in minutes" action={<strong className="accent metric">{data.minutes.toLocaleString("en-US")} Min</strong>}>
        <svg className="trend-chart" viewBox="0 0 490 200" role="img" aria-label={`Listening activity across eight intervals: ${data.trend.join(", ")}`}>
          {[40, 90, 140, 190].map((y) => <line key={y} x1="0" y1={y} x2="490" y2={y} stroke="var(--border)" strokeDasharray="3 5" />)}
          <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" />
          {data.trend.map((value, index) => <circle key={index} cx={20 + index * 64} cy={170 - (value / maxTrend) * 135} r="3" fill="var(--accent)"><title>{value} minutes</title></circle>)}
        </svg><div className="chart-labels"><span>Period start</span><span>Period end</span></div>
      </Card>
      <Card title="Most Popular POIs (Plays)" description="Highest played Vietnamese landmark guides"><ol className="popular-list">{data.popularPois.map((poi, index) => <li key={poi.name}><div><span><b className="accent">0{index + 1}</b>{poi.name}</span><small>{poi.plays.toLocaleString("en-US")} plays</small></div><div className="progress-track"><div style={{ width: `${poi.plays / data.popularPois[0].plays * 100}%` }} /></div></li>)}</ol></Card>
    </div>
    <div className="dashboard-bottom">
      <Card title="Visitor Heatmap" description="Peak visitor activity distribution"><div className="heatmap">{data.heatmap.map((row, day) => <div className="heatmap-row" key={day}><span>{days[day]}</span>{row.map((level, hour) => <span key={hour} className={`heat-cell level-${level}`} title={`${days[day]}, ${hour + 8}:00 — activity ${level} of 4`} />)}</div>)}</div><div className="chart-labels"><span>08:00</span><span>12:00</span><span>16:00</span><span>22:00</span></div><div className="heat-legend"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <span key={level} className={`heat-cell level-${level}`} />)}<span>More</span></div></Card>
      <Card title="Peak Visiting Time" description="Hourly visitor volume distribution"><div className="bar-chart" role="img" aria-label={`Hourly visits from 08:00 in one-hour intervals: ${data.hourlyVisits.join(", ")}`}>{data.hourlyVisits.map((value, index) => <div className="bar-column" key={index}><div className="bar" style={{ height: `${value / Math.max(...data.hourlyVisits) * 100}%` }} title={`${index + 8}:00 — ${value} visits`} /></div>)}</div><div className="chart-labels">{["08h", "10h", "12h", "14h", "16h", "19h"].map((hour) => <span key={hour}>{hour}</span>)}</div></Card>
    </div><footer className="dashboard-footer"><span className="status-dot" />Demo workspace · All metrics are sample data</footer>
  </>;
}
