import { useEffect, useState } from "react";
import { CheckCircle2, X } from "lucide-react";

const activities = [
  { name: "Sarah", state: "TX", action: "started Weight Loss", min: 2 },
  { name: "Michael", state: "CA", action: "got approved for HRT", min: 4 },
  { name: "Jennifer", state: "FL", action: "started Menopause care", min: 7 },
  { name: "David", state: "NY", action: "renewed his Sexual Health plan", min: 11 },
  { name: "Emma", state: "CO", action: "started Hair & Skin", min: 14 },
  { name: "Carlos", state: "AZ", action: "got approved for Weight Loss", min: 19 },
  { name: "Priya", state: "WA", action: "started Longevity", min: 23 },
  { name: "Olivia", state: "GA", action: "began Sleep program", min: 27 },
];

export function LiveActivityToast() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // First show after 6s
    const initial = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(initial);
  }, [dismissed]);

  useEffect(() => {
    if (!visible || dismissed) return;
    // Cycle every 8s
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % activities.length);
        setVisible(true);
      }, 600);
    }, 8000);
    return () => clearInterval(cycle);
  }, [visible, dismissed]);

  if (dismissed) return null;
  const a = activities[index];

  return (
    <div
      className={`fixed left-3 z-30 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
      style={{ bottom: "calc(140px + env(safe-area-inset-bottom, 0px))" }}
      role="status"
      aria-live="polite"
    >
      <div className="bg-card/95 backdrop-blur-md border border-border shadow-elevated rounded-2xl px-3 py-2.5 flex items-center gap-2.5 max-w-[260px] md:max-w-xs">
        <div className="relative shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 ring-2 ring-card animate-pulse" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] md:text-xs font-semibold text-foreground leading-tight truncate">
            {a.name} from {a.state}
          </p>
          <p className="text-[10px] md:text-[11px] text-muted-foreground leading-tight truncate">
            {a.action} · {a.min}m ago
          </p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 text-muted-foreground/60 hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
