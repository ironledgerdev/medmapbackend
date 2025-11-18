import { AppointmentTable } from "@/components/AppointmentTable";
import { FilterBar } from "@/components/FilterBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Download } from "lucide-react";

export default function Appointments() {
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
    {
      id: "5",
      patientName: "Anele Mkhize",
      doctorName: "Dr. Pieter van Zyl",
      date: new Date(2025, 10, 21),
      time: "03:00 PM",
      status: "pending" as const,
    },
    {
      id: "6",
      patientName: "Johan Botha",
      doctorName: "Dr. Zanele Khumalo",
      date: new Date(2025, 10, 17),
      time: "01:00 PM",
      status: "cancelled" as const,
    },
  ];

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
      onChange: (value: string) => console.log("Status filter:", value),
    },
    {
      label: "Date Range",
      options: [
        { label: "All Time", value: "all" },
        { label: "Today", value: "today" },
        { label: "This Week", value: "week" },
        { label: "This Month", value: "month" },
      ],
      onChange: (value: string) => console.log("Date filter:", value),
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
          <CardTitle>All Appointments</CardTitle>
          <CardDescription>Search and filter appointments by status and date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            searchPlaceholder="Search by patient or doctor name..."
            onSearchChange={(value) => console.log("Search:", value)}
            filters={filters}
          />
          <AppointmentTable
            appointments={mockAppointments}
            onView={(id) => console.log("View appointment:", id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
