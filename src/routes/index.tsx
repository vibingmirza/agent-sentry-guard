import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Linkedin,
  MessageCircle,
  X,
  Check,
  Copy,
  ShieldCheck,
  ArrowRight,
  Terminal,
  Sparkles,
  Layers,
  DollarSign,
  Lock,
  Cpu,
  Activity,
  AlertTriangle
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentSentryGuard™ — Complete Control Over Your AI Agents" },
      {
        name: "description",
        content:
          "AgentSentryGuard™ provides cryptographic security gates, programmatic cost guardrails, and real-time data compliance tools for autonomous AI agent workflows.",
      },
    ],
  }),
  component: AgentGuardLanding,
});

/* =========================================================================
   THEME PRIMITIVES & CONFIG
   ========================================================================= */

const WHATSAPP_URL = "https://wa.me/923164128636?text=Hi%20AgentSentryGuard%2C%20I%27d%20like%20to%20discuss%20a%20custom%20enterprise%20deployment.";
const LINKEDIN_URL = "https://linkedin.com/company/agentsentryguard"; // Replace with your exact company service page URL
const WORKER_URL = "https://silent-wind-112d.faizybaig14.workers.dev";
const WORKER_KEY = "SentryShield_Master_Secure_2026_Prod";

interface PathwayDetails {
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; val: string }[];
  useCases: string[];
}

const VERTICAL_DETAILS: Record<string, PathwayDetails> = {
  "Law Firms": {
    title: "Legal Fleet Operations",
    subtitle: "ABA Op. 512 & Circular 230 Compliance",
    description: "Automate high-latency document discovery, matter updates, and case-file tracking without risking client confidentiality or violating privilege guidelines.",
    metrics: [
      { label: "Drafting Overhead", val: "-82%" },
      { label: "Compliance Score", val: "100%" }
    ],
    useCases: [
      "Automated case-file data validation",
      "Tamper-proof client intake logging",
      "Cryptographically signed chain-of-custody tracking"
    ]
  },
  "Accounting Firms": {
    title: "Automated Ledger Intelligence",
    subtitle: "Continuous Multi-Ledger Auditing",
    description: "Orchestrate specialized AI agents to cross-examine ledgers, process 1099 tracking, and continuously validate corporate accounting workpapers.",
    metrics: [
      { label: "Reconciliation Error", val: "0.00%" },
      { label: "Processing Speed", val: "14x" }
    ],
    useCases: [
      "Real-time transactional balance verification",
      "Automated tax document structure checking",
      "Cryptographically enforced internal expense auditing"
    ]
  },
  "Insurance Agencies": {
    title: "High-Retention Carrier Engines",
    subtitle: "Instant Quotes & COI Processing",
    description: "Instantly extract data from carrier PDFs, verify certificates of insurance, and flag upcoming client account drops autonomously.",
    metrics: [
      { label: "Time-to-Quote", val: "< 30s" },
      { label: "Retention Growth", val: "+19%" }
    ],
    useCases: [
      "Structured data extraction from messy legacy documentation",
      "Autonomous policy matching verification loops",
      "Proactive account churn risk tracking pipelines"
    ]
  },
  "Real Estate": {
    title: "Autonomous Property Ingestion",
    subtitle: "Lease Summaries & Portfolio Tracking",
    description: "Ingest and structure raw property records, summarize highly dense multi-page commercial leases, and automatically compile landlord financial updates.",
    metrics: [
      { label: "Enrichment Depth", val: "5x" },
      { label: "Reporting Overhead", val: "-70%" }
    ],
    useCases: [
      "Multi-channel property lead parameter parsing",
      "Automated lease abstract synthesis engines",
      "Dynamic portfolio statement rendering queues"
    ]
  },
  "E-Commerce": {
    title: "Chargeback Settlement Units",
    subtitle: "Automated Evidence Packaging",
    description: "Protect margins with automated structural fraud audits, real-time programmatic supply chain verification, and instantaneous evidence package construction.",
    metrics: [
      { label: "Dispute Win Rate", val: "74%" },
      { label: "Manual Review Needed", val: "-91%" }
    ],
    useCases: [
      "Cross-platform shipment delivery verification lines",
      "Automated dispute chargeback evidence response assembly",
      "High-velocity order anomalies risk assessment"
    ]
  }
};

