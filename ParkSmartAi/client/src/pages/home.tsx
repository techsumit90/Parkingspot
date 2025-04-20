import { useEffect } from "react";
import HeroSection from "@/components/home/hero-section";
import FeaturesSection from "@/components/home/features-section";
import DashboardSection from "@/components/home/dashboard-section";
import HowItWorksSection from "@/components/home/how-it-works-section";
import ContactSection from "@/components/home/contact-section";

export default function Home() {
  useEffect(() => {
    // Support for smooth scrolling to anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Account for fixed header
          behavior: 'smooth'
        });
      });
    });
    
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', function (e) {});
      });
    };
  }, []);
  
  return (
    <div>
      <div id="home">
        <HeroSection />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="dashboard">
        <DashboardSection />
      </div>
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
}
