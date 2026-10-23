import { Skeleton } from "boneyard-js/react";
import { useState } from "react";
import { useDepartmentCover } from "../../hooks/useDepartmentCover";
import type { DepartmentWithTotal } from "../../models/DepartmentWithTotal";
import { CursorImagePreview } from "../common/CursorImagePreview";
import { DepartmentListRow } from "./DepartmentListRow";

const SKELETON_FIXTURE: DepartmentWithTotal[] = Array.from({ length: 8 }, (_, index) => ({
  departmentId: index + 1,
  displayName: "Department name",
  totalWorks: 0,
}));

interface DepartmentListProps {
  departments: DepartmentWithTotal[] | undefined;
  emptyMessage: string;
}

export function DepartmentList({ departments, emptyMessage }: DepartmentListProps) {
  const [hoveredId, setHoveredId] = useState<number>();
  const { coverUrl: hoveredCoverUrl } = useDepartmentCover(hoveredId);

  return (
    <Skeleton
      name="department-list"
      loading={!departments}
      fixture={<DepartmentListRows departments={SKELETON_FIXTURE} isPlaceholder />}
      select="viewport"
    >
      {departments &&
        (departments.length > 0 ? (
          <div onPointerLeave={() => setHoveredId(undefined)}>
            <DepartmentListRows departments={departments} onHover={setHoveredId} />
            <CursorImagePreview src={hoveredCoverUrl} />
          </div>
        ) : (
          <p className="department-list__empty text-muted">{emptyMessage}</p>
        ))}
    </Skeleton>
  );
}

interface DepartmentListRowsProps {
  departments: DepartmentWithTotal[];
  onHover?: (departmentId: number) => void;
  isPlaceholder?: boolean;
}

// Rows other than the hovered one fade back
function DepartmentListRows({ departments, onHover, isPlaceholder }: DepartmentListRowsProps) {
  return (
    <div className="department-list [&:has(a:hover)_a:not(:hover)]:text-muted">
      {departments.map((department, index) => (
        <DepartmentListRow
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
