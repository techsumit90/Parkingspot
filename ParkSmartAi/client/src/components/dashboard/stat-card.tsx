import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  description: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  textColor?: string;
  valueSize?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  description,
  borderColor,
  iconBgColor,
  iconColor,
  textColor = "",
  valueSize = "text-3xl",
}: StatCardProps) {
  return (
    <Card className={`stat-card bg-white rounded-xl shadow-sm p-6 border-t-4 ${borderColor} transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 font-medium">{title}</h3>
        <div className={`${iconColor} ${iconBgColor} p-2 rounded-lg`}>
          {icon}
        </div>
      </div>
      <p className={`${valueSize} font-bold ${textColor}`}>{value}</p>
      <p className="text-sm text-gray-500 mt-2">{description}</p>
    </Card>
  );
}
