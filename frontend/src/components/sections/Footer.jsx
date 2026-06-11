import React from "react";
import { Home, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A1A3A] text-blue-100" data-testid="footer">
      <div className="container-x py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">Northcrest</span>
            </div>
            <p className="text-sm text-blue-200/80 leading-relaxed">
              Connecting U.S. homebuyers with licensed mortgage professionals since 2018.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> hello@northcrest.example</p>
              <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 1-800-555-0199</p>
              <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Austin, TX · Remote U.S.</p>
            </div>
          </div>

          <div>
            <p className="font-heading font-semibold text-white mb-4">Products</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#calculator" className="hover:text-white">Affordability Calculator</a></li>
              <li><a href="#calculator" className="hover:text-white">Pre-Qualification</a></li>
              <li><a href="#programs" className="hover:text-white">Loan Programs</a></li>
              <li><a href="#resources" className="hover:text-white">Free Guide</a></li>
            </ul>
          </div>

          <div>
            <p className="font-heading font-semibold text-white mb-4">Resources</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
              <li><a href="#" className="hover:text-white">Mortgage Glossary</a></li>
              <li><a href="#" className="hover:text-white">Rate Updates</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <p className="font-heading font-semibold text-white mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#" data-testid="footer-privacy" className="hover:text-white">Privacy Policy</a></li>
              <li><a href="#" data-testid="footer-terms" className="hover:text-white">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white">Licenses & Disclosures</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 text-[11px] text-blue-300/70 leading-relaxed">
          <p data-testid="footer-disclaimer">
            <strong className="text-blue-200">Mortgage Disclaimer:</strong> Northcrest is a mortgage marketplace and not a direct lender. Loan products are offered by independent, licensed third-party lenders. Rates, terms, and approval are subject to lender review and underwriting. Pre-qualification is not a commitment to lend. APR shown is illustrative. Equal Housing Opportunity. NMLS ID #1234567 (sample). © {new Date().getFullYear()} Northcrest Mortgage, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
