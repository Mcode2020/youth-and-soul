import { useSEOHead } from "@/hooks/useSEOHead";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { MinimalFooter } from "@/components/layout/MinimalFooter";
import { BottomNav } from "@/components/ui/BottomNav";
import lozengesImg from "@/assets/ys-lozenges-jar.jpg";
import hyposprayImg from "@/assets/ys-hypospray-product.png";

const sections = [
  {
    id: "wegovy-isi",
    title: "Wegovy® (semaglutide) injection",
    warning: "In studies with mice and rats, semaglutide (the active ingredient in Wegovy and Ozempic) caused thyroid tumors, including thyroid cancer. It is not known if Wegovy will cause thyroid tumors or a type of thyroid cancer called medullary thyroid carcinoma (MTC) in people. Tell your provider if you get a lump or swelling in your neck, hoarseness, trouble swallowing, or shortness of breath. These may be symptoms of thyroid cancer.",
    warningExtra: "Do not use Wegovy if you or any of your family have ever had a type of thyroid cancer called medullary thyroid carcinoma (MTC) or if you have an endocrine system condition called Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    use: "Wegovy is used along with a reduced-calorie diet and increased physical activity for chronic weight management in adults with obesity or with overweight plus a weight-related condition. It is also used to reduce the risk of major adverse cardiovascular events in adults with known cardiovascular disease and with either obesity or overweight.",
    seriousSideEffects: [
      "Thyroid C-Cell Tumors",
      "Inflammation of Pancreas (Acute Pancreatitis)",
      "Acute Gallbladder Disease",
      "Low Blood Sugar (Hypoglycemia)",
      "Acute Kidney Injury",
      "Severe Gastrointestinal Adverse Reactions",
      "Serious Allergic Reactions",
      "Diabetic Retinopathy Complications",
      "Increase in Heart Rate",
      "Pulmonary Aspiration During General Anesthesia",
    ],
    commonSideEffects: ["Nausea", "Diarrhea", "Vomiting", "Constipation", "Abdominal pain", "Headache", "Fatigue", "Dyspepsia", "Dizziness", "Abdominal distension", "Belching", "Flatulence", "Gastroenteritis", "Gastroesophageal reflux disease"],
    prescribingInfoUrl: "https://www.novo-pi.com/wegovy.pdf",
  },
  {
    id: "lozenges-isi",
    title: "Semaglutide & Tirzepatide Lozenges",
    priceLabel: "From $149/Month",
    image: lozengesImg,
    warning: "In studies with rodents, semaglutide and tirzepatide caused thyroid C-cell tumors, including thyroid cancer. It is not known if these medications will cause thyroid tumors or a type of thyroid cancer called medullary thyroid carcinoma (MTC) in people. Tell your provider if you get a lump or swelling in your neck, hoarseness, trouble swallowing, or shortness of breath. These may be symptoms of thyroid cancer.",
    warningExtra: "Do not use these medications if you or any of your family have ever had a type of thyroid cancer called medullary thyroid carcinoma (MTC) or if you have an endocrine system condition called Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    use: "Youth & Soul Semaglutide & Tirzepatide Lozenges are used along with a reduced-calorie diet and increased physical activity for chronic weight management in adults with obesity or with overweight plus a weight-related condition.",
    seriousSideEffects: [
      "Thyroid C-Cell Tumors",
      "Severe Gastrointestinal Disease",
      "Acute Kidney Injury",
      "Acute Gallbladder Disease",
      "Inflammation of Pancreas (Acute Pancreatitis)",
      "Allergic Reactions",
      "Low Blood Sugar (Hypoglycemia)",
      "Diabetic Retinopathy Complications",
      "Pulmonary Aspiration During General Anesthesia",
    ],
    commonSideEffects: ["Nausea", "Diarrhea", "Vomiting", "Constipation", "Stomach pain", "Indigestion", "Injection site reactions", "Fatigue", "Allergic reactions", "Belching", "Hair loss", "Gastroesophageal reflux disease"],
    prescribingInfoUrl: "https://uspl.lilly.com/zepbound/zepbound.html",
  },
  {
    id: "ozempic-isi",
    title: "Ozempic® (semaglutide) injection",
    warning: "In studies with mice and rats, semaglutide (the active ingredient in Ozempic and Wegovy) caused thyroid tumors, including thyroid cancer. It is not known if Ozempic will cause thyroid tumors or a type of thyroid cancer called medullary thyroid carcinoma (MTC) in people. Tell your provider if you get a lump or swelling in your neck, hoarseness, trouble swallowing, or shortness of breath. These may be symptoms of thyroid cancer.",
    warningExtra: "Do not use Ozempic if you or any of your family have ever had a type of thyroid cancer called medullary thyroid carcinoma (MTC) or if you have an endocrine system condition called Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    use: "Ozempic is a GLP-1 receptor agonist used with diet and exercise to improve glycemic control in patients with type 2 diabetes mellitus, and to reduce the risk of major adverse cardiovascular events in patients with type 2 diabetes and established cardiovascular disease.",
    seriousSideEffects: [
      "Thyroid C-Cell Tumors",
      "Inflammation of Pancreas (Acute Pancreatitis)",
      "Diabetic Retinopathy Complications",
      "Low Blood Sugar (Hypoglycemia)",
      "Acute Kidney Injury",
      "Serious Allergic Reactions",
      "Acute Gallbladder Disease",
      "Increase in Heart Rate",
    ],
    commonSideEffects: ["Nausea", "Vomiting", "Diarrhea", "Stomach pain", "Constipation"],
    prescribingInfoUrl: "https://www.novo-pi.com/ozempic.pdf",
  },
  {
    id: "hypospray-isi",
    title: "Tirzepatide Hypospray",
    priceLabel: "$189/Month",
    image: hyposprayImg,
    warning: "In rodents, tirzepatide caused thyroid C-cell tumors, including thyroid cancer. It is not known whether tirzepatide causes these tumors in people. Tell your provider if you get a lump or swelling in your neck, hoarseness, trouble swallowing, or shortness of breath. These may be symptoms of thyroid cancer.",
    warningExtra: "Do not use this product if you or any of your family have ever had a type of thyroid cancer called medullary thyroid carcinoma (MTC) or if you have a condition called Multiple Endocrine Neoplasia syndrome type 2 (MEN 2).",
    use: "Youth & Soul Dual GLP/GLP-1 Tirzepatide Body Hypo-Spray is used along with a reduced-calorie diet and increased physical activity to reduce and maintain weight in adults with obesity or with overweight plus a weight-related condition.",
    seriousSideEffects: [
      "Thyroid C-Cell Tumors",
      "Inflammation of Pancreas (Acute Pancreatitis)",
      "Severe Gastrointestinal Disease",
      "Acute Kidney Injury",
      "Low Blood Sugar (Hypoglycemia)",
      "Allergic Reactions",
      "Diabetic Retinopathy Complications",
      "Acute Gallbladder Disease",
      "Pulmonary Aspiration During General Anesthesia",
    ],
    commonSideEffects: ["Nausea", "Constipation", "Diarrhea", "Vomiting", "Indigestion", "Stomach pain", "Headache", "Bloating", "Fatigue", "Belching", "Gastroesophageal reflux disease", "Flatulence", "Hair loss"],
    prescribingInfoUrl: "https://uspl.lilly.com/foundayo/foundayo.html",
  },
];

