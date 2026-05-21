import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowLeft, ArrowRight, Calendar, Tag, BarChart3, Globe,
  ExternalLink, BookOpen, ChevronRight, HelpCircle, Sparkles,
  Clock, FileText
} from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

type HubPage = {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  hero_title: string;
  hero_subtitle: string | null;
  content: string;
  category: string;
  keywords: string[];
  related_products_category: string | null;
  published_at: string | null;
  og_title: string | null;
  og_description: string | null;
  h1_title: string | null;
  tags: string[];
  external_links: any[];
  internal_links: any[];
};

type SpokePage = {
  id: string;
  slug: string;
  title: string;
  meta_description: string | null;
  content: string;
  page_type: string;
  question: string | null;
  keywords: string[];
  sources: string[];
  stats: any[];
  hub_id: string;
  is_ai_generated: boolean;
  published_at: string | null;
  og_title: string | null;
  og_description: string | null;
  h1_title: string | null;
  tags: string[];
  target_keyword: string | null;
  external_links: any[];
  internal_links: any[];
};

// Extract FAQs from markdown content (## headings that end with ?)
function extractFAQs(content: string): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];
  const lines = content.split("\n");
  let currentQ = "";
  let currentA: string[] = [];

  for (const line of lines) {
    const match = line.match(/^#{1,3}\s+(.+\?)\s*$/);
    if (match) {
      if (currentQ && currentA.length) {
        faqs.push({ question: currentQ, answer: currentA.join("\n").trim() });
      }
      currentQ = match[1];
      currentA = [];
    } else if (currentQ) {
      currentA.push(line);
    }
  }
  if (currentQ && currentA.length) {
    faqs.push({ question: currentQ, answer: currentA.join("\n").trim() });
  }
  return faqs;
}

function renderSource(source: string, index: number) {
  // Check if source is or contains a URL
  const urlMatch = source.match(/(https?:\/\/[^\s)]+)/);
  if (urlMatch) {
    const url = urlMatch[0];
    const label = source.replace(url, "").replace(/[–—-]\s*$/, "").replace(/^\s*[–—-]\s*/, "").trim() || url;
    return (
      <li key={index} className="flex items-start gap-3 py-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
          {index + 1}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline break-all"
        >
          {label || url}
        </a>
      </li>
    );
  }
  return (
    <li key={index} className="flex items-start gap-3 py-2">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0 mt-0.5">
        {index + 1}
      </span>
      <span className="text-sm text-muted-foreground">{source}</span>
    </li>
  );
}

