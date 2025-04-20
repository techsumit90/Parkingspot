import { Button } from "@/components/ui/button";
import { MapPin, MousePointer, Car } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: <MapPin className="h-10 w-10" />,
    title: "View Available Spots",
    description: "Check our interactive map to see all available parking spots in real-time. Color-coded for easy identification."
  },
  {
    number: 2,
    icon: <MousePointer className="h-10 w-10" />,
    title: "Book Your Spot",
    description: "Select an available spot and confirm your booking with details like duration and vehicle information."
  },
  {
    number: 3,
    icon: <Car className="h-10 w-10" />,
    title: "Park with Confidence",
    description: "Receive a confirmation and navigate to your reserved spot. When leaving, simply mark your spot as free."
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Simple steps to find and book your parking spot
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                {step.number}
              </div>
              <div className="text-center pt-6">
                <div className="mb-6 text-5xl text-primary mx-auto">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <a href="#dashboard" className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg inline-block transition-colors duration-300">
            Try It Now
          </a>
        </div>
      </div>
    </section>
  );
}
