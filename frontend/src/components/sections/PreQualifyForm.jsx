import React from "react";

export default function PreQualifyForm() {
  return (
    <section id="prequalify" className="section bg-white">
      <div className="container-x">
        {/* Visible marker for production verification */}
        <p className="text-[10px] text-gray-300 mb-2">GHL Form v1.1</p>
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
