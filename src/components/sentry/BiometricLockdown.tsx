import { Fingerprint, ShieldAlert, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "./app-context";

export function BiometricLockdown() {
  const { scanning, lockdown, releaseLockdown, t } = useApp();
  if (!scanning && !lockdown) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-background/70">
      {scanning && (
        <div className="text-center space-y-6">
          <div className="relative size-40 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-sentry-cyan/30" />
            <div className="absolute inset-0 rounded-full border-t-2 border-sentry-cyan animate-spin" />
            <Fingerprint className="absolute inset-0 m-auto size-20 text-sentry-cyan animate-pulse" />
            <div
              className="absolute left-0 right-0 h-0.5 bg-sentry-cyan/70"
              style={{ animation: "scanline 2s ease-in-out forwards", boxShadow: "0 0 12px oklch(0.82 0.18 200)" }}
            />
          </div>
          <div className="text-sentry-cyan font-mono text-sm tracking-wider uppercase">{t.scanning}</div>
        </div>
      )}
      {lockdown && (
        <div className="absolute inset-0 flex flex-col items-center justify-center red-alert-pulse">
          <ShieldAlert className="size-24 text-sentry-crimson mb-4" style={{ filter: "drop-shadow(0 0 20px currentColor)" }} />
          <div className="text-3xl md:text-5xl font-black tracking-widest text-sentry-crimson mb-2 text-center">
            {t.locked}
          </div>
          <div className="text-xs uppercase tracking-[0.3em] text-sentry-crimson/80 mb-8">
            Director auth required to disengage
          </div>
          <Button
            onClick={releaseLockdown}
            className="bg-sentry-crimson text-background hover:bg-sentry-crimson/90 sentry-glow-crimson font-bold uppercase tracking-wider h-12 px-6"
          >
            <Unlock className="size-4 mr-2" />
            {t.unlock}
          </Button>
        </div>
      )}
    </div>
  );
}
