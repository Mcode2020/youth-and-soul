import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useSEOHead({
    title: "Reset Password",
    description: "Securely reset your Youth & Soul account password.",
    path: "/reset-password",
    noIndex: true,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) setError(error.message);
    else setMessage("Your password has been updated. You can now view your dashboard.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <MobileHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md bg-card rounded-2xl border border-border/50 shadow-medium p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl text-foreground mb-2">Create a new password</h1>
            <p className="text-sm text-muted-foreground">Choose a secure password for your Youth & Soul dashboard.</p>
          </div>
          {error && <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">{error}</div>}
          {message && <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">{message}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-12 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <>Update Password <ArrowRight className="w-4 h-4" /></>}
            </button>
            {message && <button type="button" onClick={() => navigate("/dashboard")} className="w-full py-3 border border-border rounded-xl text-foreground font-medium hover:bg-secondary transition-colors">Go to Dashboard</button>}
          </form>
        </div>
      </main>
    </div>
  );
}