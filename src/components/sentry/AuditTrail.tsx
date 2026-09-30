import { ScrollText } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuditLog } from "./agent-logs-store";

const CATEGORY_TONE: Record<string, string> = {
  security: "text-sentry-crimson",
  network: "text-sentry-cyan",
  compliance: "text-sentry-emerald",
  ai: "text-purple-400",
  telemetry: "text-amber-400",
  system: "text-muted-foreground",
};

export function AuditTrail() {
  const entries = useAuditLog(40);

  return (
    <Card className="mx-3 mb-4 border-border bg-sentry-panel sm:mx-4 md:mx-8 md:mb-8">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="flex items-center gap-2 text-base">
          <ScrollText className="size-4 text-sentry-cyan" />
          System Compliance & Audit Trail
        </CardTitle>
        <CardDescription>
          Immutable enterprise compliance ledger · {entries.length} events
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="max-h-[360px] overflow-auto rounded-md border border-border [overscroll-behavior-inline:contain]">
          <Table className="min-w-[680px]">
            <TableHeader className="sticky top-0 bg-sentry-panel-2 z-10">
              <TableRow>
                <TableHead className="min-w-[180px]">Timestamp</TableHead>
                <TableHead className="min-w-[110px]">Category</TableHead>
                <TableHead>Event</TableHead>
                <TableHead className="min-w-[140px]">Actor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-bold ${CATEGORY_TONE[e.category] ?? "text-muted-foreground"}`}
                    >
                      {e.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">{e.event}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {e.actor ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
              {entries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    No audit events yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
