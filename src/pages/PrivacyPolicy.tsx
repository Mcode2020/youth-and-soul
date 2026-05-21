import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function PrivacyPolicy() {
  useSEOHead({
    title: "Privacy Policy — Youth & Soul",
    description: "Youth & Soul privacy policy. Learn how we protect your personal data, health information, and HIPAA compliance.",
    path: "/privacy-policy",
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Privacy Policy" }]} />

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: April 16, 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
            <p>We collect information you provide directly, such as when you create an account, make a purchase, enroll in a health program, or contact us. This may include your name, email address, phone number (including mobile number), date of birth, shipping address, and health-related information necessary for telehealth consultations.</p>
            <p>When you provide your mobile phone number and opt in to receive SMS/text messages, we collect and store your phone number for the purpose of sending you transactional and informational messages related to your account and services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. How We Use Your Information</h2>
            <p>We use your information to process orders, facilitate telehealth consultations, personalize your experience, send transactional communications, and improve our services. Health data is used exclusively for medical consultations and is handled in compliance with applicable healthcare regulations.</p>
            <p><strong>SMS/Text Messaging:</strong> If you opt in to receive SMS/text messages from Youth & Soul, we will use your mobile phone number to send you:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Enrollment confirmations and welcome messages</li>
              <li>Program approval links and status updates</li>
              <li>Appointment reminders and medication shipping notifications</li>
              <li>Important account and service-related alerts</li>
            </ul>
            <p className="mt-2">Message frequency varies based on your activity and program enrollment. Message and data rates may apply. You can opt out at any time by replying STOP to any message.</p>
            <p><strong>Email Communications:</strong> If you provide your email address and consent to receive communications, we will send you enrollment confirmations, program updates, health tips, promotional offers, and important service-related notifications.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Information Sharing</h2>
            <p>We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Licensed healthcare providers for telehealth services</li>
              <li>Payment processors (Stripe) for secure transaction processing</li>
              <li>SMS/messaging service providers (Twilio) for delivering text messages you have opted in to receive</li>
              <li>Email service providers for delivering email communications</li>
              <li>Service providers who assist in operating our platform</li>
            </ul>
            <p className="mt-2">All third-party providers are bound by confidentiality agreements and are prohibited from using your information for purposes other than providing services on our behalf.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. SMS/Text Message Consent & Data</h2>
            <p>By providing your mobile phone number and checking the SMS consent box during enrollment or signup, you expressly consent to receive autodialed or prerecorded SMS/text messages from Youth & Soul at the number provided. Consent is not a condition of purchase.</p>
            <p><strong>What we collect:</strong> Your mobile phone number, consent status, date and time of consent, and message delivery records.</p>
            <p><strong>How we protect it:</strong> Phone numbers and SMS consent data are stored securely using encryption at rest and in transit. Access is restricted to authorized personnel and service providers necessary for message delivery.</p>
            <p><strong>Opt-out:</strong> You may revoke consent at any time by replying STOP to any message. After opting out, you will receive one final confirmation message and no further texts will be sent.</p>
            <p><strong>Help:</strong> Reply HELP to any message for assistance or contact us at hello@youthandsoul.com.</p>
            <p><strong>Supported carriers:</strong> Major US carriers are supported. Carriers are not liable for delayed or undelivered messages.</p>
            <p><strong>No sharing for marketing:</strong> We do not share, sell, or rent your mobile phone number or SMS consent data with third parties for their own marketing purposes. Your information is shared only with our messaging service provider (Twilio) solely for the purpose of delivering messages on our behalf.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Data Security</h2>
            <p>We implement industry-standard security measures including encryption (TLS 1.2+), secure servers, access controls, and regular security audits to protect your personal, health, and communication information. However, no method of transmission over the Internet is 100% secure.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Cookies & Tracking</h2>
            <p>We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide you services. SMS consent records and messaging logs are retained for a minimum of 5 years from the date of consent to comply with TCPA recordkeeping requirements. You may request deletion of your data at any time, subject to legal retention obligations.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@youthandsoul.com. California residents have additional rights under the CCPA, including the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Know what personal information is collected, used, shared, or sold</li>
              <li>Delete personal information held by us</li>
              <li>Opt out of the sale of personal information (we do not sell your data)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Children's Privacy</h2>
            <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from minors. If we learn that we have collected information from a child under 18, we will promptly delete it.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website with a revised effective date. For material changes affecting SMS or email consent, we will notify you via the communication channel affected.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, your SMS/text message preferences, or your data rights, please contact us at:</p>
            <p>
              Email: hello@youthandsoul.com<br />
              Phone: +1 (307) 448-1931<br />
              SMS Help: Reply HELP to any text message<br />
              Address: Los Angeles, CA
            </p>
          </section>
        </div>
      </div>

      <Footer />
      <div className="md:hidden"><BottomNav /></div>
    </div>
  );
}
