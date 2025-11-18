import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  testId?: string;
}

export function StatCard({ title, value, trend, icon: Icon, testId }: StatCardProps) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold" data-testid={`${testId}-value`}>{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>{" "}
            from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
