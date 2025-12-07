import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2 } from "lucide-react";
import type { DashboardStats, Appointment, Doctor } from "@shared/schema";

export default function Analytics() {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<"csv" | "pdf" | "excel" | null>(null);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats");
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as Promise<DashboardStats>;
    },
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const response = await fetch("/api/appointments");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json() as Promise<Appointment[]>;
    },
  });

  const { data: doctors = [] } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await fetch("/api/doctors");
      if (!response.ok) throw new Error("Failed to fetch doctors");
      return response.json() as Promise<Doctor[]>;
    },
  });

  // Prepare chart data
  const appointmentStatusData = [
    { name: "Pending", value: appointments.filter((a) => a.status === "pending").length, fill: "#fbbf24" },
    { name: "Confirmed", value: appointments.filter((a) => a.status === "confirmed").length, fill: "#60a5fa" },
    { name: "Completed", value: appointments.filter((a) => a.status === "completed").length, fill: "#34d399" },
    { name: "Cancelled", value: appointments.filter((a) => a.status === "cancelled").length, fill: "#f87171" },
  ];

  const doctorStatusData = [
    { name: "Verified", value: doctors.filter((d) => d.approved_at).length, fill: "#34d399" },
    { name: "Pending", value: doctors.filter((d) => !d.approved_at).length, fill: "#fbbf24" },
  ];

  // Monthly revenue (simulated)
  const monthlyRevenueData = [
    { month: "Jan", revenue: 12000 },
    { month: "Feb", revenue: 15000 },
    { month: "Mar", revenue: 18000 },
    { month: "Apr", revenue: 16000 },
    { month: "May", revenue: 20000 },
    { month: "Jun", revenue: stats?.total_revenue || 0 },
  ];

  // Appointment trends (simulated)
  const appointmentTrendsData = [
    { week: "Week 1", appointments: 12, completed: 10 },
    { week: "Week 2", appointments: 15, completed: 13 },
    { week: "Week 3", appointments: 18, completed: 16 },
    { week: "Week 4", appointments: appointments.length, completed: appointments.filter((a) => a.status === "completed").length },
  ];

  const handleExport = async (format: "csv" | "pdf" | "excel") => {
    setExportFormat(format);
    try {
      const data = {
        stats,
        appointmentsSummary: {
          total: appointments.length,
          pending: appointments.filter((a) => a.status === "pending").length,
          confirmed: appointments.filter((a) => a.status === "confirmed").length,
          completed: appointments.filter((a) => a.status === "completed").length,
          cancelled: appointments.filter((a) => a.status === "cancelled").length,
        },
        doctorsSummary: {
          total: doctors.length,
          verified: doctors.filter((d) => d.approved_at).length,
          pending: doctors.filter((d) => !d.approved_at).length,
        },
        exportedAt: new Date().toISOString(),
      };

      if (format === "csv") {
        exportToCSV(data);
      } else if (format === "pdf") {
        toast({
          title: "PDF Export",
          description: "PDF export functionality requires additional setup. For now, use CSV export.",
        });
      } else if (format === "excel") {
        toast({
          title: "Excel Export",
          description: "Excel export functionality requires additional setup. For now, use CSV export.",
        });
      }
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    } finally {
      setExportFormat(null);
    }
  };

  const exportToCSV = (data: any) => {
    const csv = [
      "MedMap Analytics Report",
      `Exported: ${new Date().toISOString()}`,
      "",
      "DASHBOARD STATISTICS",
      `Total Doctors,${data.stats.total_doctors}`,
      `Active Patients,${data.stats.active_patients}`,
      `Today Appointments,${data.stats.today_appointments}`,
      `Total Revenue,${data.stats.total_revenue}`,
      "",
      "APPOINTMENTS SUMMARY",
      `Total,${data.appointmentsSummary.total}`,
      `Pending,${data.appointmentsSummary.pending}`,
      `Confirmed,${data.appointmentsSummary.confirmed}`,
      `Completed,${data.appointmentsSummary.completed}`,
      `Cancelled,${data.appointmentsSummary.cancelled}`,
      "",
      "DOCTORS SUMMARY",
      `Total,${data.doctorsSummary.total}`,
      `Verified,${data.doctorsSummary.verified}`,
      `Pending,${data.doctorsSummary.pending}`,
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    toast({
      title: "Export Successful",
      description: "Analytics report has been exported to CSV",
    });
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Platform insights and performance metrics
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              Export as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("excel")}>
              Export as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Doctors"
          value={stats?.total_doctors ?? 0}
          change={`${stats?.doctors_trend ?? 0}%`}
          changeType={Number(stats?.doctors_trend) >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Active Patients"
          value={stats?.active_patients ?? 0}
          change={`${stats?.patients_trend ?? 0}%`}
          changeType={Number(stats?.patients_trend) >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Today Appointments"
          value={stats?.today_appointments ?? 0}
          change={`${stats?.appointments_trend ?? 0}%`}
          changeType={Number(stats?.appointments_trend) >= 0 ? "positive" : "negative"}
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats?.total_revenue ?? 0}`}
          change={`${stats?.revenue_trend ?? 0}%`}
          changeType={Number(stats?.revenue_trend) >= 0 ? "positive" : "negative"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
            <CardDescription>Revenue trend over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
            <CardDescription>Weekly appointment patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={appointmentTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#60a5fa" />
                <Bar dataKey="completed" fill="#34d399" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Appointment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Appointment Status</CardTitle>
            <CardDescription>Distribution of appointments by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={appointmentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {appointmentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Doctor Verification Status */}
        <Card>
          <CardHeader>
            <CardTitle>Doctor Verification Status</CardTitle>
            <CardDescription>Doctors by verification status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={doctorStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {doctorStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
