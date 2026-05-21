import { useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { ArrowLeft, Bell, Rocket } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function ComingSoon() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  useSEOHead({
    title: "Coming Soon",
    description: "This Youth & Soul feature is launching soon. Join our notification list to be the first to know.",
    path: "/coming-soon",
    noIndex: true,
  });

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      toast({ title: "You're on the list!", description: "We'll notify you when this feature launches." });
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <main className="max-w-lg mx-auto px-4 py-16 text-center">
        <button onClick={() => navigate(-1)} className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Go back
        </button>

        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Rocket className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-3">Coming Soon</h1>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
          We're building something amazing. Tele-Health video consultations will be available soon. Get notified when we launch!
        </p>

        <form onSubmit={handleNotify} className="flex gap-2 max-w-sm mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-card border border-border/50 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/40"
            required
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Bell className="w-4 h-4" />
            Notify Me
          </button>
        </form>
      </main>
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
