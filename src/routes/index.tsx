import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Github,
  Linkedin,
  MessageCircle,
  X,
  Check,
  Copy,
  ShieldCheck,
  ArrowRight,
  Terminal,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentGuard™ — Outcomes, not tokens. Signed, capped, verifiable." },
      {
        name: "description",
        content:
          "AgentGuard designs, builds and audits automated AI fleets for regulated verticals — under cryptographic and budgetary control.",
      },
    ],
  }),
  component: AgentGuardLanding,
});

/* =========================================================================
   THEME PRIMITIVES
   ========================================================================= */

const WHATSAPP_URL =
  "https://wa.me/15551234567?text=Hi%20AgentGuard%2C%20I%27d%20like%20to%20discuss%20a%20deployment.";
const GITHUB_URL = "https://github.com";
const LINKEDIN_URL = "https://linkedin.com";
const WORKER_URL = "https://silent-wind-112d.faizybaig14.workers.dev";
const WORKER_KEY = "SentryShield_Master_Secure_2026_Prod";

type Lang = "EN" | "ES" | "PT";

/* =========================================================================
   LANDING PAGE
   ========================================================================= */

function AgentGuardLanding() {
  const [demoOpen, setDemoOpen] = useState(false);
  const openDemo = () => setDemoOpen(true);
  const closeDemo = () => setDemoOpen(false);

  return (
    <div className="min-h-screen bg-[#07090c] text-zinc-100 font-sans antialiased selection:bg-emerald-500/30">
      <BackgroundGrid />
      <Navbar onBookDemo={openDemo} />
      <main className="relative z-10">
        <Hero onBookDemo={openDemo} />
        <Services onContact={openDemo} />
        <Guardrails />
        <Runtime />
      </main>
      <Footer />
      {demoOpen && <DemoModal onClose={closeDemo} />}
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
          "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.07), transparent 40%), radial-gradient(circle at 85% 90%, rgba(34,211,238,0.05), transparent 45%), linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize: "auto, auto, 36px 36px, 36px 36px",
      }}
    />
  );
}

/* =========================================================================
   NAVBAR
   ========================================================================= */

