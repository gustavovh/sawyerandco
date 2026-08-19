import React, { useEffect } from "react";
import Navbar from "../components/sections/Navbar";
import Hero from "../components/sections/Hero";
import Calculator from "../components/sections/Calculator";   // <-- FALTA ESTA LÍNEA
import Trust from "../components/sections/Trust";
import Benefits from "../components/sections/Benefits";
import LeadMagnet from "../components/sections/LeadMagnet";
import Programs from "../components/sections/Programs";
import FAQ from "../components/sections/FAQ";
import FinalCTA from "../components/sections/FinalCTA";
import Footer from "../components/sections/Footer";
import ChatBot from "../components/sections/ChatBot";

export default function Landing() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widgets.leadconnectorhq.com/loader.js";
    script.setAttribute("data-resources-url", "https://widgets.leadconnectorhq.com/chat-widget/loader.js");
    script.setAttribute("data-widget-id", "6a85942f56eb8ca703a8b841");
    script.setAttribute("data-source", "WEB_USER");
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);
  
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
