import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AgentLog = {
  id: string;
  agent_name: string;
  status: "Active" | "Idle" | "Breached";
  location: string;
  tokens_used: number;
  created_at: string;
};

export function useAgentLogs(limit = 200) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("agent_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (data) setLogs(data as AgentLog[]);
    setLoading(false);
  }, [limit]);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("agent_logs_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "agent_logs" },
        (payload) => {
          setLogs((prev) => [payload.new as AgentLog, ...prev].slice(0, limit));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh, limit]);

  return { logs, loading, refresh };
}

export type AuditEntry = {
  id: string;
  event: string;
  category: string;
  actor: string | null;
  created_at: string;
};

export function useAuditLog(limit = 50) {
  const [entries, setEntries] = useState<AuditEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        if (mounted && data) setEntries(data as AuditEntry[]);
      });
    const channel = supabase
      .channel("audit_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_log" },
        (payload) => {
          setEntries((prev) => [payload.new as AuditEntry, ...prev].slice(0, limit));
        },
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [limit]);

  return entries;
}

export function useSystemLock() {
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("system_config")
      .select("is_system_locked")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (mounted && data) setLocked(data.is_system_locked);
      });
    const channel = supabase
      .channel("lock_live")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "system_config" },
        (payload) => {
          setLocked((payload.new as { is_system_locked: boolean }).is_system_locked);
        },
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return locked;
}
