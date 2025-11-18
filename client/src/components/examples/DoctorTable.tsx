import { DoctorTable } from "../DoctorTable";

export default function DoctorTableExample() {
  const mockDoctors = [
    {
      id: "1",
      name: "Dr. Thabo Mthembu",
      specialty: "Cardiologist",
      province: "Gauteng",
      status: "verified" as const,
      experience: 15,
    },
    {
      id: "2",
      name: "Dr. Sarah Williams",
      specialty: "General Practitioner",
      province: "Western Cape",
      status: "pending" as const,
      experience: 12,
    },
    {
      id: "3",
      name: "Dr. Nomsa Dlamini",
      specialty: "Pediatrician",
      province: "KwaZulu-Natal",
      status: "verified" as const,
      experience: 18,
    },
  ];

  return (
    <div className="p-6 bg-background">
      <DoctorTable
        doctors={mockDoctors}
        onView={(id) => console.log("View doctor:", id)}
        onEdit={(id) => console.log("Edit doctor:", id)}
        onDelete={(id) => console.log("Delete doctor:", id)}
        onApprove={(id) => console.log("Approve doctor:", id)}
        onReject={(id) => console.log("Reject doctor:", id)}
      />
    </div>
  );
}
