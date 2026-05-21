import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-api-key",
};

const schema = z.object({
  agent_name: z.string().min(1).max(120),
  status: z.enum(["Active", "Idle", "Breached"]),
  location: z.string().min(1).max(80),
  tokens_used: z.number().int().min(0).max(10_000_000),
});

export const Route = createFileRoute("/api/public/logs")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response(JSON.stringify({ error: "Invalid JSON" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        const parsed = schema.safeParse(body);
        if (!parsed.success) {
          return new Response(
            JSON.stringify({ error: "Validation failed", issues: parsed.error.issues }),
            { status: 400, headers: { "Content-Type": "application/json", ...cors } },
          );
        }
        const { data, error } = await supabaseAdmin
          .from("agent_logs")
          .insert(parsed.data)
          .select()
          .single();
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        // Best-effort audit entry
        await supabaseAdmin.from("audit_log").insert({
          event: `Telemetry ingested: ${parsed.data.agent_name} (${parsed.data.status})`,
          category: "telemetry",
          actor: parsed.data.location,
        });
        return new Response(JSON.stringify({ success: true, log: data }), {
          status: 201,
          headers: { "Content-Type": "application/json", ...cors },
        });
      },
    },
  },
});
