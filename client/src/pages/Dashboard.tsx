import { StatCard } from "@/components/StatCard";
import { AppointmentTable } from "@/components/AppointmentTable";
import { Users, UserCog, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats, Appointment } from "@shared/schema";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/stats"],
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
    select: (data) => data.slice(0, 10), // Get recent 10
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor platform performance and key metrics
        </p>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Doctors"
            value={stats?.total_doctors.toLocaleString() || "0"}
            trend={{ value: stats?.doctors_trend || 0, isPositive: (stats?.doctors_trend || 0) > 0 }}
            icon={UserCog}
            testId="stat-doctors"
          />
          <StatCard
            title="Active Patients"
            value={stats?.active_patients.toLocaleString() || "0"}
            trend={{ value: stats?.patients_trend || 0, isPositive: (stats?.patients_trend || 0) > 0 }}
            icon={Users}
            testId="stat-patients"
          />
          <StatCard
            title="Today's Appointments"
            value={stats?.today_appointments.toLocaleString() || "0"}
            trend={{ value: stats?.appointments_trend || 0, isPositive: (stats?.appointments_trend || 0) > 0 }}
            icon={Calendar}
            testId="stat-appointments"
          />
          <StatCard
            title="Revenue (MTD)"
            value={formatCurrency(stats?.total_revenue || 0)}
            trend={{ value: stats?.revenue_trend || 0, isPositive: (stats?.revenue_trend || 0) > 0 }}
            icon={TrendingUp}
            testId="stat-revenue"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest bookings across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          {appointmentsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <AppointmentTable
              appointments={appointments.map((apt) => ({
                ...apt,
                date: new Date(apt.appointment_date),
                time: apt.appointment_time,
                patientName: apt.patient_name || 'Unknown',
                doctorName: apt.doctor_name || 'Unknown',
              }))}
              onView={(id) => console.log("View appointment:", id)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
