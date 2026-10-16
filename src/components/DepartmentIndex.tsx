import { Skeleton } from "boneyard-js/react";
import { useState } from "react";
import { useDepartmentCover } from "../hooks/useDepartmentCover";
import type { DepartmentWithTotal } from "../models/DepartmentWithTotal";
import { CursorImagePreview } from "./CursorImagePreview";
import { DepartmentIndexRow } from "./DepartmentIndexRow";

const SKELETON_FIXTURE: DepartmentWithTotal[] = Array.from({ length: 8 }, (_, index) => ({
  departmentId: index + 1,
  displayName: "Department name",
  totalWorks: 0,
}));

interface DepartmentIndexProps {
  departments: DepartmentWithTotal[] | undefined;
  emptyMessage: string;
}

export function DepartmentIndex({ departments, emptyMessage }: DepartmentIndexProps) {
  const [hoveredId, setHoveredId] = useState<number>();
  const { coverUrl: hoveredCoverUrl } = useDepartmentCover(hoveredId);

  return (
    <Skeleton
      name="department-index"
      loading={!departments}
      fixture={<DepartmentIndexRows departments={SKELETON_FIXTURE} isPlaceholder />}
      select="viewport"
    >
      {departments &&
        (departments.length > 0 ? (
          <div onPointerLeave={() => setHoveredId(undefined)}>
            <DepartmentIndexRows departments={departments} onHover={setHoveredId} />
            <CursorImagePreview src={hoveredCoverUrl} />
          </div>
        ) : (
          <p className="department-index__empty text-muted">{emptyMessage}</p>
        ))}
    </Skeleton>
  );
}

interface DepartmentIndexRowsProps {
  departments: DepartmentWithTotal[];
  onHover?: (departmentId: number) => void;
  isPlaceholder?: boolean;
}

// Rows other than the hovered one fade back
function DepartmentIndexRows({ departments, onHover, isPlaceholder }: DepartmentIndexRowsProps) {
  return (
    <div className="department-index [&:has(a:hover)_a:not(:hover)]:text-muted">
      {departments.map((department, index) => (
        <DepartmentIndexRow
          key={department.departmentId}
          department={department}
          position={index + 1}
          onHover={onHover && (() => onHover(department.departmentId))}
          isPlaceholder={isPlaceholder}
        />
      ))}
    </div>
  );
}
