import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SentrySidebar, type SentryView } from "@/components/sentry/Sidebar";
import { UserView } from "@/components/sentry/UserView";
import { AdminView } from "@/components/sentry/AdminView";
import { ClientView } from "@/components/sentry/ClientView";
import { AnalyticsView } from "@/components/sentry/AnalyticsView";
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
  const [view, setView] = useState<SentryView>("user");

  return (
    <div className="flex min-h-screen w-full">
      <SentrySidebar active={view} onChange={setView} />
      <main className="flex-1 min-w-0 flex flex-col">
        {view === "user" && <UserView />}
        {view === "admin" && <AdminView />}
        {view === "client" && <ClientView />}
      </main>
      <Toaster theme="dark" position="top-right" richColors />
    </div>
  );
}
