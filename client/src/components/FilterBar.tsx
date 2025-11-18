import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    label: string;
    options: { label: string; value: string }[];
    onChange?: (value: string) => void;
  }[];
}

export function FilterBar({
  searchPlaceholder = "Search...",
  onSearchChange,
  filters = [],
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-9"
          onChange={(e) => onSearchChange?.(e.target.value)}
          data-testid="input-search"
        />
      </div>
      {filters.map((filter, index) => (
        <Select key={index} onValueChange={filter.onChange}>
          <SelectTrigger className="w-full sm:w-[180px]" data-testid={`select-${filter.label.toLowerCase()}`}>
            <SelectValue placeholder={filter.label} />
          </SelectTrigger>
          <SelectContent>
            {filter.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
