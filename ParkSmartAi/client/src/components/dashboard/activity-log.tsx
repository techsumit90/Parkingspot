import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { Car, LogOut, Clock } from "lucide-react";

type Activity = {
  id: number;
  spotName: string;
  action: "booked" | "freed" | "expired";
  timestamp: string;
  vehicleNumber?: string;
};

interface ActivityLogProps {
  activities: Activity[];
  isLoading: boolean;
}

export default function ActivityLog({ activities, isLoading }: ActivityLogProps) {
  // Style mapping for different activity types
  const activityStyles = {
    booked: {
      borderColor: "border-primary",
      bgColor: "bg-blue-50",
      icon: <Car className="text-primary" />,
    },
    freed: {
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      icon: <LogOut className="text-green-500" />,
    },
    expired: {
      borderColor: "border-amber-500",
      bgColor: "bg-amber-50",
      icon: <Clock className="text-amber-500" />,
    },
  };
  
  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };
  
  // Generate activity message
  const getActivityMessage = (activity: Activity) => {
    switch (activity.action) {
      case "booked":
        return `Spot ${activity.spotName} booked`;
      case "freed":
        return `Spot ${activity.spotName} freed`;
      case "expired":
        return `Spot ${activity.spotName} booking expired`;
      default:
        return `Activity for ${activity.spotName}`;
    }
  };
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="mt-8">
        <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="h-10 w-10 rounded-full mr-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-8">
      <h4 className="text-lg font-semibold mb-4">Recent Activity</h4>
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activities</p>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => {
            const style = activityStyles[activity.action];
            
            return (
              <div 
                key={activity.id}
                className={`flex items-center p-3 border-l-4 ${style.borderColor} ${style.bgColor} rounded-r-lg`}
              >
                <div className="mr-4 bg-white p-2 rounded-full">
                  {style.icon}
                </div>
                <div>
                  <p className="font-medium">{getActivityMessage(activity)}</p>
                  <p className="text-sm text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
