import React, { useState } from "react";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function LeadMagnet() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setBusy(true);
    try {
      await api.post("/subscribers", { email, source: "lead-magnet" });
      setDone(true);
      toast.success("Check your inbox — guide is on its way!");
    } catch {
      toast.error("Couldn't send. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const items = [
    "How much down payment you actually need",
    "Credit score requirements by loan type",
    "Hidden closing costs (and how to avoid them)",
    "The 5 most common first-timer mistakes",
  ];

  return (
    <section id="resources" className="section" data-testid="leadmagnet-section">
      <div className="container-x">
        <div className="bg-[#0F2557] rounded-3xl overflow-hidden grid md:grid-cols-2 relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0066FF]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="p-8 md:p-14 relative">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 text-xs font-semibold uppercase tracking-wider">
              <FileText className="w-3 h-3" /> Free Resource
            </span>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-white mt-4 tracking-tight">
              2026 First-Time Homebuyer Success Guide
            </h2>
            <p className="text-blue-100 mt-3 text-lg leading-relaxed">
              Everything you need to navigate your first mortgage with confidence.
            </p>
            <ul className="mt-6 space-y-2.5">
              {items.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-blue-50">
                  <CheckCircle2 className="w-5 h-5 mt-0.5 text-[#0066FF] flex-shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>

            {!done ? (
              <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-3" data-testid="leadmagnet-form">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-white border-0 flex-1"
                  data-testid="leadmagnet-email"
                  required
                />
                <button type="submit" disabled={busy} className="btn-primary h-12 disabled:opacity-50" data-testid="leadmagnet-submit">
                  <Download className="w-4 h-4" /> {busy ? "Sending…" : "Download Free"}
                </button>
              </form>
            ) : (
              <div className="mt-8 bg-white/10 rounded-xl p-4 flex items-center gap-3" data-testid="leadmagnet-success">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <p className="text-white text-sm">Sent! Check your inbox in a few minutes.</p>
              </div>
            )}
            <p className="text-xs text-blue-300 mt-4">PDF · 24 pages · Updated for 2026</p>
          </div>

          <div className="relative min-h-[300px] md:min-h-full">
            <img
              src="https://images.unsplash.com/photo-1709787627975-9cb37bbeca60?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"
              alt="First time homebuyers in front of house"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
