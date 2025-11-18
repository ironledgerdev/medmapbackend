import { StatCard } from "../StatCard";
import { Users } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="p-6 bg-background">
      <StatCard
        title="Total Doctors"
        value="1,234"
        trend={{ value: 12.5, isPositive: true }}
        icon={Users}
        testId="stat-doctors"
      />
    </div>
  );
}
