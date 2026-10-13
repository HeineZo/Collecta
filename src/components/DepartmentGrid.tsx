import { Skeleton } from "boneyard-js/react";
import type { DepartmentWithTotal } from "../models/DepartmentWithTotal";
import { DepartmentCard } from "./DepartmentCard";

const SKELETON_FIXTURE: DepartmentWithTotal[] = Array.from({ length: 7 }, (_, index) => ({
  departmentId: index + 1,
  displayName: "Department name",
  totalWorks: 0,
}));

interface DepartmentGridProps {
  // Undefined while loading: the skeleton is shown instead.
  departments: DepartmentWithTotal[] | undefined;
  emptyMessage: string;
}

export function DepartmentGrid({ departments, emptyMessage }: DepartmentGridProps) {
  return (
    <Skeleton
      name="department-grid"
      loading={!departments}
      fixture={<FeaturedDepartmentGrid departments={SKELETON_FIXTURE} isPlaceholder />}
      select="viewport"
    >
      {departments &&
        (departments.length > 0 ? (
          <FeaturedDepartmentGrid departments={departments} />
        ) : (
          <p className="department-grid__empty text-muted">{emptyMessage}</p>
        ))}
    </Skeleton>
  );
}

// The first department gets a large card, the others a regular grid.
function FeaturedDepartmentGrid({
  departments,
  isPlaceholder,
}: {
  departments: DepartmentWithTotal[];
  isPlaceholder?: boolean;
}) {
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
