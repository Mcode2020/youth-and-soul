import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Stethoscope } from "lucide-react";

/**
 * Persistent mobile-only call-to-action that floats just above the BottomNav.
 * Hides on intake/checkout routes to avoid conflict, and only shows after the
 * user has scrolled past the hero (so it doesn't compete with the headline).
 */
export function StickyEnrollCTA() {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  const hiddenRoutes = ["/glp-weightloss", "/weightloss-glp-intake", "/checkout", "/enroll", "/auth"];
  const isHidden = hiddenRoutes.some((r) => location.pathname.startsWith(r));

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight - 200;
      setShow(y > 500 && y < max);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`md:hidden fixed left-0 right-0 z-40 px-3 pointer-events-none transition-all duration-300 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom, 0px))" }}
      aria-hidden={!show}
    >
      <button
        onClick={() => navigate("/weightloss-glp-intake")}
        className="pointer-events-auto w-full bg-primary text-primary-foreground rounded-2xl shadow-elevated flex items-center justify-between gap-3 px-4 py-3 active:scale-[0.98] transition-transform"
      >
        <span className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <Stethoscope className="w-4 h-4" />
          </span>
          <span className="text-left">
            <span className="block text-[11px] uppercase tracking-wide opacity-80 leading-none">Free consult</span>
            <span className="block text-sm font-bold leading-tight">Start — From $125/mo</span>
          </span>
        </span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
}
