import { useState } from "react";
import { Shield, Fingerprint, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "./app-context";

export function LoginModal() {
  const { session, login, t } = useApp();
  const [guestLoading, setGuestLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const targetUser = username.trim();
    const targetPass = password.trim();

    if (!targetUser || !targetPass) return;
    
    setBusy(true);
    
    setTimeout(() => {
      // SECURE CREDENTIAL CHECK:
      if (targetUser.toLowerCase() === "mirzafaizan" && targetPass === "sovereign_guard_2026") {
        login("Director Mirza Faizan Baig");
      } else {
        setError("ACCESS DENIED: Invalid Director Credentials.");
      }
      setBusy(false);
    }, 900);
  };

  return (
    <Dialog open={!session} onOpenChange={() => undefined}>
      <DialogContent
        className="bg-sentry-panel border-sentry-cyan/40 max-w-md sentry-glow-cyan [&>button.absolute]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-center mb-2">
          <div className="size-14 rounded-xl bg-gradient-to-br from-sentry-cyan to-sentry-emerald flex items-center justify-center sentry-glow-cyan">
            <Shield className="size-7 text-background" strokeWidth={2.5} />
          </div>
        </div>
        <DialogTitle className="text-center text-xl font-bold">{t.login}</DialogTitle>
        <DialogDescription className="text-center text-muted-foreground text-xs">
          {t.enterCredentials}
        </DialogDescription>

        <form onSubmit={submit} className="mt-4 space-y-3">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 animate-pulse">
              <AlertTriangle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.username}</label>
            <Input
              placeholder="Enter Director Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-sentry-panel-2 border-border h-11"
              autoFocus
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.password}</label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-sentry-panel-2 border-border h-11"
            />
          </div>
          <Button
            type="submit"
            disabled={busy}
            className="w-full h-12 bg-sentry-cyan text-background hover:bg-sentry-cyan/90 sentry-glow-cyan font-bold uppercase tracking-wider"
          >
            {busy ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Fingerprint className="size-4 mr-2" />
            )}
            {t.loginCta}
          </Button>
          <p className="text-[10px] text-center text-muted-foreground">
            Authorized for Director {t.directorName}, {t.director}.
          </p>
        </form>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-sentry-panel px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={() => {
            setGuestLoading(true);
            setTimeout(() => {
              login("Guest Executive");
              setGuestLoading(false);
            }, 400);
          }}
          disabled={guestLoading}
          className="w-full h-12 bg-gradient-to-r from-sentry-emerald to-sentry-cyan text-background hover:opacity-90 sentry-glow-emerald font-bold uppercase tracking-wider"
        >
          {guestLoading ? (
            <Loader2 className="size-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="size-4 mr-2" />
          )}
          Explore Guest Demo
        </Button>
        <p className="text-[10px] text-center text-muted-foreground">
          Instant access · realistic seeded data · no account required
        </p>
      </DialogContent>
    </Dialog>
  );
}
