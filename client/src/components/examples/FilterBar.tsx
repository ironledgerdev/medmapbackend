import { FilterBar } from "../FilterBar";

export default function FilterBarExample() {
  const filters = [
    {
      label: "Province",
      options: [
        { label: "All Provinces", value: "all" },
        { label: "Gauteng", value: "gauteng" },
        { label: "Western Cape", value: "western-cape" },
        { label: "KwaZulu-Natal", value: "kwazulu-natal" },
      ],
      onChange: (value: string) => console.log("Province:", value),
    },
    {
      label: "Status",
      options: [
        { label: "All Statuses", value: "all" },
        { label: "Verified", value: "verified" },
        { label: "Pending", value: "pending" },
      ],
      onChange: (value: string) => console.log("Status:", value),
    },
  ];

  return (
    <div className="p-6 bg-background">
      <FilterBar
        searchPlaceholder="Search doctors..."
        onSearchChange={(value) => console.log("Search:", value)}
        filters={filters}
      />
    </div>
  );
}
