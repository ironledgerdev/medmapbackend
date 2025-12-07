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
import { Eye, Pencil, Trash2, CheckCircle, XCircle, LogIn } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Doctor {
  id: string;
  name?: string;
  practice_name: string;
  speciality: string;
  province: string;
  status?: "verified" | "pending" | "rejected";
  years_experience: number;
  specialty?: string;
  experience?: number;
}

interface DoctorTableProps {
  doctors: Doctor[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onImpersonate?: (doctor: Doctor) => void;
}

export function DoctorTable({
  doctors,
  onView,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onImpersonate,
}: DoctorTableProps) {
  const getInitials = (name: string | undefined) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Province</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id} className="hover-elevate" data-testid={`row-doctor-${doctor.id}`}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(doctor.name || doctor.practice_name)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{doctor.name || doctor.practice_name}</div>
                </div>
              </TableCell>
              <TableCell>{doctor.specialty || doctor.speciality}</TableCell>
              <TableCell>{doctor.province}</TableCell>
              <TableCell>{doctor.experience || doctor.years_experience} years</TableCell>
              <TableCell>
                <Badge
                  variant={
                    doctor.status === "verified"
                      ? "default"
                      : doctor.status === "pending"
                      ? "secondary"
                      : "destructive"
                  }
                  data-testid={`badge-status-${doctor.id}`}
                >
                  {doctor.status || "pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {doctor.status === "pending" && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onApprove?.(doctor.id)}
                        data-testid={`button-approve-${doctor.id}`}
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onReject?.(doctor.id)}
                        data-testid={`button-reject-${doctor.id}`}
                      >
                        <XCircle className="h-4 w-4 text-red-600" />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onImpersonate?.(doctor)}
                    title="Impersonate doctor"
                  >
                    <LogIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView?.(doctor.id)}
                    data-testid={`button-view-${doctor.id}`}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit?.(doctor.id)}
                    data-testid={`button-edit-${doctor.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(doctor.id)}
                    data-testid={`button-delete-${doctor.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
