import { DoctorTable } from "@/components/DoctorTable";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Doctors() {
  const { toast } = useToast();
  type DoctorStatus = "verified" | "pending" | "rejected";
  
  const [doctors, setDoctors] = useState<Array<{
    id: string;
    name: string;
    specialty: string;
    province: string;
    status: DoctorStatus;
    experience: number;
  }>>([
    {
      id: "1",
      name: "Dr. Thabo Mthembu",
      specialty: "Cardiologist",
      province: "Gauteng",
      status: "verified",
      experience: 15,
    },
    {
      id: "2",
      name: "Dr. Sarah Williams",
      specialty: "General Practitioner",
      province: "Western Cape",
      status: "pending",
      experience: 12,
    },
    {
      id: "3",
      name: "Dr. Nomsa Dlamini",
      specialty: "Pediatrician",
      province: "KwaZulu-Natal",
      status: "verified",
      experience: 18,
    },
    {
      id: "4",
      name: "Dr. Pieter van Zyl",
      specialty: "Orthopedic Surgeon",
      province: "Gauteng",
      status: "pending",
      experience: 10,
    },
    {
      id: "5",
      name: "Dr. Zanele Khumalo",
      specialty: "Dermatologist",
      province: "Western Cape",
      status: "verified",
      experience: 14,
    },
  ]);

  const filters = [
    {
      label: "Province",
      options: [
        { label: "All Provinces", value: "all" },
        { label: "Gauteng", value: "gauteng" },
        { label: "Western Cape", value: "western-cape" },
        { label: "KwaZulu-Natal", value: "kwazulu-natal" },
      ],
      onChange: (value: string) => console.log("Province filter:", value),
    },
    {
      label: "Specialty",
      options: [
        { label: "All Specialties", value: "all" },
        { label: "Cardiologist", value: "cardiologist" },
        { label: "General Practitioner", value: "gp" },
        { label: "Pediatrician", value: "pediatrician" },
      ],
      onChange: (value: string) => console.log("Specialty filter:", value),
    },
    {
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Verified", value: "verified" },
        { label: "Pending", value: "pending" },
      ],
      onChange: (value: string) => console.log("Status filter:", value),
    },
  ];

  const handleApprove = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "verified" as DoctorStatus } : doc
      )
    );
    toast({
      title: "Doctor Approved",
      description: "The doctor has been verified successfully.",
    });
  };

  const handleReject = (id: string) => {
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, status: "rejected" as DoctorStatus } : doc
      )
    );
    toast({
      title: "Doctor Rejected",
      description: "The doctor verification has been rejected.",
      variant: "destructive",
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
          <CardTitle>All Doctors</CardTitle>
          <CardDescription>Search and filter doctors by various criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FilterBar
            searchPlaceholder="Search by name or specialty..."
            onSearchChange={(value) => console.log("Search:", value)}
            filters={filters}
          />
          <DoctorTable
            doctors={doctors}
            onView={(id) => console.log("View doctor:", id)}
            onEdit={(id) => console.log("Edit doctor:", id)}
            onDelete={(id) => console.log("Delete doctor:", id)}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        </CardContent>
      </Card>
    </div>
  );
}
