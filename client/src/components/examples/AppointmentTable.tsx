import { AppointmentTable } from "../AppointmentTable";

export default function AppointmentTableExample() {
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
  ];

  return (
    <div className="p-6 bg-background">
      <AppointmentTable
        appointments={mockAppointments}
        onView={(id) => console.log("View appointment:", id)}
      />
    </div>
  );
}
