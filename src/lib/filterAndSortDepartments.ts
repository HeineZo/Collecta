import type { DepartmentSortOrder } from "../models/DepartmentSortOrder";
import type { DepartmentWithTotal } from "../models/DepartmentWithTotal";

export function filterAndSortDepartments(
  departments: DepartmentWithTotal[],
  searchQuery: string,
  sortOrder: DepartmentSortOrder,
): DepartmentWithTotal[] {
  const query = searchQuery.trim().toLowerCase();
  const matching = departments.filter((department) => department.displayName.toLowerCase().includes(query));
  return matching.sort((a, b) =>
    sortOrder === "most-works" ? b.totalWorks - a.totalWorks : a.displayName.localeCompare(b.displayName),
  );
}
