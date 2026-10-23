import { useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { DepartmentHero } from "../components/DepartmentHero";
import { DepartmentIndex } from "../components/DepartmentIndex";
import { ErrorState } from "../components/ErrorState";
import { SearchBar } from "../components/SearchBar";
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
    <AppLayout>
      <DepartmentHero
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
          <DepartmentIndex departments={visibleDepartments} emptyMessage={`No department matches “${searchQuery}”.`} />
        )}
      </section>
    </AppLayout>
  );
}
