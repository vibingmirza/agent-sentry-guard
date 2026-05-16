import { useApp } from "./app-context";
import { Globe2, MapPin } from "lucide-react";

type Node = { name: string; x: number; y: number };

const PK_NODES: Node[] = [
  { name: "Islamabad", x: 200, y: 90 },
  { name: "Lahore", x: 245, y: 175 },
  { name: "Karachi", x: 110, y: 290 },
];

const GLOBAL_NODES: Node[] = [
  { name: "San Francisco", x: 110, y: 145 },
  { name: "New York", x: 215, y: 135 },
  { name: "London", x: 380, y: 115 },
  { name: "Berlin", x: 410, y: 115 },
  { name: "Dubai", x: 470, y: 175 },
  { name: "Islamabad", x: 510, y: 155 },
  { name: "Singapore", x: 585, y: 220 },
  { name: "Tokyo", x: 655, y: 145 },
  { name: "Sydney", x: 680, y: 285 },
];

export function RegionMap() {
  const { region, t } = useApp();
  return (
    <section className="rounded-xl border border-border bg-sentry-panel p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {region === "pakistan" ? (
            <MapPin className="size-4 text-sentry-cyan" />
          ) : (
            <Globe2 className="size-4 text-sentry-cyan" />
          )}
          <h3 className="font-semibold text-sm">
            {region === "pakistan" ? t.pakistan : t.global} Sovereignty Grid
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
          Live · {region === "pakistan" ? PK_NODES.length : GLOBAL_NODES.length} nodes
        </span>
      </div>
      <div className="rounded-lg bg-sentry-panel-2/60 border border-border overflow-hidden sentry-grid-bg">
        {region === "pakistan" ? <PakistanMap /> : <GlobalMap />}
      </div>
    </section>
  );
}

function Pulse({ x, y, label }: Node) {
  return (
    <g>
      <circle cx={x} cy={y} r="12" className="fill-sentry-cyan/15">
        <animate attributeName="r" values="6;18;6" dur="2.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.9;0;0.9" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r="4" className="fill-sentry-cyan" style={{ filter: "drop-shadow(0 0 6px currentColor)" }} />
      <text
        x={x + 8}
        y={y - 8}
        className="fill-foreground"
        style={{ font: "600 10px ui-sans-serif", textShadow: "0 0 4px rgba(0,0,0,0.6)" }}
      >
        {label}
      </text>
    </g>
  );
}

function PakistanMap() {
  // Simplified stylized outline of Pakistan
  return (
    <svg viewBox="0 0 360 360" className="w-full h-[320px]">
      <defs>
        <linearGradient id="pkFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.82 0.18 200)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.78 0.19 155)" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <path
        d="M120 40 L180 30 L230 50 L260 80 L270 120 L255 145 L275 165 L260 200 L210 215 L195 245 L170 270 L140 305 L100 320 L70 300 L55 260 L70 225 L60 195 L80 165 L70 130 L95 100 L100 70 Z"
        fill="url(#pkFill)"
        stroke="oklch(0.82 0.18 200 / 0.6)"
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 12px oklch(0.82 0.18 200 / 0.3))" }}
      />
      {PK_NODES.map((n) => (
        <Pulse key={n.name} {...n} />
      ))}
    </svg>
  );
}

function GlobalMap() {
  // Stylized continent blobs
  return (
    <svg viewBox="0 0 760 380" className="w-full h-[320px]">
      <defs>
        <linearGradient id="glFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.19 155)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="oklch(0.82 0.18 200)" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <g
        fill="url(#glFill)"
        stroke="oklch(0.82 0.18 200 / 0.45)"
        strokeWidth="1"
        style={{ filter: "drop-shadow(0 0 10px oklch(0.82 0.18 200 / 0.25))" }}
      >
        {/* N. America */}
        <path d="M50 100 L180 80 L240 110 L230 180 L170 220 L100 215 L60 175 Z" />
        {/* S. America */}
        <path d="M170 230 L230 240 L220 300 L185 340 L160 320 L155 280 Z" />
        {/* Europe */}
        <path d="M340 90 L420 85 L440 130 L400 160 L355 145 Z" />
        {/* Africa */}
        <path d="M380 170 L450 175 L455 245 L420 300 L385 285 L370 235 Z" />
        {/* Asia */}
        <path d="M450 80 L640 90 L680 150 L640 200 L555 215 L495 195 L460 150 Z" />
        {/* Australia */}
        <path d="M620 270 L710 265 L720 310 L660 320 L625 305 Z" />
      </g>
      {GLOBAL_NODES.map((n) => (
        <Pulse key={n.name} {...n} />
      ))}
    </svg>
  );
}
