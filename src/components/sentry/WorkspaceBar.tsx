import { Building2, GitBranch, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useDev, type Environment } from "./dev-store";
import { useSystemLock } from "./agent-logs-store";

const ENV_TONE: Record<Environment, string> = {
  production: "text-sentry-emerald border-sentry-emerald/40 bg-sentry-emerald/10",
  staging: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  development: "text-sentry-cyan border-sentry-cyan/40 bg-sentry-cyan/10",
};

export function WorkspaceBar() {
  const { workspace, environment, setEnvironment } = useDev();
  const locked = useSystemLock();

  return (
    <div className="border-b border-border bg-sentry-panel-2/60 backdrop-blur-md">
      {locked && (
        <div className="bg-sentry-crimson/15 border-b border-sentry-crimson/50 px-6 py-2 text-center text-xs md:text-sm font-bold tracking-wider text-sentry-crimson red-alert-pulse">
          SYSTEM STATE: AIR-GAPPED. ALL OUTBOUND AI TRAFFIC INTERCEPTED.
        </div>
      )}
      <div className="flex items-center gap-4 px-6 py-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-gradient-to-br from-sentry-cyan to-sentry-emerald flex items-center justify-center">
            <Building2 className="size-3.5 text-background" />
          </div>
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Enterprise Workspace
            </div>
            <div className="text-sm font-bold">{workspace}</div>
          </div>
        </div>

        <div className="h-8 w-px bg-border mx-1 hidden md:block" />

        <div className="flex items-center gap-2">
          <GitBranch className="size-3.5 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Environment
          </span>
          <Select value={environment} onValueChange={(v) => setEnvironment(v as Environment)}>
            <SelectTrigger
              className={cn(
                "h-8 w-[150px] text-xs font-semibold uppercase tracking-wider border",
                ENV_TONE[environment],
              )}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="staging">Staging</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className={cn("size-3.5", locked ? "text-sentry-crimson" : "text-sentry-emerald")} />
          <span className="font-mono">
            {locked ? "AIR-GAPPED" : "OPERATIONAL"}
          </span>
        </div>
      </div>
    </div>
  );
}
