import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
}

interface AppointmentTableProps {
  appointments: Appointment[];
  onView?: (id: string) => void;
}

export function AppointmentTable({ appointments, onView }: AppointmentTableProps) {
  const getStatusVariant = (status: Appointment["status"]) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      case "completed":
        return "outline";
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Doctor</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} className="hover-elevate" data-testid={`row-appointment-${appointment.id}`}>
              <TableCell className="font-medium">{appointment.patientName}</TableCell>
              <TableCell>{appointment.doctorName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  {format(appointment.date, "PPP")}
                </div>
              </TableCell>
              <TableCell className="font-mono text-sm">{appointment.time}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(appointment.status)} data-testid={`badge-status-${appointment.id}`}>
                  {appointment.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView?.(appointment.id)}
                  data-testid={`button-view-${appointment.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
