import React from "react";
import { Zap, GitCompare, GraduationCap, Users } from "lucide-react";

const BENEFITS = [
  { icon: Zap, title: "Instant Affordability Estimate", desc: "No paperwork, no waiting. See your real home budget in under a minute." },
  { icon: GitCompare, title: "Compare Multiple Loan Options", desc: "FHA, VA, Conventional, Jumbo — find the best fit side-by-side." },
  { icon: GraduationCap, title: "First-Time Homebuyer Guidance", desc: "Educational tools, down payment assistance leads, and step-by-step support." },
  { icon: Users, title: "Access to Mortgage Experts", desc: "Connect with licensed NMLS loan officers who actually call you back." },
];

export default function Benefits() {
  return (
    <section className="section bg-white" data-testid="benefits-section">
      <div className="container-x">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Why us</p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#0F2557] mt-3 tracking-tight">
            Why homebuyers use our mortgage tool
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {BENEFITS.map((b, i) => (
            <div key={i} className="group p-7 rounded-2xl border border-gray-100 hover:border-[#0066FF]/40 hover:shadow-lg transition-all duration-300" data-testid={`benefit-${i}`}>
              <div className="w-12 h-12 rounded-xl bg-[#0F2557] flex items-center justify-center mb-5 group-hover:bg-[#0066FF] transition-colors">
                <b.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#0F2557]">{b.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
