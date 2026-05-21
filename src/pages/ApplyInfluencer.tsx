import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight, TrendingUp, Instagram, Youtube, CheckCircle2, DollarSign, Gift, BarChart3, Download, ExternalLink, Quote, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const platforms = ["Instagram", "YouTube", "TikTok", "Twitter/X", "Facebook", "Other"];
const niches = ["Health & Wellness", "Fitness", "Beauty & Skincare", "Nutrition", "Mental Health", "Longevity & Anti-Aging", "Biohacking", "Lifestyle"];

const benefits = [
  { icon: DollarSign, title: "10%+ Commission", desc: "On every sale through your unique link" },
  { icon: Gift, title: "Free Products", desc: "Get samples from top brands to review" },
  { icon: BarChart3, title: "Real-time Dashboard", desc: "Track clicks, conversions & earnings" },
];

const sampleScripts = [
  {
    title: "Product & Program Endorsement",
    script: `"Hey guys! I've been using Youth & Soul for the past few weeks and I'm genuinely blown away. They're a one-stop longevity and health marketplace — everything from NAD+ supplements to doctor-prescribed GLP-1 weight loss programs, all with exclusive discount codes. I started their anti-aging stack and my energy levels are through the roof. If you're serious about longevity, go check out www.youthandsoul.com — they have programs starting from $39/month with real doctors and FDA-approved compounds. Use my code for an extra discount. Link in bio!"`,
  },
  {
    title: "Discount & Deals Focus",
    script: `"Okay so I just found the best kept secret in health & wellness — Youth & Soul literally has discount codes on EVERY product in their marketplace. We're talking longevity supplements, peptides, anti-aging stacks, collagen, NAD+... all from verified brands. I saved over 20% on my last order. Just go to www.youthandsoul.com, browse their categories, and the discount codes are right there on every product. It's like having a VIP card to the best health products on the internet. You're welcome 😉"`,
  },
  {
    title: "Earn Money Posting",
    script: `"Want to make money talking about health & wellness? Youth & Soul will literally pay you cash or commission to start posting about their products. They have an incredible influencer program — you get free products, your own discount codes, and a real-time dashboard to track your earnings. I'm already making money just sharing products I actually use. Sign up at www.youthandsoul.com/apply-influencer and start posting content today. Whether you have 50K or 5M followers, they're looking for authentic creators. Let's get paid! 💰"`,
  },
];

interface InfluencerPost {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  post_type: string;
  platform: string;
}

