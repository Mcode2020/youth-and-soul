import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CheckCircle, ArrowRight, Clock, Stethoscope, Package } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { telehealthPrograms } from "@/data/telehealthPrograms";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function EnrollSuccess() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const program = telehealthPrograms.find((p) => p.slug === slug);
  useSEOHead({
    title: "Enrollment Confirmed",
    description: "Your Youth & Soul telehealth enrollment has been received. A licensed clinician will review your intake within 24 hours.",
    path: `/enroll-success/${slug || ""}`,
    noIndex: true,
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      <div className="max-w-2xl mx-auto px-4 py-16 md:py-24 text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          You're all set!
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
          Your enrollment has been submitted. Here's what happens next:
        </p>

        <div className="grid gap-4 md:gap-6 text-left mb-12">
          {[
            { icon: Clock, title: "Doctor Review (24-48 hrs)", desc: "A licensed physician will review your medical history and treatment request." },
            { icon: Stethoscope, title: "Prescription Approved", desc: "If approved, your doctor will write your prescription and you'll receive a confirmation email." },
            { icon: Package, title: "Shipped to Your Door", desc: "Your medication ships from a licensed pharmacy in discreet packaging with free delivery." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-4 bg-card rounded-2xl border border-border p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{title}</h3>
                <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </button>
          {program && (
            <button
              onClick={() => navigate(`/programs/${program.slug}`)}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors"
            >
              View Plans
            </button>
          )}
        </div>
      </div>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
