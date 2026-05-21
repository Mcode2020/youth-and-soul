import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  useSEOHead({
    title: "Contact Us",
    description: "Get in touch with Youth & Soul. Questions about supplements, telehealth programs, or discount codes? We are here to help.",
    path: "/contact",
    keywords: "contact youth and soul, customer support, health marketplace contact",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Contact Us" }]} />

      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">Contact Us</h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Have a question, partnership inquiry, or need support? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
          {/* Contact Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border border-border/50 p-6 space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">hello@youthnsoul.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Location</p>
                  <p className="text-sm text-muted-foreground">Los Angeles, CA</p>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <p className="text-sm font-semibold text-foreground mb-2">Business Hours</p>
              <p className="text-sm text-muted-foreground">Monday – Friday: 9am – 6pm PST</p>
              <p className="text-sm text-muted-foreground">Saturday – Sunday: Closed</p>
              <p className="text-xs text-muted-foreground mt-3">
                For medical support on prescription programs, our doctors are available 24/7.
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-card rounded-xl border border-border/50 p-6 md:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  maxLength={255}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                maxLength={200}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={2000}
                rows={5}
                className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                placeholder="How can we help?"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
