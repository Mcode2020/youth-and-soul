import { Reveal } from "@/components/ui/Reveal";
import stepQuestionnaire from "@/assets/step-questionnaire.jpg";
import stepDoctor from "@/assets/step-doctor-portrait.jpg";
import stepDelivery from "@/assets/step-delivery-door.jpg";

const steps = [
  { 
    number: "1",
    title: "Take the medical questionnaire", 
    desc: "Start today with our easy online patient intake form",
    image: stepQuestionnaire,
  },
  { 
    number: "2",
    title: "Get prescribed", 
    desc: "All prescriptions overseen by fully licensed and insured physicians. Currently 3 Telemed Doctor Consultations Available Today (100% included with your purchase)",
    image: stepDoctor,
  },
  { 
    number: "3",
    title: "Get your meds", 
    desc: "Our pharmacy will compound your medication and deliver it direct to your door!",
    image: stepDelivery,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-10 md:py-20 bg-gradient-to-b from-[hsl(140,30%,97%)] to-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-14">
          <p className="text-primary text-xs md:text-sm font-semibold tracking-[0.2em] uppercase mb-2">
            How it works
          </p>
          <h3 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
            From questionnaire to your door in <span className="text-gradient-sage">3 easy steps</span>
          </h3>
        </div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            aria-hidden
            className="hidden md:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
          />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8 relative">
            {steps.map((step, idx) => (
              <Reveal
                key={step.title}
                delay={idx * 120}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative w-44 h-44 md:w-52 md:h-52 mb-5">
                  <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl scale-90 group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative w-full h-full rounded-3xl overflow-hidden lift ring-1 ring-border/60 bg-white">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-white font-extrabold text-base flex items-center justify-center shadow-lg shadow-primary/30 ring-4 ring-background">
                    {step.number}
                  </span>
                </div>
                <h4 className="font-bold text-foreground text-base md:text-lg mb-1.5">{step.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground max-w-xs leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
