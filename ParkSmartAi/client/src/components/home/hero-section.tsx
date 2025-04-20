import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find Parking <span className="text-primary">in Seconds</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 leading-relaxed">
              Our AI-powered smart parking assistant helps you find, book, and navigate to available spots in real-time. Save time and reduce stress with intelligent parking management.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#dashboard" className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center">
                Check Spot Availability
              </a>
              <a href="#how-it-works" className="border border-primary text-primary hover:bg-primary hover:text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 text-center">
                How It Works
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -top-8 -left-8 w-64 h-64 bg-primary bg-opacity-10 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-blue-400 bg-opacity-10 rounded-full filter blur-3xl"></div>
              <div className="relative z-10 rounded-2xl shadow-xl overflow-hidden">
                <svg 
                  viewBox="0 0 600 400" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full"
                >
                  <rect width="600" height="400" fill="#f8fafc" />
                  <path d="M0,400 L600,400 L600,300 C500,350 300,250 0,300 Z" fill="#2563eb" fillOpacity="0.1" />
                  <rect x="100" y="100" width="400" height="150" rx="10" fill="#fff" stroke="#e2e8f0" strokeWidth="2" />
                  <rect x="120" y="130" width="50" height="50" rx="5" fill="#2563eb" />
                  <rect x="180" y="130" width="50" height="50" rx="5" fill="#ef4444" />
                  <rect x="240" y="130" width="50" height="50" rx="5" fill="#10b981" />
                  <rect x="120" y="190" width="300" height="10" rx="5" fill="#e2e8f0" />
                  <rect x="120" y="210" width="200" height="10" rx="5" fill="#e2e8f0" />
                  <circle cx="500" cy="100" r="50" fill="#2563eb" fillOpacity="0.1" />
                  <circle cx="50" cy="250" r="30" fill="#2563eb" fillOpacity="0.1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
