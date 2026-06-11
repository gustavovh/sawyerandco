import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "How much house can I afford?",
    a: "A common rule of thumb is that your housing costs (principal, interest, taxes, insurance) should not exceed 28% of your gross monthly income, and total debt obligations should stay under 43%. Our calculator applies these rules personalized to your income, debts, credit profile, and down payment.",
  },
  {
    q: "Does checking my budget affect my credit?",
    a: "No. Our affordability calculator and pre-qualification use a soft credit pull (or no pull at all). A soft pull is never visible to lenders and has zero impact on your FICO score. A hard pull only happens once you formally apply for a mortgage.",
  },
  {
    q: "What credit score do I need to qualify for a mortgage?",
    a: "FHA loans accept scores as low as 580 (or 500 with 10% down). Conventional loans typically require 620+. VA loans have no strict minimum but most lenders look for 580-620+. Jumbo loans usually require 700+. Higher scores qualify you for better interest rates.",
  },
  {
    q: "How much should I put down on a home?",
    a: "It depends on the loan type. Conventional: 3-5% minimum. FHA: 3.5%. VA & USDA: 0%. Putting 20% down lets you avoid private mortgage insurance (PMI), but waiting to save 20% isn't always the best move — talk to a loan officer about the tradeoffs.",
  },
  {
    q: "What loan programs are available?",
    a: "The main programs are Conventional, FHA, VA, USDA, Jumbo, and Investment Property loans. Each has different credit, down payment, and income requirements. Our calculator recommends the programs that best fit your profile.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="section bg-white" data-testid="faq-section">
      <div className="container-x max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#0066FF]">FAQ</p>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#0F2557] mt-3 tracking-tight">
            Questions, answered.
          </h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-200">
              <AccordionTrigger className="font-heading text-left text-lg font-medium text-[#0F2557] py-5 hover:no-underline" data-testid={`faq-trigger-${i}`}>
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed text-base pb-5" data-testid={`faq-answer-${i}`}>
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
