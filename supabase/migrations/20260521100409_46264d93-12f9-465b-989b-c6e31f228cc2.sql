
-- agent_logs: real telemetry from agents
CREATE TABLE public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Active','Idle','Breached')),
  location TEXT NOT NULL,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_agent_logs_created_at ON public.agent_logs(created_at DESC);

-- system_config: global state (lockdown switch)
CREATE TABLE public.system_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  is_system_locked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
INSERT INTO public.system_config (id, is_system_locked) VALUES (1, false);

-- audit_log: compliance ledger
CREATE TABLE public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'system',
  actor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at DESC);

-- RLS: demo platform — public read; writes via service role (server routes) only
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read agent_logs" ON public.agent_logs FOR SELECT USING (true);
CREATE POLICY "public read system_config" ON public.system_config FOR SELECT USING (true);
CREATE POLICY "public read audit_log" ON public.audit_log FOR SELECT USING (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_config;
ALTER PUBLICATION supabase_realtime ADD TABLE public.audit_log;
