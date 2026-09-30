import { Shield, MessageSquare, LayoutDashboard, FileBadge, BarChart3, Crosshair, Network, Code2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "./app-context";

export type SentryView = "user" | "admin" | "client" | "analytics" | "warroom" | "federation" | "developer";

export function SentrySidebar({
  active,
  onChange,
  mobileOpen = false,
  onMobileClose,
}: {
  active: SentryView;
  onChange: (v: SentryView) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}) {
  const { t, lang } = useApp();
  const items: { id: SentryView; label: string; sub: string; icon: typeof Shield }[] = [
    { id: "user", label: t.nav.user, sub: t.sub.user, icon: MessageSquare },
    { id: "admin", label: t.nav.admin, sub: t.sub.admin, icon: LayoutDashboard },
    { id: "client", label: t.nav.client, sub: t.sub.client, icon: FileBadge },
    { id: "analytics", label: t.nav.analytics, sub: t.sub.analytics, icon: BarChart3 },
    { id: "warroom", label: t.nav.warroom, sub: t.sub.warroom, icon: Crosshair },
    { id: "federation", label: t.nav.federation, sub: t.sub.federation, icon: Network },
    { id: "developer", label: "Developer API", sub: "Ingest & Sandbox", icon: Code2 },
  ];

  const chooseView = (id: SentryView) => {
    onChange(id);
    onMobileClose?.();
  };

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-50 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-[60] flex h-dvh w-[min(18rem,88vw)] shrink-0 flex-col border-r border-border bg-sentry-panel/95 backdrop-blur-xl transition-transform duration-200 md:sticky md:top-0 md:z-auto md:h-screen md:w-72 md:translate-x-0 md:bg-sentry-panel/60",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
      <div className="p-6 border-b border-border">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="flex min-w-0 items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-sentry-cyan to-sentry-emerald flex items-center justify-center sentry-glow-cyan">
            <Shield className="size-5 text-background" strokeWidth={2.5} />
          </div>
          <div className="min-w-0">
            <h1 className={cn("truncate text-lg font-bold tracking-tight", lang === "ur" && "font-nasta")}>
              {t.appName}
            </h1>
            <p className="truncate text-[10px] uppercase tracking-widest text-sentry-cyan">{t.tagline}</p>
          </div>
          </div>
          <Button type="button" size="icon" variant="ghost" className="md:hidden" onClick={onMobileClose} aria-label="Close navigation">
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => chooseView(it.id)}
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
                <div className={cn("text-sm font-semibold nav-label", lang === "ur" && "font-nasta")}>
                  {it.label}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{it.sub}</div>
              </div>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <div className="rounded-lg bg-sentry-panel-2 p-3 border border-border">
          <div className="flex items-center gap-2 mb-1">
            <span className="size-2 rounded-full bg-sentry-emerald sentry-glow-emerald" />
            <span className="text-xs font-medium">All Systems Nominal</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {t.directorName} · {t.director}
          </p>
        </div>
      </div>
      </aside>
    </>
  );
}
