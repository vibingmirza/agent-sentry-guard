import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts";
import { TrendingUp } from "lucide-react";
import { useApp } from "./app-context";
import { useAlerts } from "./alerts-store";

export function RiskForecast() {
  const { region, t } = useApp();
  const { alerts } = useAlerts();

  const data = useMemo(() => {
    const base = alerts.length;
    const days = ["-3d", "-2d", "-1d", "TODAY", "+1d", "+2d", "+3d", "+4d"];
    const trend = region === "pakistan" ? 1.0 : 1.35;
    return days.map((d, i) => {
      const historical = i <= 3;
      const seed = (i + 1) * 7 + base;
      const risk = Math.round((20 + ((seed * 13) % 35) + i * 4) * trend);
      const ci = Math.round(risk * 0.18);
      return {
        day: d,
        risk,
        upper: risk + ci,
        lower: Math.max(0, risk - ci),
        historical,
      };
    });
  }, [alerts.length, region]);

  return (
    <section className="rounded-xl border border-border bg-sentry-panel p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-sentry-emerald" />
          <h3 className="font-semibold text-sm">{t.riskForecast}</h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {region === "pakistan" ? t.pakistan : t.global} · 7-day projection
        </span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="riskFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.82 0.18 200)" stopOpacity={0.6} />
                <stop offset="100%" stopColor="oklch(0.82 0.18 200)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="riskBand" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.78 0.19 155)" stopOpacity={0.25} />
                <stop offset="100%" stopColor="oklch(0.78 0.19 155)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.32 0.03 230 / 0.4)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.7 0.02 240)" }} stroke="oklch(0.32 0.03 230)" />
            <YAxis tick={{ fontSize: 10, fill: "oklch(0.7 0.02 240)" }} stroke="oklch(0.32 0.03 230)" />
            <Tooltip
              contentStyle={{
                background: "oklch(0.18 0.02 250)",
                border: "1px solid oklch(0.32 0.03 230)",
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: "oklch(0.82 0.18 200)" }}
            />
            <ReferenceLine x="TODAY" stroke="oklch(0.65 0.25 25)" strokeDasharray="4 4" label={{ value: "NOW", fill: "oklch(0.65 0.25 25)", fontSize: 10, position: "top" }} />
            <Area type="monotone" dataKey="upper" stroke="none" fill="url(#riskBand)" />
            <Area type="monotone" dataKey="risk" stroke="oklch(0.82 0.18 200)" strokeWidth={2} fill="url(#riskFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
