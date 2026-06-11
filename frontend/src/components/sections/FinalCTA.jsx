import React from "react";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="section bg-white" data-testid="finalcta-section">
      <div className="container-x">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0F2557] via-[#10306E] to-[#0066FF] p-10 md:p-20 overflow-hidden text-center">
          <div className="absolute inset-0 bg-grain opacity-30" />
          <div className="relative">
            <h2 className="font-heading text-4xl md:text-6xl font-semibold text-white tracking-tight max-w-3xl mx-auto">
              Start your homeownership journey today.
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">
              60 seconds is all it takes. No credit pull. No commitment. Just clarity.
            </p>
            <a
              href="#calculator"
              data-testid="finalcta-btn"
              className="mt-8 inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-white text-[#0F2557] font-semibold hover:bg-blue-50 transition-all"
            >
              Get My Free Estimate <ArrowRight className="w-4 h-4" />
            </a>
            <p className="mt-5 text-xs text-blue-200">Free · Secure · No impact on your credit score</p>
          </div>
        </div>
      </div>
    </section>
  );
}
