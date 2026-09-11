import React, { useEffect } from "react";

export default function GetQuoteForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  return (
    <section id="get-quote" className="section" data-testid="getquote-section">
      <div className="container-x">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-[#0F2557] tracking-tight">
            Get Your Free Quote
          </h2>
          <p className="text-slate-600 mt-3 text-lg leading-relaxed">
            Tell us a bit about yourself and a licensed mortgage professional will follow up with your personalized quote.
          </p>
        </div>
        <div className="max-w-3xl mx-auto">
          <iframe
            src="https://api.leadconnectorhq.com/widget/form/0vodT8LE8uNLmKeFbnvx"
            style={{ width: "100%", height: "1938px", border: "none", borderRadius: "8px" }}
            id="inline-0vodT8LE8uNLmKeFbnvx"
            data-layout="{'id':'INLINE'}"
            data-trigger-type="alwaysShow"
            data-trigger-value=""
            data-activation-type="alwaysActivated"
            data-activation-value=""
            data-deactivation-type="neverDeactivate"
            data-deactivation-value=""
            data-form-name="Form 0"
            data-height="1938"
            data-layout-iframe-id="inline-0vodT8LE8uNLmKeFbnvx"
            data-form-id="0vodT8LE8uNLmKeFbnvx"
            data-cookie-consent="true"
            data-cookie-consent-provider="auto"
            title="Form 0"
          />
        </div>
      </div>
    </section>
  );
}
