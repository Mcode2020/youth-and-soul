import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Heart, Award, Users, Globe, Mic, Trophy, Tv, Globe2, Star, Target, Sparkles } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import joAnkierPortrait from "@/assets/jo-ankier-portrait.png";
import joAnkierTnt from "@/assets/jo-ankier-tnt.png";
import joAnkierAthletics from "@/assets/jo-ankier-athletics.png";
import { useSEOHead } from "@/hooks/useSEOHead";

const interviewQA = [
  {
    q: "What inspired you to create Youth&Soul?",
    a: "As an international athlete and broadcaster, I've spent my entire career pushing the boundaries of human performance. I saw first-hand how access to the best longevity and anti-aging science was limited to elite athletes and celebrities. Youth&Soul was born from a desire to democratize that access — to make cutting-edge healthspan products, tele-health consultations, and evidence-based protocols available to everyone, not just the privileged few.",
  },
  {
    q: "Why launch a longevity marketplace now?",
    a: "The longevity industry is at an inflection point. We've gone from fringe biohacking to FDA-approved medications like GLP-1 agonists that genuinely change lives. Consumers are overwhelmed by choices and misinformation. Youth&Soul curates the noise — we vet every product, partner with board-certified doctors, and provide transparent, real-customer reviews. The timing couldn't be more critical.",
  },
  {
    q: "What does it mean to be an 'ethical telehealth company'?",
    a: "Ethics in telehealth means transparency at every level. We never push unnecessary medications. Our doctors conduct genuine consultations — not rubber-stamp prescriptions. We disclose all pricing upfront with no hidden fees. We partner with licensed clinician networks like OpenLoop to ensure every patient interaction meets the highest medical standards. Being ethical isn't a marketing tagline for us — it's the foundation of our business model.",
  },
  {
    q: "How does your athletic background shape Youth&Soul's mission?",
    a: "Holding three British National Records taught me discipline, but more importantly, it taught me about the body's incredible potential when given the right tools. As an athlete, I learned that performance isn't just about training — it's about recovery, nutrition, hormonal balance, and sleep. Youth&Soul channels that holistic understanding into products and programs that help everyday people optimize their healthspan.",
  },
  {
    q: "You've covered four Olympic Games and interviewed legends like Roger Federer and Jurgen Klopp. How does that experience translate to building a health platform?",
    a: "Broadcasting at the highest level taught me how to identify excellence and communicate complex stories simply. At ESPN, I anchored Sports Center live to 55 countries — you learn quickly how to cut through noise and deliver what matters. That's exactly what Youth&Soul does in the health space. We cut through the supplement industry noise and deliver what actually works, backed by evidence and expert endorsement.",
  },
  {
    q: "Why is longevity more than just 'anti-aging'?",
    a: "Longevity isn't about looking younger — it's about living better, longer. It's about maintaining cognitive sharpness at 70, physical vitality at 80, and emotional resilience throughout. The science now supports interventions like NAD+ therapy, peptides, and metabolic optimization that genuinely extend healthspan. Youth&Soul makes these interventions accessible and understandable for the average consumer.",
  },
  {
    q: "What role does community play at Youth&Soul?",
    a: "Community is everything. We're not just a marketplace — we're a movement. Our platform thrives on real reviews from real customers, not paid endorsements. When someone shares their GLP-1 transformation or their experience with a longevity peptide, that authentic voice helps others make informed decisions. We've built a space where health-conscious individuals can learn, share, and grow together.",
  },
  {
    q: "How do you ensure product quality on the platform?",
    a: "Every product listed on Youth&Soul goes through a rigorous vetting process. We evaluate clinical evidence, ingredient transparency, manufacturing standards, and customer outcomes. Our marketplace model — with a 15% commission and no upfront fees — means only products that genuinely perform will thrive. If it doesn't deliver results, it doesn't survive on our platform. Simple as that.",
  },
  {
    q: "What's your vision for Youth&Soul in the next five years?",
    a: "I want Youth&Soul to be the definitive destination for anyone serious about their healthspan. That means expanding our telehealth programs into new areas — cognitive optimization, gut health protocols, hormonal balance for men and women. I see us partnering with leading research institutions, offering AI-powered personalized health plans, and building the largest verified community of longevity enthusiasts in the world.",
  },
  {
    q: "As a United Nations Sports for Peace ambassador, how does that influence your work?",
    a: "The UN ambassadorial role reinforced my belief in the transformative power of health and sport. Health equity is a global issue — access to quality healthcare shouldn't depend on geography or wealth. Youth&Soul is built on that principle. Whether you're in London, Los Angeles, or Lagos, you deserve access to the best longevity science available. That's the future we're building.",
  },
];

