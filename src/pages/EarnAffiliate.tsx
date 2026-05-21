import { useState, useEffect } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useSEOHead } from "@/hooks/useSEOHead";
import { Coins, Users, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const EarnAffiliate = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  useSEOHead({
    title: "Earn as an Affiliate — Youth & Soul",
    description: "Join the Youth & Soul affiliate program. Earn commissions promoting premium health, longevity, and anti-aging products.",
    path: "/earn-affiliate",
  });

  const [form, setForm] = useState({ name: "", email: "", social: "", audience: "", why: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Application submitted! We'll be in touch within 48 hours.");
      setForm({ name: "", email: "", social: "", audience: "", why: "" });
      setSubmitting(false);
    }, 1200);
  };

  const perks = [
    { icon: Coins, title: "High Telehealth Payouts", desc: "Telehealth affiliates are amongst the highest-payout affiliates in the industry." },
    { icon: Users, title: "Dedicated Support", desc: "Get a personal affiliate manager from day one." },
    { icon: TrendingUp, title: "Real-Time Dashboard", desc: "Track clicks, conversions, and payouts live." },
    { icon: CheckCircle, title: "Exclusive Codes", desc: "Custom discount codes for your audience." },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Earn Affiliate" }]} />

      <main className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Turn Your Audience Into <span className="text-primary">Revenue</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join our affiliate program and earn commissions promoting premium health, longevity, and telehealth offers across TikTok, email, blogs, Instagram, YouTube, or your own Facebook and TikTok ads.
          </p>
        </div>

        <div className="mb-10 rounded-2xl border border-primary/20 bg-primary/10 p-5 md:p-7 text-center">
          <h2 className="text-xl md:text-3xl font-black text-foreground mb-2">Telehealth is one of affiliate marketing's strongest categories</h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto">
            Affiliates in the telehealth space are amongst the highest-payout affiliates in the industry, with multiple ways to promote: TikTok, email lists, blogs, Instagram, YouTube, Facebook ads, and TikTok ads.
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {perks.map((p) => (
            <div key={p.title} className="bg-card border border-border/50 rounded-2xl p-5 text-center">
              <p.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-foreground mb-1">{p.title}</h3>
              <p className="text-xs text-muted-foreground">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Application Form */}
        <div className="max-w-xl mx-auto bg-card border border-border/50 rounded-2xl p-6 md:p-10">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">Apply Now</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm placeholder:text-muted-foreground outline-none"
            />
            <input
              required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email Address" className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm placeholder:text-muted-foreground outline-none"
            />
            <input
              required value={form.social} onChange={(e) => setForm({ ...form, social: e.target.value })}
              placeholder="Primary Social Media URL" className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm placeholder:text-muted-foreground outline-none"
            />
            <input
              value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}
              placeholder="Audience Size (approx)" className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm placeholder:text-muted-foreground outline-none"
            />
            <textarea
              value={form.why} onChange={(e) => setForm({ ...form, why: e.target.value })}
              placeholder="Why do you want to partner with Youth&Soul?" rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm placeholder:text-muted-foreground outline-none resize-none"
            />
            <button
              type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default EarnAffiliate;
