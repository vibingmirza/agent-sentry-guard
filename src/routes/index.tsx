import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SentrySidebar, type SentryView } from "@/components/sentry/Sidebar";
import { UserView } from "@/components/sentry/UserView";
import { AdminView } from "@/components/sentry/AdminView";
import { ClientView } from "@/components/sentry/ClientView";
import { AnalyticsView } from "@/components/sentry/AnalyticsView";
import { WarRoom } from "@/components/sentry/WarRoom";
import { FederationGrid } from "@/components/sentry/FederationGrid";
import { DeveloperView } from "@/components/sentry/DeveloperView";
import { AuditTrail } from "@/components/sentry/AuditTrail";
import { WorkspaceBar } from "@/components/sentry/WorkspaceBar";
import { AlertsProvider } from "@/components/sentry/alerts-store";
import { AppProvider, useApp } from "@/components/sentry/app-context";
import { DevProvider } from "@/components/sentry/dev-store";
import { Header } from "@/components/sentry/Header";
import { LoginModal } from "@/components/sentry/LoginModal";
import { BiometricLockdown } from "@/components/sentry/BiometricLockdown";
import { RawAgentFeed } from "@/components/sentry/RawAgentFeed";
import { RegionMap } from "@/components/sentry/RegionMap";
import { RiskForecast } from "@/components/sentry/RiskForecast";
import { Toaster } from "@/components/ui/sonner";
import { ArrowRight, Sparkles, Layers, DollarSign, Lock } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AgentSentryGuard™ — Multi-Agent AI Governance & Control" },
      {
        name: "description",
        content:
          "Agent-Sentry provides cryptographic security gates, programmatic cost guardrails, and real-time data compliance tools for autonomous AI agent workflows.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppProvider>
      <DevProvider>
        <AlertsProvider>
          <ShellRouter />
        </AlertsProvider>
      </DevProvider>
    </AppProvider>
  );
}

function ShellRouter() {
  const [showLanding, setShowLanding] = useState(true);
  const [view, setView] = useState<SentryView>("user");
  const { session, theme } = useApp();

  // Handle direct navigation shortcuts from the landing actions
  const handleLaunchApp = (targetView: SentryView) => {
    setView(targetView);
    setShowLanding(false);
  };

  // If landing mode is enabled, display the gorgeous marketing layer
  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#07090c] text-zinc-100 font-sans antialiased relative overflow-x-hidden selection:bg-emerald-500/30 selection:text-emerald-100">
        {/* Background Decorative Mesh Lines */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.06), transparent 40%), linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px)",
            backgroundSize: "auto, 40px 40px",
          }}
        />

        {/* Minimal Landing Navbar */}
        <header className="relative z-10 border-b border-white/5 bg-[#07090c]/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <span className="font-mono text-base font-bold text-white tracking-tight">
              AgentSentryGuard<span className="text-emerald-400">™</span>
            </span>
            <button
              onClick={() => handleLaunchApp("user")}
              className="group inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-xs font-mono font-bold text-black shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all hover:bg-emerald-300"
            >
              Access Engine Console
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="relative z-10 mx-auto max-w-4xl px-6 pt-20 pb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-[10px] font-mono text-emerald-300 tracking-wider">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            CRYPTOGRAPHIC OPERATIONAL CONTROL READY
          </div>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            Complete Governance Control Over Your{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              AI Workforce.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-sm sm:text-base text-zinc-400 leading-relaxed">
            Uncontrolled AI workflows risk financial loops, security parameter drops, or target vector data leaks. 
            <strong> AgentSentryGuard™</strong> sits directly at the edge—enforcing strict programmatic spending guardrails, tracking structural payloads, and maintaining cryptographically immutable compliance chains.
          </p>

          {/* Action Trigger Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => handleLaunchApp("admin")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-emerald-300 shadow-xl shadow-emerald-400/10"
            >
              Open Administrative View <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleLaunchApp("warroom")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              Enter Threat War Room Terminal
            </button>
          </div>

          {/* Core Feature Value Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 gap-6 text-left sm:grid-cols-3 border-t border-white/5 pt-12">
            <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <DollarSign className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">Hard Token Budget Caps</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">Enforce strict spending execution limits at task level to fully negate compounding prompt loop runaway expenses.</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                <Lock className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">Data Plane Interception</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">Programmatic string processing scans outbounds to completely clean out sensitive credit sequences or custom PII parameters.</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.01] p-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-400/10 text-emerald-400">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-white">Cryptographic Audit Logs</h3>
              <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">Hash-chain verification signatures provide security officers with mathematically sound audit tracking across global execution paths.</p>
            </div>
          </div>
        </main>

        <footer className="absolute bottom-0 w-full py-6 text-center text-[10px] font-mono text-zinc-600 border-t border-white/5 bg-black/20">
          © 2026 AgentSentryGuard™ Core Infrastructure. Aligned with SDG 9 Frameworks.
        </footer>
      </div>
    );
  }

  // =========================================================================
  // YOUR IMMUTABLE COMPLETE ORIGINAL APPLICATION PLATFORM INFRASTRUCTURE
  // =========================================================================
  return (
    <>
      <LoginModal />
      <BiometricLockdown />
      <div className={session ? "flex min-h-screen w-full relative" : "flex min-h-screen w-full pointer-events-none opacity-40 blur-sm relative"}>
        
        {/* Quick escape route anchor back to Landing page if needed */}
        <button 
          onClick={() => setShowLanding(true)}
          className="absolute bottom-4 left-4 z-50 inline-flex items-center gap-1.5 rounded bg-zinc-900 border border-white/10 px-2.5 py-1 text-[10px] font-mono text-zinc-400 hover:text-white hover:border-emerald-400/40 transition-colors shadow-xl"
        >
          &larr; Exit Console Mode
        </button>

        <SentrySidebar active={view} onChange={setView} />
        <main className="flex-1 min-w-0 flex flex-col">
          <Header />
          <WorkspaceBar />
          <div className="flex-1 min-w-0 flex flex-col">
            {view === "user" && <UserView />}
            {view === "admin" && (
              <div className="space-y-6">
                <div className="px-8 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RegionMap />
                  <RiskForecast />
                </div>
                <AdminView />
              </div>
            )}
            {view === "client" && <ClientView />}
            {view === "analytics" && (
              <div className="space-y-6">
                <div className="px-8 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <RegionMap />
                  <RiskForecast />
                </div>
                <AnalyticsView />
              </div>
            )}
            {view === "warroom" && <WarRoom />}
            {view === "federation" && <FederationGrid />}
            {view === "developer" && <DeveloperView />}
            <AuditTrail />
          </div>
          <RawAgentFeed />
        </main>
        <Toaster theme={theme === "light" ? "light" : "dark"} position="top-right" richColors />
      </div>
    </>
  );
}
