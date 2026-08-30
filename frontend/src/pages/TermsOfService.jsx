import React from "react";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="terms-of-service-page">
      <Navbar />
      <main className="flex-grow py-12 md:py-16 bg-[#FAFAFA]">
        <div className="container-x max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm text-slate-800 leading-relaxed">
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-[#0F2557] mb-2">
            Terms of Service | Sawyer & Co.
          </h1>
          <p className="text-sm text-slate-500 mb-8 border-b border-gray-100 pb-4">
            <strong>Sawyer & Co. LLC</strong><br />
            Effective Date: August 2026<br />
            Last Updated: August 2026
          </p>

          <div className="space-y-8 text-sm md:text-base">
            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                1. Agreement To Terms
              </h2>
              <p>
                These Terms of Service ("Terms") govern your access to and use of the website sawyernco.com and any services, content, features, or tools offered by Sawyer & Co. LLC ("Sawyer & Co.", "we", "us", or "our").
              </p>
              <p className="mt-2">
                By accessing or using our website, submitting a pre-qualification inquiry, or interacting with our services, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you must immediately cease using our website and services.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                2. Who We Are — Important Disclosure
              </h2>
              <p>
                Sawyer & Co. LLC is a mortgage lead generation, marketing, and marketplace platform. <strong>Sawyer & Co. is not a mortgage lender, mortgage broker, financial institution, or creditor.</strong>
              </p>
              <p className="mt-2">
                We do not take mortgage applications, make credit decisions, issue pre-approval letters, originate loans, lock interest rates, or offer loan commitments. All mortgage quotes, interest rate estimates, qualification evaluations, and loan approvals are performed exclusively by independent, licensed third-party lenders, brokers, or financial institutions ("Lending Partners") with whom we share consumer inquiries.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                3. Our Services
              </h2>
              <p>
                Sawyer & Co. provides online tools, educational content, affordability calculators, and lead intake forms designed to help consumers evaluate potential home financing options and connect with licensed Lending Partners.
              </p>
              <p className="mt-2">
                Calculations provided on sawyernco.com are for illustrative and educational purposes only. They are self-reported estimates and do not represent a guarantee of loan availability, interest rates, or loan terms.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                4. No Credit Pull
              </h2>
              <p>
                Submitting an inquiry through Sawyer & Co. does not require a hard credit pull by Sawyer & Co., and Sawyer & Co. does not perform credit inquiries.
              </p>
              <p className="mt-2">
                However, once you are connected with an independent Lending Partner, that lender may request your social security number and authorization to perform a soft or hard credit check in accordance with their independent underwriting standards and licensing requirements.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                5. User Representations
              </h2>
              <p>By using our website and submitting an inquiry, you represent and warrant that:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>You are at least 18 years of age.</li>
                <li>All information provided by you is accurate, current, complete, and truthful.</li>
                <li>You are seeking mortgage information or loan options for yourself or on behalf of someone who has granted you explicit authorization.</li>
                <li>You will not use our website for any unlawful, fraudulent, or unauthorized purpose.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                6. Consent To Be Contacted
              </h2>
              <p>
                By submitting your contact information on sawyernco.com, you provide your express written consent for Sawyer & Co. LLC and its network of licensed Lending Partners to contact you regarding home loan products, mortgage pre-qualification, and related real estate services.
              </p>
              <p className="mt-2">
                You agree to be contacted via telephone, mobile phone, SMS/text message, and email, including through automated dialing systems, artificial intelligence assistants, and prerecorded voice messages, even if your phone number is listed on a federal, state, or internal Do Not Call registry.
              </p>
              <p className="mt-2">
                Your consent is not required as a condition of purchasing any property, goods, or services. Message and data rates may apply. You may opt out of receiving communications at any time by replying "STOP" to text messages or emailing <a href="mailto:jake@sawyernco.com" className="text-[#0066FF] underline">jake@sawyernco.com</a>.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                7. Data Sharing and Aged Data
              </h2>
              <p>
                When you submit a contact or pre-qualification form, you acknowledge and agree that Sawyer & Co. may share your contact information and self-reported mortgage criteria with one or more independent Lending Partners or lead distribution networks.
              </p>
              <p className="mt-2">
                Subject to applicable law, consumer inquiry data may also be re-engaged, marketed, or re-distributed at a future date ("aged data") to licensed mortgage or real estate professionals offering relevant products or services.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                8. Limitation Of Liability
              </h2>
              <p>
                To the fullest extent permitted by applicable law, Sawyer & Co. LLC, its officers, directors, employees, affiliates, and agents shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of or in connection with:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Your use of or inability to use our website or tools.</li>
                <li>Any loan terms, interest rates, approvals, rejections, delays, or actions taken by third-party Lending Partners.</li>
                <li>Errors, omissions, or inaccuracies in mortgage calculator estimations or site content.</li>
                <li>Unauthorized access to or alteration of your transmissions or data.</li>
              </ul>
              <p className="mt-3">
                Our total cumulative liability for any claim under these Terms shall not exceed $100 USD.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                9. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles. Any dispute arising under or relating to these Terms or your use of sawyernco.com shall be resolved exclusively in the state or federal courts located in Delaware.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                10. Changes To Terms
              </h2>
              <p>
                We reserve the right to modify or replace these Terms at any time in our sole discretion. We will indicate that updates have occurred by revising the "Last Updated" date at the top of these Terms. Your continued use of the website following the posting of changes constitutes acceptance of those changes.
              </p>
            </section>

            <section>
              <h2 className="font-heading text-xl md:text-2xl font-semibold text-[#0F2557] mb-3">
                11. Contact Us
              </h2>
              <p>
                If you have questions or comments regarding these Terms of Service, please contact us at:
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
