import React from "react";
import { ShieldCheck, BadgeCheck, MessageSquare, Award, Star } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Secure & Private", desc: "256-bit encryption. We never sell your data." },
  { icon: BadgeCheck, title: "No Credit Impact", desc: "Soft pull only. Your FICO is untouched." },
  { icon: MessageSquare, title: "Free Consultation", desc: "Talk to a licensed officer at zero cost." },
  { icon: Award, title: "Licensed Partners", desc: "Vetted NMLS-licensed mortgage professionals." },
];

const TESTIMONIALS = [
  { name: "Sarah K.", location: "Austin, TX", text: "I had an affordability range in under a minute. Closed on our first home 38 days later.", initial: "SK" },
  { name: "Marcus J.", location: "Denver, CO", text: "Walked me through FHA vs Conventional. Saved $180/month vs my bank's offer.", initial: "MJ" },
  { name: "Priya R.", location: "Seattle, WA", text: "Honest, fast, no pressure. The loan officer actually returned my calls.", initial: "PR" },
];

export default function Trust() {
  return (
    <section className="section bg-[#FAFAFA]" data-testid="trust-section">
      <div className="container-x">
        <div className="grid md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {ITEMS.map((it) => (
            <div key={it.title} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#0066FF]/40 transition-colors" data-testid={`trust-${it.title.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <it.icon className="w-5 h-5 text-[#0066FF]" />
              </div>
              <p className="font-heading font-semibold text-[#0F2557]">{it.title}</p>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="card-soft" data-testid={`testimonial-${i}`}>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-slate-700 leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F2557] text-white flex items-center justify-center text-sm font-semibold">{t.initial}</div>
                <div>
                  <p className="font-semibold text-[#0F2557] text-sm">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