export default function SeoPage() {
  const { slug } = useParams();
  const [hub, setHub] = useState<HubPage | null>(null);
  const [spoke, setSpoke] = useState<SpokePage | null>(null);
  const [relatedSpokes, setRelatedSpokes] = useState<SpokePage[]>([]);
  const [parentHub, setParentHub] = useState<HubPage | null>(null);
  const [allHubs, setAllHubs] = useState<HubPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) loadPage(slug);
  }, [slug]);

  const loadPage = async (s: string) => {
    setLoading(true);
    const { data: hubData } = await supabase
      .from("seo_hub_pages")
      .select("*")
      .eq("slug", s)
      .eq("is_published", true)
      .single();

    if (hubData) {
      setHub(hubData as HubPage);
      setSpoke(null);
      const [{ data: spokes }, { data: hubs }] = await Promise.all([
        supabase.from("seo_spoke_pages").select("*").eq("hub_id", hubData.id).eq("is_published", true).order("created_at", { ascending: false }),
        supabase.from("seo_hub_pages").select("*").eq("is_published", true),
      ]);
      setRelatedSpokes((spokes || []) as SpokePage[]);
      setAllHubs((hubs || []) as HubPage[]);
      updateMeta(hubData.title, hubData.meta_description, hubData.keywords, hubData.og_title, hubData.og_description);
    } else {
      const { data: spokeData } = await supabase
        .from("seo_spoke_pages")
        .select("*")
        .eq("slug", s)
        .eq("is_published", true)
        .single();

      if (spokeData) {
        setSpoke(spokeData as SpokePage);
        setHub(null);
        const [{ data: parent }, { data: siblings }] = await Promise.all([
          supabase.from("seo_hub_pages").select("*").eq("id", spokeData.hub_id).single(),
          supabase.from("seo_spoke_pages").select("*").eq("hub_id", spokeData.hub_id).eq("is_published", true).neq("id", spokeData.id).limit(6),
        ]);
        setParentHub(parent as HubPage);
        setRelatedSpokes((siblings || []) as SpokePage[]);
        updateMeta(spokeData.title, spokeData.meta_description, spokeData.keywords, spokeData.og_title, spokeData.og_description);
      }
    }
    setLoading(false);
  };

  const updateMeta = (title: string, desc: string | null, keywords: string[], ogTitle?: string | null, ogDesc?: string | null) => {
    document.title = `${title} | Youth & Soul`;
    const setMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (el) el.setAttribute("content", content);
      else {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        el.setAttribute("content", content);
        document.head.appendChild(el);
      }
    };
    setMeta("description", desc || "");
    setMeta("keywords", keywords.join(", "));
    setMeta("robots", "index, follow, max-snippet:-1, max-image-preview:large");
    setMeta("author", "Youth & Soul");
    setMeta("og:title", ogTitle || title, true);
    setMeta("og:description", ogDesc || desc || "", true);
    setMeta("og:type", spoke ? "article" : "website", true);
    setMeta("og:url", `https://youthandsoul.com/learn/${slug}`, true);
    setMeta("og:site_name", "Youth & Soul", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle || title);
    setMeta("twitter:description", ogDesc || desc || "");

    const existing = document.querySelector("script[data-seo-ld]");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo-ld", "true");
    const baseOrg = {
      "@type": "Organization",
      name: "Youth & Soul",
      url: "https://youthandsoul.com",
    };
    const jsonLd: any = {
      "@context": "https://schema.org",
      "@type": spoke?.page_type === "qa" ? "FAQPage" : "MedicalWebPage",
      headline: title,
      description: desc,
      keywords: keywords.join(", "),
      publisher: baseOrg,
      author: baseOrg,
      datePublished: spoke?.published_at || hub?.published_at || new Date().toISOString(),
      url: `https://youthandsoul.com/learn/${slug}`,
      inLanguage: "en-US",
    };
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `https://youthandsoul.com/learn/${slug}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!hub && !spoke) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <Link to="/learn"><Button>Back to Learn</Button></Link>
      </div>
    );
  }

  // ─── HUB PAGE ──────────────────────────────────────────────
  if (hub) {
    const faqs = extractFAQs(hub.content);

    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <MobileHeader />
        <Breadcrumbs items={[{ label: "Learn", href: "/learn" }, { label: hub.hero_title }]} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-14 md:py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Badge className="mb-4 text-xs font-bold uppercase tracking-wider">{hub.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 leading-tight">{hub.hero_title}</h1>
            {hub.hero_subtitle && (
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-6">{hub.hero_subtitle}</p>
            )}
            {hub.published_at && (
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Published {new Date(hub.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </div>
            )}
            <div className="flex gap-3 justify-center mt-8">
              <Link to={`/programs/${hub.related_products_category || hub.category}`}>
                <Button size="lg">View Programs</Button>
              </Link>
              <Link to="/search">
                <Button size="lg" variant="outline">Browse Products</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Table of Contents for spokes */}
        {relatedSpokes.length > 0 && (
          <section className="border-b border-border bg-card/50">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3">
                <FileText className="h-4 w-4 text-primary" />
                In This Guide
              </div>
              <div className="flex flex-wrap gap-2">
                {relatedSpokes.slice(0, 8).map(s => (
                  <Link
                    key={s.id}
                    to={`/learn/${s.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-foreground hover:bg-primary/10 hover:text-primary transition-colors border border-border"
                  >
                    {s.question || s.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:mt-10 prose-headings:mb-4 prose-headings:text-foreground prose-p:leading-relaxed prose-p:mb-6 prose-li:mb-2 prose-strong:text-foreground prose-strong:block prose-strong:mb-3 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-hr:my-10 [&_strong+br]:mb-4 [&_p>strong:first-child]:inline-block [&_p>strong:first-child]:mb-2">
            <ReactMarkdown>{hub.content}</ReactMarkdown>
          </div>
        </article>

        {/* FAQ Accordion from extracted headings */}
        {faqs.length > 2 && (
          <section className="bg-secondary/30 py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-sm text-muted-foreground">Quick answers to common questions</p>
                </div>
              </div>
              <Accordion type="multiple" className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-5 data-[state=open]:shadow-sm">
                    <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:text-primary py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:mb-3 prose-p:leading-relaxed">
                        <ReactMarkdown>{faq.answer}</ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* Related Spoke Pages */}
        {relatedSpokes.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Related Articles & Questions</h2>
                <p className="text-sm text-muted-foreground">Deep dives into specific topics</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSpokes.map(s => (
                <Link key={s.id} to={`/learn/${s.slug}`}>
                  <Card className="hover:border-primary/30 hover:shadow-md transition-all h-full group">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                          {s.page_type === "qa" ? "Q&A" : "Article"}
                        </Badge>
                        {s.published_at && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(s.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {s.question || s.title}
                      </h3>
                      {s.meta_description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{s.meta_description}</p>
                      )}
                      <div className="flex items-center gap-1 text-primary text-xs font-medium">
                        Read more <ChevronRight className="h-3 w-3" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Internal Links */}
        {hub.internal_links?.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-10 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-5">More from Youth & Soul</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {hub.internal_links.map((link: any, i: number) => (
                <Link key={i} to={link.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                  <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                  <span className="text-sm font-medium text-foreground">{link.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* External Authority Links */}
        {hub.external_links?.length > 0 && (
          <section className="bg-secondary/30 py-10">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Trusted Health Resources</h2>
                  <p className="text-xs text-muted-foreground">Verified sources for further reading</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {hub.external_links.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</div>
                      {link.description && <div className="text-xs text-muted-foreground mt-0.5">{link.description}</div>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Explore Other Topics */}
        <section className="max-w-6xl mx-auto px-4 py-12 border-t border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Explore Other Topics</h2>
          <div className="grid md:grid-cols-3 gap-3">
            {allHubs.filter(h => h.id !== hub.id).slice(0, 6).map(h => (
              <Link key={h.id} to={`/learn/${h.slug}`}>
                <Card className="hover:border-primary/30 hover:shadow-sm transition-all group">
                  <CardContent className="p-5">
                    <Badge variant="outline" className="mb-2 text-[10px] uppercase">{h.category}</Badge>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{h.hero_title}</h3>
                    {h.hero_subtitle && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{h.hero_subtitle}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Tags */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2">
            {(hub.tags?.length ? hub.tags : hub.keywords || []).map((k: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />{k.startsWith("#") ? k : `#${k}`}
              </Badge>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Take Action?</h2>
            <p className="text-muted-foreground mb-6">Get approved in under 5 minutes for doctor-supervised treatments.</p>
            <div className="flex gap-3 justify-center">
              <Link to="/weightloss-glp-intake"><Button size="lg">View Programs</Button></Link>
              <Link to="/search"><Button size="lg" variant="outline">Browse Products</Button></Link>
            </div>
          </div>
        </section>

        <Footer />
        <div className="md:hidden"><BottomNav /></div>
      </div>
    );
  }

  // ─── SPOKE PAGE ────────────────────────────────────────────
  if (spoke) {
    const stats = Array.isArray(spoke.stats) ? spoke.stats : [];
    const faqs = extractFAQs(spoke.content);

    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <MobileHeader />
        <Breadcrumbs items={[
          { label: "Learn", href: "/learn" },
          ...(parentHub ? [{ label: parentHub.category, href: `/learn/${parentHub.slug}` }] : []),
          { label: spoke.title },
        ]} />

        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="text-xs font-bold uppercase tracking-wider">
                {spoke.page_type === "qa" ? "Q&A" : "Article"}
              </Badge>
              {spoke.is_ai_generated && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="h-3 w-3" /> AI Research
                </Badge>
              )}
              {spoke.target_keyword && (
                <Badge variant="outline" className="text-xs">{spoke.target_keyword}</Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {spoke.h1_title || spoke.title}
            </h1>
            {spoke.question && spoke.question !== spoke.title && (
              <p className="text-lg text-muted-foreground italic border-l-4 border-primary/30 pl-4 mb-4">
                "{spoke.question}"
              </p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
              {spoke.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(spoke.published_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </span>
              )}
              {parentHub && (
                <Link to={`/learn/${parentHub.slug}`} className="flex items-center gap-1.5 text-primary hover:underline">
                  <BookOpen className="h-3.5 w-3.5" />
                  {parentHub.hero_title}
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        {stats.length > 0 && (
          <section className="bg-card border-y border-border">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.slice(0, 4).map((s: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-primary">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        <article className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:mt-10 prose-headings:mb-4 prose-headings:text-foreground prose-h2:text-2xl prose-h2:border-b prose-h2:border-border prose-h2:pb-3 prose-h3:text-xl prose-p:leading-relaxed prose-p:mb-6 prose-p:text-foreground/80 prose-li:mb-2 prose-strong:text-foreground prose-strong:block prose-strong:mb-3 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary/30 prose-blockquote:bg-primary/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-hr:my-10 prose-img:rounded-xl [&_p>strong:first-child]:inline-block [&_p>strong:first-child]:mb-2">
            <ReactMarkdown>{spoke.content}</ReactMarkdown>
          </div>
        </article>

        {/* FAQ Accordion */}
        {faqs.length > 2 && (
          <section className="bg-secondary/30 py-12 md:py-16">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                  <p className="text-sm text-muted-foreground">Quick answers from this article</p>
                </div>
              </div>
              <Accordion type="multiple" className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-xl px-5 data-[state=open]:shadow-sm">
                    <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:text-primary py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="prose prose-sm dark:prose-invert max-w-none prose-p:mb-3 prose-p:leading-relaxed">
                        <ReactMarkdown>{faq.answer}</ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </section>
        )}

        {/* Sources & References */}
        {spoke.sources?.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-10 md:py-12">
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Sources & References</h3>
                  <p className="text-xs text-muted-foreground">{spoke.sources.length} cited sources</p>
                </div>
              </div>
              <ul className="divide-y divide-border">
                {spoke.sources.map((s, i) => renderSource(s, i))}
              </ul>
            </div>
          </section>
        )}

        {/* External Authority Links */}
        {spoke.external_links?.length > 0 && (
          <section className="bg-secondary/30 py-10">
            <div className="max-w-4xl mx-auto px-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Trusted Health Resources</h2>
                  <p className="text-xs text-muted-foreground">Verified sources for further reading</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {spoke.external_links.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                  >
                    <ExternalLink className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{link.name}</div>
                      {link.description && <div className="text-xs text-muted-foreground mt-0.5">{link.description}</div>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">Ready to Take Action?</h2>
            <p className="text-muted-foreground mb-6">Get approved in under 5 minutes for doctor-supervised treatments.</p>
            <div className="flex gap-3 justify-center">
              {parentHub && (
                <Link to={`/programs/${parentHub.related_products_category || parentHub.category}`}>
                  <Button size="lg">View Programs</Button>
                </Link>
              )}
              <Link to="/search"><Button size="lg" variant="outline">Browse Products</Button></Link>
            </div>
          </div>
        </section>

        {/* Internal Links */}
        {spoke.internal_links?.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 py-10 border-t border-border">
            <h2 className="text-xl font-bold text-foreground mb-5">More from Youth & Soul</h2>
            <div className="grid md:grid-cols-2 gap-2">
              {spoke.internal_links.map((link: any, i: number) => (
                <Link key={i} to={link.path} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group">
                  <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform shrink-0" />
                  <span className="text-sm font-medium text-foreground">{link.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Reading */}
        {relatedSpokes.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 py-12">
            <h2 className="text-xl font-bold text-foreground mb-6">Related Reading</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedSpokes.map(s => (
                <Link key={s.id} to={`/learn/${s.slug}`}>
                  <Card className="hover:border-primary/30 hover:shadow-md transition-all group h-full">
                    <CardContent className="p-5">
                      <Badge variant="outline" className="mb-2 text-[10px] uppercase">{s.page_type}</Badge>
                      <h3 className="font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {s.question || s.title}
                      </h3>
                      {s.meta_description && (
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{s.meta_description}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Tags */}
        <section className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2">
            {(spoke.tags?.length ? spoke.tags : spoke.keywords || []).map((k: string, i: number) => (
              <Badge key={i} variant="outline" className="text-xs">
                <Tag className="h-3 w-3 mr-1" />{k.startsWith("#") ? k : `#${k}`}
              </Badge>
            ))}
          </div>
        </section>

        {/* Back link */}
        {parentHub && (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <Link to={`/learn/${parentHub.slug}`} className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
              <ArrowLeft className="h-4 w-4" /> Back to {parentHub.hero_title}
            </Link>
          </div>
        )}

        <Footer />
        <div className="md:hidden"><BottomNav /></div>
      </div>
    );
  }

  return null;
}