const milestones = [
  { icon: Trophy, label: "3 British National Records", desc: "International athletics" },
  { icon: Tv, label: "4 Olympic Games", desc: "ESPN & Olympic Channel" },
  { icon: Mic, label: "ESPN Sports Center", desc: "Lead anchor, 55 countries" },
  { icon: Globe2, label: "UN Sports for Peace", desc: "Global ambassador" },
  { icon: Star, label: "Laureus Awards", desc: "Host & interviewer" },
  { icon: Award, label: "2012 Olympics Video", desc: "With Beckham & Khan" },
];

const About = () => {
  useSEOHead({
    title: "About Jo Ankier & Youth & Soul | Longevity Marketplace",
    description: "Meet Jo Ankier — former international athlete, ESPN broadcaster, and co-founder of Youth & Soul. Learn why she's building the world's most ethical longevity marketplace.",
    path: "/about",
    keywords: "Jo Ankier, Youth and Soul founder, longevity marketplace, ethical telehealth, GLP-1, anti-aging",
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "About" }]} />

      {/* Hero Banner */}
      <div className="relative w-full h-[340px] md:h-[480px] overflow-hidden">
        <img
          src={joAnkierTnt}
          alt="Jo Ankier broadcasting live at TNT Sports"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            About Youth&Soul
          </h1>
          <p className="text-sm md:text-lg text-white/90 max-w-2xl mx-auto drop-shadow">
            The trusted marketplace for longevity and anti-aging. Backed by science, real reviews, and functional beauty.
          </p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {/* Mission */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-12 md:mb-20">
          <div className="space-y-4">
            <h2 className="text-xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>Our Mission</h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              We believe everyone deserves access to the best longevity and anti-aging products, backed by real science and genuine community reviews. Youth&Soul connects consumers with vetted brands, expert tele-health consultations, and a passionate community of health-conscious individuals.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Our platform operates on a fair marketplace model — no upfront fees for sellers, just a 15% commission when products sell. This ensures only quality products thrive.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Heart, label: "Science-Backed", desc: "Every product reviewed by experts" },
              { icon: Award, label: "Quality First", desc: "Rigorous vetting process" },
              { icon: Users, label: "Community Driven", desc: "Real reviews from real people" },
              { icon: Globe, label: "Accessible", desc: "Insider prices for everyone" },
            ].map((item) => (
              <div key={item.label} className="p-4 bg-card rounded-xl border border-border/50 text-center">
                <item.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.label}</h3>
                <p className="text-[10px] text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Jo Ankier Full Profile ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">Meet the Founder</span>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Jo Ankier
            </h2>
            <p className="text-primary font-semibold text-sm md:text-base">Co-Founder & CEO</p>
          </div>

          {/* Portrait + Bio */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-12">
            <img
              src={joAnkierPortrait}
              alt="Jo Ankier portrait"
              className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover shadow-xl shrink-0"
            />
            <div className="space-y-4">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Joanna Ankier is a former international athlete who held three British National Records and is now a prominent television personality. She has covered four Olympic Games for ESPN and the Olympic Channel, anchored ESPN's flagship <strong>Sports Center</strong> live to 55 countries, and currently hosts for BT Sport Boxing and reports for Amazon Prime Video.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                After achieving a 2:1 from the University of Nottingham in Physics and Philosophy, Jo followed her BSc with a Diploma in Sports Law and Media Law from King's College London. In 2005, she was selected as the focal athlete in the promotional video for the 2012 Olympic Games alongside David Beckham, Amir Khan, and other British sporting icons.
              </p>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                A champion of sustainability and wellness, Jo founded Youth&Soul to bridge the gap between cutting-edge longevity science and everyday consumers — making anti-aging, functional beauty, and healthspan products accessible to everyone.
              </p>
            </div>
          </div>

          {/* Milestones */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {milestones.map((m) => (
              <div key={m.label} className="p-4 bg-card rounded-xl border border-border/50 text-center">
                <m.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <h4 className="text-xs font-bold text-foreground mb-0.5">{m.label}</h4>
                <p className="text-[10px] text-muted-foreground">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Athletics banner */}
          <div className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden mb-12">
            <img
              src={joAnkierAthletics}
              alt="Jo Ankier competing in international athletics"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
              <div className="px-6 md:px-10 max-w-md">
                <p className="text-lg md:text-2xl font-bold text-foreground leading-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                  "Performance isn't just about training — it's about recovery, nutrition, and optimizing your healthspan."
                </p>
                <p className="text-xs text-muted-foreground mt-2">— Jo Ankier</p>
              </div>
            </div>
          </div>

          {/* Broadcasting Career */}
          <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-10 mb-12">
            <h3 className="text-lg md:text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Broadcasting Career
            </h3>
            <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              <p>
                Having spent much time in the United States training and competing, Jo was already known in sports circles on both sides of the Atlantic. A one-off ESPN International assignment in Jamaica quickly led to a seven-year contract covering major global events.
              </p>
              <p>
                As lead anchor for ESPN's <strong>Sports Center</strong>, Jo broadcast live to 55 countries from the London Olympic Games. She went on to report from the Rio Olympics, host the ESPY Awards red carpet, anchor the X Games and America's Cup Sailing, and cover the IAAF World Championships. Her West Coast reporting spanned NBA, boxing, cycling, and more.
              </p>
              <p>
                Jo also dedicated time to anchor Major League Soccer's <strong>Kick TV</strong> and from 2014–2018 served as anchor and reporter for USA's <strong>The Tennis Channel</strong>. In 2018, she created sports news content for TRT's <strong>Beyond the Game</strong>, securing exclusive Champions League final interviews with Jurgen Klopp, Jordan Henderson, Sadio Mane, and Steven Gerrard.
              </p>
              <p>
                At the 2018 Laureus World Sports Awards, Jo obtained interviews with Roger Federer, Boris Becker, Ryan Giggs, Alessandro Del Piero, Steve Waugh, and Hope Solo. After eight years of international broadcasting, she returned home to London to connect her vast experience with her Team GB roots.
              </p>
            </div>
          </div>

          {/* Ambassadorial & Corporate */}
          <div className="bg-primary/5 rounded-2xl p-6 md:p-10 mb-16">
            <div className="flex items-center gap-3 mb-4">
              <Globe2 className="w-6 h-6 text-primary" />
              <h3 className="text-lg md:text-xl font-bold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                Global Ambassador & Corporate Speaker
              </h3>
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Jo inspires others through the power of sport via ambassadorial roles including the <strong>United Nations Sports for Peace</strong> and <strong>London 2012 Olympics</strong> appointments. She continues to thrive in the corporate arena — hosting panel discussions and awards ceremonies, delivering keynote speeches, and conducting high-profile interviews at events worldwide.
            </p>
          </div>
        </section>

        {/* ── Interview Q&A ── */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent-foreground text-xs font-bold uppercase tracking-wider mb-4">Exclusive Interview</span>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Why Longevity, Why Now?
            </h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
              Jo Ankier on building the world's most ethical telehealth & longevity marketplace.
            </p>
          </div>

          <div className="space-y-6">
            {interviewQA.map((item, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 md:p-8">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">Q{i + 1}</span>
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-foreground leading-snug">
                    {item.q}
                  </h3>
                </div>
                <div className="ml-11">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-10 md:py-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl px-6 mb-8">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="text-xl md:text-3xl font-bold text-foreground mb-3" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Join the Longevity Movement
          </h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
            Explore our curated marketplace of science-backed products, doctor-prescribed programs, and a community that cares about living better, longer.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="/products" className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              Explore Products
            </a>
            <a href="/weightloss-glp-intake" className="px-6 py-3 bg-card border border-border text-foreground rounded-xl text-sm font-semibold hover:bg-secondary transition-colors">
              View Programs
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
};

export default About;
