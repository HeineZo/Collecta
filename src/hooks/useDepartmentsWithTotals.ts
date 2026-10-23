import { useMemo } from "react";
import useSWR from "swr";
import { fetchCollectionCount } from "../api/collectionSearchApi";
import { fetchDepartments } from "../api/departmentsApi";
import type { DepartmentWithTotal } from "../models/DepartmentWithTotal";

export function useDepartmentsWithTotals() {
  const departmentsQuery = useSWR("departments", fetchDepartments);
  const departments = departmentsQuery.data;
  const totalsQuery = useSWR(
    departments ? ["department-totals", departments.length] : null,
    () =>
      Promise.all(
        departments!.map((department) =>
          fetchCollectionCount({ departmentId: department.departmentId }),
        ),
      ),
  );
  const totals = totalsQuery.data;

  const departmentsWithTotals = useMemo<DepartmentWithTotal[] | undefined>(
    () =>
      totals &&
      departments?.map((department, index) => ({
        ...department,
        totalWorks: totals[index],
      })),
    [departments, totals],
  );
  const departmentNames = useMemo(
    () => departments?.map((department) => department.displayName),
    [departments],
  );

  return {
    departments: departmentsWithTotals,
    departmentNames,
    hasError: Boolean(departmentsQuery.error || totalsQuery.error),
    retry: () => {
      void departmentsQuery.mutate();
      void totalsQuery.mutate();
    },
  };
}
