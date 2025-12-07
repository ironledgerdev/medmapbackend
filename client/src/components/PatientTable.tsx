import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { MoreVertical, LogIn, RotateCw, Loader2 } from "lucide-react";
import type { Patient } from "@shared/schema";

interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  onImpersonate: (patient: Patient) => void;
}

export function PatientTable({ patients, isLoading, onImpersonate }: PatientTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const resetPasswordMutation = useMutation({
    mutationFn: async (patientId: string) => {
      const tempPassword = Math.random().toString(36).slice(-12);
      const response = await fetch(`/api/patients/${patientId}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: tempPassword }),
      });

      if (!response.ok) throw new Error("Failed to reset password");
      return { tempPassword, ...await response.json() };
    },
    onSuccess: (data) => {
      toast({
        title: "Password Reset",
        description: `Temporary password: ${data.tempPassword}`,
      });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      setResetDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Patient</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {patient.first_name?.[0]}
                        {patient.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{patient.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{patient.email}</TableCell>
                <TableCell className="text-sm">{patient.phone || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {patient.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(patient.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          onImpersonate(patient);
                          toast({
                            title: "Impersonating",
                            description: `You are now impersonating ${patient.name}`,
                          });
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Impersonate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPatient(patient);
                          setResetDialogOpen(true);
                        }}
                      >
                        <RotateCw className="h-4 w-4 mr-2" />
                        Reset Password
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reset the password for {selectedPatient?.name}? They will receive a temporary password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (selectedPatient) {
                resetPasswordMutation.mutate(selectedPatient.id);
              }
            }}
            disabled={resetPasswordMutation.isPending}
          >
            {resetPasswordMutation.isPending && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Reset Password
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