export default function SafetyInfoGLP1() {
  useSEOHead({
    title: "Important Safety Info for GLP-1s — Youth & Soul",
    description: "Important safety information, including boxed warnings, for GLP-1 medications including Wegovy, Zepbound, Ozempic, and Foundayo.",
    path: "/safety-info/glp1",
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />

      <main className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-2xl md:text-4xl font-black text-foreground mb-4">
          Important Safety Info for GLP-1s
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mb-8">
          See Important Safety Information, including Boxed Warning, about:
        </p>

        <nav className="mb-10 space-y-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="block text-primary text-sm underline underline-offset-2 hover:text-primary/80"
            >
              {s.title}
            </a>
          ))}
        </nav>

        <div className="space-y-14">
          {sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              {(s as any).image && (
                <div className="flex items-center gap-4 mb-5 p-4 bg-muted/40 rounded-2xl border border-border">
                  <img src={(s as any).image} alt={s.title} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl flex-shrink-0" loading="lazy" />
                  <div>
                    <p className="font-bold text-foreground text-sm md:text-base leading-tight">{s.title}</p>
                    {(s as any).priceLabel && (
                      <p className="text-primary font-semibold text-sm md:text-base mt-1">{(s as any).priceLabel}</p>
                    )}
                  </div>
                </div>
              )}
              <h2 className="text-lg md:text-2xl font-bold text-foreground mb-4">
                Important Safety Information for {s.title}
              </h2>

              <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-4 md:p-6 mb-6">
                <h3 className="font-bold text-destructive text-sm md:text-base mb-2">
                  ⚠️ Warning: Risk of Thyroid C-Cell Tumors
                </h3>
                <p className="text-xs md:text-sm text-foreground leading-relaxed mb-3 font-semibold">
                  {s.warning}
                </p>
                <p className="text-xs md:text-sm text-foreground leading-relaxed font-semibold">
                  {s.warningExtra}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-foreground text-sm md:text-base mb-2">
                  What is the FDA-approved use?
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {s.use}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-foreground text-sm md:text-base mb-2">
                  Most serious side effects to monitor:
                </h3>
                <ul className="space-y-1.5">
                  {s.seriousSideEffects.map((se) => (
                    <li key={se} className="text-xs md:text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span>
                      {se}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-foreground text-sm md:text-base mb-2">
                  Most common side effects:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {s.commonSideEffects.map((ce) => (
                    <span key={ce} className="px-2.5 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                      {ce}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                This information is not comprehensive. Please see the full{" "}
                <a
                  href={s.prescribingInfoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  Prescribing Information
                </a>{" "}
                for complete safety information.
              </p>

              <p className="text-xs text-muted-foreground mt-2">
                Report negative side effects to FDA MedWatch at 1-800-FDA-1088 or{" "}
                <a href="http://www.fda.gov/medwatch" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  www.fda.gov/medwatch
                </a>
              </p>
            </section>
          ))}
        </div>

        <div className="mt-14 p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Disclaimer:</strong> The safety information provided on this page is sourced from publicly available FDA-approved prescribing information and drug labels. Youth & Soul is not a healthcare provider or pharmacy. Always consult with your licensed healthcare provider before starting any medication. This page is for informational purposes only.
          </p>
        </div>
      </main>

      <MinimalFooter />
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
