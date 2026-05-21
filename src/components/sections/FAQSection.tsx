import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does the program cost?",
    answer:
      "Our plans start from just $39/month depending on the program. Each plan includes doctor consultations, personalized prescriptions, and ongoing support. Visit any program page to see detailed tier pricing.",
  },
  {
    question: "Will this work for me?",
    answer:
      "Our doctor-led programs are personalized to your health profile, goals, and medical history. During your consultation (which takes under 5 minutes), our physicians assess your needs and prescribe the most effective treatment plan for you.",
  },
  {
    question: "What if my insurance doesn't cover the medication?",
    answer:
      "Many of our programs offer affordable self-pay options that are often cheaper than insurance co-pays. We also provide exclusive discount codes on 375+ products in our marketplace to help reduce costs.",
  },
  {
    question: "What can I expect after I sign up?",
    answer:
      "After signing up, you'll complete a quick medical intake form. A licensed physician reviews your information and prescribes your personalized plan — usually within hours. Medications are shipped directly to your door with free expedited delivery.",
  },
  {
    question: "Are the doctors licensed and legitimate?",
    answer:
      "Yes. Every physician on our platform is board-certified and licensed in your state. Youth & Soul is committed to being the most ethical online telehealth company — we never use AI-generated doctor profiles or fake testimonials.",
  },
  {
    question: "Can I cancel my plan anytime?",
    answer:
      "Absolutely. All our plans are month-to-month with no long-term contracts. You can cancel, pause, or change your plan at any time from your dashboard.",
  },
];

export function FAQSection() {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-foreground text-center mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="bg-[hsl(145,30%,95%)] border border-[hsl(145,30%,80%)]/40 rounded-2xl px-6 data-[state=open]:shadow-sm"
            >
              <AccordionTrigger className="text-left text-base md:text-lg font-semibold text-foreground hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm md:text-base text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
