import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import StatCard from "@/components/dashboard/stat-card";
import ParkingGrid from "@/components/dashboard/parking-grid";
import BookingForm from "@/components/dashboard/booking-form";
import ActivityLog from "@/components/dashboard/activity-log";
import NotificationModal from "@/components/ui/notification-modal";
import { formatDistanceToNow } from "date-fns";
import { SquareParking, CheckCircle, XCircle, Clock } from "lucide-react";

// Types for the dashboard
type DashboardStats = {
  totalSpots: number;
  availableSpots: number;
  occupiedSpots: number;
  reservedSpots: number;
};

type ParkingSpot = {
  id: number;
  spotName: string;
  status: "available" | "occupied" | "reserved";
  lastUpdated: string;
  vehicleNumber?: string;
  bookedAt?: string;
  bookingDuration?: number;
};

type Activity = {
  id: number;
  spotName: string;
  action: "booked" | "freed" | "expired";
  timestamp: string;
  vehicleNumber?: string;
};

type ModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error";
};

export default function DashboardSection() {
  const { toast } = useToast();
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
  });

  // Fetch parking spots
  const { data: parkingSpots, isLoading: spotsLoading } = useQuery<ParkingSpot[]>({
    queryKey: ["/api/parking-spots"],
  });

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/parking-spots/stats"],
  });

  // Fetch activities
  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  // Book spot mutation
  const bookSpotMutation = useMutation({
    mutationFn: (data: { spotName: string; vehicleNumber: string; duration: number }) => {
      return apiRequest("POST", "/api/parking-spots/book", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parking-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/parking-spots/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      setSelectedSpot(null);
      showNotification("Booking Confirmed", "Your parking spot has been successfully booked. You can find all details in the dashboard.", "success");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Failed to book parking spot. Please try again.",
      });
    },
  });

  // Free spot mutation
  const freeSpotMutation = useMutation({
    mutationFn: (spotName: string) => {
      return apiRequest("POST", "/api/parking-spots/free", { spotName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/parking-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/parking-spots/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      toast({
        title: "Spot Freed",
        description: "The parking spot has been successfully freed.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to free parking spot. Please try again.",
      });
    },
  });

  // Auto refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ["/api/parking-spots"] });
      queryClient.invalidateQueries({ queryKey: ["/api/parking-spots/stats"] });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle spot click
  const handleSpotClick = (spot: ParkingSpot) => {
    if (spot.status === "available") {
      setSelectedSpot(spot);
    } else {
      showNotification(
        "Spot Unavailable", 
        "This parking spot is currently occupied or reserved.", 
        "error"
      );
    }
  };

  // Handle booking form submission
  const handleBookSpot = (data: { vehicleNumber: string; duration: number }) => {
    if (!selectedSpot) return;
    
    bookSpotMutation.mutate({
      spotName: selectedSpot.spotName,
      vehicleNumber: data.vehicleNumber,
      duration: data.duration,
    });
  };

  // Handle freeing a spot
  const handleFreeSpot = (spotName: string) => {
    freeSpotMutation.mutate(spotName);
  };

  // Show notification modal
  const showNotification = (title: string, message: string, type: "success" | "error") => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  // Close notification modal
  const closeNotification = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  // Format time for last updated
  const formatLastUpdated = () => {
    if (!stats) return "Loading...";
    return "2 mins ago"; // Static example, would be dynamic in real app
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Live Dashboard</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Monitor real-time parking analytics and spot availability
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Total Spots"
            value={statsLoading ? "..." : stats?.totalSpots.toString() || "0"}
            icon={<SquareParking />}
            borderColor="border-primary"
            iconBgColor="bg-blue-100"
            iconColor="text-primary"
            description="Parking capacity"
          />
          
          <StatCard 
            title="Available"
            value={statsLoading ? "..." : stats?.availableSpots.toString() || "0"}
            icon={<CheckCircle />}
            borderColor="border-green-500"
            iconBgColor="bg-green-100"
            iconColor="text-green-500"
            textColor="text-green-500"
            description="Ready to book"
          />
          
          <StatCard 
            title="Occupied"
            value={statsLoading ? "..." : stats?.occupiedSpots.toString() || "0"}
            icon={<XCircle />}
            borderColor="border-red-500"
            iconBgColor="bg-red-100"
            iconColor="text-red-500"
            textColor="text-red-500"
            description="Currently in use"
          />
          
          <StatCard 
            title="Last Updated"
            value={formatLastUpdated()}
            icon={<Clock />}
            borderColor="border-gray-400"
            iconBgColor="bg-gray-100"
            iconColor="text-gray-600"
            valueSize="text-xl"
            description="Auto-refreshes every 30s"
          />
        </div>
        
        {/* Parking Spot Map */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <ParkingGrid 
            spots={parkingSpots || []}
            isLoading={spotsLoading}
            onSpotClick={handleSpotClick}
            onFreeSpot={handleFreeSpot}
          />
          
          {/* Booking Form (conditionally rendered) */}
          {selectedSpot && (
            <BookingForm 
              spot={selectedSpot} 
              onCancel={() => setSelectedSpot(null)} 
              onBook={handleBookSpot}
              isLoading={bookSpotMutation.isPending}
            />
          )}
          
          {/* Activity Log */}
          <ActivityLog activities={activities || []} isLoading={activitiesLoading} />
        </div>
      </div>
      
      {/* Notification Modal */}
      <NotificationModal 
        isOpen={modalState.isOpen}
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        onClose={closeNotification}
      />
    </section>
  );
}
