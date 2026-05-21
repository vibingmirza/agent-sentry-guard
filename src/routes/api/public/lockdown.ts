import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const schema = z.object({ locked: z.boolean(), actor: z.string().max(120).optional() });

export const Route = createFileRoute("/api/public/lockdown")({
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
          return new Response(JSON.stringify({ error: "Validation failed" }), {
            status: 400,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        const { error } = await supabaseAdmin
          .from("system_config")
          .update({ is_system_locked: parsed.data.locked, updated_at: new Date().toISOString() })
          .eq("id", 1);
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        await supabaseAdmin.from("audit_log").insert({
          event: parsed.data.locked
            ? "BIOMETRIC LOCKDOWN ENGAGED — Outbound AI traffic intercepted"
            : "Lockdown disengaged — System restored to OPERATIONAL",
          category: "security",
          actor: parsed.data.actor ?? "operator",
        });
        return new Response(JSON.stringify({ success: true, locked: parsed.data.locked }), {
          status: 200,
          headers: { "Content-Type": "application/json", ...cors },
        });
      },
    },
  },
});
