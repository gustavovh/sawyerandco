import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_mortgage-prequalify/artifacts/19i5630p_image.png";

export default function Footer() {
  return (
    <footer className="bg-[#0A1A3A] text-blue-100" data-testid="footer">
      <div className="container-x py-16">
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-3 inline-block mb-4">
              <img src={LOGO_URL} alt="Sawyer & Company" className="h-24 w-auto object-contain" />
            </div>
            <p className="text-sm text-blue-200/80 leading-relaxed">
              Connecting U.S. homebuyers with licensed mortgage professionals since 2018.
            </p>
            <div className="mt-5 space-y-2 text-sm">
             <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 1-385-534-8359</p>
             </div>
            <a href="#get-quote" data-testid="footer-get-quote" className="btn-primary text-sm py-2.5 px-5 mt-5 inline-flex">Get Quote</a>
          </div>

          <div>
            <p className="font-heading font-semibold text-white mb-4">Products</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#calculator" className="hover:text-white">Affordability Calculator</a></li>
              <li><a href="#calculator" className="hover:text-white">Pre-Qualification</a></li>
              <li><a href="#programs" className="hover:text-white">Loan Programs</a></li>
            </ul>
          </div>

          <div>
            <p className="font-heading font-semibold text-white mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" data-testid="footer-privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><a href="#" className="hover:text-white">Licenses & Disclosures</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 text-[11px] text-blue-300/70 leading-relaxed">
          <p data-testid="footer-disclaimer">
            <strong className="text-blue-200">Mortgage Disclaimer:</strong> Sawyer & Company is a mortgage marketplace and not a direct lender. Loan products are offered by independent, licensed third-party lenders. Rates, terms, and approval are subject to lender review and underwriting. Pre-qualification is not a commitment to lend. APR shown is illustrative. Equal Housing Opportunity. NMLS ID #1234567 (sample). © {new Date().getFullYear()} Sawyer & Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
