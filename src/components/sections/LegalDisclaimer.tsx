import logo from "@/assets/logo-youthsoul-new.png";

export function LegalDisclaimer() {
  return (
    <section className="border-t border-border bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        {/* Contact Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-8 border-b border-border">
          <img src={logo} alt="Youth & Soul" className="h-10 md:h-12 w-auto" loading="lazy" />
        </div>

        <div className="space-y-6 text-xs text-muted-foreground leading-relaxed">
          <p>
            *The assessment available on the Youth&Soul website does not establish a doctor-patient relationship between the individual and Youth&Soul. Bask Health, a network of US-licensed physicians following rigorous safety protocols, has established exclusionary criteria to determine eligibility for GLP-1 medications. The responses provided in the Youth&Soul assessment determine whether the individual is screened out, and a Bask Health clinician will conduct a consultation after checkout to confirm whether a prescription is appropriate. All prescribing decisions rest with the treating clinician.
          </p>
          <p>
            All claims and benefits referenced on this website reflect self-reported data from GLP-1 customers enrolled in a treatment plan that includes compounded GLP-1 medications and consultations with licensed medical professionals. Customers reported their weight at initial intake and every 3–4 weeks thereafter. Individual results from compounded medications may vary based on adherence to the program and clinician recommendations. Compounded GLP-1s are prepared in FDA-regulated facilities; however, the compounded medications themselves are not FDA-approved or independently evaluated for safety, efficacy, or quality. The decision to use compounded medications is guided by the licensed provider's medical judgment following a telehealth consultation and review of the patient's medical history.
          </p>
          <p>
            We encourage all prospective users to discuss the specific risks and benefits of compounded medications with their provider. Youth&Soul does not manufacture compounded medications, and individuals may receive medication that differs in appearance from what is shown on this website.
          </p>

          <h4 className="text-sm font-semibold text-foreground pt-4">Pharmacy Providers</h4>
          <p>
            We are partnered with multiple USA-certified pharmacies to deliver the highest quality products and experience. Our team meets regularly with pharmacy partners to discuss product availability, shipping timelines, and up-to-date medication testing reports.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 pt-2">
            <div className="text-xs">
              <p className="font-semibold text-foreground mb-1">Procompounding Pharmacy</p>
              <ul className="space-y-0.5 text-muted-foreground">
                <li>527 N State of Franklin Road, Suite 2</li>
                <li>Johnson City, TN 37604</li>
                <li>
                  <a href="https://www.procompounding.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">www.ProCompounding.com</a>
                </li>
                <li>Phone: 1-855-975-0597 ex: 2089</li>
                <li>Fax: 1-423-975-6304</li>
                <li>
                  <a href="mailto:Jessica.Patrone@ProCompounding.com" className="hover:text-primary transition-colors">Jessica.Patrone@ProCompounding.com</a>
                </li>
              </ul>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-foreground mb-1">Fulfillment Facility — The Pharmacy Hub</p>
              <ul className="space-y-0.5 text-muted-foreground">
                <li>15600 NW 15th Ave, Suite C</li>
                <li>Miami, FL 33169</li>
              </ul>
            </div>
          </div>

          <p className="pt-2 text-[11px] italic">
            The information transmitted is intended only for the person or entity to which it is addressed and may contain confidential and/or privileged material. Any review, retransmission, dissemination or other use of, or taking of any action in reliance upon, this information by persons or entities other than the intended recipient is prohibited. This document may contain information covered under the Privacy Act, 5 USC 552(a), and/or the Health Insurance Portability and Accountability Act (PL 104-191) and its various implementing regulations and must be protected in accordance with those provisions. If you received this in error, please contact the sender and delete the material from any computer.
          </p>

          <p className="pt-4">
            *Results vary based on starting weight and program adherence. Inches lost from hips, waist, chest, thighs, and arms in the first month. These patients exercised daily and ate a reduced-calorie diet. Their fat loss is not typical. Your results may vary. Medication prescriptions are at the discretion of medical providers and may not be suitable for everyone. Youth&Soul patients typically experience 1–2 lbs per week of weight loss after 4 weeks, involving a healthy diet and exercise changes. Consult a healthcare professional before using medication or starting any weight loss program. *Based on average weight loss in three 68-week clinical trials of patients without diabetes who reached and maintained a dose of 2.4 mg/week of GLP-1 treatment, along with a reduced-calorie diet and increased physical activity.
          </p>
          <p>
            Medication is included in the cost of the Youth&Soul Program. Wegovy® is FDA-approved for weight loss. Ozempic® is FDA-approved for type 2 diabetes treatment but may be prescribed for weight loss. The trademarks, service marks, trade names (Wegovy®, Ozempic®), and products displayed on this Internet site are protected and belong to their respective owners. Medical treatment is provided by affiliated P.C.s, an affiliated network of medical professional corporations and associations.
          </p>
          <p>
            Certain materials on this website, including text, images, and other media, may be generated or enhanced using artificial intelligence technologies. No representation or warranty is made regarding the accuracy, completeness, or reliability of such content. Individuals appearing in advertisements may be actors or models.
          </p>
          <p>
            Testimonials on the website are from Youth&Soul patients. For patient privacy, images representing those testimonials may use models.
          </p>
          <p>
            By accepting our Terms of Use, you additionally understand and agree that Youth&Soul is not acting as a pharmacy, nor does Youth&Soul control or interfere with any such services. By accepting these Terms of Use, you understand and agree that you may be entering into a relationship with a pharmacy, pharmacist, and/or pharmacy group or other such relationship with any one or more such third-party entities.
          </p>
        </div>
      </div>
    </section>
  );
}
