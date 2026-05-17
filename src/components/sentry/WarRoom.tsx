import { useEffect, useMemo, useRef, useState } from "react";
import {
  Crosshair,
  Play,
  Radar,
  ShieldAlert,
  Activity,
  Cpu,
  Waves,
  Ghost,
  Factory,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type City = "Karachi" | "Lahore" | "Islamabad";
type Stage = 0 | 1 | 2 | 3 | 4; // 0 = idle

type Scenario = {
  id: string;
  name: string;
  icon: typeof Waves;
  target: City;
  blurb: string;
  vector: string;
  velocity: string;
  estLoss: number; // USD
};

const SCENARIOS: Scenario[] = [
  {
    id: "red-monsoon",
    name: "Operation Red Monsoon",
    icon: Waves,
    target: "Karachi",
    blurb: "High-velocity DDoS flooding the Karachi maritime data hub.",
    vector: "Volumetric L3/L4 + DNS amplification",
    velocity: "2.4 Tbps surge",
    estLoss: 1_840_000,
  },
  {
    id: "ghost-protocol",
    name: "Ghost Protocol",
    icon: Ghost,
    target: "Islamabad",
    blurb: "Silent credential escalation into the Islamabad Federal core.",
    vector: "Stolen OAuth refresh + lateral pivot",
    velocity: "Low & slow · 6 req/min",
    estLoss: 4_120_000,
  },
  {
    id: "sdg9",
    name: "SDG 9 Compliance Disruption",
    icon: Factory,
    target: "Lahore",
    blurb: "Supply-chain ransomware against Lahore industrial automation servers.",
    vector: "Signed-update poisoning · LockBit variant",
    velocity: "Encryption ETA 9m",
    estLoss: 7_650_000,
  },
];

const PK_COORDS: Record<City, { x: number; y: number }> = {
  Islamabad: { x: 200, y: 90 },
  Lahore: { x: 245, y: 175 },
  Karachi: { x: 110, y: 290 },
};

type FeedLine = { ts: string; level: "info" | "warn" | "crit" | "ok"; text: string };

const fmtMs = (ms: number) => `${ms.toLocaleString()} ms`;
const fmtUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export function WarRoom() {
  const [scenario, setScenario] = useState<Scenario>(SCENARIOS[0]);
  const [stage, setStage] = useState<Stage>(0);
  const [running, setRunning] = useState(false);
  const [integrity, setIntegrity] = useState(100);
  const [blocked, setBlocked] = useState(0);
  const [surge, setSurge] = useState(0); // multiplier 0..3
  const [defense, setDefense] = useState(0);
  const [feed, setFeed] = useState<FeedLine[]>([
    { ts: now(), level: "info", text: "War Room standby — select a scenario." },
  ]);
  const [ttr, setTtr] = useState<number | null>(null);
  const startRef = useRef<number>(0);
  const feedEnd = useRef<HTMLDivElement | null>(null);

  function now() {
    return new Date().toLocaleTimeString([], { hour12: false });
  }

  const push = (line: Omit<FeedLine, "ts">) =>
    setFeed((f) => [...f.slice(-120), { ...line, ts: now() }]);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [feed]);

  // Stage choreography
  useEffect(() => {
    if (!running) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    push({ level: "warn", text: `[RECON] ${scenario.name} — probing ${scenario.target} edge.` });
    setStage(1);

    timers.push(
      setTimeout(() => {
        setStage(2);
        push({ level: "crit", text: `[PENETRATION] ${scenario.vector} on ${scenario.target}.` });
        const id = setInterval(
          () => setIntegrity((p) => Math.max(38, p - 2.4 - Math.random() * 2)),
          120,
        );
        timers.push(setTimeout(() => clearInterval(id), 2400) as unknown as ReturnType<typeof setTimeout>);
        const sid = setInterval(() => setSurge((s) => Math.min(3, s + 0.18)), 140);
        timers.push(setTimeout(() => clearInterval(sid), 2400) as unknown as ReturnType<typeof setTimeout>);
      }, 1600),
    );

    timers.push(
      setTimeout(() => {
        setStage(3);
        push({ level: "info", text: `[SENTRY-AI] Drafting countermeasure rule → Action Queue.` });
        const id = setInterval(() => {
          setDefense((d) => {
            const next = Math.min(100, d + 4 + Math.random() * 3);
            if (next < 100) setBlocked((b) => b + Math.round(scenario.estLoss * 0.012));
            return next;
          });
        }, 90);
        timers.push(setTimeout(() => clearInterval(id), 2800) as unknown as ReturnType<typeof setTimeout>);
      }, 4200),
    );

    timers.push(
      setTimeout(() => {
        setStage(4);
        setDefense(100);
        const recover = setInterval(
          () => setIntegrity((p) => Math.min(100, p + 3)),
          80,
        );
        timers.push(setTimeout(() => clearInterval(recover), 1800) as unknown as ReturnType<typeof setTimeout>);
        const ms = performance.now() - startRef.current;
        setTtr(Math.round(ms));
        push({ level: "ok", text: `[RESOLVED] Mitigation in ${fmtMs(Math.round(ms))}. Loss blocked.` });
        setBlocked((b) => Math.max(b, Math.round(scenario.estLoss * 0.92)));
        setRunning(false);
        const sid = setInterval(() => setSurge((s) => Math.max(0, s - 0.12)), 100);
        timers.push(setTimeout(() => clearInterval(sid), 2500) as unknown as ReturnType<typeof setTimeout>);
      }, 7200),
    );

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const execute = () => {
    if (running) return;
    setStage(0);
    setIntegrity(100);
    setDefense(0);
    setBlocked(0);
    setTtr(null);
    setSurge(0);
    setFeed([{ ts: now(), level: "info", text: `Booting war game: ${scenario.name}` }]);
    startRef.current = performance.now();
    setRunning(true);
  };

  const stageLabels = ["Idle", "Reconnaissance", "Penetration", "System Reaction", "Resolution"];

  const baseRate = 5.0;
  const liveRate = baseRate * (1 + surge);

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--war-cyan)]">
            Strategic War Room
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1">Predictive Breach Simulation</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Live red-team rehearsal harness. Run high-fidelity adversary scripts against the
            sovereign grid — no external dependencies, all client-side.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
          <span className="size-2 rounded-full bg-[color:var(--war-cyan)] shadow-[0_0_10px_var(--war-cyan)]" />
          Range Armed
        </div>
      </header>

      {/* Scenario selector */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {SCENARIOS.map((s) => {
          const Icon = s.icon;
          const active = scenario.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => !running && setScenario(s)}
              disabled={running}
              className={cn(
                "war-tile text-left p-5 flex flex-col gap-3 disabled:opacity-60",
                active && "war-tile--active",
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-9 rounded-md grid place-items-center border border-[color:var(--war-cyan)]/40 bg-[color:var(--war-cyan)]/10">
                    <Icon className="size-4 text-[color:var(--war-cyan)]" />
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-[color:var(--war-purple)]">
                    Target · {s.target}
                  </span>
                </div>
                {active && (
                  <span className="text-[10px] uppercase tracking-widest text-[color:var(--war-cyan)]">
                    Loaded
                  </span>
                )}
              </div>
              <h3 className="font-semibold leading-tight">{s.name}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.blurb}</p>
              <div className="grid grid-cols-2 gap-2 mt-1 text-[10px] uppercase tracking-widest">
                <div className="war-chip">{s.vector}</div>
                <div className="war-chip">{s.velocity}</div>
              </div>
            </button>
          );
        })}
      </section>

      {/* Controller bar */}
      <section className="war-panel p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={execute}
              disabled={running}
              className="bg-[color:var(--war-cyan)] text-background hover:bg-[color:var(--war-cyan)]/85"
            >
              <Play className="size-4" />
              {running ? "Scenario Running…" : "Execute Scenario"}
            </Button>
            <div className="text-xs text-muted-foreground">
              Stage{" "}
              <span className="text-[color:var(--war-cyan)] font-semibold">
                {stage}/4 · {stageLabels[stage]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Timer className="size-3.5" />
            {ttr !== null ? (
              <span className="text-[color:var(--war-cyan)] font-semibold">
                TTR · {fmtMs(ttr)}
              </span>
            ) : (
              <span>Awaiting mitigation</span>
            )}
          </div>
        </div>

        {/* Stage timeline */}
        <ol className="mt-5 grid grid-cols-4 gap-2">
          {[
            { n: 1, label: "Reconnaissance", icon: Radar },
            { n: 2, label: "Penetration", icon: ShieldAlert },
            { n: 3, label: "System Reaction", icon: Cpu },
            { n: 4, label: "Resolution", icon: CheckCircle2 },
          ].map((s) => {
            const Icon = s.icon;
            const reached = stage >= (s.n as Stage);
            const current = stage === (s.n as Stage);
            return (
              <li
                key={s.n}
                className={cn(
                  "rounded-md border p-3 transition-colors",
                  reached
                    ? "border-[color:var(--war-cyan)]/60 bg-[color:var(--war-cyan)]/10"
                    : "border-border bg-card/40",
                  current && "shadow-[0_0_24px_var(--war-cyan)]",
                )}
              >
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>Stage {s.n}</span>
                  <Icon
                    className={cn(
                      "size-3.5",
                      reached ? "text-[color:var(--war-cyan)]" : "text-muted-foreground",
                    )}
                  />
                </div>
                <div className="mt-1 text-sm font-medium">{s.label}</div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Map + Terminal */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="war-panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Crosshair className="size-4 text-[color:var(--war-cyan)]" />
              <h3 className="text-sm font-semibold">Live Engagement · Sovereign Grid</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Target lock · {scenario.target}
            </span>
          </div>
          <div className="rounded-lg border border-border bg-background/40 overflow-hidden sentry-grid-bg">
            <WarMap target={scenario.target} stage={stage} />
          </div>
        </div>

        <div className="war-panel p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="size-4 text-[color:var(--war-purple)]" />
              <h3 className="text-sm font-semibold">War Room Terminal</h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {feed.length} lines
            </span>
          </div>
          <div className="h-[320px] overflow-y-auto rounded-md border border-border bg-black/40 p-3 font-mono text-[11px] leading-relaxed">
            {feed.map((l, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted-foreground">{l.ts}</span>
                <span
                  className={cn(
                    l.level === "info" && "text-[color:var(--war-cyan)]",
                    l.level === "warn" && "text-amber-400",
                    l.level === "crit" && "text-rose-400",
                    l.level === "ok" && "text-emerald-400",
                  )}
                >
                  {l.text}
                </span>
              </div>
            ))}
            <div ref={feedEnd} />
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricGauge
          label="System Integrity"
          value={integrity}
          suffix="%"
          tone={integrity > 80 ? "good" : integrity > 60 ? "warn" : "bad"}
          progress={integrity}
        />
        <MetricGauge
          label="Financial Loss Blocked"
          value={blocked}
          formatter={fmtUsd}
          tone="good"
          progress={Math.min(100, (blocked / scenario.estLoss) * 100)}
          footer={`Cap · ${fmtUsd(scenario.estLoss)}`}
        />
        <MetricGauge
          label="Compute Surge Overhead"
          value={liveRate}
          formatter={(n) => `$${n.toFixed(2)}/hr`}
          tone={surge > 1.5 ? "bad" : surge > 0.6 ? "warn" : "good"}
          progress={Math.min(100, (surge / 3) * 100)}
          footer={`Base $${baseRate.toFixed(2)}/hr · ×${(1 + surge).toFixed(2)}`}
        />
      </section>

      <ScopedStyles />
    </div>
  );
}

function MetricGauge({
  label,
  value,
  suffix,
  formatter,
  tone,
  progress,
  footer,
}: {
  label: string;
  value: number;
  suffix?: string;
  formatter?: (n: number) => string;
  tone: "good" | "warn" | "bad";
  progress: number;
  footer?: string;
}) {
  const color =
    tone === "good"
      ? "var(--war-cyan)"
      : tone === "warn"
        ? "oklch(0.82 0.17 75)"
        : "oklch(0.7 0.27 20)";
  const display = formatter ? formatter(value) : `${Math.round(value).toLocaleString()}${suffix ?? ""}`;
  return (
    <div className="war-panel p-5">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div
        className="mt-1 text-3xl font-bold font-mono tabular-nums"
        style={{ color, textShadow: `0 0 16px ${color}` }}
      >
        {display}
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-background/60 overflow-hidden">
        <div
          className="h-full transition-all"
          style={{
            width: `${progress}%`,
            background: color,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>
      {footer && (
        <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}

function WarMap({ target, stage }: { target: City; stage: Stage }) {
  const cities: City[] = ["Islamabad", "Lahore", "Karachi"];
  return (
    <svg viewBox="0 0 360 360" className="w-full h-[300px]">
      <defs>
        <linearGradient id="warpk" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--war-cyan)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--war-purple)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path
        d="M120 40 L180 30 L230 50 L260 80 L270 120 L255 145 L275 165 L260 200 L210 215 L195 245 L170 270 L140 305 L100 320 L70 300 L55 260 L70 225 L60 195 L80 165 L70 130 L95 100 L100 70 Z"
        fill="url(#warpk)"
        stroke="var(--war-cyan)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
      />
      {cities.map((c) => {
        const p = PK_COORDS[c];
        const isTarget = c === target;
        const breached = isTarget && stage >= 2 && stage < 4;
        const resolved = isTarget && stage === 4;
        const color = breached
          ? "oklch(0.65 0.25 25)"
          : resolved
            ? "var(--war-cyan)"
            : "var(--war-purple)";
        return (
          <g key={c}>
            <circle cx={p.x} cy={p.y} r="14" fill={color} fillOpacity="0.15">
              {breached && (
                <>
                  <animate attributeName="r" values="8;22;8" dur="0.9s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0;0.9" dur="0.9s" repeatCount="indefinite" />
                </>
              )}
            </circle>
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill={color}
              style={{ filter: `drop-shadow(0 0 8px ${color})` }}
            />
            <text
              x={p.x + 9}
              y={p.y - 9}
              fill="currentColor"
              style={{ font: "600 11px ui-sans-serif" }}
            >
              {c}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ScopedStyles() {
  return (
    <style>{`
      :root, .theme-light, .theme-cyber {
        --war-cyan: #00f2ff;
        --war-purple: #bc84ee;
      }
      .war-panel {
        border: 1px solid color-mix(in oklab, var(--war-cyan) 25%, transparent);
        background:
          linear-gradient(180deg, color-mix(in oklab, var(--war-purple) 4%, transparent), transparent 70%),
          color-mix(in oklab, var(--background) 92%, black);
        border-radius: 12px;
        box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--war-purple) 8%, transparent);
        background-image:
          linear-gradient(color-mix(in oklab, var(--war-cyan) 6%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklab, var(--war-cyan) 6%, transparent) 1px, transparent 1px);
        background-size: 28px 28px;
      }
      .war-tile {
        border: 1px solid color-mix(in oklab, var(--war-cyan) 20%, transparent);
        background: color-mix(in oklab, var(--background) 92%, black);
        border-radius: 12px;
        transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
      }
      .war-tile:hover { transform: translateY(-1px); border-color: color-mix(in oklab, var(--war-cyan) 50%, transparent); }
      .war-tile--active {
        border-color: var(--war-cyan);
        box-shadow: 0 0 0 1px var(--war-cyan), 0 0 28px color-mix(in oklab, var(--war-cyan) 35%, transparent);
      }
      .war-chip {
        border: 1px solid color-mix(in oklab, var(--war-purple) 35%, transparent);
        color: color-mix(in oklab, var(--war-purple) 85%, white);
        padding: 4px 6px;
        border-radius: 4px;
        text-align: center;
      }
    `}</style>
  );
}
