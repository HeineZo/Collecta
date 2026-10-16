import type { DepartmentWithTotal } from "../models/DepartmentWithTotal";

// Departments whose name matches the query, biggest first.
export function filterDepartments(departments: DepartmentWithTotal[], searchQuery: string): DepartmentWithTotal[] {
  const query = searchQuery.trim().toLowerCase();
  const matching = departments.filter((department) => department.displayName.toLowerCase().includes(query));
  return matching.sort((a, b) => b.totalWorks - a.totalWorks);
}
