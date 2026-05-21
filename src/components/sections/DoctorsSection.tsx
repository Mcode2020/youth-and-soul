import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "lucide-react";

import doctor1 from "@/assets/doctors/doctor-1.jpg";
import doctor2 from "@/assets/doctors/doctor-2.jpg";
import doctor3 from "@/assets/doctors/doctor-3.jpg";

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string | null;
  photo_url: string | null;
  testimonial: string;
}

const fallbackDoctors: Doctor[] = [
  { id: "1", name: "Dr. Lisa Hernandez", title: "MD", specialty: "Internal Medicine & Hormone Therapy", photo_url: doctor1, testimonial: "Our telehealth programs are designed with the same clinical rigor as in-person care. Every prescription is personalized based on comprehensive health evaluations, lab work, and ongoing monitoring. I'm proud to be part of a team that makes high-quality medicine accessible to everyone." },
  { id: "2", name: "Dr. Sarah Chen", title: "MD", specialty: "Endocrinology & Metabolic Health", photo_url: doctor2, testimonial: "What excites me most is seeing patients transform not just physically, but mentally and emotionally. Hormone optimization and metabolic health are deeply interconnected — when we get the balance right, patients experience improvements across every aspect of their lives." },
  { id: "3", name: "Dr. David Park", title: "DO", specialty: "Regenerative & Anti-Aging Medicine", photo_url: doctor3, testimonial: "The science behind NAD+ therapy and peptide protocols is advancing rapidly. We're not just treating symptoms — we're targeting the root mechanisms of aging and decline. My patients consistently report feeling 10-15 years younger within the first few months." },
];

export function DoctorsSection({ slug }: { slug: string }) {
  const { data: dbDoctors } = useQuery({
    queryKey: ["program-doctors", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_doctors")
        .select("*")
        .eq("program_slug", slug)
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const doctors: Doctor[] = dbDoctors && dbDoctors.length > 0
    ? dbDoctors.map((d) => ({
        id: d.id,
        name: d.name,
        title: d.title,
        specialty: d.specialty,
        photo_url: d.photo_url,
        testimonial: d.testimonial,
      }))
    : fallbackDoctors;

  return (
    <section className="bg-card border-y border-border">
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide mb-3">
            Our Medical Team
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Trusted by Leading Physicians
          </h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto">
            Board-certified doctors who believe in accessible, science-backed care.
          </p>
        </div>

        <div className={`grid gap-6 ${doctors.length <= 2 ? 'md:grid-cols-2 max-w-3xl mx-auto' : 'md:grid-cols-3'}`}>
          {doctors.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="bg-background rounded-2xl border border-border/50 p-6 flex flex-col items-center text-center shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-3 border-primary/20 mb-4 bg-muted/30">
                {doc.photo_url ? (
                  <img
                    src={doc.photo_url}
                    alt={doc.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground">{doc.name}</h3>
              <p className="text-xs text-primary font-medium mb-1">{doc.title}</p>
              {doc.specialty && (
                <p className="text-[11px] text-muted-foreground mb-4">{doc.specialty}</p>
              )}
              <Quote className="w-4 h-4 text-primary/40 mb-2" />
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {doc.testimonial}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
