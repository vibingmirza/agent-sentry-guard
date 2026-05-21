import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Environment = "production" | "staging" | "development";

type DevSettings = {
  apiKey: string | null;
  maxTokensPerMin: number;
  maxCostPerAgent: number;
  webhookUrl: string;
  workspace: string;
  environment: Environment;
};

type Ctx = DevSettings & {
  generateApiKey: () => string;
  clearApiKey: () => void;
  setMaxTokensPerMin: (n: number) => void;
  setMaxCostPerAgent: (n: number) => void;
  setWebhookUrl: (s: string) => void;
  setEnvironment: (e: Environment) => void;
};

const DevContext = createContext<Ctx | null>(null);

const KEY = "sentry-dev-settings-v1";

const defaults: DevSettings = {
  apiKey: null,
  maxTokensPerMin: 5000,
  maxCostPerAgent: 25,
  webhookUrl: "",
  workspace: "NexusAI Global Marketplace",
  environment: "production",
};

function load(): DevSettings {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults;
    return { ...defaults, ...(JSON.parse(raw) as Partial<DevSettings>) };
  } catch {
    return defaults;
  }
}

export function DevProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DevSettings>(() => load());

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<Ctx>(
    () => ({
      ...state,
      generateApiKey: () => {
        const rand =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID().replace(/-/g, "")
            : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
        const key = `asg_live_${rand.slice(0, 32)}`;
        setState((s) => ({ ...s, apiKey: key }));
        return key;
      },
      clearApiKey: () => setState((s) => ({ ...s, apiKey: null })),
      setMaxTokensPerMin: (n) => setState((s) => ({ ...s, maxTokensPerMin: n })),
      setMaxCostPerAgent: (n) => setState((s) => ({ ...s, maxCostPerAgent: n })),
      setWebhookUrl: (v) => setState((s) => ({ ...s, webhookUrl: v })),
      setEnvironment: (e) => setState((s) => ({ ...s, environment: e })),
    }),
    [state],
  );

  return <DevContext.Provider value={value}>{children}</DevContext.Provider>;
}

export function useDev() {
  const ctx = useContext(DevContext);
  if (!ctx) throw new Error("useDev must be used inside DevProvider");
  return ctx;
}
