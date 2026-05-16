import { useState } from "react";
import { Shield, Fingerprint, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "./app-context";

export function LoginModal() {
  const { session, login, t } = useApp();
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
      </DialogContent>
    </Dialog>
  );
}
