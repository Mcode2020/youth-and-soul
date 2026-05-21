import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Stethoscope, Truck, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function GLPCareCTA() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }
    try {
      localStorage.setItem("ys_glp_lead_email", email);
    } catch {}
    navigate(`/weightloss-glp-intake?email=${encodeURIComponent(email)}`);
  };

  const benefits = [
    { icon: Stethoscope, label: "US-licensed clinicians review every intake within 24 hours" },
    { icon: ShieldCheck, label: "No membership or hidden fees — full refund if not approved" },
    { icon: Truck, label: "Free discreet shipping straight to your door" },
  ];

  return (
    <section
      aria-labelledby="glp-care-cta-heading"
      className="max-w-6xl mx-auto px-4 pt-2 pb-6"
    >
      <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-[hsl(var(--background))] via-[hsl(var(--secondary))] to-[hsl(var(--background))] p-6 md:p-10 shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.18em] text-primary mb-3">
              Doctor-Guided GLP-1 Care
            </p>
            <h2
              id="glp-care-cta-heading"
              className="text-2xl md:text-4xl font-black text-foreground leading-tight tracking-tight mb-4"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Weight loss made easy with personalized care
            </h2>
            <ul className="space-y-3 mb-6">
              {benefits.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-start gap-3 text-sm md:text-base text-foreground/85">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
                  </span>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-5 md:p-6 border border-border shadow-md">
            <label htmlFor="glp-cta-email" className="block text-sm font-semibold text-foreground mb-2">
              See if you qualify — get started in 2 minutes
            </label>
            <p className="text-xs text-muted-foreground mb-4">
              Enter your email to start your free eligibility check. From $125/mo, no insurance required.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="glp-cta-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                aria-label="Email address"
                className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                Start free check
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3">
              By continuing you agree to be contacted about your GLP-1 care. We never share your data.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
