import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import {
  Heart, Crown, ChevronRight, Settings, LogOut, Trash2, Eye, Stethoscope,
  CheckCircle, Clock, XCircle, ArrowRight, ExternalLink, Truck, Package, CreditCard,
} from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useSavedProducts } from "@/hooks/useSavedProducts";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useSEOHead } from "@/hooks/useSEOHead";
import { getStripePriceIdForTier } from "@/lib/priceMappings";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";

interface HealthPlan {
  source: "subscription" | "enrollment";
  id: string;
  programName: string;
  status: string;
  tierName?: string;
  monthlyPrice?: number;
  startedAt: string;
  currentPeriodEnd?: string | null;
  programSlug?: string;
  priceId?: string | null;
  paid: boolean;
  email?: string;
}

const PROGRAM_NAME_MAP: Record<string, string> = {
  "weight-loss": "GLP-1 Weight Loss",
  "menopause-hrt": "Menopause & HRT",
  "sexual-health": "Libido & Sexual Health",
  "skin-hair": "Skin, Hair & Anti-Aging",
  "longevity": "Longevity & Vitality",
  "pain-recovery": "Pain & Recovery",
  "brain-cognitive": "Brain & Cognitive Performance",
  "gut-health": "Gut Health & Digestion",
  "mental-health": "Mental Health & Therapy",
};

const statusBadge = (status: string) => {
  const s = status.toLowerCase();
  if (["active", "trialing", "paid", "approved"].includes(s))
    return { cls: "text-green-700 bg-green-50", Icon: CheckCircle, label: "Active" };
  if (["pending", "pending_mdi_setup", "submitted_to_mdi", "incomplete", "shipped", "upcoming"].includes(s))
    return { cls: "text-blue-700 bg-blue-50", Icon: Clock, label: s.includes("mdi") ? "Doctor review" : status };
  if (["canceled", "cancelled", "denied"].includes(s))
    return { cls: "text-red-700 bg-red-50", Icon: XCircle, label: status };
  return { cls: "text-muted-foreground bg-secondary", Icon: Clock, label: status };
};

const planTimeline = [
  "Doctor review in progress",
  "Prescription pending approval",
  "Delivery updates will appear here",
];

const paidStatuses = ["active", "trialing", "paid", "approved", "submitted_to_mdi", "shipped"];

const vipPlans = [
  { id: "vip_monthly" as const, name: "Monthly", price: "$19.99/mo", savings: "Flexible monthly access" },
  { id: "vip_annual" as const, name: "Annual", price: "$149.99/yr", savings: "Save $90 per year" },
];

