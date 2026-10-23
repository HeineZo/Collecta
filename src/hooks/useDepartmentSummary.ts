import useSWR from "swr";
import { fetchCollectionCount } from "../api/collectionSearchApi";
import { fetchDepartments } from "../api/departmentsApi";

export function useDepartmentSummary(departmentId: number) {
  const departmentsQuery = useSWR("departments", fetchDepartments);
  const totalWorksQuery = useSWR(["department-total", departmentId], () => fetchCollectionCount({ departmentId }));
  const onViewQuery = useSWR(["department-on-view", departmentId], () =>
    fetchCollectionCount({ departmentId, isOnView: true }),
  );
  const queries = [departmentsQuery, totalWorksQuery, onViewQuery];
  const name = departmentsQuery.data?.find((department) => department.departmentId === departmentId)?.displayName;

  return {
    name,
    isUnknown: departmentsQuery.data !== undefined && name === undefined,
    totalWorks: totalWorksQuery.data,
    onViewCount: onViewQuery.data,
    hasError: queries.some((query) => query.error),
    retry: () => queries.forEach((query) => void query.mutate()),
  };
}