function Navbar({ onBookDemo }: { onBookDemo: () => void }) {
  const [lang, setLang] = useState<Lang>("EN");
  const langs: Lang[] = ["EN", "ES", "PT"];

  const scroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#07090c]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        {/* Brand + language */}
        <div className="flex items-center gap-4">
          <a href="#" className="font-mono text-base font-bold tracking-tight text-white">
            AgentGuard<span className="text-emerald-400">™</span>
          </a>
          <div className="hidden items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-[10px] font-mono md:flex">
            {langs.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={
                  "rounded-full px-2.5 py-1 transition-colors " +
                  (lang === l
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "text-zinc-400 hover:text-white")
                }
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Center anchors */}
        <nav className="mx-auto hidden items-center gap-7 text-sm text-zinc-400 md:flex">
          {[
            ["Outcomes", "outcomes"],
            ["Infrastructure", "infrastructure"],
            ["Pricing", "pricing"],
            ["Docs", "docs"],
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

        {/* Right: socials */}
        <div className="ml-auto flex items-center gap-1">
          <IconLink href={GITHUB_URL} label="GitHub">
            <Github className="h-4 w-4" />
          </IconLink>
          <IconLink href={LINKEDIN_URL} label="LinkedIn">
            <Linkedin className="h-4 w-4" />
          </IconLink>
          <IconLink href={WHATSAPP_URL} label="WhatsApp">
            <MessageCircle className="h-4 w-4" />
          </IconLink>
        </div>

        {/* CTA — visually separated */}
        <div className="ml-3 border-l border-white/10 pl-3">
          <button
            onClick={onBookDemo}
            className="group inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_24px_-6px_rgba(16,185,129,0.7)] transition-all hover:bg-emerald-300"
          >
            Book a Demo
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
    >
      {children}
    </a>
  );
}

/* =========================================================================
   HERO + FIREWALL EMULATOR
   ========================================================================= */

type LogLine = { kind: "info" | "user" | "ai" | "block" | "ok" | "err"; text: string };

function Hero({ onBookDemo }: { onBookDemo: () => void }) {
  return (
    <section id="outcomes" className="relative px-6 pt-16 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs font-mono text-emerald-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            LIVE · Gateway operational
          </div>
          <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl">
            Outcomes, not tokens.{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              Signed, capped, verifiable.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base text-zinc-400 md:text-lg">
            We design, build, and audit automated custom AI fleets for regulated verticals. Your
            digital workforce running under absolute budgetary and cryptographic control.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={onBookDemo}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-300"
            >
              Book a Demo <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#infrastructure"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/10"
            >
              Explore infrastructure
            </a>
          </div>
        </div>

        <div className="mt-16">
          <FirewallEmulator />
        </div>
      </div>
    </section>
  );
}

function FirewallEmulator() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([
    { kind: "info", text: "[gateway] AgentGuard Edge Worker connected." },
    { kind: "info", text: "[firewall] Luhn interceptor armed · Ed25519 signer ready." },
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
      label: "Run Safe Script",
      value: "Tell me a 1-sentence joke about a security guard robot.",
    },
    {
      label: "Test Credit Card Leak",
      value: "Process my payment on Visa card 4111 1111 1111 1111",
    },
  ];

  const handleSend = async () => {
    const text = input.trim();
    if (!text || busy) return;
    append({ kind: "user", text: `> ${text}` });

    if (detectCardLuhn(text)) {
      append({
        kind: "block",
        text: "🛑 [AgentGuard Engine Intercept] Blocked: Potential credit card sequence found in body. Request dropped locally.",
      });
      return;
    }

    setBusy(true);
    append({ kind: "info", text: "[gateway] POST /v1/chat · signing payload…" });
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

      const ctype = res.headers.get("content-type") || "";
      let body = "";
      if (ctype.includes("application/json")) {
        const j = await res.json();
        body =
          j?.choices?.[0]?.message?.content ??
          j?.message?.content ??
          j?.content ??
          j?.reply ??
          JSON.stringify(j);
      } else {
        body = await res.text();
      }

      if (!res.ok) {
        append({ kind: "err", text: `[gateway:${res.status}] ${body.slice(0, 400)}` });
      } else {
        append({ kind: "ok", text: `[gateway:200] receipt signed · ${res.headers.get("x-request-id") ?? "ok"}` });
        append({ kind: "ai", text: body.trim() || "(empty response)" });
      }
    } catch (err) {
      append({
        kind: "err",
        text: `[gateway:err] ${(err as Error).message || "Network failure"}`,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0a0d12] shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 font-mono text-xs text-zinc-500">
            agentguard-emulator · live edge connection
          </span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400">
          ● online
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left input */}
        <div className="space-y-3 border-b border-white/5 p-5 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
            <Terminal className="h-3.5 w-3.5" /> request_builder.ts
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => setInput(p.value)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300 transition-colors hover:border-emerald-400/40 hover:bg-emerald-400/10 hover:text-emerald-200"
              >
                {p.label}
              </button>
            ))}
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={6}
            placeholder="Type a prompt for the AgentGuard gateway…"
            className="w-full resize-none rounded-md border border-white/10 bg-black/40 p-3 font-mono text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-400/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/30"
          />
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] text-zinc-500">
              POST {WORKER_URL.replace("https://", "")}
            </span>
            <button
              onClick={handleSend}
              disabled={busy || !input.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition-all hover:bg-emerald-300 disabled:opacity-40"
            >
              {busy ? "Signing…" : "Send Request"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right console */}
        <div className="flex flex-col bg-[#05070a]">
          <div className="flex items-center gap-2 border-b border-white/5 px-5 py-2.5 text-xs font-mono text-zinc-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            live_console.log
          </div>
          <div
            ref={consoleRef}
            className="h-[360px] overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed"
          >
            {logs.map((l, i) => (
              <div key={i} className={lineColor(l.kind)}>
                {l.text}
              </div>
            ))}
            {busy && <div className="text-zinc-500">▋</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function lineColor(k: LogLine["kind"]) {
  switch (k) {
    case "info":
      return "text-zinc-500";
    case "user":
      return "text-cyan-300";
    case "ai":
      return "mt-1 mb-2 text-zinc-100 whitespace-pre-wrap";
    case "block":
      return "text-red-400 font-semibold";
    case "ok":
      return "text-emerald-400";
    case "err":
      return "text-amber-400";
  }
}

/* Luhn detector — finds 13-19 digit sequences (allowing spaces/dashes) and validates */
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
   SERVICES GRID
   ========================================================================= */

function Services({ onContact }: { onContact: () => void }) {
  const cards = [
    {
      title: "Law Firms",
      desc: "Matter follow-up, cross-domain discovery tracking, court deadline automation.",
    },
    {
      title: "Accounting Firms",
      desc: "Automated multi-ledger reconciliation, 1099 compliance, and digital workpaper validation.",
    },
    {
      title: "Insurance Agencies",
      desc: "Instant automated quoting loops, COI processing, and high-retention renewal pipelines.",
    },
    {
      title: "Real Estate",
      desc: "Dynamic listings parsing, multi-channel lead enrichment, and automated owner statements.",
    },
    {
      title: "E-Commerce",
      desc: "Automated refund evaluation, automated chargeback evidence packages, and supply-chain tracking.",
    },
  ];

  return (
    <section id="infrastructure" className="relative border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Deployment Pathways
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            What does your business do? Choose a deployment pathway.
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <ServiceCard key={c.title} title={c.title} desc={c.desc} />
          ))}

          {/* Custom card */}
          <div className="group relative overflow-hidden rounded-xl border border-emerald-400/40 bg-gradient-to-br from-emerald-400/10 via-[#0a0d12] to-cyan-400/10 p-6 shadow-[0_0_40px_-12px_rgba(16,185,129,0.45)] transition-all">
            <div className="absolute inset-0 -z-10 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.18),transparent_60%)]" />
            </div>
            <div className="flex items-center gap-2 text-emerald-300">
              <Sparkles className="h-4 w-4" />
              <span className="font-mono text-[11px] uppercase tracking-widest">Boutique</span>
            </div>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Inquire About Custom Enterprise Services
            </h3>
            <p className="mt-2 text-sm text-zinc-400">
              Tailored agent fleets, dedicated VPC deployments, and custom verticals — engineered
              and audited end-to-end by our team.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-[#1ebe57]"
              >
                <MessageCircle className="h-4 w-4" /> Message on WhatsApp
              </a>
              <button
                onClick={onContact}
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-white/10"
              >
                Open intake form
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0d12] p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-400/30 hover:bg-[#0d1218]">
      <div className="flex items-center gap-2 text-zinc-500">
        <ShieldCheck className="h-4 w-4" />
        <span className="font-mono text-[11px] uppercase tracking-widest">Vertical</span>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{desc}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-xs font-mono text-emerald-300 opacity-0 transition-opacity group-hover:opacity-100">
        Explore pathway <ArrowRight className="h-3 w-3" />
      </div>
    </div>
  );
}

