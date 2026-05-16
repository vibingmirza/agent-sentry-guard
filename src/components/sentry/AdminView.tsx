import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Power,
  ShieldCheck,
  ShieldAlert,
  Siren,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  CircleDot,
  X,
  Eye,
  Brain,
  Lock,
  Unlock,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  useAlerts,
  MOCK_INCIDENTS,
  type Alert,
  type AlertSeverity,
  type IncidentType,
  type ResolutionType,
  type AlertStatus,
} from "./alerts-store";
import { useApp } from "./app-context";

const SEVERITIES: AlertSeverity[] = ["Critical", "High", "Medium", "Low"];
const TYPES: IncidentType[] = ["Auth", "API", "Network"];
const RESOLUTION_TYPES: ResolutionType[] = [
  "True Positive - Remediated",
  "False Positive - Whitelisted",
  "Benign Trigger",
];

export function AdminView() {
  const { active, archived, authorizedRules, addAlert, setStatus, resolveAlert, authorizeBlock, revokeAuthorization } = useAlerts();
  const { t, lang } = useApp();
  const [killed, setKilled] = useState(false);
  const [inspecting, setInspecting] = useState<Alert | null>(null);

  // Resolution dialog
  const [resolving, setResolving] = useState<Alert | null>(null);
  const [resType, setResType] = useState<ResolutionType>("True Positive - Remediated");
  const [resSummary, setResSummary] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [sevFilter, setSevFilter] = useState<Set<AlertSeverity>>(new Set());
  const [typeFilter, setTypeFilter] = useState<Set<IncidentType>>(new Set());
  const [agentFilter, setAgentFilter] = useState<string>("all");

  const allAgents = useMemo(
    () => Array.from(new Set([...active, ...archived].map((a) => a.agent))).sort(),
    [active, archived],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return active.filter((a) => {
      if (sevFilter.size && !sevFilter.has(a.severity)) return false;
      if (typeFilter.size && !typeFilter.has(a.type)) return false;
      if (agentFilter !== "all" && a.agent !== agentFilter) return false;
      if (q && !a.prompt.toLowerCase().includes(q) && !a.ip.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [active, search, sevFilter, typeFilter, agentFilter]);

  const simulateIncident = () => {
    const tpl = MOCK_INCIDENTS[Math.floor(Math.random() * MOCK_INCIDENTS.length)];
    const a = addAlert(tpl);
    toast.error("New Incident Simulated", {
      description: a.prompt,
      icon: <Siren className="size-4 text-sentry-crimson" />,
    });
  };

  const triggerKill = () => {
    setKilled((k) => !k);
    if (!killed) {
      toast.error("MASTER KILL SWITCH ACTIVATED", {
        description: "All Worker Agents paused. Incident broadcast to security team.",
      });
    } else {
      toast.success("Agents resumed", {
        description: "Multi-agent fleet restored to normal operation.",
      });
    }
  };

  const cycleStatus = (a: Alert) => {
    if (a.status === "Unassigned") {
      setStatus(a.id, "Investigating");
      toast.info("Investigation started", { description: a.prompt });
    } else if (a.status === "Investigating") {
      setResolving(a);
      setResType("True Positive - Remediated");
      setResSummary("");
    }
  };

  const submitResolution = () => {
    if (!resolving) return;
    if (!resSummary.trim()) {
      toast.error("Resolution summary is required");
      return;
    }
    resolveAlert(resolving.id, resType, resSummary.trim());
    toast.success("Alert resolved & archived", { description: resType });
    setResolving(null);
  };

  const toggleSev = (s: AlertSeverity) => {
    setSevFilter((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };
  const toggleType = (t: IncidentType) => {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      next.has(t) ? next.delete(t) : next.add(t);
      return next;
    });
  };
  const clearFilters = () => {
    setSearch("");
    setSevFilter(new Set());
    setTypeFilter(new Set());
    setAgentFilter("all");
  };

  const exportCsv = () => {
    const rows = [
      ["ID", "Severity", "Type", "Agent", "IP", "Status", "Risk", "Prompt"],
      ...filtered.map((a) => [
        a.id,
        a.severity,
        a.type,
        a.agent,
        a.ip,
        a.status,
        a.risk,
        a.prompt,
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sentry-audit-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    toast.success("Audit report exported", { description: `${filtered.length} alerts` });
  };

  return (
    <TooltipProvider delayDuration={150}>
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sentry-cyan mb-2">Admin View</p>
          <h2 className={cn("text-2xl font-bold", lang === "ur" && "font-nasta")}>
            Safety &amp; Infrastructure Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
            <BadgeCheck className="size-4 text-sentry-cyan" />
            Acting Authority: <span className="font-semibold text-foreground">{t.directorName}</span> · {t.director}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={simulateIncident}
            className="bg-sentry-panel-2 border border-sentry-cyan/40 text-sentry-cyan hover:bg-sentry-cyan/10 hover:text-sentry-cyan font-semibold uppercase tracking-wider sentry-glow-cyan"
          >
            <Siren className="size-4 mr-1" />
            Simulate Incident
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span
              className={cn(
                "size-2 rounded-full",
                killed ? "bg-sentry-crimson sentry-glow-crimson" : "bg-sentry-emerald sentry-glow-emerald",
              )}
            />
            {killed ? "FLEET PAUSED" : "FLEET LIVE"}
          </div>
        </div>
      </header>

      {/* Top metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <HealthMeter killed={killed} />
        <MetricCard
          label="Agents Online"
          value={killed ? "0 / 12" : "12 / 12"}
          icon={Activity}
          accent="cyan"
        />
        <MetricCard
          label="Threats Blocked (24h)"
          value={String([...active, ...archived].filter((l) => l.blocked).length)}
          icon={AlertTriangle}
          accent="crimson"
        />
      </div>

      {/* Filters Panel */}
      <section className="rounded-xl border border-border bg-sentry-panel p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-sentry-cyan" />
          <h3 className="font-semibold text-sm">Data Controls</h3>
          <span className="ml-auto text-xs text-muted-foreground">
            Showing {filtered.length} of {active.length} active
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          <div className="lg:col-span-4 relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search description or IP address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-sentry-panel-2 border-border"
            />
          </div>
          <div className="lg:col-span-3">
            <Select value={agentFilter} onValueChange={setAgentFilter}>
              <SelectTrigger className="bg-sentry-panel-2 border-border">
                <SelectValue placeholder="Agent Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Agents</SelectItem>
                {allAgents.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="lg:col-span-5 flex items-center justify-end gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5 mr-1" /> Clear
            </Button>
            <Button
              onClick={exportCsv}
              className="bg-sentry-cyan/15 border border-sentry-cyan/40 text-sentry-cyan hover:bg-sentry-cyan/25 hover:text-sentry-cyan font-semibold"
            >
              <Download className="size-4 mr-1.5" />
              Export CSV Audit Report
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground self-center mr-1">
            Severity:
          </span>
          {SEVERITIES.map((s) => (
            <FilterChip key={s} active={sevFilter.has(s)} onClick={() => toggleSev(s)}>
              {s}
            </FilterChip>
          ))}
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground self-center ml-3 mr-1">
            Type:
          </span>
          {TYPES.map((t) => (
            <FilterChip key={t} active={typeFilter.has(t)} onClick={() => toggleType(t)}>
              {t}
            </FilterChip>
          ))}
        </div>
      </section>

      {/* Active alerts */}
      <section className="rounded-xl border border-border bg-sentry-panel overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <ShieldCheck className="size-4 text-sentry-cyan" /> Live Audit Logs
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Active queue
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sentry-panel-2 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Prompt</th>
                <th className="text-left px-6 py-3 font-medium">Severity</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Agent / Source</th>
                <th className="text-right px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground text-sm">
                    No alerts match the current filters.
                  </td>
                </tr>
              )}
              {filtered.map((log) => {
                const Icon = log.icon;
                return (
                  <tr
                    key={log.id}
                    className="border-t border-border hover:bg-sentry-panel-2/50 transition-colors"
                  >
                    <td className="px-6 py-4 max-w-md">
                      <p className="text-foreground">{log.prompt}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                        {log.type} · {log.ip}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <SeverityBadge severity={log.severity} blocked={log.blocked} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={log.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon className="size-4 text-sentry-cyan" />
                        <code className="text-xs">{log.agent}</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setInspecting(log)}
                              className="h-8 px-2 text-muted-foreground hover:text-sentry-cyan"
                            >
                              <Eye className="size-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t.inspect} · {t.chainOfThought}</TooltipContent>
                        </Tooltip>
                        {log.blocked && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                onClick={() => {
                                  if (log.authorized) {
                                    revokeAuthorization(log.id);
                                    toast.info("Authorization revoked");
                                  } else {
                                    authorizeBlock(log.id);
                                    toast.success("Block authorized → Active Security Rules");
                                  }
                                }}
                                className={cn(
                                  "h-8 px-2.5 text-xs font-bold uppercase tracking-wider",
                                  log.authorized
                                    ? "bg-sentry-emerald/20 border border-sentry-emerald/50 text-sentry-emerald"
                                    : "bg-sentry-cyan/15 border border-sentry-cyan/50 text-sentry-cyan hover:bg-sentry-cyan/25",
                                )}
                              >
                                {log.authorized ? <Lock className="size-3 mr-1" /> : <ShieldCheck className="size-3 mr-1" />}
                                {log.authorized ? "Authorized" : t.authorize}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              {log.authorized ? "Click to revoke security rule" : "Promote to persistent block rule"}
                            </TooltipContent>
                          </Tooltip>
                        )}
                        <ActionButton status={log.status} onClick={() => cycleStatus(log)} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Active Security Rules */}
      <section className="rounded-xl border border-sentry-emerald/40 bg-gradient-to-br from-sentry-emerald/5 to-transparent overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Lock className="size-4 text-sentry-emerald" /> {t.activeRules}
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-sentry-emerald">
            {authorizedRules.length} enforced · persistent
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sentry-panel-2/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Rule</th>
                <th className="text-left px-6 py-3 font-medium">Severity</th>
                <th className="text-left px-6 py-3 font-medium">Agent</th>
                <th className="text-left px-6 py-3 font-medium">Authorized</th>
                <th className="text-right px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {authorizedRules.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No security rules authorized yet. Click "Authorize" on a blocked threat to enforce it.
                  </td>
                </tr>
              )}
              {authorizedRules.map((rule) => (
                <tr key={rule.id} className="border-t border-border">
                  <td className="px-6 py-3 max-w-md">
                    <p className="text-foreground line-clamp-1">{rule.prompt}</p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mono">{rule.type} · {rule.ip}</p>
                  </td>
                  <td className="px-6 py-3"><SeverityBadge severity={rule.severity} blocked={rule.blocked} /></td>
                  <td className="px-6 py-3"><code className="text-xs text-muted-foreground">{rule.agent}</code></td>
                  <td className="px-6 py-3 text-xs text-muted-foreground">
                    {rule.authorizedAt ? new Date(rule.authorizedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        revokeAuthorization(rule.id);
                        toast.info("Rule revoked");
                      }}
                      className="text-muted-foreground hover:text-sentry-crimson"
                    >
                      <Unlock className="size-3.5 mr-1" /> Revoke
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Archived */}
      <section className="rounded-xl border border-border bg-sentry-panel/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Archive className="size-4 text-muted-foreground" /> Archived Logs
          </h3>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {archived.length} resolved
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sentry-panel-2/60 text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Prompt</th>
                <th className="text-left px-6 py-3 font-medium">Severity</th>
                <th className="text-left px-6 py-3 font-medium">Resolution</th>
                <th className="text-left px-6 py-3 font-medium">Summary</th>
                <th className="text-left px-6 py-3 font-medium">Agent</th>
              </tr>
            </thead>
            <tbody>
              {archived.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground text-sm">
                    No resolved alerts yet.
                  </td>
                </tr>
              )}
              {archived.map((log) => (
                <tr key={log.id} className="border-t border-border">
                  <td className="px-6 py-3 max-w-md">
                    <p className="text-muted-foreground line-clamp-1">{log.prompt}</p>
                  </td>
                  <td className="px-6 py-3">
                    <SeverityBadge severity={log.severity} blocked={log.blocked} muted />
                  </td>
                  <td className="px-6 py-3">
                    <Badge
                      variant="outline"
                      className="text-[10px] border-sentry-emerald/40 text-sentry-emerald"
                    >
                      <CheckCircle2 className="size-3 mr-1" />
                      {log.resolution}
                    </Badge>
                  </td>
                  <td className="px-6 py-3 text-xs text-muted-foreground max-w-xs truncate">
                    {log.summary}
                  </td>
                  <td className="px-6 py-3">
                    <code className="text-xs text-muted-foreground">{log.agent}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Kill switch */}
      <section className="rounded-xl border border-sentry-crimson/40 bg-gradient-to-br from-sentry-crimson/10 to-transparent p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="size-12 rounded-lg bg-sentry-crimson/20 border border-sentry-crimson/50 flex items-center justify-center">
            <Power className="size-6 text-sentry-crimson" />
          </div>
          <div>
            <h3 className="font-bold">Master Kill Switch</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Immediately suspends every Worker Agent and broadcasts an incident alert.
            </p>
          </div>
        </div>
        <Button
          onClick={triggerKill}
          className={cn(
            "font-bold uppercase tracking-wider px-6 h-12",
            killed
              ? "bg-sentry-emerald text-background hover:bg-sentry-emerald/90"
              : "bg-sentry-crimson text-background hover:bg-sentry-crimson/90 sentry-glow-crimson",
          )}
        >
          <Power className="size-4 mr-2" />
          {killed ? "Resume Fleet" : "Engage Kill Switch"}
        </Button>
      </section>

      {/* Resolution dialog */}
      <Dialog open={!!resolving} onOpenChange={(o) => !o && setResolving(null)}>
        <DialogContent className="bg-sentry-panel border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-sentry-emerald" />
              Resolve Alert
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Document the outcome of this investigation before archiving.
            </DialogDescription>
          </DialogHeader>
          {resolving && (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-sentry-panel-2 p-3 text-sm">
                <p className="text-foreground">{resolving.prompt}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {resolving.type} · {resolving.ip} · {resolving.agent}
                </p>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Resolution Type
                </label>
                <Select value={resType} onValueChange={(v) => setResType(v as ResolutionType)}>
                  <SelectTrigger className="bg-sentry-panel-2 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {RESOLUTION_TYPES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">
                  Analyst Summary
                </label>
                <Textarea
                  rows={3}
                  placeholder="Brief description of remediation, root cause, or rationale…"
                  value={resSummary}
                  onChange={(e) => setResSummary(e.target.value)}
                  className="bg-sentry-panel-2 border-border resize-none"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setResolving(null)}>
              Cancel
            </Button>
            <Button
              onClick={submitResolution}
              className="bg-sentry-emerald text-background hover:bg-sentry-emerald/90"
            >
              <CheckCircle2 className="size-4 mr-1.5" />
              Resolve &amp; Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspect / Chain of Thought dialog */}
      <Dialog open={!!inspecting} onOpenChange={(o) => !o && setInspecting(null)}>
        <DialogContent className="bg-sentry-panel border-sentry-cyan/40 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="size-5 text-sentry-cyan" />
              {t.inspect} · {t.chainOfThought}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Reasoning trace from Sentry-Guard Executive Intelligence.
            </DialogDescription>
          </DialogHeader>
          {inspecting && (
            <div className="space-y-3">
              <div className="rounded-md border border-border bg-sentry-panel-2 p-3 text-sm">
                <p className="text-foreground">{inspecting.prompt}</p>
                <p className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {inspecting.type} · {inspecting.ip} · {inspecting.agent}
                </p>
              </div>
              <pre className="font-mono-tech text-xs leading-relaxed whitespace-pre-wrap bg-black/40 border border-sentry-cyan/30 rounded-md p-4 text-sentry-cyan/90">
{inspecting.chainOfThought}
              </pre>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInspecting(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </TooltipProvider>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-colors",
        active
          ? "bg-sentry-cyan/15 border-sentry-cyan/50 text-sentry-cyan"
          : "border-border text-muted-foreground hover:text-foreground hover:border-sentry-cyan/30",
      )}
    >
      {children}
    </button>
  );
}

function SeverityBadge({
  severity,
  blocked,
  muted,
}: {
  severity: AlertSeverity;
  blocked: boolean;
  muted?: boolean;
}) {
  const map: Record<AlertSeverity, string> = {
    Critical: "text-sentry-crimson border-sentry-crimson/50 bg-sentry-crimson/10",
    High: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    Medium: "text-sentry-cyan border-sentry-cyan/40 bg-sentry-cyan/10",
    Low: "text-sentry-emerald border-sentry-emerald/40 bg-sentry-emerald/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border",
        map[severity],
        muted && "opacity-70",
      )}
    >
      {blocked ? <ShieldAlert className="size-3" /> : <ShieldCheck className="size-3" />}
      {severity}
    </span>
  );
}

function StatusBadge({ status }: { status: AlertStatus }) {
  if (status === "Investigating") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/40">
        <span className="relative flex size-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-amber-400" />
        </span>
        Investigating
      </span>
    );
  }
  if (status === "Resolved") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sentry-emerald/15 text-sentry-emerald border border-sentry-emerald/40">
        <CheckCircle2 className="size-3" /> Resolved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sentry-panel-2 text-muted-foreground border border-border">
      <CircleDot className="size-3" /> Unassigned
    </span>
  );
}

function ActionButton({ status, onClick }: { status: AlertStatus; onClick: () => void }) {
  if (status === "Unassigned") {
    return (
      <Button size="sm" variant="outline" onClick={onClick} className="border-sentry-cyan/40 text-sentry-cyan hover:bg-sentry-cyan/10 hover:text-sentry-cyan">
        <Clock className="size-3.5 mr-1" /> Investigate
      </Button>
    );
  }
  if (status === "Investigating") {
    return (
      <Button
        size="sm"
        onClick={onClick}
        className="bg-sentry-emerald/15 border border-sentry-emerald/40 text-sentry-emerald hover:bg-sentry-emerald/25 hover:text-sentry-emerald"
      >
        <CheckCircle2 className="size-3.5 mr-1" /> Resolve
      </Button>
    );
  }
  return null;
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
  accent: "cyan" | "crimson" | "emerald";
}) {
  const color =
    accent === "cyan" ? "text-sentry-cyan" : accent === "crimson" ? "text-sentry-crimson" : "text-sentry-emerald";
  return (
    <div className="rounded-xl border border-border bg-sentry-panel p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className={cn("size-4", color)} />
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function HealthMeter({ killed }: { killed: boolean }) {
  const value = killed ? 12.0 : 98.4;
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  return (
    <div className="rounded-xl border border-border bg-sentry-panel p-6 flex items-center gap-5">
      <svg width="130" height="130" viewBox="0 0 130 130" className="-rotate-90 shrink-0">
        <circle cx="65" cy="65" r={r} stroke="currentColor" strokeWidth="10" fill="none" className="text-sentry-panel-2" />
        <circle
          cx="65"
          cy="65"
          r={r}
          stroke="currentColor"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          className={cn("transition-all duration-700", killed ? "text-sentry-crimson" : "text-sentry-emerald")}
          style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
        />
      </svg>
      <div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">System Health</div>
        <div className={cn("text-4xl font-bold tabular-nums", killed ? "text-sentry-crimson" : "text-sentry-emerald")}>
          {value.toFixed(1)}%
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          {killed ? "Degraded — fleet paused" : "Optimal across all agents"}
        </div>
      </div>
    </div>
  );
}
