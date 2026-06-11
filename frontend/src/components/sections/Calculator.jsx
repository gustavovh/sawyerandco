import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, ShieldCheck, Lock, Sparkles, CheckCircle2, TrendingUp } from "lucide-react";
import { api, formatMoney } from "@/lib/api";
import { toast } from "sonner";

const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];
const CREDIT_OPTIONS = [
  { value: "below-580", label: "Below 580", desc: "Building credit" },
  { value: "580-619", label: "580-619", desc: "Fair" },
  { value: "620-679", label: "620-679", desc: "Good" },
  { value: "680-739", label: "680-739", desc: "Very good" },
  { value: "740+", label: "740+", desc: "Excellent" },
];

const STEPS = ["Income", "Debts", "Down Payment", "Credit", "Location", "Your Info"];

export default function Calculator() {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({
    annual_income: 85000,
    monthly_debt: 400,
    down_payment: 30000,
    credit_score: "680-739",
    state: "CA",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    zip_code: "",
  });

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const progress = useMemo(() => ((step + 1) / STEPS.length) * 100, [step]);

  const canNext = () => {
    switch (step) {
      case 0: return form.annual_income >= 10000;
      case 1: return form.monthly_debt >= 0;
      case 2: return form.down_payment >= 0;
      case 3: return !!form.credit_score;
      case 4: return !!form.state;
      case 5:
        return form.first_name && form.last_name && form.email.includes("@") && form.phone.length >= 7 && form.zip_code.length >= 5;
      default: return false;
    }
  };

  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));
  const prev = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    setSubmitting(true);
    try {
      const calc = await api.post("/calculate", {
        annual_income: Number(form.annual_income),
        monthly_debt: Number(form.monthly_debt),
        down_payment: Number(form.down_payment),
        credit_score: form.credit_score,
        state: form.state,
      });
      const lead = {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        zip_code: form.zip_code,
        annual_income: Number(form.annual_income),
        monthly_debt: Number(form.monthly_debt),
        down_payment: Number(form.down_payment),
        credit_score: form.credit_score,
        state: form.state,
        source: "calculator",
        home_price_low: calc.data.home_price_low,
        home_price_high: calc.data.home_price_high,
        monthly_payment: calc.data.monthly_payment,
      };
      await api.post("/leads", lead);
      setResult(calc.data);
      toast.success("Your personalized estimate is ready!");
    } catch (e) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="calculator" className="section bg-white">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] text-xs font-semibold uppercase tracking-wider" data-testid="calc-section-eyebrow">
            <Sparkles className="w-3 h-3" /> Affordability Calculator
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#0F2557] mt-4 tracking-tight" data-testid="calc-section-title">
            See your real budget in 60 seconds.
          </h2>
          <p className="mt-4 text-slate-600 text-lg">
            Five quick questions. We'll calculate what you can afford and recommend the right loan programs.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 card-soft" data-testid="calc-form-card">
            {!result ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Step {step + 1} of {STEPS.length} · {STEPS[step]}
                  </p>
                  <p className="text-xs text-slate-500">{Math.round(progress)}% complete</p>
                </div>
                <Progress value={progress} className="h-1.5 mb-8" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.25 }}
                    className="min-h-[280px]"
                  >
                    {step === 0 && (
                      <div>
                        <Label className="font-heading text-2xl text-[#0F2557]">What's your annual household income?</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-6">Pre-tax income from all earners.</p>
                        <div className="mb-2 flex items-baseline gap-2">
                          <span className="font-heading text-4xl font-bold text-[#0F2557] tabular-nums">{formatMoney(form.annual_income)}</span>
                          <span className="text-slate-500 text-sm">/ year</span>
                        </div>
                        <Slider data-testid="calc-income-slider" value={[form.annual_income]} min={20000} max={500000} step={5000} onValueChange={(v) => update("annual_income", v[0])} className="mt-4" />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                          <span>$20k</span><span>$500k</span>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div>
                        <Label className="font-heading text-2xl text-[#0F2557]">Monthly debt payments?</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-6">Car loans, student loans, credit cards (minimum payments).</p>
                        <div className="mb-2 flex items-baseline gap-2">
                          <span className="font-heading text-4xl font-bold text-[#0F2557] tabular-nums">{formatMoney(form.monthly_debt)}</span>
                          <span className="text-slate-500 text-sm">/ month</span>
                        </div>
                        <Slider data-testid="calc-debt-slider" value={[form.monthly_debt]} min={0} max={5000} step={50} onValueChange={(v) => update("monthly_debt", v[0])} className="mt-4" />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                          <span>$0</span><span>$5,000</span>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <Label className="font-heading text-2xl text-[#0F2557]">How much for the down payment?</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-6">Including savings, gifts, or assistance programs.</p>
                        <div className="mb-2 flex items-baseline gap-2">
                          <span className="font-heading text-4xl font-bold text-[#0F2557] tabular-nums">{formatMoney(form.down_payment)}</span>
                        </div>
                        <Slider data-testid="calc-down-slider" value={[form.down_payment]} min={0} max={200000} step={1000} onValueChange={(v) => update("down_payment", v[0])} className="mt-4" />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                          <span>$0</span><span>$200k</span>
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <Label className="font-heading text-2xl text-[#0F2557]">What's your credit score range?</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-6">A soft estimate is fine — no credit check.</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {CREDIT_OPTIONS.map((opt) => {
                            const active = form.credit_score === opt.value;
                            return (
                              <button
                                key={opt.value}
                                onClick={() => update("credit_score", opt.value)}
                                data-testid={`calc-credit-${opt.value}`}
                                className={`text-left p-4 rounded-xl border-2 transition-all ${active ? "border-[#0066FF] bg-blue-50/50" : "border-gray-200 hover:border-gray-300"}`}
                              >
                                <p className="font-heading font-semibold text-[#0F2557]">{opt.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div>
                        <Label className="font-heading text-2xl text-[#0F2557]">Which state are you buying in?</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-6">We'll match you with lenders licensed in your area.</p>
                        <Select value={form.state} onValueChange={(v) => update("state", v)}>
                          <SelectTrigger data-testid="calc-state-select" className="h-12 text-base">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {step === 5 && (
                      <div>
                        <Label className="font-heading text-2xl text-[#0F2557]">Where should we send your estimate?</Label>
                        <p className="text-sm text-slate-500 mt-1 mb-6 flex items-center gap-2">
                          <Lock className="w-3.5 h-3.5" /> Secure & private. We never sell your info.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <Input data-testid="lead-first-name" placeholder="First name" value={form.first_name} onChange={(e) => update("first_name", e.target.value)} className="h-12" />
                          <Input data-testid="lead-last-name" placeholder="Last name" value={form.last_name} onChange={(e) => update("last_name", e.target.value)} className="h-12" />
                          <Input data-testid="lead-email" type="email" placeholder="Email address" value={form.email} onChange={(e) => update("email", e.target.value)} className="h-12 sm:col-span-2" />
                          <Input data-testid="lead-phone" placeholder="Phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="h-12" />
                          <Input data-testid="lead-zip" placeholder="ZIP code" value={form.zip_code} onChange={(e) => update("zip_code", e.target.value)} className="h-12" maxLength={5} />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-4">
                          By submitting you consent to be contacted by Northcrest and our licensed lending partners about your inquiry. This will not affect your credit score.
                        </p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between gap-3">
                  <Button variant="ghost" onClick={prev} disabled={step === 0} data-testid="calc-prev-btn">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  {step < STEPS.length - 1 ? (
                    <button onClick={next} disabled={!canNext()} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" data-testid="calc-next-btn">
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button onClick={submit} disabled={!canNext() || submitting} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed" data-testid="calc-submit-btn">
                      {submitting ? "Calculating…" : "Get My Estimate"} <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
            ) : (
              <ResultView result={result} form={form} onReset={() => { setResult(null); setStep(0); }} />
            )}
          </div>

          {/* Right: Value Prop / Locked teaser */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F2557] text-white rounded-2xl p-8 h-full relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#0066FF]/30 rounded-full blur-3xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-200">Your Personalized</p>
                <h3 className="font-heading text-3xl md:text-4xl font-semibold mt-2">{result ? "Estimate" : "Estimate awaits"}</h3>
                {!result && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-start gap-3 text-blue-100">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-300 flex-shrink-0" />
                      <p className="text-sm">Home price range tailored to your income & DTI</p>
                    </div>
                    <div className="flex items-start gap-3 text-blue-100">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-300 flex-shrink-0" />
                      <p className="text-sm">Estimated monthly payment & today's rates</p>
                    </div>
                    <div className="flex items-start gap-3 text-blue-100">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-300 flex-shrink-0" />
                      <p className="text-sm">Top 3 loan programs you likely qualify for</p>
                    </div>
                    <div className="flex items-start gap-3 text-blue-100">
                      <CheckCircle2 className="w-5 h-5 mt-0.5 text-blue-300 flex-shrink-0" />
                      <p className="text-sm">No credit check · No spam · Free</p>
                    </div>
                  </div>
                )}
                {result && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-blue-100 text-sm">
                      <TrendingUp className="w-4 h-4" /> Based on a 30-year fixed at {result.estimated_rate}%
                    </div>
                  </div>
                )}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-blue-200 text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SOC 2 · 256-bit encryption · NMLS licensed partners</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ResultView({ result, form, onReset }) {
  return (
    <div data-testid="calc-result-view">
      <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold mb-2">
        <CheckCircle2 className="w-4 h-4" /> Your estimate is ready
      </div>
      <h3 className="font-heading text-3xl md:text-4xl font-semibold text-[#0F2557]" data-testid="calc-result-title">
        Hi {form.first_name}, here's your budget.
      </h3>
      <p className="text-slate-600 mt-2">A licensed loan officer will follow up shortly. No obligation.</p>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0066FF]">Home price range</p>
          <p className="font-heading text-3xl font-bold text-[#0F2557] mt-2 tabular-nums" data-testid="result-home-price">
            {formatMoney(result.home_price_low)} – {formatMoney(result.home_price_high)}
          </p>
        </div>
        <div className="bg-blue-50/60 rounded-xl p-5 border border-blue-100">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#0066FF]">Estimated monthly</p>
          <p className="font-heading text-3xl font-bold text-[#0F2557] mt-2 tabular-nums" data-testid="result-monthly">
            {formatMoney(result.monthly_payment)}
          </p>
          <p className="text-xs text-slate-500 mt-1">Principal, interest, taxes & insurance</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Recommended loan programs</p>
        <div className="flex flex-wrap gap-2">
          {result.loan_programs.map((p) => (
            <span key={p} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-[#0F2557]" data-testid="result-program">{p}</span>
          ))}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-slate-500">Rate</p>
          <p className="font-semibold text-[#0F2557] tabular-nums">{result.estimated_rate}%</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-slate-500">Down payment</p>
          <p className="font-semibold text-[#0F2557] tabular-nums">{formatMoney(form.down_payment)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-slate-500">DTI ratio</p>
          <p className="font-semibold text-[#0F2557] tabular-nums">{result.dti_ratio}%</p>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <a href="#programs" className="btn-primary flex-1 justify-center">Explore loan programs</a>
        <button onClick={onReset} className="btn-outline" data-testid="calc-reset-btn">Recalculate</button>
      </div>
    </div>
  );
}
