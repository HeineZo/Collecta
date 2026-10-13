import { useMemo, useState } from "react";
import { AppLayout } from "../components/AppLayout";
import { DepartmentGrid } from "../components/DepartmentGrid";
import { DepartmentSortToggle } from "../components/DepartmentSortToggle";
import { ErrorState } from "../components/ErrorState";
import { ResultCount } from "../components/ResultCount";
import { RotatingDepartmentTitle } from "../components/RotatingDepartmentTitle";
import { SearchBar } from "../components/SearchBar";
import { useDepartmentsWithTotals } from "../hooks/useDepartmentsWithTotals";
import { filterAndSortDepartments } from "../lib/filterAndSortDepartments";
import type { DepartmentSortOrder } from "../models/DepartmentSortOrder";

export function DepartmentListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<DepartmentSortOrder>("most-works");
  const { departments, departmentNames, hasError, retry } = useDepartmentsWithTotals();
  const visibleDepartments = useMemo(
    () => departments && filterAndSortDepartments(departments, searchQuery, sortOrder),
    [departments, searchQuery, sortOrder],
  );

  return (
    <AppLayout>
      <section className="department-list__hero flex flex-wrap items-end justify-between gap-8">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
          <RotatingDepartmentTitle departmentNames={departmentNames} />
          <p className="max-w-md text-base text-muted md:text-lg">
            {departmentNames ? `${departmentNames.length} departments` : "Every department of the Met"}
          </p>
        </div>

        <div className="department-list__controls flex w-full max-w-[440px] flex-col gap-3.5">
          <SearchBar label="Search a department" value={searchQuery} onChange={setSearchQuery} />
          <div className="flex items-center justify-between gap-4">
            <DepartmentSortToggle value={sortOrder} onChange={setSortOrder} />
            <ResultCount count={visibleDepartments?.length} noun="results" />
          </div>
        </div>
      </section>

      <section aria-label="Departments" className="department-list__results mt-8 md:mt-14">
        {hasError ? (
          <ErrorState message="The Met collection could not be reached." onRetry={retry} />
        ) : (
          <DepartmentGrid departments={visibleDepartments} emptyMessage={`No department matches “${searchQuery}”.`} />
        )}
      </section>
    </AppLayout>
  );
}