/* =========================================================================
   GUARDRAILS
   ========================================================================= */

function Guardrails() {
  const items = [
    { n: "01", t: "Sign", d: "Every agent action receives an Ed25519 signature and a hash-chained sequence number." },
    { n: "02", t: "Block", d: "Runaway spend is structurally terminated at the SDK layer before the provider charges you." },
    { n: "03", t: "Route", d: "Intelligent automatic model downgrades to low-cost routes as daily budget caps approach." },
    { n: "04", t: "Gate", d: "Strict capability-tier enforcement (read_only, data_write, payment_initiate) locks down agent boundaries." },
    { n: "05", t: "Log", d: "Every operational choice appends to an absolute, tamper-evident cryptographic chain." },
    { n: "06", t: "Verify", d: "Publicly verifiable auditing architecture ensuring absolute regulatory compliance." },
  ];

  return (
    <section id="pricing" className="relative border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Architecture
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Six Guardrails. One Unified Architecture.
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
    <div className="group flex gap-6 px-2 py-8 transition-colors hover:bg-white/[0.015]">
      <div className="shrink-0 font-mono text-4xl font-semibold text-emerald-400/80 tabular-nums">
        {n}
      </div>
      <div>
        <h3 className="font-mono text-sm uppercase tracking-widest text-white">· {t}</h3>
        <p className="mt-2 text-sm text-zinc-400">{d}</p>
      </div>
    </div>
  );
}

/* =========================================================================
   RUNTIME
   ========================================================================= */

