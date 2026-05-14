import { Shield, MessageSquare, LayoutDashboard, FileBadge, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SentryView = "user" | "admin" | "client" | "analytics";

const items: { id: SentryView; label: string; icon: typeof Shield; sub: string }[] = [
  { id: "user", label: "AI Playground", icon: MessageSquare, sub: "User View" },
  { id: "admin", label: "Safety Dashboard", icon: LayoutDashboard, sub: "Admin View" },
  { id: "client", label: "Compliance Office", icon: FileBadge, sub: "Client View" },
  { id: "analytics", label: "Analytics Insights", icon: BarChart3, sub: "Telemetry" },
];

export function SentrySidebar({
  active,
  onChange,
}: {
  active: SentryView;
  onChange: (v: SentryView) => void;
}) {
  return (
    <aside className="sticky top-0 h-screen w-72 shrink-0 border-r border-border bg-sentry-panel/60 backdrop-blur-xl flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-10 rounded-lg bg-gradient-to-br from-sentry-cyan to-sentry-emerald flex items-center justify-center sentry-glow-cyan">
              <Shield className="size-5 text-background" strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Agent-Sentry</h1>
            <p className="text-[10px] uppercase tracking-widest text-sentry-cyan">
              Multi-Agent Governance
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onChange(it.id)}
              className={cn(
                "w-full group flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all border",
                isActive
                  ? "bg-sentry-panel-2 border-sentry-cyan/40 sentry-glow-cyan"
                  : "border-transparent hover:bg-sentry-panel-2/60 hover:border-border",
              )}
            >
              <Icon
                className={cn(
                  "size-5 transition-colors",
                  isActive ? "text-sentry-cyan" : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">{it.label}</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {it.sub}
                </div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="rounded-lg bg-sentry-panel-2 p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-sentry-emerald sentry-glow-emerald" />
            <span className="text-xs font-medium">All Systems Nominal</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Aligned with SDG 9 & Pakistan Vision 2035
          </p>
        </div>
      </div>
    </aside>
  );
}
