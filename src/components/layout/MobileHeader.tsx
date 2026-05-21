import { Bell, Menu, Search, X, ChevronRight, MessageCircle, Heart, LayoutDashboard, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ContactPopup } from "@/components/ui/ContactPopup";
import { supabase } from "@/integrations/supabase/client";
import ysLogo from "@/assets/youth-soul-logo.png";

const HEADER_HEIGHT = 56;

const menuItems = [
  { label: "Explore", section: "", href: "/explore" },
  { label: "Weight Loss", section: "", href: "/weightloss-glp-intake" },
  { label: "Women's Health", section: "menopause-section" },
  { label: "Sexual Health", section: "sexual-health-section" },
  { label: "Mental Health", section: "mental-health-section" },
  { label: "Hair Regrowth", section: "hair-loss-section" },
  { label: "Brain & Cognitive", section: "brain-section" },
  { label: "Anti-Aging & Skincare", section: "skin-section" },
  // Peptides hidden
  { label: "Our Doctors", section: "expert-section" },
  { label: "Testimonials", section: "testimonials-section" },
  { label: "Learn", section: "", href: "/learn" },
];

export function MobileHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [userInitial, setUserInitial] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const setFromSession = (session: any) => {
      if (session?.user) {
        const name =
          (session.user.user_metadata?.full_name as string) ||
          (session.user.email as string) ||
          "U";
        setUserInitial(name.charAt(0).toUpperCase());
      } else {
        setUserInitial(null);
      }
    };
    supabase.auth.getSession().then(({ data: { session } }) => setFromSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) =>
      setFromSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/");
  };
  const scrollToSection = (sectionId: string) => {
    const scrollToElement = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - HEADER_HEIGHT;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      }
    };
    
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(scrollToElement, 300);
    } else {
      scrollToElement();
    }
    setMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-charcoal backdrop-blur-md border-b border-border/20 safe-top">
        <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
          {/* Logo */}
          <a href="/" className="flex items-center shrink-0" aria-label="Youth & Soul home">
            <img
              src={ysLogo}
              alt="Youth & Soul"
              className="h-7 md:h-9 w-auto object-contain"
            />
          </a>

          {/* Right side: dashboard pill (when logged in) + burger */}
          <div className="flex items-center gap-2">
            {userInitial && (
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 pl-1 pr-2.5 py-1 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                aria-label="Open dashboard"
              >
                <span className="w-7 h-7 rounded-full bg-accent text-charcoal flex items-center justify-center text-xs font-bold">
                  {userInitial}
                </span>
                <span className="text-xs font-medium text-cream hidden sm:inline">Dashboard</span>
              </button>
            )}
            <button
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-cream/10 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-cream" />
            </button>
          </div>
        </div>
      </header>

      {/* Side slide-out menu */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />

          {/* Side panel */}
          <div className="fixed top-0 right-0 bottom-0 z-50 w-[88%] max-w-[400px] bg-cream shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header — editorial brand block */}
            <div className="relative px-6 pt-7 pb-6 bg-charcoal text-cream">
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-cream/10 hover:bg-cream/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span style={{ fontFamily: "Fraunces, Georgia, serif" }} className="block text-3xl font-light tracking-tight leading-none">
                Youth<span className="text-accent">&</span>Soul
              </span>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-cream/60">
                Cinematic luxury telehealth
              </p>
            </div>

            {/* Account row */}
            <div className="px-6 pt-5">
              {userInitial ? (
                <button
                  onClick={() => { setMenuOpen(false); navigate("/dashboard"); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors text-left group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
                      {userInitial}
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">My Dashboard</span>
                      <span className="text-[11px] text-muted-foreground">Account & orders</span>
                    </span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <button
                  onClick={() => { setMenuOpen(false); navigate("/auth"); }}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-primary/5 hover:bg-primary/10 transition-colors text-left group"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                      <LayoutDashboard className="w-5 h-5" />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">Sign in</span>
                      <span className="text-[11px] text-muted-foreground">Create your free account</span>
                    </span>
                  </span>
                  <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto px-6 pt-6 pb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 mb-2 pl-1">Explore</p>
              <ul className="space-y-0.5">
                {menuItems.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => {
                        if ((item as any).href) {
                          setMenuOpen(false);
                          navigate((item as any).href);
                        } else if (item.section) {
                          scrollToSection(item.section);
                        }
                      }}
                      className="w-full flex items-center justify-between py-3 px-2 rounded-xl text-left hover:bg-primary/5 transition-colors group"
                    >
                      <span style={{ fontFamily: "Fraunces, Georgia, serif" }} className="text-[17px] font-normal text-foreground group-hover:text-primary transition-colors">
                        {item.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>

              {userInitial && (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 mt-4 py-3 px-2 rounded-xl text-left hover:bg-destructive/5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Sign out</span>
                </button>
              )}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border/60 bg-cream/60 grid grid-cols-3 gap-2">
              <button
                onClick={() => { setMenuOpen(false); setContactOpen(true); }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/5 transition-colors text-center"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-medium text-foreground leading-tight">Support</span>
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/earn-affiliate"); }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/5 transition-colors text-center"
              >
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-medium text-foreground leading-tight">Affiliate</span>
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/apply-influencer"); }}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-primary/5 transition-colors text-center"
              >
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-medium text-foreground leading-tight">Influencer</span>
              </button>
            </div>
          </div>
        </>
      )}

      <ContactPopup open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
