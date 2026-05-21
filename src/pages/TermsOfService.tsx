import { MobileHeader } from "@/components/layout/MobileHeader";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { useSEOHead } from "@/hooks/useSEOHead";

export default function TermsOfService() {
  useSEOHead({
    title: "Terms of Service — Youth & Soul",
    description: "Youth & Soul terms of service. Read our terms for telehealth programs, marketplace purchases, SMS communications, and subscription plans.",
    path: "/terms-of-service",
  });

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <MobileHeader />
      <Breadcrumbs items={[{ label: "Terms of Service" }]} />

      <div className="max-w-3xl mx-auto px-4 py-10 md:py-16">
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: April 16, 2026</p>

        <div className="prose prose-sm max-w-none text-foreground/80 space-y-6">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>By accessing or using Youth&Soul ("the Platform"), you agree to be bound by these Terms of Service, including our Privacy Policy and SMS/Communications Terms. If you do not agree, please do not use our services.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Services Description</h2>
            <p>Youth&Soul is a marketplace for longevity, anti-aging, and functional beauty products. We also facilitate telehealth consultations and prescription programs through licensed healthcare providers. Youth&Soul is not a healthcare provider and does not practice medicine.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Eligibility</h2>
            <p>You must be at least 18 years old and a resident of the United States to use our services. Telehealth services are available only in states where our partner providers are licensed.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Account Responsibilities</h2>
            <p>You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. You agree to provide accurate, current, and complete information including your email address and phone number.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">5. Purchases & Payments</h2>
            <p>All purchases are subject to product availability and pricing at the time of order. Prices are displayed in USD and may be subject to change. Discount codes are provided by participating brands and are subject to their terms. Payments are securely processed by Stripe.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">6. Telehealth Programs</h2>
            <p>Prescription programs require a consultation with a licensed physician. Approval is not guaranteed. All medical decisions are made independently by the prescribing physician. If you are not approved, you will receive a full refund. Subscription programs may be cancelled at any time with 30 days' notice.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">7. SMS/Text Message Terms</h2>
            <p>By providing your mobile phone number and opting in during enrollment or signup, you consent to receive autodialed or prerecorded SMS/text messages from Youth & Soul. These terms apply to all SMS communications sent by or on behalf of Youth & Soul.</p>
            
            <h3 className="text-base font-semibold text-foreground mt-4">7.1 Types of Messages</h3>
            <p>You may receive the following types of text messages:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Enrollment confirmations</strong> — Welcome messages confirming your program enrollment</li>
              <li><strong>Approval & status updates</strong> — Links to your program approval page and status changes</li>
              <li><strong>Appointment reminders</strong> — Upcoming consultation and follow-up reminders</li>
              <li><strong>Shipping notifications</strong> — Medication and product shipment updates</li>
              <li><strong>Account alerts</strong> — Important account, billing, and security notifications</li>
            </ul>

            <h3 className="text-base font-semibold text-foreground mt-4">7.2 Message Frequency</h3>
            <p>Message frequency varies based on your activity and program enrollment. You may receive up to 10 messages per month. Message and data rates may apply depending on your mobile carrier and plan.</p>

            <h3 className="text-base font-semibold text-foreground mt-4">7.3 Opt-Out</h3>
            <p>You can opt out of receiving SMS/text messages at any time by replying <strong>STOP</strong> to any message from Youth & Soul. After opting out, you will receive one final confirmation message. No further messages will be sent unless you re-subscribe.</p>

            <h3 className="text-base font-semibold text-foreground mt-4">7.4 Help</h3>
            <p>For help with text messages, reply <strong>HELP</strong> to any message or contact us at hello@youthandsoul.com or +1 (307) 448-1931.</p>

            <h3 className="text-base font-semibold text-foreground mt-4">7.5 Consent</h3>
            <p>Consent to receive SMS/text messages is not required as a condition of purchasing any goods or services. You may purchase products or enroll in programs without opting in to SMS communications.</p>

            <h3 className="text-base font-semibold text-foreground mt-4">7.6 Carrier Disclaimer</h3>
            <p>Carriers (AT&T, T-Mobile, Verizon, etc.) are not liable for delayed or undelivered messages. Youth & Soul is not responsible for messages that are not delivered due to carrier network issues, phone settings, or other factors outside our control.</p>

            <h3 className="text-base font-semibold text-foreground mt-4">7.7 Privacy</h3>
            <p>Your phone number and SMS data are handled in accordance with our <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a>. We do not sell, share, or rent your phone number or SMS consent information to any third party for their marketing purposes.</p>

            <h3 className="text-base font-semibold text-foreground mt-4">7.8 Messaging Service Provider</h3>
            <p>SMS/text messages are sent using Twilio, a third-party messaging platform. By opting in, you acknowledge that your phone number will be shared with Twilio solely for the purpose of delivering messages on behalf of Youth & Soul.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">8. Email Communications</h2>
            <p>By providing your email address during enrollment or account creation, you consent to receive the following types of email communications from Youth & Soul:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong>Transactional emails</strong> — Order confirmations, enrollment receipts, shipping updates, and account notifications</li>
              <li><strong>Program updates</strong> — Approval status, prescription information, and consultation reminders</li>
              <li><strong>Health & wellness content</strong> — Educational articles, tips, and product recommendations (if opted in)</li>
              <li><strong>Promotional offers</strong> — Exclusive discounts, new product launches, and special offers (if opted in)</li>
            </ul>
            <p className="mt-2">You may unsubscribe from promotional emails at any time by clicking the "Unsubscribe" link in any email. Transactional emails related to your active programs and orders will continue to be sent as necessary for service delivery.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">9. Seller Marketplace</h2>
            <p>Third-party sellers are responsible for the accuracy of their product listings, fulfillment, and customer service. Youth&Soul is not liable for products sold by third-party sellers on the platform.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">10. Intellectual Property</h2>
            <p>All content on Youth&Soul, including text, graphics, logos, and software, is the property of Youth&Soul or its licensors and is protected by intellectual property laws.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">11. Limitation of Liability</h2>
            <p>Youth&Soul shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform or products purchased through it. This includes, but is not limited to, any issues related to SMS/text message delivery, email delivery, or communication delays.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">12. Indemnification</h2>
            <p>You agree to indemnify and hold harmless Youth & Soul, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of our services, violation of these Terms, or infringement of any rights of another party.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">13. Dispute Resolution</h2>
            <p>Any disputes arising out of or relating to these Terms shall be resolved through binding arbitration in Los Angeles, California, in accordance with the rules of the American Arbitration Association. You agree to waive any right to a jury trial or to participate in a class action.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">14. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of California without regard to conflict of law principles. The Telephone Consumer Protection Act (TCPA) and applicable FCC regulations govern our SMS communications practices.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">15. Changes to These Terms</h2>
            <p>We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on our website with a revised effective date. Continued use of our services after changes constitutes acceptance of the updated Terms. For changes affecting SMS or email communications, we will provide notice via the affected communication channel.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground">16. Contact</h2>
            <p>For questions about these Terms, contact us at:</p>
            <p>
              Email: hello@youthandsoul.com<br />
              Phone: +1 (307) 448-1931<br />
              SMS Help: Reply HELP to any text message<br />
              SMS Opt-Out: Reply STOP to any text message<br />
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
