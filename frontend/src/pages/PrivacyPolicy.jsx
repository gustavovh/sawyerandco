import React from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="privacy-policy-page">
      <Navbar />
      <main className="flex-grow py-12 md:py-16 bg-[#FAFAFA]">
        <div className="container-x max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm text-slate-800 leading-relaxed">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#0F2557] mb-2">
            Privacy Policy | Sawyer & Co.
          </h1>
          <p className="text-sm text-slate-500 mb-8 border-b border-gray-100 pb-4">
            <strong>Sawyer & Co. LLC</strong><br />
            Effective Date: August 2026<br />
            Last Updated: August 2026
          </p>

          <div className="space-y-8 text-sm md:text-base">
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                1. Who We Are
              </h2>
              <p>
                Sawyer & Co. LLC ("Sawyer & Co.", "we", "us", or "our") operates the website sawyernco.com and related online services. Sawyer & Co. is a mortgage lead generation and marketplace platform. We are not a mortgage lender, mortgage broker, or financial institution, and we do not make credit decisions or issue loan commitments.
              </p>
              <p className="mt-2">
                We connect consumers seeking home financing information with our network of licensed mortgage lenders, brokers, and industry partners ("Lending Partners").
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                2. Information We Collect
              </h2>
              <p>We collect information that you provide directly to us when using our website or submitting an inquiry, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Contact Information:</strong> Name, email address, phone number, and physical address or state of residence.</li>
                <li><strong>Self-Reported Financial & Homebuying Information:</strong> Annual income, estimated monthly debts, credit score range, estimated down payment, target home price, and preferred loan type.</li>
                <li><strong>Technical & Usage Data:</strong> IP address, browser type, device information, operating system, referring URLs, and website interactions collected automatically via cookies, web beacons, and analytics tools.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                3. How We Use Your Information
              </h2>
              <p>We use the information we collect for the following business purposes:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Connecting you with licensed mortgage professionals who can provide loan options and pre-qualification assistance.</li>
                <li>Processing and responding to your inquiries or requests for information.</li>
                <li>Providing personalized affordability estimates and mortgage calculator results.</li>
                <li>Communicating with you regarding loan products, updates, promotional offers, or customer service inquiries via telephone, text message, email, or automated messaging systems (subject to applicable consent).</li>
                <li>Operating, maintaining, improving, and analyzing our website, tools, and advertising campaigns.</li>
                <li>Complying with legal, regulatory, and audit requirements.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                4. How We Share Your Information
              </h2>
              <p>We share consumer information in the following circumstances:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>With Lending Partners:</strong> When you submit a pre-qualification request or contact form, we transmit your contact details and self-reported mortgage information to licensed mortgage lenders, brokers, or lead distribution networks so they may evaluate your inquiry and contact you directly regarding loan products.</li>
                <li><strong>With Service Providers:</strong> We share data with third-party vendors who perform services on our behalf, such as web hosting, customer relationship management (CRM) platforms, analytics providers, advertising platforms (including Meta and Google), and messaging services.</li>
                <li><strong>For Legal & Protection Reasons:</strong> We may disclose information if required by law, subpoena, court order, or governmental regulation, or to protect the rights, property, safety, or security of Sawyer & Co., our users, or the public.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, reorganization, bankruptcy, or sale of company assets, consumer data may be transferred as part of the transaction.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                5. Your Rights — California Residents (CCPA)
              </h2>
              <p>
                Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific rights regarding their personal information:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li><strong>Right to Know / Access:</strong> You have the right to request information about the categories and specific pieces of personal information we have collected, used, and shared about you over the past 12 months.</li>
                <li><strong>Right to Delete:</strong> You have the right to request the deletion of personal information we have collected from you, subject to certain legal exceptions.</li>
                <li><strong>Right to Correct:</strong> You have the right to request correction of inaccurate personal information.</li>
                <li><strong>Right to Opt-Out of Sale or Sharing:</strong> Because we transmit consumer inquiries to third-party Lending Partners for commercial consideration, this transfer may constitute a "sale" or "sharing" of personal data under California law. You have the right to opt out of the sale or sharing of your personal information at any time.</li>
                <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising any of your CCPA privacy rights.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these California privacy rights, please submit a written request to <a href="mailto:jake@sawyernco.com" className="text-[#0066FF] underline">jake@sawyernco.com</a> with the subject line "California Privacy Rights Request."
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                6. Your Choices and Opt Out Rights
              </h2>
              <p>
                <strong>Email Marketing Opt-Out:</strong> You may unsubscribe from promotional email communications at any time by clicking the "Unsubscribe" link located at the bottom of our emails or by contacting <a href="mailto:jake@sawyernco.com" className="text-[#0066FF] underline">jake@sawyernco.com</a>.
              </p>
              <p className="mt-2">
                <strong>SMS / Text Message Opt-Out:</strong> You may opt out of receiving text messages at any time by replying "STOP" to any text message received from us or our Lending Partners.
              </p>
              <p className="mt-2">
                <strong>Do Not Call / TCPA Revocation:</strong> You may revoke your consent to be contacted by phone or automated dialing systems at any time by emailing <a href="mailto:jake@sawyernco.com" className="text-[#0066FF] underline">jake@sawyernco.com</a> or notifying the caller directly.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                7. Data Retention
              </h2>
              <p>
                We retain personal information for as long as reasonably necessary to fulfill the purposes described in this Privacy Policy, comply with applicable legal obligations, resolve disputes, enforce agreements, and meet regulatory recordkeeping standards.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                8. Data Security
              </h2>
              <p>
                We implement reasonable physical, technical, and administrative security measures designed to protect personal information against unauthorized access, loss, misuse, alteration, or destruction. However, no data transmission over the Internet or electronic storage system can be guaranteed to be 100% secure.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                9. Children's Privacy
              </h2>
              <p>
                Our website and services are intended solely for adult consumers aged 18 and older. We do not knowingly collect or solicit personal information from individuals under the age of 18.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                10. Changes To This Policy
              </h2>
              <p>
                We reserve the right to update or modify this Privacy Policy at any time. When changes are made, we will update the "Last Updated" date at the top of this page. Your continued use of our website or services following any updates constitutes acceptance of the revised Privacy Policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                11. Contact Us
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                <p><strong>Sawyer & Co. LLC</strong></p>
                <p>Email: <a href="mailto:jake@sawyernco.com" className="text-[#0066FF] underline">jake@sawyernco.com</a></p>
                <p>Website: <a href="https://sawyernco.com" className="text-[#0066FF] underline">https://sawyernco.com</a></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
