import { useParams, useNavigate } from "react-router-dom";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { ArrowLeft, Clock, TrendingUp, Share2 } from "lucide-react";
import { useSEOHead } from "@/hooks/useSEOHead";

const articleContent: Record<string, {
  title: string;
  category: string;
  readTime: string;
  views: number;
  image: string;
  content: string[];
}> = {
  "what-nmn-does": {
    title: "What NMN Does (and Doesn't Do)",
    category: "Longevity",
    readTime: "5 min read",
    views: 12453,
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&q=80",
    content: [
      "Nicotinamide mononucleotide (NMN) has exploded in popularity as a longevity supplement, largely thanks to research by Dr. David Sinclair at Harvard. But what does the science actually say?",
      "NMN is a precursor to NAD+ (nicotinamide adenine dinucleotide), a critical coenzyme found in every cell of your body. NAD+ levels naturally decline with age, and this decline is associated with many hallmarks of aging including mitochondrial dysfunction, DNA damage, and cellular senescence.",
      "What NMN Does: Studies in mice have shown that NMN supplementation can restore NAD+ levels, improve insulin sensitivity, enhance energy metabolism, and even reverse some age-related gene expression changes. A landmark 2021 human trial published in Science showed NMN improved muscle insulin sensitivity in prediabetic women.",
      "What NMN Doesn't Do: NMN is not a magic anti-aging pill. It won't reverse wrinkles overnight, cure diseases, or make you look 20 years younger. The human evidence is still early-stage, and most dramatic results come from animal studies that may not fully translate to humans.",
      "The Bottom Line: NMN shows genuine promise as a longevity supplement backed by solid mechanistic science. However, consumers should have realistic expectations and choose high-quality, third-party tested products. Look for brands that provide certificates of analysis and use stabilized forms of NMN.",
    ],
  },
  "botox-alternatives": {
    title: "Botox Alternatives That Actually Help",
    category: "Anti-Aging",
    readTime: "4 min read",
    views: 8932,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80",
    content: [
      "Botox has been the gold standard for reducing wrinkles for decades, but not everyone wants injections. The good news? There are several evidence-based alternatives that can genuinely help reduce the appearance of fine lines and wrinkles.",
      "Retinoids remain the most well-studied topical anti-aging ingredient. Prescription tretinoin and over-the-counter retinol both stimulate collagen production and accelerate cell turnover. Results typically appear after 12 weeks of consistent use.",
      "Peptides like Matrixyl (palmitoyl pentapeptide-4) and Argireline (acetyl hexapeptide-3) have shown promise in clinical trials. Argireline, sometimes called 'Botox in a bottle,' works by relaxing facial muscles — though its effects are milder than actual Botox.",
      "Microcurrent devices deliver low-level electrical currents that stimulate facial muscles and boost ATP production. The NuFACE and ZIIP devices have gained popularity, with some studies showing temporary lifting and toning effects.",
      "Topical niacinamide (vitamin B3) at concentrations of 4-5% has been shown to improve skin elasticity, reduce hyperpigmentation, and strengthen the skin barrier. It's gentle enough for sensitive skin and pairs well with most other actives.",
      "While none of these alternatives will replicate the dramatic, immediate results of Botox, a consistent routine combining retinoids, peptides, and good sun protection can significantly slow visible aging and improve skin quality over time.",
    ],
  },
  "athlete-safe-supplements": {
    title: "What Athlete-Safe Really Means",
    category: "Sports",
    readTime: "3 min read",
    views: 6721,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80",
    content: [
      "For competitive athletes, supplement safety goes beyond just quality — it means ensuring products are free from substances banned by the World Anti-Doping Agency (WADA). But what does 'athlete-safe' actually mean, and how can you verify it?",
      "Third-party certification programs like NSF Certified for Sport, Informed Sport, and BSCG (Banned Substances Control Group) test supplements for over 270+ banned substances. These certifications involve batch testing, facility audits, and ongoing monitoring.",
      "The risk is real: studies have found that up to 25% of supplements sold online contain undeclared banned substances. Even trace contamination from shared manufacturing equipment can trigger a positive drug test and end an athlete's career.",
      "At Youth&Soul, we clearly label athlete-safe products with a shield badge, making it easy for competitive athletes to shop with confidence. Every product with this badge has been verified through an accredited third-party testing program.",
    ],
  },
  "nad-boosters-science": {
    title: "The Science Behind NAD+ Boosters",
    category: "Science",
    readTime: "7 min read",
    views: 15234,
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80",
    content: [
      "NAD+ (nicotinamide adenine dinucleotide) is arguably the most important molecule in longevity science right now. It's essential for over 500 enzymatic reactions in your body, including DNA repair, energy metabolism, and circadian rhythm regulation.",
      "As we age, NAD+ levels decline by roughly 50% every 20 years. This decline is linked to virtually every hallmark of aging: mitochondrial dysfunction, genomic instability, cellular senescence, and chronic inflammation.",
      "There are two main precursors used to boost NAD+: NMN (nicotinamide mononucleotide) and NR (nicotinamide riboside). Both are converted into NAD+ through different metabolic pathways. NMN is one step closer to NAD+ in the biosynthesis pathway, which some researchers argue makes it more efficient.",
      "The sirtuin connection is key: NAD+ activates a family of proteins called sirtuins (SIRT1-7), which regulate gene expression, DNA repair, and metabolic pathways. Dr. David Sinclair's research has shown that boosting NAD+ can reactivate sirtuins and potentially reverse aspects of aging at the cellular level.",
      "Clinical evidence is growing. Human trials have shown that NMN supplementation is safe and can increase blood NAD+ levels. A 2022 study showed improved aerobic capacity in middle-aged runners taking NMN. However, long-term human studies on lifespan extension are still underway.",
      "When choosing a NAD+ booster, look for: third-party testing for purity (>98%), proper storage (some forms are heat-sensitive), and realistic dosing based on published research (typically 250-1000mg daily for NMN).",
    ],
  },
  "collagen-myths-reality": {
    title: "Collagen: Myths vs Reality",
    category: "Beauty",
    readTime: "6 min read",
    views: 9876,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1200&q=80",
    content: [
      "Collagen supplements are a multi-billion dollar industry, but there's still confusion about what they can and can't do. Let's separate the science from the marketing hype.",
      "Myth: 'Collagen you eat goes straight to your skin.' Reality: When you ingest collagen, your body breaks it down into amino acids and peptides. These fragments may signal your body to produce more collagen, but they don't travel intact to your skin.",
      "What the science says: Multiple randomized controlled trials have shown that hydrolyzed collagen peptides (types I and III) can improve skin elasticity, hydration, and reduce wrinkle depth after 8-12 weeks of daily supplementation at doses of 2.5-10g.",
      "Not all collagen is equal: Marine collagen (from fish) has smaller peptide sizes and may be better absorbed than bovine collagen. Look for 'hydrolyzed' collagen peptides rather than gelatin, which has larger molecules and lower bioavailability.",
      "Beyond skin: Collagen supplementation has also shown benefits for joint health, with studies demonstrating reduced joint pain in athletes and people with osteoarthritis. Type II collagen is specifically researched for joint support.",
      "The bottom line: Collagen supplements do work, but results take time (8-12 weeks minimum) and depend on quality, dose, and consistency. They work best as part of a comprehensive approach that includes sun protection, vitamin C intake, and adequate protein.",
    ],
  },
  "rapamycin-anti-aging": {
    title: "Rapamycin: The Anti-Aging Drug",
    category: "Research",
    readTime: "8 min read",
    views: 21098,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&q=80",
    content: [
      "Rapamycin is the only drug consistently shown to extend lifespan across multiple species — from yeast to mice. Originally developed as an immunosuppressant for organ transplant patients, it's now at the forefront of anti-aging research.",
      "How it works: Rapamycin inhibits mTOR (mechanistic target of rapamycin), a protein complex that regulates cell growth, metabolism, and autophagy. By suppressing mTOR, rapamycin mimics some effects of caloric restriction — the only other intervention consistently shown to extend lifespan in animals.",
      "The mouse data is remarkable: rapamycin extended median lifespan by 9-14% even when started late in life. It reduced cancer incidence, improved cardiac function, and enhanced immune response in aged mice.",
      "Human use is controversial: While some longevity physicians prescribe low-dose rapamycin off-label, it's not FDA-approved for anti-aging. Side effects at immunosuppressive doses include increased infection risk, metabolic changes, and mouth ulcers.",
      "The 'rapalog' approach: Researchers are developing rapamycin analogs (rapalogs) that may offer anti-aging benefits with fewer side effects. Several clinical trials are underway testing low-dose, intermittent rapamycin regimens in healthy older adults.",
      "Important caveat: Self-medicating with rapamycin is risky. It requires medical supervision, regular blood monitoring, and careful dose management. The longevity community is watching ongoing clinical trials closely for definitive human evidence.",
    ],
  },
};

