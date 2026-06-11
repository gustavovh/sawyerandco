import React from "react";
import { Home, Shield, Award, Building2, TrendingUp, ArrowUpRight } from "lucide-react";

const PROGRAMS = [
  {
    icon: Home,
    name: "Conventional",
    tag: "Most popular",
    desc: "Standard loans not backed by the government. Best for buyers with strong credit and 3%+ down.",
    points: ["620+ credit score", "From 3% down", "No upfront MIP"],
    color: "from-blue-500 to-blue-700",
  },
  {
    icon: Shield,
    name: "FHA",
    tag: "First-timers",
    desc: "Government-insured loans with flexible credit & down payment requirements.",
    points: ["580+ credit (3.5% down)", "500+ credit (10% down)", "Lower closing costs"],
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Award,
    name: "VA",
    tag: "Veterans",
    desc: "Exclusive benefits for veterans, active-duty service members, and surviving spouses.",
    points: ["0% down payment", "No PMI required", "Lower interest rates"],
    color: "from-amber-500 to-amber-700",
  },
  {
    icon: Building2,
    name: "Jumbo",
    tag: "High-value",
    desc: "For loans exceeding conforming limits in high-cost areas and luxury markets.",
    points: ["700+ credit score", "10-20% down typical", "Strong reserves"],
    color: "from-purple-500 to-purple-700",
  },
  {
    icon: TrendingUp,
    name: "Investment",
    tag: "Real estate investors",
    desc: "Financing for rental properties, second homes, and investment portfolios.",
    points: ["20-25% down", "Higher reserves", "DSCR programs available"],
    color: "from-rose-500 to-rose-700",
  },
];

export default function Programs() {
  return (
    <section id="programs" className="section bg-[#FAFAFA]" data-testid="programs-section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">Loan Programs</p>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#0F2557] mt-3 tracking-tight">
              The right loan for every borrower.
            </h2>
          </div>
          <p className="md:max-w-md text-slate-600">
            Five programs, hundreds of lender combinations. Our calculator surfaces the ones you'll actually qualify for.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {PROGRAMS.map((p, i) => (
            <div
              key={p.name}
              className="group bg-white rounded-2xl p-7 border border-gray-100 hover:-translate-y-1 hover:border-[#0066FF] hover:shadow-xl transition-all duration-300"
              data-testid={`program-${p.name.toLowerCase()}`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center`}>
                  <p.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066FF] bg-blue-50 px-2 py-1 rounded-full">{p.tag}</span>
              </div>
              <h3 className="font-heading text-2xl font-semibold text-[#0F2557] mt-5">{p.name} Loan</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{p.desc}</p>
              <ul className="mt-5 space-y-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0066FF]" /> {pt}
                  </li>
                ))}
              </ul>
              <a href="#calculator" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0066FF] group-hover:gap-2 transition-all">
                See if you qualify <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
