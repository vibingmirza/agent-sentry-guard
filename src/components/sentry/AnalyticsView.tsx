import { useMemo } from "react";
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
  Cell,
} from "recharts";
import { useAlerts, type AlertSeverity } from "./alerts-store";
import { SystemDiagnostics } from "./SystemDiagnostics";

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  Low: "hsl(160 84% 45%)",
  Medium: "hsl(217 91% 60%)",
  High: "hsl(38 92% 55%)",
  Critical: "hsl(348 83% 55%)",
};

const TIMESERIES_BASE = [
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
  const { alerts } = useAlerts();

  const severityData = useMemo(() => {
    const counts: Record<AlertSeverity, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    for (const a of alerts) counts[a.severity]++;
    return (["Low", "Medium", "High", "Critical"] as AlertSeverity[]).map((s) => ({
      severity: s,
      alerts: counts[s],
      fill: SEVERITY_COLORS[s],
    }));
  }, [alerts]);

  const timeseries = useMemo(() => {
    const today = [...TIMESERIES_BASE];
    today[today.length - 1] = {
      ...today[today.length - 1],
      incidents: today[today.length - 1].incidents + alerts.length,
      blocked: today[today.length - 1].blocked + alerts.filter((a) => a.blocked).length,
    };
    return today;
  }, [alerts]);

  const total = alerts.length;
  const critical = alerts.filter((a) => a.severity === "Critical").length;
  const blocked = alerts.filter((a) => a.blocked).length;
  const blockRate = total ? ((blocked / total) * 100).toFixed(1) + "%" : "—";

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-sentry-cyan mb-2">Analytics Insights</p>
        <h2 className="text-2xl font-bold">Threat Intelligence Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Aggregated telemetry across all multi-agent operations over the last 7 days.
        </p>
      </header>

      <SystemDiagnostics />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-xl border border-border bg-sentry-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-sentry-cyan" />
              <h3 className="font-semibold">Alerts by Severity</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Live</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
                <XAxis
                  dataKey="severity"
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(217 33% 22%)" }}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: "hsl(215 20% 65%)", fontSize: 12 }}
                  axisLine={{ stroke: "hsl(217 33% 22%)" }}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "hsl(217 33% 15% / 0.4)" }} />
                <Bar dataKey="alerts" radius={[6, 6, 0, 0]}>
                  {severityData.map((d) => (
                    <Cell key={d.severity} fill={d.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-sentry-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-sentry-emerald" />
              <h3 className="font-semibold">Security Incidents Over Time</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Last 7 days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Area type="monotone" dataKey="incidents" stroke="hsl(217 91% 60%)" strokeWidth={2} fill="url(#incidentsGrad)" name="Incidents" />
                <Area type="monotone" dataKey="blocked" stroke="hsl(160 84% 45%)" strokeWidth={2} fill="url(#blockedGrad)" name="Blocked" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Alerts", value: String(total), accent: "text-sentry-cyan" },
          { label: "Critical Threats", value: String(critical), accent: "text-sentry-crimson" },
          { label: "Block Rate", value: blockRate, accent: "text-sentry-emerald" },
          { label: "Avg Response", value: "1.8s", accent: "text-foreground" },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-sentry-panel p-5">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">{m.label}</div>
            <div className={`text-2xl font-bold tabular-nums ${m.accent}`}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