const articleSlugs: Record<string, string> = {
  "What NMN Does (and Doesn't Do)": "what-nmn-does",
  "Botox Alternatives That Actually Help": "botox-alternatives",
  "What Athlete-Safe Really Means": "athlete-safe-supplements",
  "The Science Behind NAD+ Boosters": "nad-boosters-science",
  "Collagen: Myths vs Reality": "collagen-myths-reality",
  "Rapamycin: The Anti-Aging Drug": "rapamycin-anti-aging",
};

export { articleSlugs };

export default function Article() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = slug ? articleContent[slug] : null;

  useSEOHead({
    title: article?.title || "Article Not Found",
    description: article ? (article.content[0]?.slice(0, 160) || article.title) : "Article not found on Youth & Soul.",
    path: `/article/${slug || ""}`,
    type: article ? "article" : "website",
    ogImage: article?.image,
    keywords: article ? `${article.category}, ${article.title}, longevity, health, supplements` : undefined,
    noIndex: !article,
    article: article ? {
      author: "Youth & Soul Editorial",
      section: article.category,
      tags: [article.category, "longevity", "health"],
    } : undefined,
    jsonLd: article ? {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.content[0]?.slice(0, 200),
      image: [article.image],
      articleSection: article.category,
      url: `https://youthandsoul.com/article/${slug}`,
      author: { "@type": "Organization", name: "Youth & Soul" },
      publisher: { "@id": "https://youthandsoul.com/#organization" },
      mainEntityOfPage: `https://youthandsoul.com/article/${slug}`,
      inLanguage: "en-US",
    } : undefined,
  });

  if (!article) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-0">
        <MobileHeader />
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl text-foreground mb-4">Article Not Found</h1>
          <button onClick={() => navigate("/")} className="text-primary hover:underline">
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      <main className="max-w-3xl mx-auto px-4 py-6 md:py-12">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Hero image */}
        <div className="relative aspect-[2/1] rounded-2xl overflow-hidden mb-6">
          <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
              {article.category}
            </span>
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {article.readTime}
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {(article.views / 1000).toFixed(1)}k views
          </div>
          <button className="ml-auto flex items-center gap-1 text-primary hover:text-primary/80">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-4xl text-foreground mb-6">{article.title}</h1>

        {/* Content */}
        <div className="prose prose-sm md:prose-base max-w-none">
          {article.content.map((paragraph, i) => (
            <p key={i} className="text-foreground/80 leading-relaxed mb-4 text-sm md:text-base">
              {paragraph}
            </p>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 p-6 bg-card rounded-2xl border border-border/50 text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Explore Related Products</h3>
          <p className="text-sm text-muted-foreground mb-4">Find the best {article.category.toLowerCase()} products reviewed by our community</p>
          <button
            onClick={() => navigate(`/search?category=${encodeURIComponent(article.category)}`)}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Browse {article.category} Products
          </button>
        </div>
      </main>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
