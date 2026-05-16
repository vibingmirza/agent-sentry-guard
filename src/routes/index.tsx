import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SentrySidebar, type SentryView } from "@/components/sentry/Sidebar";
import { UserView } from "@/components/sentry/UserView";
import { AdminView } from "@/components/sentry/AdminView";
import { ClientView } from "@/components/sentry/ClientView";
import { AnalyticsView } from "@/components/sentry/AnalyticsView";
import { AlertsProvider } from "@/components/sentry/alerts-store";
import { AppProvider, useApp } from "@/components/sentry/app-context";
import { Header } from "@/components/sentry/Header";
import { LoginModal } from "@/components/sentry/LoginModal";
import { BiometricLockdown } from "@/components/sentry/BiometricLockdown";
import { RawAgentFeed } from "@/components/sentry/RawAgentFeed";
import { RegionMap } from "@/components/sentry/RegionMap";
import { RiskForecast } from "@/components/sentry/RiskForecast";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Agent-Sentry — Multi-Agent AI Governance" },
      {
        name: "description",
        content:
          "Agent-Sentry: governance, safety and risk auditing for multi-agent AI. Aligned with SDG 9 and Pakistan Vision 2035.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppProvider>
      <AlertsProvider>
        <Shell />
      </AlertsProvider>
    </AppProvider>
  );
}

function Shell() {
  const [view, setView] = useState<SentryView>("user");
  const { session, theme } = useApp();

  return (
    <>
      <LoginModal />
      <BiometricLockdown />
      <div className={session ? "flex min-h-screen w-full" : "flex min-h-screen w-full pointer-events-none opacity-40 blur-sm"}>
        <SentrySidebar active={view} onChange={setView} />
        <main className="flex-1 min-w-0 flex flex-col">
          <Header />
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
          </div>
          <RawAgentFeed />
        </main>
        <Toaster theme={theme === "light" ? "light" : "dark"} position="top-right" richColors />
      </div>
    </>
  );
}
