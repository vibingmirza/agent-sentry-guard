import { useEffect, useMemo, useRef, useState } from "react";
import {
  Globe2,
  KeyRound,
  ShieldCheck,
  Radio,
  Lock,
  RefreshCw,
  Fingerprint,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Node = {
  id: string;
  city: string;
  region: string;
  x: number;
  y: number;
  compliance: number;
  tokenType: "JWT" | "OAuth";
  sync: "Encrypted" | "Isolated";
};

const NODES: Node[] = [
  { id: "dxb", city: "Dubai", region: "Middle East Command Hub", x: 470, y: 175, compliance: 98.4, tokenType: "JWT", sync: "Encrypted" },
  { id: "fra", city: "Frankfurt", region: "Sovereign Euro-Grid", x: 410, y: 115, compliance: 99.1, tokenType: "OAuth", sync: "Encrypted" },
  { id: "sin", city: "Singapore", region: "Asia-Pacific Gateway", x: 585, y: 220, compliance: 97.6, tokenType: "JWT", sync: "Isolated" },
];

const SOVEREIGN = { id: "isl", city: "Islamabad", x: 510, y: 155 };

function randomHash(): string {
  const bytes = new Uint8Array(32);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

type Broadcast = {
  id: string;
  ts: string;
  signature: string;
  scrubbed: boolean;
  received: string[]; // node ids
};

export function FederationGrid() {
  const [keys, setKeys] = useState<Record<string, string>>(() =>
    Object.fromEntries(NODES.map((n) => [n.id, randomHash()])),
  );
  const [rotating, setRotating] = useState(false);
  const [rotationAt, setRotationAt] = useState<number>(() => Date.now());
  const [broadcasting, setBroadcasting] = useState(false);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([
    {
      id: "seed",
      ts: new Date(Date.now() - 1000 * 60 * 4).toLocaleTimeString([], { hour12: false }),
      signature: randomHash().slice(0, 48),
      scrubbed: true,
      received: NODES.map((n) => n.id),
    },
  ]);
  const [telemetry, setTelemetry] = useState(() =>
    NODES.map((n) => ({ id: n.id, latency: 40 + Math.random() * 40, throughput: 80 + Math.random() * 20 })),
  );
  const feedEnd = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setTelemetry((arr) =>
        arr.map((t) => ({
          ...t,
          latency: Math.max(18, Math.min(120, t.latency + (Math.random() - 0.5) * 8)),
          throughput: Math.max(50, Math.min(100, t.throughput + (Math.random() - 0.5) * 4)),
        })),
      );
    }, 1400);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    feedEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [broadcasts]);

  const rotateKeys = () => {
    if (rotating) return;
    setRotating(true);
    let ticks = 0;
    const id = setInterval(() => {
      setKeys(Object.fromEntries(NODES.map((n) => [n.id, randomHash()])));
      ticks++;
      if (ticks > 10) {
        clearInterval(id);
        setRotating(false);
        setRotationAt(Date.now());
      }
    }, 90);
  };

  const broadcast = () => {
    if (broadcasting) return;
    setBroadcasting(true);
    const stamp = new Date().toLocaleTimeString([], { hour12: false });
    const sig = randomHash().slice(0, 48);
    const pending: Broadcast = { id: `b-${Date.now()}`, ts: stamp, signature: sig, scrubbed: false, received: [] };
    setBroadcasts((arr) => [...arr, pending]);

    // scrub
    setTimeout(() => {
      setBroadcasts((arr) =>
        arr.map((b) => (b.id === pending.id ? { ...b, scrubbed: true } : b)),
      );
    }, 700);

    // propagate to nodes one by one
    NODES.forEach((n, i) => {
      setTimeout(
        () => {
          setBroadcasts((arr) =>
            arr.map((b) =>
              b.id === pending.id ? { ...b, received: [...b.received, n.id] } : b,
            ),
          );
        },
        1200 + i * 500,
      );
    });

    setTimeout(() => setBroadcasting(false), 1200 + NODES.length * 500 + 200);
  };

  const lastRotated = useMemo(() => {
    const sec = Math.floor((Date.now() - rotationAt) / 1000);
    return sec;
  }, [rotationAt, broadcasts]);

  return (
    <div className="p-8 space-y-6">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--war-purple)]">
            Sovereign Federation Grid
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1">Cross-Border Ledger &amp; KMS</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Secure multi-agent federation with strict residency. Zero-knowledge broadcasts to allied
            command hubs — local rotation, no external API required.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest">
          <span className="size-2 rounded-full bg-[color:var(--war-purple)] shadow-[0_0_10px_var(--war-purple)]" />
          Federation Online · {NODES.length} allies
        </div>
      </header>

      {/* Alliance grid map */}
      <section className="war-panel p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Globe2 className="size-4 text-[color:var(--war-cyan)]" />
            <h3 className="text-sm font-semibold">Federated Alliance Node Network</h3>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Residency · Pakistan sovereign core
          </span>
        </div>
        <div className="rounded-lg border border-border bg-background/40 overflow-hidden sentry-grid-bg">
          <FederationMap />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {NODES.map((n) => {
            const t = telemetry.find((x) => x.id === n.id)!;
            return (
              <div key={n.id} className="war-tile p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-[color:var(--war-purple)]">
                      {n.region}
                    </div>
                    <div className="font-semibold">{n.city}</div>
                  </div>
                  <span
                    className={cn(
                      "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded",
                      n.sync === "Encrypted"
                        ? "border border-[color:var(--war-cyan)]/50 text-[color:var(--war-cyan)]"
                        : "border border-amber-400/50 text-amber-400",
                    )}
                  >
                    {n.sync}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="war-chip">Token · {n.tokenType}</div>
                  <div className="war-chip">SCI · {n.compliance.toFixed(1)}%</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <div>Latency · <span className="text-foreground font-mono">{t.latency.toFixed(0)}ms</span></div>
                  <div>Tput · <span className="text-foreground font-mono">{t.throughput.toFixed(0)}%</span></div>
                </div>
                <div className="text-[10px] font-mono break-all text-muted-foreground/80">
                  <span className="text-[color:var(--war-purple)]">key:</span>{" "}
                  {keys[n.id].slice(0, 48)}…
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTSN + KMS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="war-panel p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="size-4 text-[color:var(--war-cyan)]" />
              <h3 className="text-sm font-semibold">Federation Intelligence Broadcast (CTSN)</h3>
            </div>
            <Button
              onClick={broadcast}
              disabled={broadcasting}
              className="bg-[color:var(--war-purple)] text-background hover:bg-[color:var(--war-purple)]/85"
            >
              <Radio className="size-4" />
              {broadcasting ? "Broadcasting…" : "Broadcast Anonymized Signature"}
            </Button>
          </div>

          <div className="h-[300px] overflow-y-auto rounded-md border border-border bg-black/40 p-3 font-mono text-[11px] leading-relaxed">
            {broadcasts.map((b) => (
              <div key={b.id} className="mb-3">
                <div className="text-muted-foreground">
                  {b.ts} <span className="text-[color:var(--war-cyan)]">[CTSN]</span> emit
                </div>
                <div className="pl-4">
                  <span className="text-[color:var(--war-purple)]">sig:</span>{" "}
                  <span className={cn(!b.scrubbed && "blur-sm select-none")}>
                    {b.signature}
                  </span>
                  {!b.scrubbed && (
                    <span className="ml-2 text-amber-400">scrubbing PII…</span>
                  )}
                  {b.scrubbed && (
                    <span className="ml-2 text-emerald-400">[ZKP-sealed]</span>
                  )}
                </div>
                {NODES.map((n) => {
                  const ok = b.received.includes(n.id);
                  return (
                    <div key={n.id} className="pl-4 flex items-center gap-2">
                      <span className={ok ? "text-emerald-400" : "text-muted-foreground/60"}>
                        {ok ? "✓" : "·"}
                      </span>
                      <span className="text-muted-foreground">
                        → {n.city.toUpperCase()}
                      </span>
                      <span className={ok ? "text-emerald-400" : "text-muted-foreground/50"}>
                        {ok ? "ACK · received" : "pending…"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ))}
            <div ref={feedEnd} />
          </div>
        </div>

        <div className="war-panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="size-4 text-[color:var(--war-purple)]" />
              <h3 className="text-sm font-semibold">Cryptographic KMS Board</h3>
            </div>
          </div>

          <div className="space-y-3">
            <KmsRow
              icon={Lock}
              label="Quantum-Resistant Key Rotation"
              status="ACTIVE"
              detail="Kyber-1024 + AES-256-GCM hybrid"
            />
            <KmsRow
              icon={Fingerprint}
              label="Zero-Knowledge Policy Proofs"
              status="ACTIVE"
              detail="Groth16 circuits · 384-bit witness"
            />
            <KmsRow
              icon={ShieldCheck}
              label="Federation mTLS Pinning"
              status="ENFORCED"
              detail="SHA-256 cert chain · 3 allies"
            />
            <KmsRow
              icon={Activity}
              label="Rotation Cadence"
              status={`${lastRotated}s ago`}
              detail="Target ≤ 300s drift"
            />
          </div>

          <Button
            onClick={rotateKeys}
            disabled={rotating}
            variant="outline"
            className={cn(
              "w-full border-[color:var(--war-cyan)]/50 text-[color:var(--war-cyan)] hover:bg-[color:var(--war-cyan)]/10 hover:text-[color:var(--war-cyan)]",
              rotating && "animate-pulse",
            )}
          >
            <RefreshCw className={cn("size-4", rotating && "animate-spin")} />
            {rotating ? "Recalculating…" : "Rotate Global Verification Keys"}
          </Button>

          <div className="rounded-md border border-border bg-black/40 p-3 font-mono text-[10px] leading-relaxed space-y-1">
            {NODES.map((n) => (
              <div key={n.id} className="flex gap-2">
                <span className="text-[color:var(--war-purple)] w-16 shrink-0">
                  {n.city.toLowerCase()}
                </span>
                <span className={cn("truncate", rotating && "text-[color:var(--war-cyan)]")}>
                  {keys[n.id]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScopedStyles />
    </div>
  );
}

function KmsRow({
  icon: Icon,
  label,
  status,
  detail,
}: {
  icon: typeof Lock;
  label: string;
  status: string;
  detail: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background/40 p-3">
      <div className="flex items-center gap-3">
        <span className="size-8 grid place-items-center rounded border border-[color:var(--war-purple)]/40 bg-[color:var(--war-purple)]/10">
          <Icon className="size-4 text-[color:var(--war-purple)]" />
        </span>
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{detail}</div>
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-[color:var(--war-cyan)]">
        {status}
      </span>
    </div>
  );
}

function FederationMap() {
  return (
    <svg viewBox="0 0 760 380" className="w-full h-[260px]">
      <defs>
        <linearGradient id="fedfill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--war-purple)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--war-cyan)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <g
        fill="url(#fedfill)"
        stroke="var(--war-cyan)"
        strokeOpacity="0.4"
        strokeWidth="1"
      >
        <path d="M340 90 L420 85 L440 130 L400 160 L355 145 Z" />
        <path d="M380 170 L450 175 L455 245 L420 300 L385 285 L370 235 Z" />
        <path d="M450 80 L640 90 L680 150 L640 200 L555 215 L495 195 L460 150 Z" />
        <path d="M620 270 L710 265 L720 310 L660 320 L625 305 Z" />
      </g>

      {NODES.map((n) => (
        <line
          key={n.id}
          x1={SOVEREIGN.x}
          y1={SOVEREIGN.y}
          x2={n.x}
          y2={n.y}
          stroke="var(--war-purple)"
          strokeOpacity="0.5"
          strokeWidth="1"
          strokeDasharray="4 4"
        >
          <animate
            attributeName="stroke-dashoffset"
            from="0"
            to="-16"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </line>
      ))}

      {/* Sovereign core */}
      <g>
        <circle
          cx={SOVEREIGN.x}
          cy={SOVEREIGN.y}
          r="9"
          fill="var(--war-cyan)"
          style={{ filter: "drop-shadow(0 0 10px var(--war-cyan))" }}
        />
        <circle cx={SOVEREIGN.x} cy={SOVEREIGN.y} r="14" fill="var(--war-cyan)" fillOpacity="0.15">
          <animate attributeName="r" values="10;22;10" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <text x={SOVEREIGN.x + 10} y={SOVEREIGN.y - 10} fill="currentColor" style={{ font: "600 11px ui-sans-serif" }}>
          Sovereign Core
        </text>
      </g>

      {NODES.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r="6" fill="var(--war-purple)" style={{ filter: "drop-shadow(0 0 8px var(--war-purple))" }} />
          <text x={n.x + 10} y={n.y - 8} fill="currentColor" style={{ font: "600 11px ui-sans-serif" }}>
            {n.city}
          </text>
        </g>
      ))}
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
        border: 1px solid color-mix(in oklab, var(--war-purple) 25%, transparent);
        background:
          linear-gradient(180deg, color-mix(in oklab, var(--war-cyan) 4%, transparent), transparent 70%),
          color-mix(in oklab, var(--background) 92%, black);
        border-radius: 12px;
        box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--war-cyan) 8%, transparent);
        background-image:
          linear-gradient(color-mix(in oklab, var(--war-purple) 6%, transparent) 1px, transparent 1px),
          linear-gradient(90deg, color-mix(in oklab, var(--war-purple) 6%, transparent) 1px, transparent 1px);
        background-size: 28px 28px;
      }
      .war-tile {
        border: 1px solid color-mix(in oklab, var(--war-purple) 25%, transparent);
        background: color-mix(in oklab, var(--background) 92%, black);
        border-radius: 10px;
      }
      .war-chip {
        border: 1px solid color-mix(in oklab, var(--war-cyan) 35%, transparent);
        color: color-mix(in oklab, var(--war-cyan) 90%, white);
        padding: 4px 6px;
        border-radius: 4px;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 0.08em;
      }
    `}</style>
  );
}
