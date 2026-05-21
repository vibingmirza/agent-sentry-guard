import { useState } from "react";
import { Key, Copy, Check, Zap, Sliders, Webhook, Code2, Loader2, Terminal } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useDev } from "./dev-store";

const LOCATIONS = ["Karachi", "Lahore", "Islamabad"];
const STATUSES = ["Active", "Idle", "Breached"] as const;

export function DeveloperView() {
  const {
    apiKey,
    generateApiKey,
    maxTokensPerMin,
    setMaxTokensPerMin,
    maxCostPerAgent,
    setMaxCostPerAgent,
    webhookUrl,
    setWebhookUrl,
  } = useDev();

  const [copied, setCopied] = useState<string | null>(null);
  const [pinging, setPinging] = useState(false);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1500);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard unavailable");
    }
  };

  const triggerSandboxPing = async () => {
    setPinging(true);
    try {
      const payload = {
        agent_name: `Sandbox-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        tokens_used: Math.floor(Math.random() * 4000 + 500),
      };
      const res = await fetch("/api/public/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { "x-api-key": apiKey } : {}),
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Request failed");
      toast.success(`Telemetry posted · ${payload.agent_name}`, {
        description: `${payload.status} · ${payload.location} · ${payload.tokens_used} tokens`,
      });
    } catch (e) {
      toast.error("Sandbox ping failed", { description: String(e) });
    } finally {
      setPinging(false);
    }
  };

  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : "https://your-app.lovable.app";
  const displayKey = apiKey ?? "asg_live_•••••••••••••••• (generate to reveal)";

  const jsExample = `// JavaScript / TypeScript
const res = await fetch("${baseUrl}/api/public/logs", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": "${apiKey ?? "asg_live_YOUR_KEY"}",
  },
  body: JSON.stringify({
    agent_name: "Agent-Foxtrot-42",
    status: "Active",
    location: "Karachi",
    tokens_used: 1820,
  }),
});
const data = await res.json();
console.log(data);`;

  const pyExample = `# Python (requests)
import requests

requests.post(
    "${baseUrl}/api/public/logs",
    headers={
        "Content-Type": "application/json",
        "x-api-key": "${apiKey ?? "asg_live_YOUR_KEY"}",
    },
    json={
        "agent_name": "Agent-Foxtrot-42",
        "status": "Active",
        "location": "Karachi",
        "tokens_used": 1820,
    },
)`;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Code2 className="size-6 text-sentry-cyan" />
          Developer API Suite
        </h1>
        <p className="text-sm text-muted-foreground">
          Stream real telemetry into Agent-Sentry · public ingest at{" "}
          <code className="text-sentry-cyan font-mono">/api/public/logs</code>
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* API Key */}
        <Card className="bg-sentry-panel border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Key className="size-4 text-sentry-cyan" />
              Secret API Key
            </CardTitle>
            <CardDescription>Used as <code>x-api-key</code> on the ingest endpoint.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 p-3 rounded-md bg-sentry-panel-2 border border-border font-mono text-xs break-all">
              {displayKey}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  const k = generateApiKey();
                  toast.success("Secret key generated", { description: k });
                }}
                className="bg-sentry-cyan text-background hover:bg-sentry-cyan/90 font-semibold"
              >
                <Key className="size-3.5 mr-1.5" />
                Generate New Secret Key
              </Button>
              {apiKey && (
                <Button variant="outline" onClick={() => copy(apiKey, "key")}>
                  {copied === "key" ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sandbox */}
        <Card className="bg-sentry-panel border-sentry-emerald/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Terminal className="size-4 text-sentry-emerald" />
              Sandbox Tester
            </CardTitle>
            <CardDescription>
              Fires a real <code>POST /api/public/logs</code>. Watch the dashboard update live.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={triggerSandboxPing}
              disabled={pinging}
              className="bg-sentry-emerald text-background hover:bg-sentry-emerald/90 sentry-glow-emerald font-bold uppercase tracking-wider h-11"
            >
              {pinging ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Zap className="size-4 mr-2" />
              )}
              Trigger Sandbox Agent Ping
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Code samples */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CodeBlock title="JavaScript / Fetch" code={jsExample} onCopy={() => copy(jsExample, "js")} copied={copied === "js"} />
        <CodeBlock title="Python / requests" code={pyExample} onCopy={() => copy(pyExample, "py")} copied={copied === "py"} />
      </div>

      {/* Guardrails + Webhooks */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-sentry-panel border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sliders className="size-4 text-sentry-cyan" />
              Anomaly Thresholds
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label className="uppercase tracking-wider text-muted-foreground">
                  Max Tokens per Minute
                </Label>
                <span className="font-mono text-sentry-cyan">{maxTokensPerMin.toLocaleString()}</span>
              </div>
              <Slider
                value={[maxTokensPerMin]}
                min={500}
                max={20000}
                step={500}
                onValueChange={(v) => setMaxTokensPerMin(v[0])}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <Label className="uppercase tracking-wider text-muted-foreground">
                  Max Cost per Agent (USD)
                </Label>
                <span className="font-mono text-sentry-cyan">${maxCostPerAgent}</span>
              </div>
              <Slider
                value={[maxCostPerAgent]}
                min={5}
                max={500}
                step={5}
                onValueChange={(v) => setMaxCostPerAgent(v[0])}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sentry-panel border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Webhook className="size-4 text-sentry-cyan" />
              Outgoing Webhooks
            </CardTitle>
            <CardDescription>Dispatched on breach. Slack / Teams compatible.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Slack / Teams Webhook URL
            </Label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="bg-sentry-panel-2 font-mono text-xs"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.success("Webhook configuration saved")}
            >
              Save Webhook
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CodeBlock({
  title,
  code,
  onCopy,
  copied,
}: {
  title: string;
  code: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <Card className="bg-sentry-panel border-border">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm flex items-center gap-2">
          <Code2 className="size-4 text-sentry-cyan" />
          {title}
        </CardTitle>
        <Button size="sm" variant="ghost" onClick={onCopy}>
          {copied ? <Check className="size-3.5 mr-1" /> : <Copy className="size-3.5 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </CardHeader>
      <CardContent>
        <pre className="overflow-x-auto rounded-md bg-background/60 border border-border p-4 text-[11px] leading-relaxed font-mono text-foreground/90">
          <code>{code}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
