import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type ParkingSpot = {
  id: number;
  spotName: string;
  status: "available" | "occupied" | "reserved";
};

interface ParkingGridProps {
  spots: ParkingSpot[];
  isLoading: boolean;
  onSpotClick: (spot: ParkingSpot) => void;
  onFreeSpot: (spotName: string) => void;
}

export default function ParkingGrid({ spots, isLoading, onSpotClick, onFreeSpot }: ParkingGridProps) {
  // Spot status colors
  const statusColors = {
    available: "bg-green-500", // success
    occupied: "bg-red-500", // error
    reserved: "bg-amber-500" // warning
  };
  
  // Status labels for the legend
  const statusLabels = [
    { status: "available", label: "Available", color: "bg-green-500" },
    { status: "occupied", label: "Occupied", color: "bg-red-500" },
    { status: "reserved", label: "Reserved", color: "bg-amber-500" }
  ];
  
  // Generate loading placeholders
  const generateLoadingPlaceholders = () => {
    return Array(24).fill(0).map((_, i) => (
      <Skeleton key={i} className="aspect-square rounded-lg" />
    ));
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-xl font-semibold">Parking Spot Map</h3>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          {statusLabels.map((status) => (
            <div key={status.status} className="flex items-center">
              <span className={`inline-block w-4 h-4 rounded-full ${status.color} mr-2`}></span>
              <span className="text-sm">{status.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Parking Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-3 mb-6">
        {isLoading ? (
          generateLoadingPlaceholders()
        ) : (
          spots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => onSpotClick(spot)}
              className={`parking-spot ${statusColors[spot.status]} relative aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer text-white font-medium transition-all duration-300 hover:-translate-y-1`}
            >
              <span>{spot.spotName}</span>
              {(spot.status === "occupied" || spot.status === "reserved") && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1 text-xs py-0 h-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onFreeSpot(spot.spotName);
                  }}
                >
                  Free
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
