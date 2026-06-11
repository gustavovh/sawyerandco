import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, ArrowRight, Star, Rocket, TreePine, Building2, Landmark } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grain">
      <div className="container-x pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left: Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[13px] font-medium text-[#0066FF] mb-6" data-testid="hero-badge">
            <Sparkles className="w-3.5 h-3.5" /> Trusted by 47,000+ U.S. homebuyers
          </span>

          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-[#0F2557]" data-testid="hero-headline">
            Find out how much home you can afford{" "}
            <span className="text-[#0066FF]">in 60 seconds.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed" data-testid="hero-subheadline">
            Get a personalized affordability estimate, compare loan options, and connect with trusted mortgage professionals — all without affecting your credit.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#calculator" className="btn-primary text-base" data-testid="hero-cta-primary">
              Calculate My Budget <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#calculator" className="btn-outline text-base" data-testid="hero-cta-secondary">
              Get Pre-Qualified
            </a>
          </div>

          <div className="mt-8 flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2" data-testid="hero-trust-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> No credit impact
            </div>
            <div className="flex items-center gap-2" data-testid="hero-trust-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <span>4.9 · 12,840 reviews</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Image with overlay */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1551135049-8a33b5883817?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
              alt="Family meeting with mortgage advisor"
              className="w-full h-full object-cover"
              data-testid="hero-image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F2557]/40 via-transparent to-transparent" />
          </div>

          {/* Floating estimate card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="absolute -bottom-6 -left-6 md:-left-12 bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 w-64"
            data-testid="hero-floating-card"
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sample estimate</p>
            <p className="font-heading text-3xl font-bold text-[#0F2557] mt-1 tabular-nums">$425,000</p>
            <p className="text-sm text-slate-600">Estimated home budget</p>
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Monthly</p>
                <p className="font-semibold text-[#0F2557] tabular-nums">$2,780</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Rate</p>
                <p className="font-semibold text-[#0F2557] tabular-nums">6.25%</p>
              </div>
            </div>
          </motion.div>

          {/* Floating trust badge */}
          <div className="absolute -top-4 -right-4 bg-white rounded-full pl-3 pr-4 py-2 shadow-xl border border-gray-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-xs font-semibold text-[#0F2557]">SOC 2 · Bank-grade</span>
          </div>
        </motion.div>
      </div>

      {/* Trust strip — partner-style logos using lucide icons */}
      <div className="border-t border-gray-200/80 bg-white">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-slate-500">
          <p className="text-xs uppercase tracking-widest font-medium">Comparable to industry leaders</p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-80">
            <span className="flex items-center gap-2 font-heading font-semibold"><Rocket className="w-5 h-5" /> RocketLine</span>
            <span className="flex items-center gap-2 font-heading font-semibold"><Building2 className="w-5 h-5" /> BetterRate</span>
            <span className="flex items-center gap-2 font-heading font-semibold"><TreePine className="w-5 h-5" /> LendVine</span>
            <span className="flex items-center gap-2 font-heading font-semibold"><Landmark className="w-5 h-5" /> Quicken Path</span>
          </div>
        </div>
      </div>
    </section>
  );
}
