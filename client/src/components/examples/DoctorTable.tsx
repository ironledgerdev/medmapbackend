import { DoctorTable } from "../DoctorTable";

export default function DoctorTableExample() {
  const mockDoctors = [
    {
      id: "1",
      practice_name: "Mthembu Cardiology",
      name: "Dr. Thabo Mthembu",
      speciality: "Cardiologist",
      specialty: "Cardiologist",
      province: "Gauteng",
      status: "verified" as const,
      years_experience: 15,
      experience: 15,
    },
    {
      id: "2",
      practice_name: "Williams Medical Practice",
      name: "Dr. Sarah Williams",
      speciality: "General Practitioner",
      specialty: "General Practitioner",
      province: "Western Cape",
      status: "pending" as const,
      years_experience: 12,
      experience: 12,
    },
    {
      id: "3",
      practice_name: "Dlamini Pediatrics",
      name: "Dr. Nomsa Dlamini",
      speciality: "Pediatrician",
      specialty: "Pediatrician",
      province: "KwaZulu-Natal",
      status: "verified" as const,
      years_experience: 18,
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
