import { useMemo, useState } from "react";
import { AppLayout } from "../components/layout/AppLayout";
import { DepartmentListHero } from "../components/department/DepartmentListHero";
import { DepartmentList } from "../components/department/DepartmentList";
import { ErrorState } from "../components/common/ErrorState";
import { SearchBar } from "../components/common/SearchBar";
import { useDepartmentsWithTotals } from "../hooks/useDepartmentsWithTotals";
import { useScrollIntoViewOnChange } from "../hooks/useScrollIntoViewOnChange";
import { filterDepartments } from "../lib/filterDepartments";

export function DepartmentListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { departments, departmentNames, hasError, retry } = useDepartmentsWithTotals();
  const visibleDepartments = useMemo(
    () => departments && filterDepartments(departments, searchQuery),
    [departments, searchQuery],
  );
  const searchRef = useScrollIntoViewOnChange<HTMLDivElement>(searchQuery);

  return (
    <AppLayout title="Departments">
      <DepartmentListHero
        departments={departments}
        departmentNames={departmentNames}
        search={
          <div ref={searchRef} className="scroll-mt-28">
            <SearchBar label="Search a department" value={searchQuery} onChange={setSearchQuery} isProminent />
          </div>
        }
      />

      <section aria-label="Departments" className="department-list__results mt-10 md:mt-16">
        {hasError ? (
          <ErrorState message="The Met collection could not be reached." onRetry={retry} />
        ) : (
          <DepartmentList departments={visibleDepartments} emptyMessage={`No department matches “${searchQuery}”.`} />
        )}
      </section>
    </AppLayout>
  );
}
