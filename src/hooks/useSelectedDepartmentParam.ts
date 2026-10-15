import { useSearchParams } from "react-router";

export function useSelectedDepartmentParam() {
  const [searchParams, setSearchParams] = useSearchParams();
  const departmentId = Number(searchParams.get("department"));

  return {
    departmentId: Number.isInteger(departmentId) && departmentId > 0 ? departmentId : null,
    setDepartmentId: (id: number | null) =>
      setSearchParams(id === null ? {} : { department: String(id) }, { replace: true }),
  };
}
