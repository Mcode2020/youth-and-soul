import { useState, useRef, useEffect } from "react";
import { Search, Mic, Loader2, ArrowRight, Stethoscope, Globe, Truck, RefreshCw, AlertCircle } from "lucide-react";
import heroBackground from "@/assets/hero-wellness-clinic-v2.jpg";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { telehealthPrograms } from "@/data/telehealthPrograms";
import ReactMarkdown from "react-markdown";
import { DoctorsOnlinePill } from "@/components/conversion/DoctorsOnlinePill";

export function HeroSearchSection() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{ answer: string; sources: string[]; isFallback?: boolean } | null>(null);
  const [recommendedPrograms, setRecommendedPrograms] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const recognitionRef = useRef<any>(null);

  const loadingMessages = [
    "Consulting our medical knowledge base…",
    "Matching you with the right programs…",
    "Reviewing doctor-approved recommendations…",
    "Almost there — finalizing your answer…",
  ];

  useEffect(() => {
    if (!isSearching) { setLoadingStep(0); return; }
    const id = setInterval(() => {
      setLoadingStep((s) => (s + 1) % loadingMessages.length);
    }, 1400);
    return () => clearInterval(id);
  }, [isSearching]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setResult(null);
    setRecommendedPrograms([]);
    setLastQuery(searchQuery.trim());

    try {
      const { data, error } = await supabase.functions.invoke("ai-search", {
        body: { query: searchQuery.trim() },
      });

      const q = searchQuery.toLowerCase();
      const matched: string[] = [];
      if (q.includes("weight") || q.includes("glp") || q.includes("fat") || q.includes("diet")) matched.push("weight-loss");
      if (q.includes("menopause") || q.includes("hormone") || q.includes("hrt") || q.includes("estrogen")) matched.push("menopause-hrt");
      if (q.includes("hair") || q.includes("skin") || q.includes("aging") || q.includes("wrinkle")) matched.push("skin-hair");
      if (q.includes("sex") || q.includes("libido") || q.includes("ed ") || q.includes("erectile")) matched.push("sexual-health");
      if (q.includes("brain") || q.includes("focus") || q.includes("cognitive") || q.includes("memory")) matched.push("brain-cognitive");
      if (q.includes("pain") || q.includes("recovery") || q.includes("inflammation")) matched.push("pain-recovery");
      if (q.includes("longevity") || q.includes("nad") || q.includes("energy") || q.includes("vitality")) matched.push("longevity");
      if (q.includes("gut") || q.includes("digestion") || q.includes("bloat") || q.includes("ibs")) matched.push("gut-health");
      if (matched.length === 0) matched.push("weight-loss", "longevity", "skin-hair");
      setRecommendedPrograms(matched.slice(0, 3));

      const isFallback = !!(data as any)?.fallback;
      if (error || !data || (data as any)?.error || isFallback) {
        const status = (error as any)?.context?.status ?? (data as any)?.upstreamStatus;
        let msg = (data as any)?.answer || "Our AI assistant is briefly unavailable. Tap Try again in a moment, or explore the recommended programs below.";
        if (status === 429) msg = "We're getting a lot of questions right now — please try again in a moment.";
        if (status === 402) msg = "Our AI concierge is temporarily offline. Tap Try again shortly, or speak with a licensed doctor below.";
        setResult({ answer: msg, sources: [], isFallback: true });
      } else {
        setResult({
          answer: data.answer || "Based on your query, we recommend consulting with one of our licensed doctors for a personalized health plan.",
          sources: data.sources || [],
        });
      }
    } catch {
      setResult({
        answer: "Something went wrong reaching our AI. Tap Try again, or explore the recommended programs below.",
        sources: [],
        isFallback: true,
      });
      setRecommendedPrograms(["weight-loss", "longevity", "menopause-hrt"]);
    } finally {
      setIsSearching(false);
    }
  };

  const startVoice = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.onresult = (e: any) => {
      const t = e.results[0][0].transcript;
      setQuery(t);
      setIsListening(false);
      handleSearch(t);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);
    rec.start();
    setIsListening(true);
  };

  const matchedPrograms = recommendedPrograms
    .map((slug) => telehealthPrograms.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <section className="relative overflow-hidden bg-background md:bg-transparent">
      {/* Background image */}
      <img
        src={heroBackground}
        alt=""
        className="absolute inset-x-0 top-0 w-full h-[620px] md:h-full object-cover"
        width={1920}
        height={1080}
      />
      {/* Lighter overlay for hero text contrast (no vignette) — pointer-events-none so it never blocks the search bar / tags */}
      <div className="absolute inset-x-0 top-0 h-[620px] md:h-full bg-gradient-to-b from-black/40 via-black/15 to-black/45 z-[1] pointer-events-none" />

        <div className="relative z-[2] max-w-4xl mx-auto px-4 pt-16 pb-10 md:pt-28 md:pb-16 text-center">
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-3 md:mb-4 animate-fade-up">
          <p className="inline-flex items-center gap-2 text-[hsl(145,60%,75%)] text-xs md:text-sm font-semibold tracking-wide">
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-[hsl(145,60%,60%)] text-[hsl(145,60%,60%)] ping-soft" />
            Trusted by medical experts
          </p>
          <DoctorsOnlinePill />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-6xl font-extrabold text-white mb-2 md:mb-4 leading-[1.1] tracking-tight animate-fade-up stagger-1">
          Longevity & Health Programs,{" "}
          <span className="text-gradient-sage">made simple.</span>
        </h1>

        <p className="text-[13px] sm:text-base md:text-lg text-white font-semibold mb-5 md:mb-7 max-w-2xl mx-auto leading-relaxed animate-fade-up stagger-2 px-4 sm:whitespace-nowrap">
          Real results with professional doctor support 24/7, 7 days a week.
        </p>

        {/* Trust icons row */}
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap mb-5 md:mb-8 animate-fade-up stagger-3">
          {[
            { Icon: Stethoscope, label: "Doctor‑reviewed" },
            { Icon: Globe, label: "100% online" },
            { Icon: Truck, label: "Same Day Approvals" },
            { Icon: Truck, label: "Fast Discreet Shipping" },
          ].map(({ Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 md:gap-1.5 text-white text-[10px] md:text-[11px] font-medium px-2.5 py-1.5 md:px-2.5 md:py-1.5 rounded-full bg-primary/85 backdrop-blur-sm ring-1 ring-white/15 shadow-soft">
              <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/15 flex items-center justify-center">
                <Icon className="w-2.5 h-2.5 md:w-3 md:h-3 text-[hsl(145,60%,80%)]" />
              </span>
              {label}
            </span>
          ))}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}
          className="relative max-w-2xl mx-auto mb-6 animate-fade-up stagger-4"
        >
          {/* Glow */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[hsl(145,60%,60%)]/30 via-[hsl(160,55%,55%)]/20 to-[hsl(145,60%,60%)]/30 blur-lg opacity-70" />
          <div className="relative flex items-center gap-2 px-4 py-3 md:py-4 rounded-2xl bg-white/95 backdrop-blur-sm shadow-2xl border border-white/30">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="How can I improve my health? / What do I need help with?"
              className="flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground/60 text-sm md:text-base focus:outline-none"
            />
            <button
              type="button"
              onClick={startVoice}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 ${isListening ? "bg-primary text-white animate-pulse scale-110" : "bg-secondary/80 text-muted-foreground hover:bg-secondary"}`}
              aria-label="Voice search"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={isSearching}
              className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all shrink-0 shadow-lg shadow-primary/30"
              aria-label="Search"
            >
              <Search className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </form>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-2 md:gap-3 flex-wrap mb-2 animate-fade-up stagger-5">
          {["Weight Loss", "Menopause", "Libido", "Hot Health", "Hair & Skin", "Longevity"].map((label) => (
            <button
              key={label}
              onClick={() => { setQuery(label); handleSearch(label); }}
              className="text-[11px] md:text-xs font-semibold text-white bg-white/15 hover:bg-white/25 transition-all border border-white/50 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 hover:border-white active:scale-95 hover:-translate-y-0.5 shadow-md"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Results Section */}
      {(result || isSearching) && (
        <div className="relative z-[2] bg-background md:bg-transparent px-4 pb-10 md:pb-16">
          <div className="max-w-3xl mx-auto">
          {isSearching ? (
            <div className="bg-card rounded-2xl shadow-xl p-8 border border-border flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground animate-pulse text-center">
                {loadingMessages[loadingStep]}
              </p>
              <div className="flex gap-1.5">
                {loadingMessages.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1 w-6 rounded-full transition-colors ${i <= loadingStep ? "bg-primary" : "bg-border"}`}
                  />
                ))}
              </div>
            </div>
          ) : result ? (
            <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
              {result.isFallback && (
                <div className="flex items-start gap-3 mb-4 p-3 rounded-xl bg-accent/10 border border-accent/30">
                  <AlertCircle className="w-4 h-4 text-accent-foreground/70 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground mb-2">AI temporarily unavailable</p>
                    <button
                      onClick={() => handleSearch(lastQuery)}
                      disabled={isSearching || !lastQuery}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Try again
                    </button>
                  </div>
                </div>
              )}
              <div className="prose prose-sm max-w-none text-foreground mb-4">
                <ReactMarkdown>{result.answer}</ReactMarkdown>
              </div>

              {result.sources.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold mb-2">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {result.sources.slice(0, 4).map((src, i) => (
                      <span key={i} className="text-[10px] px-2 py-1 bg-secondary rounded-full text-muted-foreground">{src}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-5 mb-2">
                <h4 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Doctors Available Now
                </h4>
                <p className="text-xs text-muted-foreground mb-4">
                  Fill out a 5-min form to submit to your online doctor. They will reply with your prescription.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Dr. Lisa H.", specialty: "Internal Medicine", slug: "weight-loss" },
                    { name: "Dr. Sarah C.", specialty: "Endocrinology", slug: "menopause-hrt" },
                    { name: "Dr. David P.", specialty: "Anti-Aging", slug: "longevity" },
                  ].map((doc) => (
                    <button
                      key={doc.name}
                      onClick={() => navigate(`/programs/${doc.slug}`)}
                      className="text-left p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                        <span className="text-xs font-bold text-primary">{doc.name.split(" ")[1][0]}{doc.name.split(" ")[2]?.[0] || ""}</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground">{doc.name}</p>
                      <p className="text-[10px] text-muted-foreground">{doc.specialty}</p>
                    </button>
                  ))}
                </div>
              </div>

              {matchedPrograms.length > 0 && (
                <div className="border-t border-border pt-5">
                  <h4 className="text-sm font-bold text-foreground mb-3">Recommended Health Plans</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {matchedPrograms.map((program) => {
                      if (!program) return null;
                      const lowestPrice = Math.min(...program.tiers.map((t) => t.price));
                      return (
                        <button
                          key={program.slug}
                          onClick={() => navigate(`/programs/${program.slug}`)}
                          className="text-left rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all group"
                        >
                          <div className={`relative h-20 bg-gradient-to-br ${program.color} overflow-hidden`}>
                            <img
                              src={program.image}
                              alt={program.title}
                              className="w-full h-full object-cover mix-blend-luminosity opacity-60"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            {program.badge && (
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-accent text-accent-foreground text-[8px] font-bold rounded-full uppercase tracking-wide">
                                {program.badge}
                              </span>
                            )}
                            <div className="absolute bottom-1.5 left-2 right-2">
                              <h5 className="text-[10px] font-bold text-white leading-tight line-clamp-1">{program.title}</h5>
                            </div>
                          </div>
                          <div className="px-3 py-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-primary">From ${lowestPrice}/mo</span>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          </div>
        </div>
      )}

    </section>
  );
}
