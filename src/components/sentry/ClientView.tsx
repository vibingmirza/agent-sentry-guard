import { Award, Download, ShieldCheck, Globe2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ClientView() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const certId = "AS-PK-" + Math.floor(100000 + Math.random() * 899999);

  const downloadLog = () => {
    toast.success("Audit PDF Log dispatched", {
      description: `Certificate ${certId} signed and delivered to your secure inbox.`,
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-sentry-cyan mb-2">Client View</p>
        <h2 className="text-2xl font-bold">Corporate Compliance Office</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Executive-grade attestation for regulators, auditors, and enterprise stakeholders.
        </p>
      </header>

      {/* Certificate */}
      <section className="relative rounded-2xl border border-sentry-cyan/30 bg-gradient-to-br from-sentry-panel via-sentry-panel-2 to-sentry-panel p-10 overflow-hidden">
        <div className="absolute inset-0 sentry-grid-bg opacity-40 pointer-events-none" />
        <div className="absolute top-0 right-0 size-64 bg-sentry-cyan/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-64 bg-sentry-emerald/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative flex items-start justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-gradient-to-br from-sentry-cyan to-sentry-emerald flex items-center justify-center sentry-glow-cyan">
              <ShieldCheck className="size-6 text-background" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-sentry-cyan">Issued by Agent-Sentry</div>
              <div className="text-sm font-semibold">Office of National AI Governance</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Certificate ID</div>
            <code className="text-sm font-mono">{certId}</code>
          </div>
        </div>

        <div className="relative text-center py-8">
          <Award className="size-14 mx-auto text-sentry-cyan mb-4" />
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground mb-3">
            This is to certify
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-sentry-cyan via-foreground to-sentry-emerald bg-clip-text text-transparent">
            National AI Sovereignty<br />& Safety Certificate
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-sm text-muted-foreground leading-relaxed">
            The bearer's multi-agent AI infrastructure has been independently audited against the Agent-Sentry
            governance framework and meets the technical, ethical, and sovereignty requirements for deployment
            within critical sectors of the Islamic Republic of Pakistan.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-3 my-6">
          <Badge icon={Globe2} label="Vision 2035 Compliant" tone="cyan" />
          <Badge icon={Sparkles} label="SDG 9 Certified" tone="emerald" />
          <Badge icon={ShieldCheck} label="Tier-1 Agent Audit" tone="cyan" />
        </div>

        <div className="relative flex items-end justify-between mt-10 pt-6 border-t border-border flex-wrap gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Date of Issue</div>
            <div className="text-sm font-semibold">{today}</div>
          </div>
          <div className="text-center">
            <div className="font-[cursive] text-2xl text-sentry-cyan italic">Mirza Faizan Baig</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground border-t border-border pt-1 mt-1">
              Director of Sovereign Intelligence
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Valid Through</div>
            <div className="text-sm font-semibold">31 December 2026</div>
          </div>
        </div>
      </section>

      {/* Download */}
      <section className="rounded-xl border border-border bg-sentry-panel p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-bold">Audit PDF Log</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Export the cryptographically-signed audit trail for the most recent compliance period.
          </p>
        </div>
        <Button
          onClick={downloadLog}
          className="bg-sentry-cyan text-background hover:bg-sentry-cyan/90 sentry-glow-cyan font-semibold h-11 px-5"
        >
          <Download className="size-4 mr-2" />
          Download Audit PDF Log
        </Button>
      </section>
    </div>
  );
}

function Badge({
  icon: Icon,
  label,
  tone,
}: {
  icon: typeof Award;
  label: string;
  tone: "cyan" | "emerald";
}) {
  const cls =
    tone === "cyan"
      ? "border-sentry-cyan/50 text-sentry-cyan bg-sentry-cyan/10"
      : "border-sentry-emerald/50 text-sentry-emerald bg-sentry-emerald/10";
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${cls}`}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
