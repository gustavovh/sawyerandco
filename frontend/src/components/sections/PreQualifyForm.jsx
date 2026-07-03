import React from "react";

export default function PreQualifyForm() {
  return (
    <section id="calculator" className="section bg-white" data-testid="ghl-form-section">
      <div className="container-x">
        <iframe
          src="https://api.leadconnectorhq.com/widget/form/0vodT8LE8uLNLMKeFbnvx"
          style={{ width: "100%", height: "600px", border: "none" }}
          id="ghl-prequalify-form"
          title="Mortgage Pre-Qualification Form"
        ></iframe>
      </div>
    </section>
  );
}
