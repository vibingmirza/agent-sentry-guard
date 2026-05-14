import { useEffect, useState } from "react";
import { Sun, Moon, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "cyber";

const THEMES: { id: Theme; label: string; icon: typeof Sun; cls: string }[] = [
  { id: "light", label: "Light", icon: Sun, cls: "theme-light" },
  { id: "dark", label: "Dark", icon: Moon, cls: "" },
  { id: "cyber", label: "Cyber SOC", icon: Zap, cls: "theme-cyber" },
];

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-cyber");
  const cls = THEMES.find((t) => t.id === theme)?.cls;
  if (cls) root.classList.add(cls);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("sentry-theme") as Theme) || "dark";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("sentry-theme", theme);
  }, [theme]);

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 p-1 rounded-full border border-border bg-sentry-panel/80 backdrop-blur-xl shadow-lg">
      {THEMES.map((t) => {
        const Icon = t.icon;
        const active = theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              active
                ? "bg-primary text-primary-foreground sentry-glow-cyan"
                : "text-muted-foreground hover:text-foreground hover:bg-sentry-panel-2",
            )}
          >
            <Icon className="size-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
