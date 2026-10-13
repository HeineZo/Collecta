import useSWR from "swr";
import { fetchDepartments, fetchDepartmentTotal, searchDepartmentObjects } from "../api/departmentsApi";

export function useDepartmentSummary(departmentId: number) {
  const departmentsQuery = useSWR("departments", fetchDepartments);
  const totalWorksQuery = useSWR(["department-total", departmentId], () => fetchDepartmentTotal(departmentId));
  const onViewQuery = useSWR(["department-on-view", departmentId], () =>
    searchDepartmentObjects(departmentId, { filters: ["isOnView"], limit: 1 }),
  );
  const queries = [departmentsQuery, totalWorksQuery, onViewQuery];

  return {
    name: departmentsQuery.data?.find((department) => department.departmentId === departmentId)?.displayName,
    totalWorks: totalWorksQuery.data,
    onViewCount: onViewQuery.data?.total,
    hasError: queries.some((query) => query.error),
    retry: () => queries.forEach((query) => void query.mutate()),
  };
}