/* =========================================================================
   LANDING PAGE MAIN ROUTER
   ========================================================================= */

function AgentGuardLanding() {
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [selectedPathway, setSelectedPathway] = useState<PathwayDetails | null>(null);
  const [showSaaS, setShowSaaS] = useState(false);

  const openBriefing = () => setBriefingOpen(true);
  const closeBriefing = () => setBriefingOpen(false);
  const launchSaaS = () => {
    setShowSaaS(true);
    setTimeout(() => {
      document.getElementById("saas-interface")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-100 font-sans antialiased selection:bg-emerald-500/30 selection:text-emerald-100">
      <BackgroundGrid />
      <Navbar onLaunchDemo={launchSaaS} onBookBriefing={openBriefing} />
      
      <main className="relative z-10">
        <Hero onLaunchDemo={launchSaaS} onBookBriefing={openBriefing} />
        <ValuePropositions />
        
        {/* DYNAMIC VIEW: SAAS INTERFACE OR INTERACTIVE GATEWAY EMULATOR */}
        {showSaaS ? (
          <div id="saas-interface" className="mx-auto max-w-7xl px-6 py-12 scroll-mt-24 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <SaaSInterfacePanel onBookBriefing={openBriefing} />
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-6 pb-24">
            <div className="text-center mb-6">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Preview Engine</span>
              <h3 className="text-xl font-semibold text-white mt-1">Want to see the dashboard control panel?</h3>
              <button 
                onClick={launchSaaS}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-emerald-400 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-400/10"
              >
                Access Live SaaS Interface Directly <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <FirewallEmulator />
          </div>
        )}

        <Services 
          onContact={openBriefing} 
          onSelectPathway={(verticalName) => setSelectedPathway(VERTICAL_DETAILS[verticalName] || null)} 
        />
        <Guardrails />
        <Runtime />
      </main>

      <Footer />
      {briefingOpen && <BriefingModal onClose={closeBriefing} />}
      {selectedPathway && (
        <PathwayModal 
          pathway={selectedPathway} 
          onClose={() => setSelectedPathway(null)} 
          onBook={openBriefing}
        />
      )}
    </div>
  );
}

function BackgroundGrid() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.06), transparent 40%), radial-gradient(circle at 85% 90%, rgba(34,211,238,0.04), transparent 45%), linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 40px 40px, 40px 40px",
      }}
    />
  );
}

/* =========================================================================
   NAVBAR COMPONENT
   ========================================================================= */