export default function ApplyInfluencer() {
  const navigate = useNavigate();
  const { toast } = useToast();
  useSEOHead({
    title: "Apply as an Influencer Partner",
    description: "Join the Youth & Soul Creator Program. Earn 10%+ commission promoting health, longevity, and telehealth programs. Open to creators with 20k+ followers.",
    path: "/apply-influencer",
    keywords: "health influencer program, wellness affiliate, longevity creator, telehealth affiliate program",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instagramPosts, setInstagramPosts] = useState<InfluencerPost[]>([]);
  const [formData, setFormData] = useState({
    fullName: "", email: "", platform: "", handle: "", followers: "", niche: "", website: "", bio: "", whyJoin: "",
  });

  useEffect(() => {
    supabase
      .from("influencer_posts")
      .select("*")
      .eq("platform", "instagram")
      .eq("is_active", true)
      .order("sort_order")
      .then(({ data }) => setInstagramPosts(data || []));
  }, []);

  // Fallback sample posts if none in DB
  const displayPosts = instagramPosts.length > 0 ? instagramPosts : [
    { id: "1", title: "20% Off Longevity Supplements", description: "Feed post — discount code promo", image_url: "/images/influencer-post-1.jpg", post_type: "feed", platform: "instagram" },
    { id: "2", title: "Start Your Longevity Journey", description: "Story post — brand awareness", image_url: "/images/influencer-post-2.jpg", post_type: "story", platform: "instagram" },
    { id: "3", title: "Save on Anti-Aging Stacks", description: "Feed post — product showcase", image_url: "/images/influencer-post-3.jpg", post_type: "feed", platform: "instagram" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast({ title: "Application Submitted!", description: "We'll review your profile and get back to you within 48 hours." });
    setIsSubmitting(false);
    navigate("/");
  };

  const isValid = formData.fullName && formData.email && formData.platform && formData.handle && formData.followers && formData.niche;

  // Note: Minimum 20K followers required

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Influencer Program" }]} />

      <main className="max-w-4xl mx-auto px-4 py-4">
        {/* Hero */}
        <div className="flex items-start justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Get Paid Today for Posts
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
              Or apply for your own commission codes and start earning
            </p>
          </div>
          <button
            onClick={() => document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden md:inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shrink-0 ml-4"
          >
            Apply Now
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* ============ WHAT TO POST — TIKTOK ============ */}
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">What to Post <span className="text-primary">(Start Today)</span></h2>

          {/* TikTok */}
          <div className="mt-6 p-5 md:p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <img src="/images/tiktok-logo.svg" alt="TikTok" className="h-7 md:h-9" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Post short-form videos about your health journey, product reviews, or daily routines — and earn commission on every sale from your link.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              TikTok creators with health & wellness audiences see the highest conversion rates. Just talk naturally about the products you love.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">
              {/* Sample Scripts */}
              <div>
                <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
                  <Quote className="w-4 h-4 text-primary" />
                  Sample Post Scripts
                </h3>
                <div className="space-y-4">
                  {sampleScripts.map((s, i) => (
                    <div key={i} className="bg-secondary/40 rounded-xl p-4 border-l-4 border-primary/40">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">{s.title}</h4>
                      <p className="text-xs md:text-sm text-muted-foreground italic leading-relaxed">
                        {s.script}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TikTok example image */}
              <div className="hidden md:block">
                <div className="rounded-2xl overflow-hidden border border-border/50 shadow-soft">
                  <img
                    src="/images/tiktok-creator-example.png"
                    alt="TikTok creator example"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground text-center mt-2">Example: Health & wellness TikTok</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ INSTAGRAM ============ */}
        <section className="mb-10">
          <div className="p-5 md:p-8 bg-card rounded-2xl border border-border/50">
            <div className="flex items-center gap-3 mb-4">
              <Instagram className="w-7 h-7 md:w-9 md:h-9 text-pink-500" />
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400 bg-clip-text text-transparent">Instagram</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Download ready-made stories and feed posts featuring our brand, discount codes, and top products. Simply save, post, and start earning.
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              Browse the posts below, download the ones you like, and add your personal caption and affiliate link.
            </p>

            {/* Downloadable Posts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {displayPosts.map((post) => (
                <div key={post.id} className="group relative bg-secondary/30 rounded-xl overflow-hidden border border-border/50">
                  <div className={post.post_type === "story" ? "aspect-[9/16]" : "aspect-square"}>
                    {post.image_url ? (
                      <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted/20">
                        <span className="text-lg font-serif font-bold" style={{ color: '#d1d5db', textShadow: '0 0 8px rgba(255,255,255,0.9)' }}>Youth&Soul</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-foreground truncate">{post.title}</h4>
                    {post.description && <p className="text-[10px] text-muted-foreground truncate">{post.description}</p>}
                    <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-medium bg-primary/10 text-primary rounded-full uppercase">
                      {post.post_type}
                    </span>
                  </div>
                  {/* Download overlay */}
                  {post.image_url && (
                    <a
                      href={post.image_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-semibold text-foreground">
                        <Download className="w-3.5 h-3.5" /> Download
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Info Link */}
        <div className="mb-10 text-center">
          <a
            href="/learn"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Learn More About Youth & Soul
          </a>
        </div>

        {/* ============ TURN INFLUENCE INTO INCOME ============ */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Influencer Program
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Turn Influence Into Income</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Join our creator network and earn by promoting health & wellness products you believe in
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {benefits.map((b) => (
            <div key={b.title} className="flex items-start gap-3 p-4 bg-card rounded-xl border border-border/50">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-primary/10 rounded-lg">
                <b.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-foreground">{b.title}</h4>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ============ APPLICATION FORM ============ */}
        <form id="apply-form" onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="Jane Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input type="email" placeholder="you@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website / Portfolio (optional)</Label>
                <Input placeholder="https://yourwebsite.com" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Instagram className="w-5 h-5 text-primary" />
                Social Media Presence
              </CardTitle>
              <CardDescription>Must have 20K+ followers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Platform *</Label>
                  <Select value={formData.platform} onValueChange={(v) => setFormData({ ...formData, platform: v })}>
                    <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                    <SelectContent>
                      {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Handle / Username *</Label>
                  <Input placeholder="@yourusername" value={formData.handle} onChange={(e) => setFormData({ ...formData, handle: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Followers *</Label>
                  <Input placeholder="e.g. 85,000" value={formData.followers} onChange={(e) => setFormData({ ...formData, followers: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Content Niche *</Label>
                  <Select value={formData.niche} onValueChange={(v) => setFormData({ ...formData, niche: v })}>
                    <SelectTrigger><SelectValue placeholder="Select niche" /></SelectTrigger>
                    <SelectContent>
                      {niches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About You</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Short Bio</Label>
                <Textarea rows={3} placeholder="Tell us about your content and audience..." value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Why do you want to join?</Label>
                <Textarea rows={3} placeholder="What excites you about Youth&Soul's influencer program?" value={formData.whyJoin} onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4">
            <Button type="submit" size="lg" className="w-full" disabled={!isValid || isSubmitting}>
              {isSubmitting ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />Submitting...</>
              ) : (
                <><CheckCircle2 className="w-4 h-4 mr-2" />Submit Application</>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              By applying, you agree to our Influencer Terms. Minimum 20K followers required.
            </p>
          </div>
        </form>
      </main>
      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
