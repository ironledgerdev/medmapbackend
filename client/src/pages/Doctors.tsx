import { DoctorTable } from "@/components/DoctorTable";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Doctor } from "@shared/schema";

export default function Doctors() {
  const { toast } = useToast();
  const { impersonateUser } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: doctors = [], isLoading } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors", { status: statusFilter, province: provinceFilter, specialty: specialtyFilter, search: searchQuery }],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, approved }: { id: string; approved: boolean }) => {
      return apiRequest("PATCH", `/api/doctors/${id}/status`, { approved });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const filters = [
    {
      label: "Province",
      options: [
        { label: "All Provinces", value: "all" },
        { label: "Gauteng", value: "Gauteng" },
        { label: "Western Cape", value: "Western Cape" },
        { label: "KwaZulu-Natal", value: "KwaZulu-Natal" },
        { label: "Eastern Cape", value: "Eastern Cape" },
        { label: "Free State", value: "Free State" },
        { label: "Limpopo", value: "Limpopo" },
        { label: "Mpumalanga", value: "Mpumalanga" },
        { label: "North West", value: "North West" },
        { label: "Northern Cape", value: "Northern Cape" },
      ],
      onChange: (value: string) => setProvinceFilter(value),
    },
    {
      label: "Specialty",
      options: [
        { label: "All Specialties", value: "all" },
        { label: "Cardiologist", value: "Cardiologist" },
        { label: "General Practitioner", value: "General Practitioner" },
        { label: "Pediatrician", value: "Pediatrician" },
        { label: "Dermatologist", value: "Dermatologist" },
        { label: "Orthopedic Surgeon", value: "Orthopedic Surgeon" },
      ],
      onChange: (value: string) => setSpecialtyFilter(value),
    },
    {
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Verified", value: "verified" },
        { label: "Pending", value: "pending" },
        { label: "Rejected", value: "rejected" },
      ],
      onChange: (value: string) => setStatusFilter(value),
    },
  ];

  const handleApprove = (id: string) => {
    updateStatusMutation.mutate(
      { id, approved: true },
      {
        onSuccess: () => {
          toast({
            title: "Doctor Approved",
            description: "The doctor has been verified successfully.",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to approve doctor",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleReject = (id: string) => {
    updateStatusMutation.mutate(
      { id, approved: false },
      {
        onSuccess: () => {
          toast({
            title: "Doctor Rejected",
            description: "The doctor verification has been rejected.",
            variant: "destructive",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error.message || "Failed to reject doctor",
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleImpersonate = (doctor: Doctor) => {
    impersonateUser(doctor.user_id || doctor.id);
    toast({
      title: "Impersonating Doctor",
      description: `You are now impersonating ${doctor.name || doctor.practice_name}. Your actions will be recorded.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Doctors Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and verify medical professionals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-export">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button data-testid="button-add-doctor">
            <Plus className="h-4 w-4 mr-2" />
            Add Doctor
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Doctors ({doctors.length})</CardTitle>
          <CardDescription>Search and filter doctors by various criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            searchPlaceholder="Search by name or specialty..."
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
            <DoctorTable
              doctors={doctors}
              onView={(id) => console.log("View doctor:", id)}
              onEdit={(id) => console.log("Edit doctor:", id)}
              onDelete={(id) => console.log("Delete doctor:", id)}
              onApprove={handleApprove}
              onReject={handleReject}
              onImpersonate={handleImpersonate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
