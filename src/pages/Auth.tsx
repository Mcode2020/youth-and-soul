import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { useSEOHead } from "@/hooks/useSEOHead";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const getSavedPasswordCredential = async () => {
  try {
    if (!("credentials" in navigator) || !("PasswordCredential" in window)) return null;
    return await (navigator.credentials as any).get({ password: true, mediation: "optional" });
  } catch {
    return null;
  }
};

const storePasswordCredential = async (email: string, password: string, name?: string) => {
  try {
    const PasswordCredentialCtor = (window as any).PasswordCredential;
    if (!("credentials" in navigator) || !PasswordCredentialCtor) return;
    const credential = new PasswordCredentialCtor({ id: email, password, name: name || email });
    await (navigator.credentials as any).store(credential);
  } catch {
    // Browser credential storage is optional; normal sign-in still works.
  }
};

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useSEOHead({
    title: isLogin ? "Sign In" : "Create Account",
    description: "Sign in to your Youth & Soul account to access your dashboard, telehealth programs, and saved products.",
    path: "/auth",
    noIndex: true,
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    getSavedPasswordCredential().then((credential: any) => {
      if (!credential?.id || !credential?.password) return;
      setEmail((current) => current || credential.id);
      setPassword((current) => current || credential.password);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isResetMode) {
      try {
        emailSchema.parse(email);
      } catch (err) {
        if (err instanceof z.ZodError) setError(err.errors[0].message);
        return;
      }
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (error) setError(error.message);
      else setSuccess("Check your inbox for a secure password reset link.");
      return;
    }

    if (!validateInputs()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        await storePasswordCredential(email, password, fullName);
      } else {
        const redirectUrl = `${window.location.origin}/dashboard`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        await storePasswordCredential(email, password, fullName);

        // Fire-and-forget welcome email (don't block UX if it fails)
        supabase.functions
          .invoke("send-enrollment-notifications", {
            body: {
              type: "enrollment_welcome",
              email,
              firstName: fullName?.split(" ")[0] || "",
              programSlug: "account",
              programTitle: "Youth & Soul",
              tierName: "Member Account",
            },
          })
          .catch((e) => console.error("welcome email error", e));
      }
    } catch (err: any) {
      if (err.message.includes("User already registered")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (err.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError(err.message || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
      <MobileHeader />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-card rounded-2xl border border-border/50 shadow-medium p-6 md:p-8">
            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl md:text-3xl text-foreground mb-2">
                {isResetMode ? "Reset Password" : isLogin ? "Welcome Back" : "Create Your Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {isResetMode
                  ? "Enter your email and we’ll send a secure reset link."
                  : isLogin 
                    ? "Sign in to access your account" 
                    : "Create your account to view your health plan, delivery updates, and care information."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary text-sm">
                {success}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && !isResetMode && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      name="name"
                      autoComplete="name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    name="email"
                    autoComplete="username email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {isLogin && !isResetMode && (
                <button
                  type="button"
                  onClick={() => { setIsResetMode(true); setError(null); setSuccess(null); }}
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Forgot password?
                </button>
              )}

              {!isResetMode && <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    name="password"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-12 py-3 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {isResetMode ? "Send Reset Link" : isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Toggle */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isResetMode ? "Remembered your password?" : isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  onClick={() => {
                    if (isResetMode) setIsResetMode(false);
                    else setIsLogin(!isLogin);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-primary font-medium hover:underline"
                >
                  {isResetMode ? "Sign in" : isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {/* VIP Promo */}
          <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20 text-center">
            <p className="text-sm text-foreground">
              <span className="font-semibold">Join VIP</span> for 20% off all products + free consultations
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}