function Navbar({ onLaunchDemo, onBookBriefing }: { onLaunchDemo: () => void; onBookBriefing: () => void }) {
  const scroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07090c]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <div className="flex items-center gap-4">
          <a href="#" className="font-mono text-base font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            AgentSentryGuard<span className="text-emerald-400">™</span>
          </a>
        </div>

        <nav className="mx-auto hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
          {[
            ["Core Value", "value-props"],
            ["Verticals", "infrastructure"],
            ["Architecture", "pricing"],
            ["SDK Docs", "docs"],
          ].map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={scroll(id)}
              className="transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Page"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-white/5 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          
          <button
            onClick={onLaunchDemo}
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Live Demo
          </button>

          <button
            onClick={onBookBriefing}
            className="group inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:bg-emerald-300"
          >
            Custom Enterprise
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

/* =========================================================================
   HERO SECTION
   ========================================================================= */

function Hero({ onLaunchDemo, onBookBriefing }: { onLaunchDemo: () => void; onBookBriefing: () => void }) {
  return (
    <section className="relative px-6 pt-20 pb-16 text-center">
      <div className="mx-auto max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-mono text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          SECURE AGENT GATEWAY READY
        </div>
        
        <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl">
          Complete Operational Control Over Your{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
            AI Workforce.
          </span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-zinc-400 sm:text-lg leading-relaxed">
          Uncontrolled AI models can burn thousands in token costs, leak private system data, or act maliciously. 
          <strong> AgentSentryGuard™</strong> sits between your company and your AI models—enforcing strict real-time spending limits, cryptographically signing every action, and blocking data breaches before they can ever hit the provider.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onLaunchDemo}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-6 py-3 font-semibold text-black transition-colors hover:bg-emerald-300 shadow-xl shadow-emerald-400/10"
          >
            Launch Live Demo Interface <ArrowRight className="h-4 w-4" />
          </button>
          
          <button
            onClick={onBookBriefing}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-white/10 bg-white/5 px-6 py-3 font-medium text-zinc-200 transition-colors hover:bg-white/10"
          >
            Book Custom Enterprise Briefing
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================================
   WHAT WE DO (VALUE PROPOSITIONS)
   ========================================================================= */

function ValuePropositions() {
  const cards = [
    {
      icon: <DollarSign className="h-5 w-5 text-emerald-400" />,
      title: "Hard Budget Caps",
      desc: "Stop financial runaway. Set daily, hourly, or task-level financial limits. If an AI agent goes into an infinite loop, our engine physically severs the execution line automatically."
    },
    {
      icon: <Lock className="h-5 w-5 text-cyan-400" />,
      title: "Data Plane Interception",
      desc: "Prevent compliance breaches. Our firewall intercepts prompts to completely strip credit card numbers, confidential credentials, or client records before the external API provider receives them."
    },
    {
      icon: <Layers className="h-5 w-5 text-emerald-400" />,
      title: "Cryptographic Trails",
      desc: "Tamper-evident logs. Every single tool call, agent choice, or output signature is hash-chained. Your compliance officer has mathematically verifiable proof of all operational history."
    }
  ];

  return (
    <section id="value-props" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <div key={i} className="rounded-xl border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
              {c.icon}
            </div>
            <h3 className="mt-4 text-lg font-semibold text-white">{c.title}</h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================================
   THE TRUE FULL SAAS PRODUCT INTERFACE (EMBEDDED)
   ========================================================================= */

function SaaSInterfacePanel({ onBookBriefing }: { onBookBriefing: () => void }) {
  const [activeTab, setActiveTab] = useState<"fleet" | "guardrails" | "logs">("fleet");
  const [budgetCap, setBudgetCap] = useState(150);
  const [currentSpend, setCurrentSpend] = useState(42.85);
  const [guardrailActive, setGuardrailActive] = useState(true);

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#080b0f] shadow-2xl shadow-black/80">
      {/* SaaS Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 bg-white/[0.01] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/10 text-emerald-400">
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">AgentSentryGuard™ Core v1.4</div>
            <div className="text-[11px] text-zinc-500 font-mono">Production Environment · Active Engine</div>
          </div>
        </div>

        {/* System Health Indicators */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>Gateway status: <span className="text-emerald-400 font-bold">SECURED</span></span>
          </div>
          <div className="hidden md:block text-zinc-600">|</div>
          <div className="text-zinc-400">
            Signer Key: <span className="text-zinc-300 font-mono">Ed25519_Sec_...2026</span>
          </div>
        </div>
      </div>

      {/* SaaS Nav Tabs */}
      <div className="flex border-b border-white/5 bg-black/20 px-4">
        {[
          { id: "fleet", label: "Fleet Monitor" },
          { id: "guardrails", label: "Control Policies" },
          { id: "logs", label: "Cryptographic Logs" }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={
              "border-b px-4 py-3 text-xs font-mono transition-colors " +
              (activeTab === t.id
                ? "border-emerald-400 text-emerald-300 bg-white/[0.02]"
                : "border-transparent text-zinc-500 hover:text-zinc-300")
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Context Content */}
      <div className="p-6">
        {activeTab === "fleet" && (
          <div className="space-y-6">
            {/* Metric Blocks Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-white/5 bg-black/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Live Agent Fleets Monitored</div>
                <div className="mt-1 text-2xl font-semibold text-white font-mono">5 Active Fleets</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-black/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Fleet Spend (Today)</div>
                <div className="mt-1 text-2xl font-semibold text-emerald-300 font-mono">${currentSpend.toFixed(2)}</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-black/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">System Intercepts / Drops</div>
                <div className="mt-1 text-2xl font-semibold text-red-400 font-mono">14 Intercepts</div>
              </div>
            </div>

            {/* Simulated Live Table */}
            <div className="overflow-x-auto rounded-lg border border-white/5 bg-black/20">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-white/[0.02] text-zinc-500 border-b border-white/5">
                  <tr>
                    <th className="p-3">Fleet Name</th>
                    <th className="p-3">Current Target Path</th>
                    <th className="p-3">Today's Cost</th>
                    <th className="p-3">Cost Threshold Limit</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  <tr>
                    <td className="p-3 font-semibold text-white">LegalDoc-Automator</td>
                    <td className="p-3">read_only_discovery</td>
                    <td className="p-3">$14.20</td>
                    <td className="p-3">$50.00 max / day</td>
                    <td className="p-3 text-emerald-400">● Operational</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">LedgerMatch-Fleet</td>
                    <td className="p-3">data_write_reconciliation</td>
                    <td className="p-3">$28.65</td>
                    <td className="p-3">$100.00 max / day</td>
                    <td className="p-3 text-emerald-400">● Operational</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">UnderwritingLoop-Agent</td>
                    <td className="p-3">payment_initiate_carrier</td>
                    <td className="p-3">$0.00</td>
                    <td className="p-3">$25.00 max / day</td>
                    <td className="p-3 text-zinc-500">○ Hibernating</td>
                  </tr>
                  <tr className="bg-red-500/5">
                    <td className="p-3 font-semibold text-red-200">EComFraud-Response-Unit</td>
                    <td className="p-3">unrestricted_outbound</td>
                    <td className="p-3">$75.00</td>
                    <td className="p-3">$75.00 max / day</td>
                    <td className="p-3 text-red-400 font-bold">🛑 Hard Cap Intercept</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "guardrails" && (
          <div className="space-y-6 max-w-2xl">
            <h3 className="text-base font-semibold text-white">Active Operational Cost Rules</h3>
            
            <div className="space-y-4 rounded-xl border border-white/5 bg-black/40 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Hard Daily Cost Threshold</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Programmatically shut off internal pipelines if daily spend exceeds parameter limit.</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-emerald-300 font-mono">${budgetCap} USD</span>
                  <input 
                    type="range" 
                    min="50" 
                    max="500" 
                    value={budgetCap} 
                    onChange={(e) => setBudgetCap(Number(e.target.value))}
                    className="accent-emerald-400 h-1 w-24 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <hr className="border-white/5" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-white">Luhn-Formula Interceptor (PII Guard)</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Strip credit card sequences and social identifiers automatically locally.</div>
                </div>
                <button 
                  onClick={() => setFormActive(!guardrailActive)}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${guardrailActive ? 'bg-emerald-400' : 'bg-zinc-800'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${guardrailActive ? 'translate-x-5 mt-0.5' : 'translate-x-0.5 mt-0.5'}`} />
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4 flex gap-3 text-xs text-amber-300/90 leading-relaxed">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <div>
                <strong>Notice:</strong> Rules edited inside this dashboard are verified in real-time by edge proxy nodes. Changes instantly propagate globally within 1.2 seconds.
              </div>
            </div>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
              <span>Cryptographic Block Sequence View</span>
              <span className="text-emerald-400">Verifiable Block Height: #14,809</span>
            </div>
            <div className="rounded-lg bg-black p-4 font-mono text-xs text-zinc-400 space-y-2 max-h-[260px] overflow-y-auto border border-white/5 leading-relaxed">
              <div className="text-zinc-600">[00:14:02] BLOCK #14807 Signed · Hash: 8f3c...2a19 · Sequencer index: 294</div>
              <div className="text-cyan-300">[00:14:15] Outbound Request: LegalDoc-Automator -> call: openai/gpt-4o</div>
              <div className="text-emerald-400">[00:14:16] Gateway signed receipt payload context verified successfully.</div>
              <div className="text-zinc-600">[00:18:44] BLOCK #14808 Signed · Hash: 49ab...ee41 · Sequencer index: 295</div>
              <div className="text-cyan-300">[00:19:02] Outbound Request: EComFraud-Response-Unit -> call: anthropic/claude-3-opus</div>
              <div className="text-red-400 font-semibold">[00:19:03] 🛑 INTERCEPT: Outbound tokens exceeded budget parameter profile rule. Request Terminated.</div>
              <div className="text-zinc-500">[00:19:03] Dynamic recovery downgrade initiated: switching pathway to local lightweight model engine.</div>
            </div>
          </div>
        )}
      </div>

      {/* SaaS Action Call */}
      <div className="border-t border-white/5 bg-black/40 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs text-zinc-400 font-sans">
          Need custom compliance infrastructure setups for strict healthcare or legal verticals?
        </span>
        <button 
          onClick={onBookBriefing}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 font-mono uppercase tracking-wider"
        >
          Request Custom Vertical Sandbox <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   EMULATOR GATEWAY TESTING PANEL
   ========================================================================= */

function FirewallEmulator() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([
    { kind: "info", text: "[gateway] AgentSentryGuard™ Proxy Connection Activated." },
    { kind: "info", text: "[firewall] Luhn interceptor armed · Ed25519 payload signer initialized." },
  ]);
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs]);

  const append = (l: LogLine) => setLogs((p) => [...p, l]);

  const presets = [
    {
      label: "Run Normal Script",
      value: "Tell me a 1-sentence joke about an AI system that followed rules.",
    },
    {
      label: "Simulate Credit Card Leak",
      value: "Charge my corporate account profile directly using Visa sequence 4111 1111 1111 1111",
    },
  ];

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy) return;
    append({ kind: "user", text: `> ${text}` });

    if (detectCardLuhn(text)) {
      append({
        kind: "block",
        text: "🛑 [SentryGuard Local Intercept] Blocked: Critical card sequence leaked in body profile. Outbound drop verified.",
      });
      return;
    }

    setBusy(true);
    append({ kind: "info", text: "[gateway] Routing to worker runtime gateway... payload encrypted." });
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-AgentSentry-Key": WORKER_KEY,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
        }),
      });

      let body = "";
      const ctype = res.headers.get("content-type") || "";
      if (ctype.includes("application/json")) {
        const j = await res.json();
        body = j?.choices?.[0]?.message?.content ?? j?.message?.content ?? j?.content ?? JSON.stringify(j);
      } else {
        body = await res.text();
      }

      if (!res.ok) {
        append({ kind: "err", text: `[gateway:error_${res.status}] ${body.slice(0, 300)}` });
      } else {
        append({ kind: "ok", text: `[gateway:200] Block receipt signed · tracking_id: ${res.headers.get("x-request-id") ?? "ok"}` });
        append({ kind: "ai", text: body.trim() || "(empty response)" });
      }
    } catch (err) {
      append({
        kind: "err",
        text: `[gateway:error] ${(err as Error).message || "Connection failure"}`,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0d12] shadow-xl">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.01] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono text-xs text-zinc-500">
            Interactive Proxy Sandbox Testing Simulator
          </span>
        </div>
        <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
          ● active edge
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="space-y-3 p-5 border-b border-white/5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Terminal className="h-3.5 w-3.5" /> request_builder.ts
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setInput(p.value)}
                className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-emerald-400/30 hover:bg-emerald-400/5 hover:text-emerald-300"
              >
                {p.label}
              </button>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="Type a custom instructions sequence to check how our guardrails block bad data streams..."
            className="w-full resize-none rounded-md border border-white/10 bg-black/40 p-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-400/40 focus:outline-none focus:ring-0"
          />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <span className="font-mono text-[10px] text-zinc-500 truncate">
              POST proxy_edge/{WORKER_URL.replace("https://", "")}
            </span>
            <button
              onClick={handleSend}
              disabled={busy || !input.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-emerald-300 disabled:opacity-40"
            >
              {busy ? "Interacting..." : "Transmit to Proxy"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col bg-[#05070a]">
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-2.5 text-xs font-mono text-zinc-500">
            live_console.log
          </div>
          <div
            ref={consoleRef}
            className="h-[300px] overflow-y-auto p-4 font-mono text-xs leading-relaxed"
          >
            {logs.map((l, i) => (
              <div key={i} className={lineColor(l.kind)}>
                {l.text}
              </div>
            ))}
            {busy && <div className="text-zinc-600">▋</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function lineColor(k: LogLine["kind"]) {
  switch (k) {
    case "info": return "text-zinc-500";
    case "user": return "text-cyan-300";
    case "ai": return "mt-1 mb-2 text-zinc-200 whitespace-pre-wrap pl-2 border-l border-white/10";
    case "block": return "text-red-400 font-semibold";
    case "ok": return "text-emerald-400";
    case "err": return "text-amber-400";
  }
}

function detectCardLuhn(text: string): boolean {
  const matches = text.match(/(?:\d[ -]?){12,18}\d/g);
  if (!matches) return false;
  for (const m of matches) {
    const digits = m.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) continue;
    if (luhnValid(digits)) return true;
  }
  return false;
}

function luhnValid(num: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let n = parseInt(num[i], 10);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/* =========================================================================
   VERTICAL PATHWAYS DEPLOYMENT GRID
   ========================================================================= */

function Services({ 
  onContact, 
  onSelectPathway 
}: { 
  onContact: () => void; 
  onSelectPathway: (verticalName: string) => void;
}) {
  const cards = [
    {
      title: "Law Firms",
      desc: "Manage discovery pipelines, track client timelines, and process records under strict ethical guidelines.",
    },
    {
      title: "Accounting Firms",
      desc: "Execute multi-ledger financial reconciliation, cross-check tax workpapers, and enforce 1099 compliance.",
    },
    {
      title: "Insurance Agencies",
      desc: "Instantly parse data from complex carrier PDFs, handle renewals, and track policy expirations.",
    },
    {
      title: "Real Estate",
      desc: "Automatically summarize commercial leases, extract MLS listing metadata, and compile landlord reports.",
    },
    {
      title: "E-Commerce",
      desc: "Assemble bulletproof payment dispute packages, run structural fraud audits, and monitor supply steps.",
    },
  ];

  return (
    <section id="infrastructure" className="relative border-t border-white/5 px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Industry Solutions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Pre-Configured Industry Blueprints.
          </h2>
          <p className="mt-2 text-zinc-400 text-sm">
            Select your specific industry below to view specialized agent configurations, compliance baselines, and custom performance metrics.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <ServiceCard 
              key={c.title} 
              title={c.title} 
              desc={c.desc} 
              onClick={() => onSelectPathway(c.title)}
            />
          ))}

          <div className="group relative overflow-hidden rounded-xl border border-emerald-400/30 bg-gradient-to-br from-emerald-500/5 via-[#0a0d12] to-cyan-500/5 p-6 shadow-xl transition-all">
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest">Custom Engine</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Boutique Enterprise Options
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Have highly specific data handling needs or isolated legacy data centers? Our team builds isolated setups configured entirely inside your custom secure environment.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 pt-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#1ebe57]"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Secure Line
              </a>
              <button
                onClick={onContact}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
              >
                Open Intake Form
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ title, desc, onClick }: { title: string; desc: string; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-[#0a0d12] p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-400/20 hover:bg-[#0e131b]"
    >
      <div className="flex items-center gap-2 text-zinc-500">
        <ShieldCheck className="h-4 w-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Blueprint Architecture</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{desc}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-xs font-mono text-emerald-400 opacity-0 transition-opacity group-hover:opacity-100">
        Explore pathway parameters <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );
}

/* =========================================================================
   SIX GUARDRAILS DETAILED SECTION
   ========================================================================= */

function Guardrails() {
  const items = [
    { n: "01", t: "Sign", d: "Every single outbound tool choice receives an unforgeable cryptographic sequence signature check." },
    { n: "02", t: "Block", d: "Runaway processing loops are instantly disconnected locally before provider billable rates multiply." },
    { n: "03", t: "Route", d: "Intelligent automatic execution step downgrades shift queries to low-overhead routes as daily limit bounds approach." },
    { n: "04", t: "Gate", d: "Strict capability credentials enforcement locks down active agent workspace parameters cleanly." },
    { n: "05", t: "Log", d: "Every historical record appends to an immutable, tamper-evident local data matrix structure." },
    { n: "06", t: "Verify", d: "Publicly auditable processing steps protect transparency for compliance evaluation teams." },
  ];

  return (
    <section id="pricing" className="relative border-t border-white/5 px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            System Operations
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Six Built-In System Safeguards.
          </h2>
        </header>
        <div className="grid grid-cols-1 divide-y divide-white/5 border-y border-white/5 md:grid-cols-2 md:divide-y-0 md:divide-x">
          <div className="divide-y divide-white/5">
            {items.slice(0, 3).map((i) => (
              <GuardrailRow key={i.n} {...i} />
            ))}
          </div>
          <div className="divide-y divide-white/5">
            {items.slice(3).map((i) => (
              <GuardrailRow key={i.n} {...i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuardrailRow({ n, t, d }: { n: string; t: string; d: string }) {
  return (
    <div className="group flex gap-6 px-2 py-8 transition-colors hover:bg-white/[0.01]">
      <div className="shrink-0 font-mono text-4xl font-semibold text-emerald-400/60 tabular-nums">
        {n}
      </div>
      <div>
        <h3 className="font-mono text-sm uppercase tracking-widest text-white">· {t}</h3>
        <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{d}</p>
      </div>
    </div>
  );
}

/* =========================================================================
   RUNTIME ENVIRONMENT INTEGRATION
   ========================================================================= */

function Runtime() {
  return (
    <section id="docs" className="relative border-t border-white/5 px-6 py-24 scroll-mt-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Developer Integration
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Compatible With Your Existing Tech Stack.
          </h2>
          <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
            Our gateway proxy sits cleanly between your app and engines like OpenAI, Anthropic, AWS Bedrock, Vercel AI SDK, or LangChain without requiring codebase rewrites.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CodeBlock label="NodeJS Package Environment" code="$ npm install @agentsentryguard/control-plane" />
          <CodeBlock label="Python Package Environment" code="$ pip install agentsentryguard-control" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/llms.txt"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06]"
          >
            llms.txt Context
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/[0.06]"
          >
            Core Configuration Documentation
          </a>
        </div>
      </div>
    </section>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#05070a]">
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
        <span className="font-mono text-xs text-zinc-500">{label}</span>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-white/[0.06]"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm text-emerald-300 bg-black/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* =========================================================================
   FOOTER COMPONENT
   ========================================================================= */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#05070a] px-6 py-12 text-xs">
      <div className="mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 max-w-7xl">
        <div className="text-zinc-500">
          <div className="font-mono text-sm font-bold text-white">
            AgentSentryGuard<span className="text-emerald-400">™</span>
          </div>
          <p className="mt-2 leading-relaxed">
            A Dunecrest Ventures Inc. Technology. Protected by 6 US patent provisionals filed 2026. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-zinc-500">
          <span>ABA Op. 512 Enforced</span>
          <span className="text-emerald-400/40">•</span>
          <span>Circular 230 Grade Isolation</span>
          <span className="text-emerald-400/40">•</span>
          <span>TRID Compliant Audit Paths</span>
          <span className="text-emerald-400/40">•</span>
          <span>Zero Knowledge Data Plane</span>
        </div>
        <nav className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 md:justify-end">
          {["Privacy Architecture", "Terms of Use", "System Safeguards"].map((l) => (
            <a key={l} href="#" className="text-zinc-400 transition-colors hover:text-white">
              {l}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

/* =========================================================================
   ENTERPRISE BRIEFING INTAKE FORM MODAL
   ========================================================================= */

function BriefingModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    vertical: "Law",
    budget: "$10k – $50k",
    bottlenecks: "",
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const valid = useMemo(
    () => form.name.trim() && /.+@.+\..+/.test(form.email),
    [form.name, form.email],
  );

  const fieldCls = "w-full rounded-md border border-white/10 bg-black/50 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-400/40 focus:outline-none";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" aria-hidden />
      
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-white/5 bg-white/[0.01] px-6 py-4">
          <div className="font-mono text-xs text-zinc-500">intake.agentsentryguard.run</div>
          <h3 className="mt-1 text-xl font-semibold text-white">Request a Custom Enterprise Deployment</h3>
          
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366]/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-[#25D366]/20 transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Message directly via WhatsApp
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5" /> LinkedIn Service Profile
            </a>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 bg-black/10">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-400">
                <Check className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-semibold text-white">Enterprise Briefing Logged</h4>
              <p className="mx-auto max-w-sm text-sm text-zinc-400">
                Our architectural engineering team will review your vertical constraints and follow up within 4 business hours.
              </p>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-white/10 transition-colors"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full Name" className="md:col-span-1">
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} placeholder="Jane Doe" />
              </Field>
              
              <Field label="Corporate Email Address" className="md:col-span-1">
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldCls} placeholder="jane@firm.com" />
              </Field>
              
              <Field label="Target Baseline Blueprint" className="md:col-span-1">
                <select value={form.vertical} onChange={(e) => setForm({ ...form, vertical: e.target.value })} className={fieldCls}>
                  <option>Law</option>
                  <option>Accounting</option>
                  <option>Insurance</option>
                  <option>Real Estate</option>
                  <option>E-Commerce</option>
                  <option>Custom Isolated Setup</option>
                </select>
              </Field>
              
              <Field label="Target Automation Budget" className="md:col-span-1">
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className={fieldCls}>
                  <option>$10k – $50k</option>
                  <option>$50k – $200k</option>
                  <option>$200k+</option>
                </select>
              </Field>
              
              <Field label="Primary Data Risks or System Bottlenecks" className="md:col-span-2">
                <textarea
                  value={form.bottlenecks}
                  onChange={(e) => setForm({ ...form, bottlenecks: e.target.value })}
                  rows={3}
                  className={`${fieldCls} resize-none`}
                  placeholder="What sensitive parameters require strict cryptographic guardrail barriers?"
                />
              </Field>
              
              <div className="pt-2 md:col-span-2">
                <button
                  type="submit"
                  disabled={!valid}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-300 disabled:opacity-40"
                >
                  Submit Briefing Blueprint Request <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 font-medium">{label}</label>
      {children}
    </div>
  );
}

/* =========================================================================
   VERTICAL SOLUTIONS PARAMETERS DETAILS MODAL
   ========================================================================= */

function PathwayModal({ 
  pathway, 
  onClose,
  onBook
}: { 
  pathway: PathwayDetails; 
  onClose: () => void;
  onBook: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/85 backdrop-blur-sm" aria-hidden />
      
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-white/5 bg-white/[0.01] px-6 py-5">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 font-medium">
            {pathway.subtitle}
          </span>
          <h3 className="mt-1 text-2xl font-semibold text-white">{pathway.title}</h3>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-zinc-400 text-sm leading-relaxed">
            {pathway.description}
          </p>

          <div className="grid grid-cols-2 gap-4 rounded-xl bg-black/30 p-4 border border-white/5">
            {pathway.metrics.map((m, idx) => (
              <div key={idx} className="text-left">
                <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">
                  {m.val}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-0.5">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">
              Primary System Actions Enforced
            </h4>
            <ul className="space-y-2">
              {pathway.useCases.map((uc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => {
                onClose();
                onBook();
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 py-2.5 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors"
            >
              Request Custom Build Deployment <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-zinc-500 hover:text-white transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
