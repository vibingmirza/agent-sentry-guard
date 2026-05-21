import { useState } from "react";
import { Shield, Fingerprint, Loader2, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "./app-context";

export function LoginModal() {
  const { session, login, t } = useApp();
  const [guestLoading, setGuestLoading] = useState(false);
  const [username, setUsername] = useState("Mirza Faizan Baig");
  const [password, setPassword] = useState("••••••••••");
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    setBusy(true);
    setTimeout(() => {
      login(username.trim());
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
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.username}</label>
            <Input
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
