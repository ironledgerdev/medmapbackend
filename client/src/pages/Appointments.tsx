import { AppointmentTable } from "@/components/AppointmentTable";
import { FilterBar } from "@/components/FilterBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import type { Appointment } from "@shared/schema";

export default function Appointments() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments", { status: statusFilter, search: searchQuery }],
  });

  // Filter appointments by date range
  const getFilteredByDate = (appointments: Appointment[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointment_date);
      const aptDateOnly = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());

      switch (dateFilter) {
        case "today":
          return aptDateOnly.getTime() === today.getTime();
        case "week":
          return aptDateOnly >= weekStart && aptDateOnly <= today;
        case "month":
          return aptDateOnly >= monthStart && aptDateOnly <= today;
        default:
          return true;
      }
    });
  };

  const filteredAppointments = getFilteredByDate(appointments);

  const filters = [
    {
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Pending", value: "pending" },
        { label: "Confirmed", value: "confirmed" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
      onChange: (value: string) => setStatusFilter(value),
    },
    {
      label: "Date Range",
      options: [
        { label: "All Time", value: "all" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
      ],
      onChange: (value: string) => setDateFilter(value),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Appointments</h1>
          <p className="text-sm text-muted-foreground">
            View and manage all platform appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-calendar-view">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </Button>
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Appointments ({appointments.length})</CardTitle>
          <CardDescription>Search and filter appointments by status and date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            searchPlaceholder="Search by patient or doctor name..."
            onSearchChange={(value) => setSearchQuery(value)}
            filters={filters}
          />
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
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
