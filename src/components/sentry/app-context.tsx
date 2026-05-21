import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getDict, type Lang, type Translations } from "./translations";

export type Theme = "light" | "dark" | "cyber";
export type Region = "pakistan" | "global";

type Session = { username: string; loggedInAt: number };

type Ctx = {
  // Auth
  session: Session | null;
  login: (username: string) => void;
  logout: () => void;
  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;
  // Language
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
  // Region
  region: Region;
  setRegion: (r: Region) => void;
  // Billing
  sessionStartedAt: number;
  monitoringSeconds: number;
  computeCost: number; // USD
  // Lockdown
  lockdown: boolean;
  scanning: boolean;
  triggerBiometricLockdown: () => void;
  releaseLockdown: () => void;
};

const AppContext = createContext<Ctx | null>(null);

const KEYS = {
  session: "sentry-session",
  theme: "sentry-theme",
  lang: "sentry-lang",
  region: "sentry-region",
  sessionStart: "sentry-session-start",
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return (raw as unknown as T) ?? fallback;
  }
}
function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("theme-light", "theme-cyber");
  if (theme === "light") root.classList.add("theme-light");
  if (theme === "cyber") root.classList.add("theme-cyber");
}

function applyLang(lang: Lang) {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = lang === "ur" ? "rtl" : "ltr";
  if (lang === "ur") root.classList.add("lang-ur");
  else root.classList.remove("lang-ur");
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => read<Session | null>(KEYS.session, null));
  const [theme, setThemeState] = useState<Theme>(() => (read<string>(KEYS.theme, "dark") as Theme) || "dark");
  const [lang, setLangState] = useState<Lang>(() => (read<string>(KEYS.lang, "en") as Lang) || "en");
  const [region, setRegionState] = useState<Region>(
    () => (read<string>(KEYS.region, "pakistan") as Region) || "pakistan",
  );
  const [sessionStartedAt] = useState<number>(() => {
    const existing = read<number>(KEYS.sessionStart, 0);
    if (existing) return existing;
    const now = Date.now();
    write(KEYS.sessionStart, now);
    return now;
  });
  const [now, setNow] = useState(Date.now());
  const [scanning, setScanning] = useState(false);
  const [lockdown, setLockdown] = useState(false);

  // Initial theme/lang application
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  useEffect(() => {
    applyLang(lang);
  }, [lang]);

  // Tick for billing widget
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    write(KEYS.theme, t);
  };
  const setLang = (l: Lang) => {
    setLangState(l);
    write(KEYS.lang, l);
  };
  const setRegion = (r: Region) => {
    setRegionState(r);
    write(KEYS.region, r);
  };
  const login = (username: string) => {
    const s = { username, loggedInAt: Date.now() };
    setSession(s);
    write(KEYS.session, s);
  };
  const logout = () => {
    setSession(null);
    if (typeof window !== "undefined") localStorage.removeItem(KEYS.session);
  };

  const triggerBiometricLockdown = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setLockdown(true);
      // Persist global lockdown state to the database
      fetch("/api/public/lockdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locked: true, actor: session?.username ?? "operator" }),
      }).catch(() => {});
    }, 2000);
  };
  const releaseLockdown = () => {
    setLockdown(false);
    fetch("/api/public/lockdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked: false, actor: session?.username ?? "operator" }),
    }).catch(() => {});
  };

  const monitoringSeconds = Math.max(0, Math.floor((now - sessionStartedAt) / 1000));
  const computeCost = (monitoringSeconds / 3600) * 5.0;

  const value = useMemo<Ctx>(
    () => ({
      session,
      login,
      logout,
      theme,
      setTheme,
      lang,
      setLang,
      t: getDict(lang),
      region,
      setRegion,
      sessionStartedAt,
      monitoringSeconds,
      computeCost,
      lockdown,
      scanning,
      triggerBiometricLockdown,
      releaseLockdown,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session, theme, lang, region, monitoringSeconds, lockdown, scanning],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

export function formatDuration(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
