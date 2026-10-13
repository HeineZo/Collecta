import { SearchField, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import Scritto from "@scritto/react";
import { Skeleton } from "boneyard-js/react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { fetchDepartments, fetchDepartmentTotal } from "../api/departmentsApi";
import { AppLayout } from "../components/AppLayout";
import { DepartmentCard } from "../components/DepartmentCard";
import { ErrorState } from "../components/ErrorState";
import type { DepartmentWithTotal } from "../models/DepartmentWithTotal";

type SortOrder = "most-works" | "alphabetical";

const HERO_ROTATION_MS = 3000;
const HERO_NAME_MAX_LENGTH = 16;
const HERO_TRANSITION = { duration: 550 };

const SKELETON_FIXTURE: DepartmentWithTotal[] = Array.from({ length: 7 }, (_, index) => ({
  departmentId: index + 1,
  displayName: "Department name",
  totalWorks: 0,
}));

export function DepartmentListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("most-works");

  const departmentsQuery = useSWR("departments", fetchDepartments);
  const departments = departmentsQuery.data;
  const totalsQuery = useSWR(departments ? ["department-totals", departments.length] : null, () =>
    Promise.all(departments!.map((department) => fetchDepartmentTotal(department.departmentId))),
  );

  const departmentsWithTotals = useMemo<DepartmentWithTotal[]>(
    () => departments?.map((department, index) => ({ ...department, totalWorks: totalsQuery.data?.[index] ?? 0 })) ?? [],
    [departments, totalsQuery.data],
  );
  const visibleDepartments = useMemo(
    () => filterAndSortDepartments(departmentsWithTotals, searchQuery, sortOrder),
    [departmentsWithTotals, searchQuery, sortOrder],
  );

  const isLoading = !departmentsQuery.error && !totalsQuery.error && (!departments || !totalsQuery.data);
  const hasError = Boolean(departmentsQuery.error || totalsQuery.error);
  const heroNames = useMemo(
    () =>
      departments
        ?.map((department) => department.displayName)
        .filter((name) => name.length <= HERO_NAME_MAX_LENGTH),
    [departments],
  );
  const heroDepartmentName = useRotatingName(heroNames);

  const retry = () => {
    void departmentsQuery.mutate();
    void totalsQuery.mutate();
  };

  return (
    <AppLayout>
      <section className="department-list__hero flex flex-wrap items-end justify-between gap-8">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
          <h1 className="text-[44px] font-light leading-[1.02] tracking-[-0.035em] md:text-[76px]">
            Jump into
            <br />
            <Scritto
              value={heroDepartmentName}
              transition={HERO_TRANSITION}
              className="block whitespace-nowrap font-medium"
            />
          </h1>
          <p className="max-w-md text-base text-muted md:text-lg">
            {departments ? `${departments.length} departments` : "Every department of the Met"}
          </p>
        </div>

        <div className="department-list__controls flex w-full max-w-[440px] flex-col gap-3.5">
          <SearchField aria-label="Search departments" value={searchQuery} onChange={setSearchQuery} fullWidth>
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="Search a department" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <div className="flex items-center justify-between gap-4">
            <ToggleButtonGroup
              aria-label="Sort departments"
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={[sortOrder]}
              onSelectionChange={(keys) => setSortOrder([...keys][0] as SortOrder)}
            >
              <ToggleButton id="most-works">Most works</ToggleButton>
              <ToggleButton id="alphabetical">A–Z</ToggleButton>
            </ToggleButtonGroup>
            <p aria-live="polite" className="text-sm text-muted">
              {!isLoading && !hasError && `${visibleDepartments.length} results`}
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Departments" className="department-list__results mt-8 md:mt-14">
        {hasError ? (
          <ErrorState message="The Met collection could not be reached." onRetry={retry} />
        ) : (
          <Skeleton
            name="department-grid"
            loading={isLoading}
            fixture={<DepartmentGrid departments={SKELETON_FIXTURE} isPlaceholder />}
            select="viewport"
          >
            {!isLoading &&
              (visibleDepartments.length > 0 ? (
                <DepartmentGrid departments={visibleDepartments} />
              ) : (
                <p className="department-list__empty text-muted">No department matches “{searchQuery}”.</p>
              ))}
          </Skeleton>
        )}
      </section>
    </AppLayout>
  );
}

function DepartmentGrid({ departments, isPlaceholder }: { departments: DepartmentWithTotal[]; isPlaceholder?: boolean }) {
  const [featured, ...others] = departments;
  return (
    <div className="department-grid flex flex-col gap-3 md:gap-4">
      <DepartmentCard department={featured} totalWorks={featured.totalWorks} isFeatured isPlaceholder={isPlaceholder} />
      <div className="department-grid__list grid grid-cols-2 gap-3 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:gap-4">
        {others.map((department) => (
          <DepartmentCard
            key={department.departmentId}
            department={department}
            totalWorks={department.totalWorks}
            isPlaceholder={isPlaceholder}
          />
        ))}
      </div>
    </div>
  );
}

function filterAndSortDepartments(
  departments: DepartmentWithTotal[],
  searchQuery: string,
  sortOrder: SortOrder,
): DepartmentWithTotal[] {
  const query = searchQuery.trim().toLowerCase();
  const matching = departments.filter((department) => department.displayName.toLowerCase().includes(query));
  return matching.sort((a, b) =>
    sortOrder === "most-works" ? b.totalWorks - a.totalWorks : a.displayName.localeCompare(b.displayName),
  );
}

function useRotatingName(names: string[] | undefined) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!names?.length) return;
    const timer = setInterval(() => setIndex((current) => (current + 1) % names.length), HERO_ROTATION_MS);
    return () => clearInterval(timer);
  }, [names?.length]);
  return names?.[index % names.length] ?? "Egyptian Art";
}
