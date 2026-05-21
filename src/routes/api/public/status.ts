import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const Route = createFileRoute("/api/public/status")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: cors }),
      GET: async () => {
        const { data, error } = await supabaseAdmin
          .from("system_config")
          .select("is_system_locked, updated_at")
          .eq("id", 1)
          .single();
        if (error) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json", ...cors },
          });
        }
        return new Response(
          JSON.stringify({
            is_system_locked: data.is_system_locked,
            updated_at: data.updated_at,
            state: data.is_system_locked ? "AIR_GAPPED" : "OPERATIONAL",
          }),
          { status: 200, headers: { "Content-Type": "application/json", ...cors } },
        );
      },
    },
  },
});
