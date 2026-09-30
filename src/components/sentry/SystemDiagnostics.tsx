import { useEffect, useState } from "react";
import { Cpu, MemoryStick, Network, Server } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, YAxis } from "recharts";

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const drift = (v: number, range: number, min: number, max: number) =>
  clamp(v + (Math.random() - 0.5) * range, min, max);

export function SystemDiagnostics() {
  const [cpu, setCpu] = useState(42);
  const [ram, setRam] = useState(68);
  const [agents] = useState({ online: 14, total: 14 });
  const [bandwidth, setBandwidth] = useState(4.2);
  const [stream, setStream] = useState<{ v: number }[]>(
    Array.from({ length: 24 }, (_, i) => ({ v: 3.5 + Math.sin(i / 2) + Math.random() })),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setCpu((c) => Math.round(drift(c, 8, 18, 92)));
      setRam((r) => Math.round(drift(r, 5, 35, 95)));
      setBandwidth((b) => Number(drift(b, 0.8, 1.2, 9.5).toFixed(1)));
      setStream((s) => [...s.slice(1), { v: drift(s[s.length - 1].v, 0.9, 1.5, 9.5) }]);
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <section>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 mb-4">
        <Server className="size-4 text-sentry-cyan" />
        <h3 className="font-semibold">System Performance &amp; Diagnostics</h3>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground">
          Live · 1.5s tick
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CPU & Memory */}
        <div className="rounded-xl border border-border bg-sentry-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              CPU &amp; Memory
            </span>
            <Cpu className="size-4 text-slate-400" />
          </div>
          <UsageBar label="CPU" value={cpu} icon={Cpu} accent="hsl(217 91% 60%)" />
          <UsageBar label="RAM" value={ram} icon={MemoryStick} accent="hsl(199 89% 60%)" />
        </div>

        {/* Active Agents */}
        <div className="rounded-xl border border-border bg-sentry-panel p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Active Agent Connections
            </span>
            <Server className="size-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold tabular-nums text-foreground mt-2">
            {agents.online} <span className="text-muted-foreground text-xl">/ {agents.total}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Sentry Nodes Connected</div>
          <div className="mt-auto grid grid-cols-4 gap-1 pt-4 sm:grid-cols-7">
            {Array.from({ length: agents.total }).map((_, i) => (
              <div
                key={i}
                className="h-2 rounded-sm bg-sentry-emerald/70"
                style={{ boxShadow: "0 0 6px hsl(160 84% 45% / 0.6)" }}
              />
            ))}
          </div>
        </div>

        {/* Bandwidth */}
        <div className="rounded-xl border border-border bg-sentry-panel p-5 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Network Bandwidth
            </span>
            <Network className="size-4 text-slate-400" />
          </div>
          <div className="text-3xl font-bold tabular-nums text-foreground mt-2">
            {bandwidth.toFixed(1)} <span className="text-base text-muted-foreground">MB/s</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">Live Ingress Stream</div>
          <div className="mt-auto h-12 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stream}>
                <YAxis hide domain={[0, 10]} />
                <Line
                  type="monotone"
                  dataKey="v"
                  stroke="hsl(217 91% 60%)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

function UsageBar({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: number;
  icon: typeof Cpu;
  accent: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="size-3.5" />
          <span>{label}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums" style={{ color: accent }}>
          {value}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-sentry-panel-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: accent, boxShadow: `0 0 8px ${accent}` }}
        />
      </div>
    </div>
  );
}
