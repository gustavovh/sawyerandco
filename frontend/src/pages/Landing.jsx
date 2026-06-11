import React from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Calculator from "@/components/sections/Calculator";
import Trust from "@/components/sections/Trust";
import Benefits from "@/components/sections/Benefits";
import LeadMagnet from "@/components/sections/LeadMagnet";
import Programs from "@/components/sections/Programs";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Footer from "@/components/sections/Footer";
import ChatBot from "@/components/sections/ChatBot";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" data-testid="landing-page">
      <Navbar />
      <main>
        <Hero />
        <Calculator />
        <Trust />
        <Benefits />
        <LeadMagnet />
        <Programs />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