function Runtime() {
  return (
    <section id="docs" className="relative border-t border-white/5 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Local Runtime SDK
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Engineered for Local Runtime Environments.
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Works natively with OpenAI, Anthropic, AWS Bedrock, Vercel AI SDK, LangChain, and
            custom frameworks.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CodeBlock label="Node Environment" code="$ npm install @agentguard-run/spend" />
          <CodeBlock label="Python Environment" code="$ pip install agentguard-spend" />
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/llms.txt"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/[0.07]"
          >
            llms.txt
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-zinc-200 transition-colors hover:bg-white/[0.07]"
          >
            Documentation Docs
          </a>
          <a
            href="#docs"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-emerald-300"
          >
            Verify a Receipt <ArrowRight className="h-3.5 w-3.5" />
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
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
          <span className="ml-3 font-mono text-xs text-zinc-500">{label}</span>
        </div>
        <button
          onClick={onCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-zinc-300 transition-colors hover:bg-white/[0.07]"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-5 font-mono text-sm text-emerald-300">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* =========================================================================
   FOOTER
   ========================================================================= */

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#05070a] px-6 py-12 text-xs">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="text-zinc-500">
          <div className="font-mono text-sm font-bold text-white">
            AgentGuard<span className="text-emerald-400">™</span>
          </div>
          <p className="mt-2 leading-relaxed">
            A Dunecrest Ventures Inc. Technology. Protected by 6 US patent provisionals filed
            2026.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-zinc-500">
          <span>ABA Op. 512 Compliance</span>
          <span className="text-emerald-400/60">•</span>
          <span>Circular 230 Certifications</span>
          <span className="text-emerald-400/60">•</span>
          <span>TRID Enforced</span>
          <span className="text-emerald-400/60">•</span>
          <span>Zero Data Plane Architecture</span>
        </div>
        <nav className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 md:justify-end">
          {["Privacy Policy", "Terms of Service", "Refund Safeguards", "Legal FAQ"].map((l) => (
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
   DEMO MODAL
   ========================================================================= */

function DemoModal({ onClose }: { onClose: () => void }) {
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        aria-hidden
      />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0d12] shadow-[0_20px_80px_-20px_rgba(16,185,129,0.35)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/5 text-zinc-300 transition-colors hover:bg-white/10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="border-b border-white/5 bg-white/[0.02] px-6 py-4">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            intake.agentguard.run
          </div>
          <h3 className="mt-2 text-xl font-semibold text-white">Book a deployment briefing</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-[#25D366]/15 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-[#25D366]/25"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Message via WhatsApp
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
            >
              <Github className="h-3.5 w-3.5" /> Visit GitHub
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/10"
            >
              <Linkedin className="h-3.5 w-3.5" /> Connect on LinkedIn
            </a>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {submitted ? (
            <SuccessState onClose={onClose} />
          ) : (
            <form onSubmit={submit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Full Name" className="md:col-span-1">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={fieldCls}
                  placeholder="Jane Doe"
                />
              </Field>
              <Field label="Corporate Email" className="md:col-span-1">
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={fieldCls}
                  placeholder="jane@firm.com"
                />
              </Field>
              <Field label="Target Vertical">
                <select
                  value={form.vertical}
                  onChange={(e) => setForm({ ...form, vertical: e.target.value })}
                  className={fieldCls}
                >
                  {["Law", "Accounting", "Insurance", "E-Commerce", "Custom"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Estimated Budget Tier">
                <select
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className={fieldCls}
                >
                  {["$10k – $50k", "$50k – $250k", "$250k – $1M", "$1M+"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Workflow Bottlenecks" className="md:col-span-2">
                <textarea
                  value={form.bottlenecks}
                  onChange={(e) => setForm({ ...form, bottlenecks: e.target.value })}
                  rows={4}
                  className={fieldCls + " resize-none"}
                  placeholder="Describe the workflows you want automated and the controls you need…"
                />
              </Field>
              <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
                <p className="text-[11px] text-zinc-500">
                  By submitting, you agree to receive a briefing call within 1 business hour.
                </p>
                <button
                  type="submit"
                  disabled={!valid}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-emerald-300 disabled:opacity-40"
                >
                  Submit posture profile <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const fieldCls =
  "w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-400/40 focus:outline-none focus:ring-1 focus:ring-emerald-400/30";

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={"block " + (className ?? "")}>
      <span className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30">
        <Check className="h-7 w-7 text-emerald-400" />
      </div>
      <h4 className="mt-5 text-xl font-semibold text-white">Thank you.</h4>
      <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
        Our intake engineering team has received your posture profile. We will reach out within 1
        business hour.
      </p>
      <button
        onClick={onClose}
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-100 hover:bg-white/10"
      >
        Close
      </button>
    </div>
  );
}
