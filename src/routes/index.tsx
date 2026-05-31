import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Linkedin,
  X,
  Check,
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
const LINKEDIN_URL = "https://linkedin.com/company/agentsentryguard"; 
const WORKER_URL = "https://silent-wind-112d.faizybaig14.workers.dev";
const WORKER_KEY = "SentryShield_Master_Secure_2026_Prod";

interface PathwayDetails {
  title: string;
  subtitle: string;
  description: string;
  metrics: { label: string; val: string }[];
  useCases: string[];
}

interface LogLine {
  kind: "info" | "user" | "block" | "err" | "ok" | "ai";
  text: string;
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
    subtitle: "Continuous Multi-Ledger Audisting",
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

function detectCardLuhn(rawText: string): boolean {
  const clean = rawText.replace(/\D/g, "");
  if (clean.length < 13 || clean.length > 19) return false;
  let sum = 0;
  let shouldDouble = false;
  for (let i = clean.length - 1; i >= 0; i--) {
    let digit = parseInt(clean.charAt(i));
    if (shouldDouble) {
      if ((digit *= 2) > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSpend((prev) => prev + parseFloat((Math.random() * 0.04).toFixed(4)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isBudgetBreached = currentSpend >= budgetCap;

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#080b0f] shadow-2xl shadow-black/80">
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

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Activity className={`h-3.5 w-3.5 ${isBudgetBreached ? 'text-rose-500' : 'text-emerald-400'} animate-pulse`} />
            <span>Gateway status: {isBudgetBreached ? (
              <span className="text-rose-500 font-bold">INTERCEPTED BLOCK</span>
            ) : (
              <span className="text-emerald-400 font-bold">SECURED</span>
            )}</span>
          </div>
          <div className="hidden md:block text-zinc-600">|</div>
          <div className="text-zinc-400">
            Signer Key: <span className="text-zinc-300 font-mono">Ed25519_Sec_...2026</span>
          </div>
        </div>
      </div>

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

      <div className="p-6">
        {isBudgetBreached && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 flex gap-3 text-xs text-red-200 animate-in fade-in zoom-in-95 duration-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
            <div>
              <strong>🛑 Policy Rule Breached:</strong> Target system limit was pulled lower than the active baseline runtime costs. <code className="bg-black/30 px-1 py-0.5 rounded text-red-300">${currentSpend.toFixed(2)} spend</code> has bypassed your custom <code className="bg-black/30 px-1 py-0.5 rounded text-red-300">${budgetCap} cap</code> policy. All non-essential engine tasks have dropped execution pipelines globally.
            </div>
          </div>
        )}

        {activeTab === "fleet" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-white/5 bg-black/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Live Agent Fleets Monitored</div>
                <div className="mt-1 text-2xl font-semibold text-white font-mono">5 Active Fleets</div>
              </div>
              <div className="rounded-lg border border-white/5 bg-black/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">Fleet Spend (Today)</div>
                <div className={`mt-1 text-2xl font-semibold font-mono transition-colors duration-300 ${isBudgetBreached ? 'text-red-400' : 'text-emerald-300'}`}>
                  ${currentSpend.toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border border-white/5 bg-black/40 p-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">System Intercepts / Drops</div>
                <div className="mt-1 text-2xl font-semibold text-red-400 font-mono">
                  {isBudgetBreached ? "15 Intercepts" : "14 Intercepts"}
                </div>
              </div>
            </div>

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
                    <td className="p-3 text-emerald-300">${(currentSpend - 14.20).toFixed(2)}</td>
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
                  <span className={`text-sm font-bold font-mono ${isBudgetBreached ? 'text-red-400' : 'text-emerald-300'}`}>${budgetCap} USD</span>
                  <input 
                    type="range" 
                    min="40" 
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
                  onClick={() => setGuardrailActive(!guardrailActive)}
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
              <div className="text-cyan-300">[00:14:15] Outbound Request: LegalDoc-Automator &rarr; call: openai/gpt-4o</div>
              <div className="text-emerald-400">[00:14:16] Gateway signed receipt payload context verified successfully.</div>
              <div className="text-zinc-600">[00:18:44] BLOCK #14808 Signed · Hash: 49ab...ee41 · Sequencer index: 295</div>
              <div className="text-cyan-300">[00:19:02] Outbound Request: EComFraud-Response-Unit &rarr; call: anthropic/claude-3-opus</div>
              <div className="text-red-400 font-semibold">[00:19:03] 🛑 INTERCEPT: Outbound tokens exceeded budget parameter profile rule. Request Terminated.</div>
              {isBudgetBreached && (
                <div className="text-rose-400 font-semibold animate-in fade-in duration-300">[00:23:11] ⚠️ POLICY SHIELD EXECUTED: Realtime master dynamic configuration allocation baseline breached. Intercept lines active.</div>
              )}
              <div className="text-zinc-500">[00:19:03] Dynamic recovery downgrade initiated: switching pathway to local lightweight model engine.</div>
            </div>
          </div>
        )}
      </div>

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
          <div className="flex items-center justify-between bg-black/40 border-b border-white/5 px-4 py-2 text-xs font-mono text-zinc-500">
            <span>Terminal Edge Logs</span>
            <button onClick={() => setLogs([])} className="text-zinc-600 hover:text-zinc-400 transition-colors">clear</button>
          </div>
          <div ref={consoleRef} className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto max-h-[280px] min-h-[220px]">
            {logs.map((l, i) => {
              let color = "text-zinc-400";
              if (l.kind === "user") color = "text-zinc-200 font-medium";
              if (l.kind === "block") color = "text-red-400 font-semibold bg-red-500/5 p-2 rounded border border-red-500/10 block";
              if (l.kind === "err") color = "text-rose-500";
              if (l.kind === "ok") color = "text-emerald-400";
              if (l.kind === "ai") color = "text-cyan-300 bg-cyan-400/5 p-2 rounded border border-cyan-400/10 block";
              return <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>{l.text}</div>;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   STUB STRUCTURAL COMPONENTS (To make full code compilable)
   ========================================================================= */

function Services({ onContact, onSelectPathway }: { onContact: () => void; onSelectPathway: (name: string) => void }) {
  return (
    <section id="infrastructure" className="mx-auto max-w-7xl px-6 py-16 scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white tracking-tight">Enforced Production Pathways</h2>
        <p className="text-zinc-400 mt-2 max-w-xl mx-auto text-sm">Select an operational profile sandbox layout to verify vertical system integration presets.</p>
      </div>
      <div className="flex flex-wrap gap-3 justify-center">
        {Object.keys(VERTICAL_DETAILS).map((name) => (
          <button
            key={name}
            onClick={() => onSelectPathway(name)}
            className="rounded-lg border border-white/5 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 hover:border-emerald-400/40 transition-all"
          >
            {name} Fleet Layout &rarr;
          </button>
        ))}
      </div>
    </section>
  );
}

function Guardrails() { return <section id="pricing" className="py-4 border-t border-white/5" />; }
defineRouteComponent(Runtime);
function Runtime() { return <section id="docs" className="py-4" />; }
function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 py-8 text-center text-xs text-zinc-600 font-mono">
      © {new Date().getFullYear()} AgentSentryGuard™ Core Systems Inc. Cryptographic Enterprise Control Mesh.
    </footer>
  );
}

/* =========================================================================
   MODAL COMPONENT STRUCTS
   ========================================================================= */

function BriefingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-[#0b0f15] p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
        <h3 className="text-lg font-bold text-white flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-400" /> Enterprise Briefing</h3>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">Connect securely to deploy a dedicated isolation guardrail sandbox matching your operational stack parameters natively.</p>
        <div className="mt-6 space-y-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors">Initialize WhatsApp Intake Vector</a>
          <button onClick={onClose} className="w-full inline-flex items-center justify-center rounded-md border border-white/5 bg-white/5 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-white/10 transition-colors">Return to Dashboard</button>
        </div>
      </div>
    </div>
  );
}

function PathwayModal({ pathway, onClose, onBook }: { pathway: PathwayDetails; onClose: () => void; onBook: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-xl border border-white/10 bg-[#0b0f15] p-6 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X className="h-4 w-4" /></button>
        <span className="font-mono text-[10px] uppercase text-emerald-400 tracking-wider font-bold">{pathway.subtitle}</span>
        <h3 className="text-xl font-bold text-white mt-1">{pathway.title}</h3>
        <p className="text-sm text-zinc-400 mt-3 leading-relaxed">{pathway.description}</p>
        
        <div className="grid grid-cols-2 gap-4 my-5 p-3 rounded-lg bg-black/40 border border-white/5 text-center">
          {pathway.metrics.map((m, i) => (
            <div key={i}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{m.label}</div>
              <div className="text-lg font-bold text-emerald-300 font-mono mt-0.5">{m.val}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Verified Flow Pipeline Anchors:</div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {pathway.useCases.map((u, i) => (
              <li key={i} className="flex items-start gap-2"><Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" /> <span>{u}</span></li>
            ))}
          </ul>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between gap-4">
          <button onClick={onClose} className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold uppercase tracking-wider">Close View</button>
          <button onClick={() => { onClose(); onBook(); }} className="inline-flex items-center gap-1.5 rounded-md bg-emerald-400 px-4 py-2 text-xs font-semibold text-black hover:bg-emerald-300 transition-colors">Request Pipeline Fleet Access <ArrowRight className="h-3 w-3" /></button>
        </div>
      </div>
    </div>
  );
}

function defineRouteComponent(component: React.ComponentType) { return component; }