const addDays = (date: string, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatDate = (date: Date) => date.toLocaleDateString(undefined, { month: "short", day: "numeric" });

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  useSEOHead({
    title: "My Dashboard",
    description: "Manage your Youth & Soul health programs, view recently viewed products, and access your saved items.",
    path: "/dashboard",
    noIndex: true,
  });
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const initialTab = searchParams.get("tab") === "vip" ? "vip" : "plans";
  const [activeTab, setActiveTab] = useState<"plans" | "recent" | "saved" | "vip">(initialTab);
  const [selectedVipPlan, setSelectedVipPlan] = useState<"vip_monthly" | "vip_annual">("vip_annual");
  const [showVipCheckout, setShowVipCheckout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [healthPlans, setHealthPlans] = useState<HealthPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [activeVipSubscription, setActiveVipSubscription] = useState<any>(null);

  const { savedProducts, toggleSave, loading: savedLoading } = useSavedProducts();
  const { items: recentItems, loading: recentLoading } = useRecentlyViewed();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        fetchProfile(session.user.id);
        fetchHealthPlans(session.user.id, session.user.email || "");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
      setProfile(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const fetchHealthPlans = async (userId: string, userEmail: string) => {
    try {
      if (userEmail) {
        await (supabase as any).rpc("link_enrollments_to_user", { _user_id: userId, _email: userEmail });
      }

      // Stripe-backed subscriptions
      const { data: subs } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);

      const enrollmentQueries = [
        (supabase.from("enrollments") as any).select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      ];
      if (userEmail) {
        enrollmentQueries.push(
          (supabase.from("enrollments") as any).select("*").eq("email", userEmail).order("created_at", { ascending: false })
        );
      }
      const enrollmentResults = await Promise.all(enrollmentQueries);
      const enrollmentMap = new Map<string, any>();
      enrollmentResults.forEach(({ data }) => (data || []).forEach((item: any) => enrollmentMap.set(item.id, item)));
      const enrolls = Array.from(enrollmentMap.values());

      const vipSub = (subs || []).find((s: any) =>
        ["vip_monthly", "vip_annual"].includes(s.price_id) &&
        paidStatuses.includes(String(s.status).toLowerCase()) &&
        (!s.current_period_end || new Date(s.current_period_end) > new Date())
      );
      setActiveVipSubscription(vipSub || null);

      const fromSubs: HealthPlan[] = (subs || [])
        .filter((s: any) => !["vip_monthly", "vip_annual"].includes(s.price_id))
        .map((s: any) => ({
        source: "subscription",
        id: s.id,
        programName: PROGRAM_NAME_MAP[s.product_id] || s.product_id || "Health Program",
        status: s.status,
        startedAt: s.created_at || s.current_period_start || new Date().toISOString(),
        currentPeriodEnd: s.current_period_end,
        programSlug: s.product_id,
        priceId: s.price_id,
        paid: paidStatuses.includes(String(s.status).toLowerCase()),
      }));

      const fromEnrolls: HealthPlan[] = (enrolls || []).map((e: any) => ({
        source: "enrollment",
        id: e.id,
        programName: PROGRAM_NAME_MAP[e.program_slug] || e.tier_label || "Health Program",
        status: e.status,
        tierName: e.tier_label,
        monthlyPrice: e.monthly_price,
        startedAt: e.created_at,
        programSlug: e.program_slug,
        priceId: getStripePriceIdForTier(e.program_slug, e.tier_label),
        paid: paidStatuses.includes(String(e.status).toLowerCase()),
        email: e.email,
      }));

      setHealthPlans([...fromSubs, ...fromEnrolls]);
    } catch (e) {
      console.error("fetch plans", e);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleSettings = () => {
    navigate("/auth");
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setShowVipCheckout(false);
    setSearchParams(tab === "plans" ? {} : { tab });
  };

  const handlePayNow = (plan: HealthPlan) => {
    if (!plan.programSlug || !plan.tierName) return;
    const params = new URLSearchParams({ program: plan.programSlug, tier: plan.tierName });
    if (plan.email || user?.email) params.set("email", plan.email || user?.email || "");
    navigate(`/checkout?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const tabs = [
    { id: "plans" as const, label: "Health Plans", icon: Stethoscope },
    { id: "recent" as const, label: "Recently Viewed", icon: Eye },
    { id: "saved" as const, label: "Saved", icon: Heart },
    { id: "vip" as const, label: "VIP Status", icon: Crown },
  ];
  const isVipActive = Boolean(profile?.is_vip || activeVipSubscription);
  const vipExpiresAt = profile?.vip_expires_at || activeVipSubscription?.current_period_end;

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Dashboard" }]} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
          <img
            src="/images/banner-youth-soul-dashboard.png"
            alt="Youth & Soul — Telehealth for a Better You"
            className="block h-auto w-full"
          />
        </div>

        {/* User Header */}
        <div className="bg-card rounded-2xl border border-border/50 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}!
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                {isVipActive && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-gradient-to-r from-accent to-gold text-foreground text-xs font-medium rounded-full">
                    <Crown className="w-3 h-3" />
                    VIP Member
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSettings}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Account settings"
                title="Account settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {/* HEALTH PLANS */}
          {activeTab === "plans" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Your Health Plans</h2>
                <button
                  onClick={() => navigate("/")}
                  className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  Browse Programs <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 text-sm text-muted-foreground">
                <p className="font-semibold text-foreground mb-2">Your dashboard tracks your care from review to delivery.</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {planTimeline.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {plansLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading your health plans…</div>
              ) : healthPlans.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
                  <Stethoscope className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No health plans yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Enroll in a doctor-supervised program — Weight Loss, Menopause, Skin & Hair, and more.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Explore Programs <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                healthPlans.map((plan) => {
                  const b = statusBadge(plan.status);
                  const shipDate = formatDate(addDays(plan.startedAt, plan.paid ? 1 : 2));
                  const deliveryDate = formatDate(addDays(plan.startedAt, plan.paid ? 2 : 4));
                  return (
                    <div
                      key={`${plan.source}-${plan.id}`}
                      className="bg-card rounded-xl border border-border/50 p-4 hover:shadow-soft transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Stethoscope className="w-5 h-5 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">{plan.programName}</p>
                            {plan.tierName && (
                              <p className="text-xs text-muted-foreground truncate">{plan.tierName}</p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              Started {new Date(plan.startedAt).toLocaleDateString()}
                              {plan.currentPeriodEnd &&
                                ` · Renews ${new Date(plan.currentPeriodEnd).toLocaleDateString()}`}
                            </p>
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${b.cls}`}>
                          <b.Icon className="w-3 h-3" />
                          {b.label}
                        </span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2 mb-3 rounded-xl bg-secondary/40 p-3 text-xs">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Truck className="w-4 h-4 text-primary" />
                          <span>Next shipping date: <strong className="text-foreground">{shipDate}</strong></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Package className="w-4 h-4 text-primary" />
                          <span>Expected delivery: <strong className="text-foreground">{deliveryDate}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border/50">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {plan.monthlyPrice ? `$${plan.monthlyPrice}/mo` : "Health plan active"}
                          </p>
                          <p className="text-xs text-muted-foreground">Check here for prescriptions, care updates, and shipping details.</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${plan.paid ? "bg-green-50 text-green-700" : "bg-secondary text-muted-foreground"}`}>
                            <CreditCard className="w-3 h-3" />
                            {plan.paid ? "Paid" : "Not paid"}
                          </span>
                          {!plan.paid && plan.source === "enrollment" && plan.priceId ? (
                            <button
                              onClick={() => handlePayNow(plan)}
                              className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                            >
                              Pay Now <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : plan.programSlug && (
                          <button
                            onClick={() => navigate(`/programs/${plan.programSlug}`)}
                            className="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                          >
                            View Program <ChevronRight className="w-4 h-4" />
                          </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* RECENTLY VIEWED */}
          {activeTab === "recent" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Recently Viewed Products</h2>
              {recentLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading…</div>
              ) : recentItems.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
                  <Eye className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">Nothing here yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Products you tap on in the marketplace will show up here.
                  </p>
                  <button
                    onClick={() => navigate("/search")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recentItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card rounded-xl border border-border/50 p-4 flex gap-4 cursor-pointer hover:shadow-soft transition-shadow"
                      onClick={() => {
                        if (item.product_url) {
                          window.open(item.product_url, "_blank", "noopener,noreferrer");
                        } else {
                          navigate(`/product/${item.product_id}`);
                        }
                      }}
                    >
                      <img
                        src={item.product_image || "/placeholder.svg"}
                        alt={item.product_name}
                        className="w-20 h-20 rounded-lg object-cover bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground line-clamp-2">{item.product_name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{item.product_brand}</p>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-foreground">${item.product_price}</p>
                          {item.product_url && <ExternalLink className="w-3 h-3 text-muted-foreground" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          Viewed {new Date(item.viewed_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SAVED */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Saved Products</h2>
              {savedLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading…</div>
              ) : savedProducts.length === 0 ? (
                <div className="bg-card rounded-2xl border border-border/50 p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-foreground mb-2">No saved products yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tap the heart icon on any product to save it here.
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-card rounded-xl border border-border/50 p-4 flex gap-4 cursor-pointer hover:shadow-soft transition-shadow"
                      onClick={() => navigate(`/product/${product.product_id}`)}
                    >
                      <img
                        src={product.product_image || "/placeholder.svg"}
                        alt={product.product_name}
                        className="w-20 h-20 rounded-lg object-cover bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm text-foreground line-clamp-2">{product.product_name}</h3>
                        <p className="text-xs text-muted-foreground mb-2">{product.product_brand}</p>
                        <p className="font-semibold text-foreground">${product.product_price}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSave({
                            id: product.product_id,
                            name: product.product_name,
                            brand: product.product_brand,
                            image: product.product_image || undefined,
                            price: product.product_price,
                            originalPrice: product.product_original_price || undefined,
                          });
                        }}
                        className="self-start p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        aria-label="Remove from saved"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIP */}
          {activeTab === "vip" && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">VIP Status</h2>
              <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-gold/10 rounded-2xl border border-border/50 p-6">
                {isVipActive ? (
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent to-gold flex items-center justify-center">
                      <Crown className="w-10 h-10 text-foreground" />
                    </div>
                    <h3 className="text-2xl text-foreground mb-2">You're a VIP!</h3>
                    <p className="text-muted-foreground mb-4">
                      Expires: {vipExpiresAt ? new Date(vipExpiresAt).toLocaleDateString() : "Never"}
                    </p>
                    <div className="flex flex-col justify-center gap-2 sm:flex-row">
                      <button
                        onClick={() => navigate("/search")}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
                      >
                        Shop VIP Discounts
                      </button>
                      <button
                        onClick={() => navigate("/contact")}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
                      >
                        Book Free Consultation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Crown className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl text-foreground mb-2">Become a VIP Member</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get exclusive discounts, early access, and free consultations.
                    </p>
                    <div className="mx-auto mb-4 grid max-w-md gap-3 sm:grid-cols-2">
                      {vipPlans.map((plan) => (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => { setSelectedVipPlan(plan.id); setShowVipCheckout(false); }}
                          className={`rounded-xl border p-4 text-left transition-colors ${
                            selectedVipPlan === plan.id
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:bg-secondary/60"
                          }`}
                        >
                          <span className="block text-sm font-semibold text-foreground">{plan.name}</span>
                          <span className="block text-lg font-bold text-foreground">{plan.price}</span>
                          <span className="block text-xs">{plan.savings}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowVipCheckout((open) => !open)}
                      className="px-6 py-3 bg-gradient-to-r from-accent to-gold text-foreground font-medium rounded-xl hover:opacity-90 transition-opacity"
                    >
                      {showVipCheckout ? "Hide Checkout" : "Join VIP Now"}
                    </button>
                    {showVipCheckout && (
                      <div className="mt-6 text-left">
                        <StripeEmbeddedCheckout
                          priceId={selectedVipPlan}
                          customerEmail={user?.email || undefined}
                          userId={user?.id}
                          programSlug="vip-membership"
                          programTitle="VIP Membership"
                          programDescription="20% off products, early access, member-only deals, and free consultations."
                          tierName={vipPlans.find((plan) => plan.id === selectedVipPlan)?.name}
                          tierPrice={vipPlans.find((plan) => plan.id === selectedVipPlan)?.price}
                          tierIncludes={["20% off all products", "Early access", "2 free consultations", "Member-only deals"]}
                          returnUrl={`${window.location.origin}/dashboard?tab=vip&checkout=success&session_id={CHECKOUT_SESSION_ID}`}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
