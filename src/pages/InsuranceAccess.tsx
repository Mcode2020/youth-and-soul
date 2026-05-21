import { useState } from "react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Shield, CheckCircle, ArrowRight } from "lucide-react";
import { useSEOHead } from "@/hooks/useSEOHead";
import { toast } from "sonner";

export default function InsuranceAccess() {
  useSEOHead({ title: "Get Insurance Access — Youth&Soul", description: "Don't have health insurance? We can help connect you to affordable plans covering longevity, hair loss, gut health, sleep, and mental health programs.", path: "/insurance-access" });

  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "", state: "", interest: "" });
  const [submitted, setSubmitted] = useState(false);

  const interests = ["Weight Loss & GLP-1", "Hair Loss & Regrowth", "Gut Health & Digestion", "Sleep & Insomnia", "Mental Health & Therapy", "Longevity & Anti-Aging", "Menopause & HRT", "All of the above"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) { toast.error("Please fill in required fields."); return; }
    setSubmitted(true);
    toast.success("We'll be in touch shortly!");
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
            Get <span className="text-primary">Insurance Access</span> for Health Plans
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Don't have insurance? We can connect you to affordable health insurance plans that cover our longevity, weight loss, hair loss, gut health, sleep, and mental health programs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">What's covered:</h3>
            <ul className="space-y-3">
              {["GLP-1 Weight Loss Programs", "Hair Loss Treatments", "Gut Health & SIBO Protocols", "Sleep & Insomnia Solutions", "Mental Health & Therapy", "Longevity & Anti-Aging", "Menopause & HRT", "Brain & Cognitive Support"].map(item => (
                <li key={item} className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-foreground mb-2">Sign up for insurance access</h3>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="First Name *" value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} className="px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" required />
                <input placeholder="Last Name" value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} className="px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" required />
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">Select State</option>
                {["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={form.interest} onChange={e => setForm(p => ({ ...p, interest: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="">What are you interested in?</option>
                {interests.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm md:text-base hover:bg-primary/90 transition-colors">
                Get Insurance Access <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-muted-foreground text-center">We'll connect you with an insurance partner. No obligation.</p>
            </form>
          ) : (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
              <CheckCircle className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">You're on the list!</h3>
              <p className="text-sm text-muted-foreground">We'll reach out shortly to connect you with an insurance partner that covers our health programs.</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Already have insurance? <a href="/weightloss-glp-intake" className="text-primary font-semibold hover:underline">Start a health plan now →</a>
          </p>
        </div>
      </main>
      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
