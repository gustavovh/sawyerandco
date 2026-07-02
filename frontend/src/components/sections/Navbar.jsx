import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const LOGO_URL = "https://customer-assets.emergentagent.com/job_mortgage-prequalify/artifacts/19i5630p_image.png";

const NAV = [
  { label: "Calculator", href: "#calculator" },
  { label: "Programs", href: "#programs" },
  { label: "Resources", href: "#resources" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200/70">
      <div className="container-x flex items-center justify-between h-20 md:h-28">
        <Link to="/" className="flex items-center group" data-testid="nav-logo">
          <img src={LOGO_URL} alt="Sawyer & Company" className="h-20 md:h-24 w-auto object-contain" />
        </Link>

        {isLanding && (
          <nav className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} data-testid={`nav-${n.label.toLowerCase()}`} className="text-sm font-medium text-slate-700 hover:text-[#0066FF] transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
        )}

        <div className="hidden md:flex items-center gap-3">
          <Link to="/admin/login" data-testid="nav-admin-link" className="text-sm font-medium text-slate-600 hover:text-[#0F2557]">Admin</Link>
          <a href="#calculator" data-testid="nav-cta" className="btn-primary text-sm py-2.5 px-5">Get Pre-Qualified</a>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2" data-testid="nav-mobile-toggle" aria-label="Toggle menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="container-x py-4 flex flex-col gap-3">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="text-base font-medium text-slate-700">{n.label}</a>
            ))}
            <a href="#calculator" onClick={() => setOpen(false)} className="btn-primary text-center mt-2">Get Pre-Qualified</a>
            <Link to="/admin/login" className="text-sm text-slate-500">Admin</Link>
          </div>
        </div>
      )}
    </header>
  );
}
