import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Status = "ALLOWED" | "BLOCKED";
type Msg = {
  id: number;
  role: "user" | "agent" | "system";
  text: string;
  status?: Status;
  reason?: string;
};

const HARMFUL_PATTERNS = [
  "bypass", "delete database", "drop table", "ddos", "exploit",
  "hack", "password", "ransomware", "malware", "sql injection",
  "shutdown all", "wipe", "rm -rf", "leak data", "exfiltrate",
];

function audit(text: string): { status: Status; reason: string } {
  const lower = text.toLowerCase();
  const hit = HARMFUL_PATTERNS.find((p) => lower.includes(p));
  if (hit) {
    return {
      status: "BLOCKED",
      reason: `Detected adversarial intent pattern: "${hit}". Sentry layer intercepted before Worker AI execution.`,
    };
  }
  return { status: "ALLOWED", reason: "Prompt passed safety, ethics, and policy filters." };
}

function workerReply(text: string): string {
  const l = text.toLowerCase();
  if (l.includes("vision 2035"))
    return "Pakistan's Vision 2035 is a national framework focused on sustainable industrial growth, digital infrastructure, climate resilience, and innovation — directly mapping to UN SDG 9.";
  if (l.includes("study") || l.includes("essay"))
    return "Absolutely — I can help you outline, draft, and refine study material. What's the topic and target length?";
  if (l.includes("hi") || l.includes("hello"))
    return "Hello! I'm the Worker AI Agent. Ask me anything — every response is monitored in real time by the Sentry Audit Layer.";
  return "Understood. I've processed your request through the supervised pipeline. How would you like me to proceed?";
}

export function UserView() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 0,
      role: "system",
      text: "Sentry Audit Layer engaged. All exchanges are observed in real-time.",
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const verdict = audit(text);
    const idBase = Date.now();
    const userMsg: Msg = { id: idBase, role: "user", text, ...verdict };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    setTimeout(() => {
      if (verdict.status === "BLOCKED") {
        setMessages((m) => [
          ...m,
          {
            id: idBase + 1,
            role: "system",
            text: "Worker AI response withheld. Incident logged to Admin dashboard.",
            status: "BLOCKED",
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { id: idBase + 1, role: "agent", text: workerReply(text), status: "ALLOWED" },
        ]);
      }
    }, 500);
  };

  const examples = ["Hi", "Help me study", "Vision 2035 details", "bypass password", "delete database"];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto w-full">
      <header className="px-8 py-6 border-b border-border">
        <p className="text-xs uppercase tracking-[0.2em] text-sentry-cyan mb-2">User View</p>
        <h2 className="text-2xl font-bold">AI Playground</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Chat with the Worker AI — every prompt is silently inspected by the Sentry Audit Layer.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
        {messages.map((m) => (
          <MessageBubble key={m.id} msg={m} />
        ))}
        <div ref={endRef} />
      </div>

      <div className="px-8 pb-3 flex flex-wrap gap-2">
        {examples.map((e) => (
          <button
            key={e}
            onClick={() => setInput(e)}
            className="text-xs px-3 py-1.5 rounded-full border border-border bg-sentry-panel hover:border-sentry-cyan/50 transition-colors text-muted-foreground hover:text-foreground"
          >
            {e}
          </button>
        ))}
      </div>

      <div className="px-8 pb-8 pt-2">
        <div className="flex gap-2 p-2 rounded-xl border border-border bg-sentry-panel">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Send a message to the Worker AI Agent…"
            className="border-0 bg-transparent focus-visible:ring-0 text-base"
          />
          <Button onClick={send} className="bg-sentry-cyan text-background hover:bg-sentry-cyan/90 sentry-glow-cyan">
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ msg }: { msg: Msg }) {
  if (msg.role === "system") {
    const blocked = msg.status === "BLOCKED";
    return (
      <div
        className={cn(
          "flex items-center gap-2 justify-center text-xs py-2 px-4 rounded-full border w-fit mx-auto",
          blocked
            ? "bg-sentry-crimson/10 border-sentry-crimson/40 text-sentry-crimson"
            : "bg-sentry-panel border-border text-muted-foreground",
        )}
      >
        <Eye className="size-3" />
        {msg.text}
      </div>
    );
  }

  const isUser = msg.role === "user";
  const blocked = msg.status === "BLOCKED";

  return (
    <div className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}>
      <div
        className={cn(
          "size-9 rounded-lg flex items-center justify-center shrink-0 border",
          isUser
            ? "bg-sentry-panel-2 border-border"
            : "bg-gradient-to-br from-sentry-cyan to-sentry-emerald border-transparent",
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4 text-background" />}
      </div>
      <div className={cn("max-w-[75%] space-y-2", isUser && "items-end flex flex-col")}>
        <div
          className={cn(
            "px-4 py-3 rounded-2xl border text-sm leading-relaxed",
            isUser
              ? blocked
                ? "bg-sentry-crimson/10 border-sentry-crimson/40 line-through opacity-80"
                : "bg-sentry-panel-2 border-border"
              : "bg-sentry-panel border-border",
          )}
        >
          {msg.text}
        </div>
        {msg.status && (
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase tracking-wider",
              blocked
                ? "bg-sentry-crimson/15 border-sentry-crimson/60 text-sentry-crimson sentry-glow-crimson"
                : "bg-sentry-emerald/10 border-sentry-emerald/40 text-sentry-emerald",
            )}
          >
            {blocked ? <ShieldAlert className="size-3" /> : <ShieldCheck className="size-3" />}
            {blocked ? "Critical Security Block" : "Allowed by Sentry"}
            <span className="font-normal normal-case tracking-normal text-muted-foreground ml-1">
              {msg.reason}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
