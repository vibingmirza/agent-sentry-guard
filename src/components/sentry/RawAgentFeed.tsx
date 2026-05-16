import { useEffect, useRef, useState } from "react";
import { Terminal, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "./app-context";

type LogLine = { id: number; ts: string; level: "INFO" | "WARN" | "ERROR" | "OK"; agent: string; msg: string };

const AGENTS = ["Auth_Sentinel", "Gateway_Agent", "Model_Vault", "Orchestrator", "Worker_07", "Marketing_Bot", "Database_Agent"];
const MESSAGES: { lvl: LogLine["level"]; msg: string }[] = [
  { lvl: "INFO", msg: "Heartbeat OK · 14ms" },
  { lvl: "OK", msg: "Prompt accepted · sentry-pass" },
  { lvl: "WARN", msg: "Rate-limit nearing threshold (82%)" },
  { lvl: "ERROR", msg: "Prompt-injection signature matched · BLOCKED" },
  { lvl: "INFO", msg: "Memory checkpoint persisted to vault" },
  { lvl: "OK", msg: "Policy bundle v2.14 validated" },
  { lvl: "WARN", msg: "Unusual token spike detected (+38%)" },
  { lvl: "ERROR", msg: "Auth handshake failed · retrying" },
  { lvl: "INFO", msg: "Region routing applied" },
];

let counter = 0;

export function RawAgentFeed() {
  const { region, t } = useApp();
  const [lines, setLines] = useState<LogLine[]>([]);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused) return;
    const tick = () => {
      const a = AGENTS[Math.floor(Math.random() * AGENTS.length)];
      const m = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
      const ts = new Date().toLocaleTimeString("en-GB", { hour12: false });
      setLines((prev) => [
        ...prev.slice(-200),
        { id: ++counter, ts, level: m.lvl, agent: a, msg: `[${region}] ${m.msg}` },
      ]);
    };
    tick();
    const id = setInterval(tick, 850);
    return () => clearInterval(id);
  }, [paused, region]);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [lines]);

  return (
    <div className="border-t border-border bg-sentry-panel/95 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <Terminal className="size-3.5 text-sentry-emerald" />
          <span className="text-[11px] uppercase tracking-widest text-sentry-emerald font-mono font-bold">
            {t.rawFeed}
          </span>
          <span className="size-1.5 rounded-full bg-sentry-emerald sentry-glow-emerald" />
        </div>
        <button
          onClick={() => setPaused((p) => !p)}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors font-mono"
        >
          {paused ? <Play className="size-3" /> : <Pause className="size-3" />}
          {paused ? "RESUME" : "PAUSE"}
        </button>
      </div>
      <div
        ref={ref}
        className="font-mono-tech text-[11px] leading-relaxed px-4 py-2 h-40 overflow-y-auto bg-black/40"
      >
        {lines.map((l) => (
          <div key={l.id} className="flex gap-3 hover:bg-sentry-panel/50">
            <span className="text-muted-foreground shrink-0">{l.ts}</span>
            <span
              className={cn(
                "shrink-0 w-12",
                l.level === "ERROR" && "text-sentry-crimson",
                l.level === "WARN" && "text-amber-400",
                l.level === "OK" && "text-sentry-emerald",
                l.level === "INFO" && "text-sentry-cyan",
              )}
            >
              {l.level}
            </span>
            <span className="text-sentry-cyan/80 shrink-0 w-32 truncate">{l.agent}</span>
            <span className="text-foreground/90">{l.msg}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
