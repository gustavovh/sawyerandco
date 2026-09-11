import React from "react";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";

export default function PrivacyPolicy() {
  const updated = "September 11, 2026";

  return (
    <div className="min-h-screen bg-white" data-testid="privacy-policy-page">
      <Navbar />

      <main className="section">
        <div className="container-x max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-semibold text-[#0F2557] tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm mb-10">Last updated: {updated}</p>

          <div className="space-y-10 text-slate-700 leading-relaxed">
            <section>
              <p>
                Sawyer & Company, Inc. ("Sawyer & Company," "we," "us," or "our") operates a mortgage
                marketplace that helps homebuyers estimate affordability, get pre-qualified, and connect
                with independent, licensed mortgage professionals. This Privacy Policy explains what
                information we collect through our website, how we use and share it, and the choices
                you have. By using our site, you agree to the practices described here.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">1. Information We Collect</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Information you provide.</strong> When you use our affordability calculator,
                  request a quote, download our first-time homebuyer guide, or submit any form on our
                  site, we collect details such as your name, email address, phone number, estimated
                  income, down payment, and property or loan preferences.
                </li>
                <li>
                  <strong>Automatically collected information.</strong> When you visit our site, we and
                  our service providers automatically collect device and usage data — such as IP
                  address, browser type, pages viewed, and referring URL — through cookies and similar
                  technologies.
                </li>
                <li>
                  <strong>Analytics and advertising data.</strong> We use the Meta Pixel and PostHog to
                  understand how visitors use our site and to measure and improve our advertising. These
                  tools may collect identifiers and interaction events (such as page views and form
                  submissions) and, in the case of the Meta Pixel, share that data with Meta Platforms,
                  Inc.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>To generate your affordability estimate and pre-qualification results.</li>
                <li>To connect you with an independent, licensed mortgage professional who can follow up on your request.</li>
                <li>To send the resources, guides, or quotes you request.</li>
                <li>To communicate with you about your inquiry, including by phone, email, or text.</li>
                <li>To operate, secure, and improve our website and services.</li>
                <li>To measure the effectiveness of our marketing and advertising campaigns.</li>
                <li>To comply with legal obligations and enforce our terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">3. How We Share Your Information</h2>
              <p className="mb-3">We do not sell your personal information. We may share it with:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Licensed mortgage professionals and lenders</strong> in our network, so they can
                  respond to your request for a quote or pre-qualification. Sawyer & Company is a
                  marketplace, not a direct lender, and does not make credit decisions.
                </li>
                <li>
                  <strong>Service providers</strong> who support our operations, including our form,
                  scheduling, and customer-relationship tools (e.g., our lead and appointment platform),
                  hosting provider, and analytics providers (Meta Pixel, PostHog).
                </li>
                <li>
                  <strong>Legal and safety purposes</strong> — to comply with applicable law, regulation,
                  legal process, or governmental request, or to protect the rights, property, or safety
                  of Sawyer & Company, our users, or others.
                </li>
                <li>
                  <strong>Business transfers</strong> — in connection with a merger, acquisition, financing, or sale of assets.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">4. Cookies & Tracking Technologies</h2>
              <p>
                We use cookies, pixels, and similar technologies to operate our site, remember your
                preferences, measure site performance, and personalize advertising. You can control
                cookies through your browser settings; disabling them may limit some site features.
                Our advertising partner (Meta) may use this data to show you relevant ads on and off our
                site — you can manage ad preferences directly through your Meta account settings.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">5. Data Retention</h2>
              <p>
                We retain personal information for as long as needed to fulfill the purposes described in
                this policy, respond to your inquiries, meet legal and regulatory requirements, and
                resolve disputes, after which it is deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">6. Your Choices & Rights</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>You may opt out of marketing emails or texts at any time using the unsubscribe link or by contacting us directly.</li>
                <li>Depending on where you live, you may have the right to access, correct, delete, or receive a copy of your personal information, or to object to certain processing.</li>
                <li>To exercise any of these rights, contact us using the details below.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">7. Children's Privacy</h2>
              <p>
                Our site is intended for adults seeking mortgage information and is not directed to
                children under 18. We do not knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">8. Security</h2>
              <p>
                We use reasonable administrative, technical, and physical safeguards designed to protect
                your information. No method of transmission or storage is completely secure, so we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">9. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. The "Last updated" date above
                reflects the most recent revision. Continued use of our site after changes take effect
                constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-2xl font-semibold text-[#0F2557] mb-3">10. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to exercise your privacy rights,
                contact us at:
              </p>
              <p className="mt-3">
                Sawyer & Company, Inc.<br />
                Phone: 1-385-534-8359
              </p>
            </section>

            <section className="pt-6 border-t border-gray-200 text-[11px] text-slate-400 leading-relaxed">
              <p>
                Sawyer & Company is a mortgage marketplace and not a direct lender. Loan products are
                offered by independent, licensed third-party lenders. This page is provided for general
                informational purposes and does not constitute legal advice.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
