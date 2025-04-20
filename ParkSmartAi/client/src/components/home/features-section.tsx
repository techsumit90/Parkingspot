import {
  Clock,
  Calendar,
  BarChart3,
  MapPin,
  Bell,
  History,
} from "lucide-react";

const features = [
  {
    icon: <Clock className="h-8 w-8" />,
    title: "Real-Time Updates",
    description: "Get instant updates on parking spot availability with our AI-powered detection system."
  },
  {
    icon: <Calendar className="h-8 w-8" />,
    title: "Easy Booking",
    description: "Reserve your parking spot in advance with just a few taps on your phone."
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Live Analytics",
    description: "View comprehensive stats about parking availability and historical patterns."
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Visual Map",
    description: "Interactive visual representation of all parking spots with real-time status."
  },
  {
    icon: <Bell className="h-8 w-8" />,
    title: "Notifications",
    description: "Receive alerts about your booking, time limits, and spot availability."
  },
  {
    icon: <History className="h-8 w-8" />,
    title: "Activity Log",
    description: "Track your parking history and monitor recent activities in the parking area."
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Smart Features</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the future of parking with our advanced AI technology
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-primary text-3xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
