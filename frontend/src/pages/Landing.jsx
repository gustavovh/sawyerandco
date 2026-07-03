import React from "react";
import Navbar from "../components/sections/Navbar";
import Hero from "../components/sections/Hero";
import Trust from "../components/sections/Trust";
import Benefits from "../components/sections/Benefits";
import LeadMagnet from "../components/sections/LeadMagnet";
import Programs from "../components/sections/Programs";
import FAQ from "../components/sections/FAQ";
import FinalCTA from "../components/sections/FinalCTA";
import Footer from "../components/sections/Footer";
import ChatBot from "../components/sections/ChatBot";

// Importa componentes
import PreQualifyForm from "../components/sections/PreQualifyForm";
import Calculator from "../components/sections/Calculator";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white" data-testid="landing-page">
      <Navbar />
      <main>
        <Hero />
        {/* Formulario GHL (Principal) */}
        <PreQualifyForm />

        <Trust />

        {/* Herramienta de Estimación Original (Respaldo) */}
        <section id="estimate-tool" className="py-20 bg-gray-50">
          <div className="container-x text-center mb-10">
            <h2 className="font-heading text-3xl font-semibold text-[#0F2557]">Interactive Estimator</h2>
            <p className="text-slate-600 mt-2">Try our manual calculator for a quick estimate.</p>
          </div>
          <Calculator />
        </section>

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
