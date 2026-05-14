import { BarChart3, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
  Legend,
} from "recharts";

const SEVERITY_DATA = [
  { severity: "Low", alerts: 124, fill: "hsl(160 84% 45%)" },
  { severity: "Medium", alerts: 78, fill: "hsl(217 91% 60%)" },
  { severity: "High", alerts: 42, fill: "hsl(38 92% 55%)" },
  { severity: "Critical", alerts: 17, fill: "hsl(348 83% 55%)" },
];

const TIMESERIES_DATA = [
  { day: "Mon", incidents: 12, blocked: 9 },
  { day: "Tue", incidents: 18, blocked: 15 },
  { day: "Wed", incidents: 9, blocked: 7 },
  { day: "Thu", incidents: 24, blocked: 21 },
  { day: "Fri", incidents: 31, blocked: 27 },
  { day: "Sat", incidents: 14, blocked: 12 },
  { day: "Sun", incidents: 22, blocked: 19 },
];

const tooltipStyle = {
  backgroundColor: "hsl(222 25% 9%)",
  border: "1px solid hsl(217 33% 22%)",
  borderRadius: "0.5rem",
  fontSize: "12px",
  color: "hsl(210 40% 96%)",
};

export function AnalyticsView() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-sentry-cyan mb-2">Analytics Insights</p>
        <h2 className="text-2xl font-bold">Threat Intelligence Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Aggregated telemetry across all multi-agent operations over the last 7 days.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts by Severity */}
        <section className="rounded-xl border border-border bg-sentry-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-sentry-cyan" />
              <h3 className="font-semibold">Alerts by Severity</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Last 24h
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SEVERITY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
                <XAxis
                  dataKey="severity"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(217 33% 22%)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(217 33% 22%)" }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(217 33% 15% / 0.4)" }} />
                <Bar dataKey="alerts" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Incidents Over Time */}
        <section className="rounded-xl border border-border bg-sentry-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-sentry-emerald" />
              <h3 className="font-semibold">Security Incidents Over Time</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Last 7 days
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIMESERIES_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incidentsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(217 91% 60%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(217 91% 60%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(160 84% 45%)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(160 84% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(217 33% 22%)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(217 33% 22%)" }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: "hsl(215 20% 65%)" }} />
                <Area
                  type="monotone"
                  dataKey="incidents"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={2}
                  fill="url(#incidentsGrad)"
                  name="Incidents"
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="hsl(160 84% 45%)"
                  strokeWidth={2}
                  fill="url(#blockedGrad)"
                  name="Blocked"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Alerts", value: "261", accent: "text-sentry-cyan" },
          { label: "Critical Threats", value: "17", accent: "text-sentry-crimson" },
          { label: "Block Rate", value: "94.2%", accent: "text-sentry-emerald" },
          { label: "Avg Response", value: "1.8s", accent: "text-foreground" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-sentry-panel p-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
              {m.label}
            </div>
            <div className={`text-2xl font-bold tabular-nums ${m.accent}`}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
