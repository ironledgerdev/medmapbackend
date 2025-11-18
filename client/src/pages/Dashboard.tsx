import { StatCard } from "@/components/StatCard";
import { AppointmentTable } from "@/components/AppointmentTable";
import { Users, UserCog, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const mockAppointments = [
    {
      id: "1",
      patientName: "Lerato Motsumi",
      doctorName: "Dr. Thabo Mthembu",
      date: new Date(2025, 10, 20),
      time: "09:00 AM",
      status: "confirmed" as const,
    },
    {
      id: "2",
      patientName: "David van der Merwe",
      doctorName: "Dr. Sarah Williams",
      date: new Date(2025, 10, 20),
      time: "10:30 AM",
      status: "pending" as const,
    },
    {
      id: "3",
      patientName: "Nomfundo Mbeki",
      doctorName: "Dr. Nomsa Dlamini",
      date: new Date(2025, 10, 19),
      time: "02:00 PM",
      status: "completed" as const,
    },
    {
      id: "4",
      patientName: "Sipho Ndlovu",
      doctorName: "Dr. Thabo Mthembu",
      date: new Date(2025, 10, 18),
      time: "11:00 AM",
      status: "completed" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">
          Monitor platform performance and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Doctors"
          value="1,234"
          trend={{ value: 12.5, isPositive: true }}
          icon={UserCog}
          testId="stat-doctors"
        />
        <StatCard
          title="Active Patients"
          value="8,547"
          trend={{ value: 8.2, isPositive: true }}
          icon={Users}
          testId="stat-patients"
        />
        <StatCard
          title="Today's Appointments"
          value="127"
          trend={{ value: -2.1, isPositive: false }}
          icon={Calendar}
          testId="stat-appointments"
        />
        <StatCard
          title="Revenue (MTD)"
          value="R 245,890"
          trend={{ value: 15.3, isPositive: true }}
          icon={TrendingUp}
          testId="stat-revenue"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Appointments</CardTitle>
          <CardDescription>Latest bookings across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentTable
            appointments={mockAppointments}
            onView={(id) => console.log("View appointment:", id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
