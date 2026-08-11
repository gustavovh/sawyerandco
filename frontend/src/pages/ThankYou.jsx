import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import Navbar from "../components/sections/Navbar";
import Footer from "../components/sections/Footer";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-white flex flex-col" data-testid="thank-you-page">
      <Navbar />

      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-[#FAFAFA] to-white section">
        <div className="container-x w-full max-w-2xl text-center">
          <div className="card-soft flex flex-col items-center justify-center py-12 md:py-16">
            <div className="rounded-full bg-[#ECFDF5] p-4 text-[#10B981] mb-6 animate-bounce" style={{ animationDuration: '3s' }}>
              <CheckCircle2 className="w-16 h-16 md:w-20 md:h-20" />
            </div>

            <h1 className="text-4xl md:text-5xl font-semibold text-[#0F2557] mb-4 tracking-tight leading-tight">
              Thank You!
            </h1>

            <p className="text-lg md:text-xl text-[#1E293B] font-medium mb-2">
              Your information has been received successfully.
            </p>

            <p className="text-slate-600 mb-10 max-w-md mx-auto">
              One of our mortgage specialists will contact you shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                to="/"
                data-testid="return-home-btn"
                className="btn-primary flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
