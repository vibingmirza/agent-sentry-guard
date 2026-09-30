import { Sun, Moon, Zap, Globe2, MapPin, Languages, Clock3, DollarSign, BadgeCheck, Fingerprint, LogOut, ShieldAlert, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useApp, formatDuration, type Theme, type Region } from "./app-context";
import type { Lang } from "./translations";

const THEMES: { id: Theme; icon: typeof Sun; label: string }[] = [
  { id: "light", icon: Sun, label: "Light" },
  { id: "dark", icon: Moon, label: "Dark" },
  { id: "cyber", icon: Zap, label: "Cyber SOC" },
];

export function Header({ onOpenNavigation }: { onOpenNavigation?: () => void }) {
  const {
    session,
    logout,
    theme,
    setTheme,
    lang,
    setLang,
    region,
    setRegion,
    monitoringSeconds,
    computeCost,
    triggerBiometricLockdown,
    t,
  } = useApp();

  return (
    <TooltipProvider delayDuration={150}>
      <header className="sticky top-0 z-40 border-b border-border bg-sentry-panel/80 backdrop-blur-xl">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2 sm:px-4 md:flex md:flex-wrap md:gap-3 md:px-6 md:py-3">
          <Button type="button" size="icon" variant="outline" className="shrink-0 md:hidden" onClick={onOpenNavigation} aria-label="Open navigation">
            <Menu className="size-4" />
          </Button>
          {/* Director identity */}
          <div className="flex min-w-0 items-center gap-2 md:pr-3 md:mr-1 md:border-r md:border-border">
            <div className="size-8 rounded-md bg-gradient-to-br from-sentry-cyan to-sentry-emerald flex items-center justify-center">
              <BadgeCheck className="size-4 text-background" />
            </div>
            <div className="min-w-0 leading-tight">
              <div className={cn("truncate text-sm font-bold", lang === "ur" && "font-nasta")}>
                {t.directorName}
              </div>
              <div className="hidden truncate text-[10px] uppercase tracking-widest text-sentry-cyan sm:block">
                {t.director}
              </div>
            </div>
          </div>

          {/* Billing widget */}
          <div className="order-4 col-span-3 hidden w-full gap-2 overflow-x-auto md:order-none md:flex md:w-auto">
            <BillingChip icon={Clock3} label={t.monitoring} value={formatDuration(monitoringSeconds)} mono />
            <BillingChip icon={DollarSign} label={t.computeCost} value={`$${computeCost.toFixed(2)} · $5.00/hr`} />
            <BillingChip icon={BadgeCheck} label={t.license} value={t.enterprise} accent="emerald" />
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 md:gap-2">
            {/* Region selector */}
            <div className="hidden sm:block"><SegmentedToggle<Region>
              value={region}
              onChange={setRegion}
              items={[
                { id: "pakistan", icon: MapPin, label: t.pakistan, tip: `${t.region}: ${t.pakistan}` },
                { id: "global", icon: Globe2, label: t.global, tip: `${t.region}: ${t.global}` },
              ]}
            /></div>
            {/* Language */}
            <div className="hidden lg:block"><SegmentedToggle<Lang>
              value={lang}
              onChange={setLang}
              items={[
                { id: "en", icon: Languages, label: "EN", tip: "English" },
                { id: "ur", icon: Languages, label: "اردو", tip: "Urdu (Nasta'liq)", labelClass: "font-nasta text-base" },
              ]}
            /></div>
            {/* Theme */}
            <SegmentedToggle<Theme>
              value={theme}
              onChange={setTheme}
              items={THEMES.map((th) => ({ id: th.id, icon: th.icon, label: "", tip: th.label }))}
            />
            {/* Biometric */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={triggerBiometricLockdown}
                  size="sm"
                  className="bg-sentry-crimson/15 border border-sentry-crimson/50 text-sentry-crimson hover:bg-sentry-crimson/25 hover:text-sentry-crimson h-8 px-3"
                >
                  <Fingerprint className="size-3.5 mr-1" />
                  <span className="text-xs font-bold uppercase tracking-wider hidden lg:inline">
                    {t.biometric}
                  </span>
                  <ShieldAlert className="size-3.5 ml-1 lg:hidden" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Engage 2-second biometric scan + system lockdown</TooltipContent>
            </Tooltip>

            {session && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={logout}
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="size-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t.logout}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
}

function BillingChip({
  icon: Icon,
  label,
  value,
  mono,
  accent,
}: {
  icon: typeof Sun;
  label: string;
  value: string;
  mono?: boolean;
  accent?: "emerald";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md border bg-sentry-panel-2/70 text-xs",
            accent === "emerald" ? "border-sentry-emerald/40" : "border-border",
          )}
        >
          <Icon
            className={cn(
              "size-3.5",
              accent === "emerald" ? "text-sentry-emerald" : "text-sentry-cyan",
            )}
          />
          <span className="text-muted-foreground hidden md:inline">{label}:</span>
          <span className={cn("font-semibold", mono && "font-mono tabular-nums")}>{value}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function SegmentedToggle<T extends string>({
  value,
  onChange,
  items,
}: {
  value: T;
  onChange: (v: T) => void;
  items: { id: T; icon: typeof Sun; label: string; tip: string; labelClass?: string }[];
}) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-md border border-border bg-sentry-panel-2/70">
      {items.map((it) => {
        const Icon = it.icon;
        const active = value === it.id;
        return (
          <Tooltip key={it.id}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onChange(it.id)}
                className={cn(
                  "flex items-center gap-1 h-7 px-2 rounded text-xs font-semibold transition-all",
                  active
                    ? "bg-sentry-cyan text-background sentry-glow-cyan"
                    : "text-muted-foreground hover:text-foreground hover:bg-sentry-panel",
                )}
              >
                <Icon className="size-3.5" />
                {it.label && <span className={it.labelClass}>{it.label}</span>}
              </button>
            </TooltipTrigger>
            <TooltipContent>{it.tip}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
