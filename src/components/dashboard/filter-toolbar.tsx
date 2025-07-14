
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "@/lib/types";

type FilterValues = { 
  searchTerm: string; 
  department: string; 
  year: string;
};

type FilterToolbarProps = {
  departments: Department[];
  years: string[];
  onFilterChange: (filters: FilterValues) => void;
  filters: FilterValues;
};

export function FilterToolbar({
  departments,
  years,
  onFilterChange,
  filters,
}: FilterToolbarProps) {
  
  const handleFilterChange = (change: Partial<FilterValues>) => {
    onFilterChange({ ...filters, ...change });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by faculty name or Scopus ID..."
          className="pl-8 sm:w-full md:w-[300px]"
          value={filters.searchTerm}
          onChange={(e) => handleFilterChange({ searchTerm: e.target.value })}
        />
      </div>
      <div className="flex gap-4">
        <Select
          value={filters.department}
          onValueChange={(value) =>
            handleFilterChange({ department: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept.id} value={dept.name}>
                {dept.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.year}
          onValueChange={(value) =>
            handleFilterChange({ year: value === "all" ? "" : value })
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
