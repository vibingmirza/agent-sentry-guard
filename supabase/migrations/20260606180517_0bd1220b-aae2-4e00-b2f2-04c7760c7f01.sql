
-- Remove public read policies and restrict to authenticated users
DROP POLICY IF EXISTS "public read agent_logs" ON public.agent_logs;
DROP POLICY IF EXISTS "public read audit_log" ON public.audit_log;
DROP POLICY IF EXISTS "public read system_config" ON public.system_config;

CREATE POLICY "authenticated read agent_logs" ON public.agent_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated read audit_log" ON public.audit_log
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "authenticated read system_config" ON public.system_config
  FOR SELECT TO authenticated USING (true);

-- Revoke anon SELECT, keep authenticated
REVOKE SELECT ON public.agent_logs FROM anon;
REVOKE SELECT ON public.audit_log FROM anon;
REVOKE SELECT ON public.system_config FROM anon;

GRANT SELECT ON public.agent_logs TO authenticated;
GRANT SELECT ON public.audit_log TO authenticated;
GRANT SELECT ON public.system_config TO authenticated;

-- Realtime channel authorization: require authenticated to subscribe
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "authenticated can subscribe to ops channels" ON realtime.messages;
CREATE POLICY "authenticated can subscribe to ops channels"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (true);
