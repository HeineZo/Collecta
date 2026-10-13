import { Chip } from "@heroui/react";
import { Link } from "react-router";
import useSWR from "swr";
import { fetchDepartmentHighlightId } from "../api/departmentsApi";
import { useMuseumObject } from "../hooks/useMuseumObject";
import { formatNumber } from "../lib/formatNumber";
import type { Department } from "../models/Department";
import { NoImageNotice } from "./NoImageNotice";

interface DepartmentCardProps {
  department: Department;
  totalWorks: number;
  isFeatured?: boolean;
  // Bare card for the boneyard capture, which only paints elements without children.
  isPlaceholder?: boolean;
}

export function DepartmentCard({ department, totalWorks, isFeatured = false, isPlaceholder = false }: DepartmentCardProps) {
  const { data: highlightId } = useSWR(["department-highlight", department.departmentId], () =>
    fetchDepartmentHighlightId(department.departmentId),
  );
  const { data: highlight } = useMuseumObject(highlightId);

  const coverUrl = highlight?.primaryImageSmall;
  const isCoverMissing = highlightId === null || (highlight !== undefined && !coverUrl);

  return (
    <Link
      to={`/departments/${department.departmentId}`}
      className={`department-card relative block overflow-hidden bg-surface-tertiary ${
        isFeatured ? "department-card--featured h-[420px] rounded-[30px] md:h-[460px]" : "h-60 rounded-3xl md:h-80"
      }`}
    >
      {coverUrl && (
        <img src={coverUrl} alt={highlight.title} loading="lazy" className="department-card__cover size-full object-cover" />
      )}
      {isCoverMissing && (
        <NoImageNotice className="department-card__no-cover size-full bg-[#18181b] text-[#a1a1aa]" />
      )}
      {!isPlaceholder && (
        <>
          <Chip size="sm" className="department-card__total absolute left-3 top-3 bg-black/55 text-white backdrop-blur-md">
            {formatNumber(totalWorks)} works
          </Chip>
          <div className="department-card__caption absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-linear-to-b from-transparent to-black/60 p-4 pt-16 text-white md:p-5 md:pt-20">
            <h2 className={`font-medium leading-tight tracking-tight ${isFeatured ? "text-3xl md:text-5xl" : "text-base md:text-lg"}`}>
              {department.displayName}
            </h2>
            {isFeatured && highlight && <p className="text-sm text-white/85">{highlight.title}</p>}
          </div>
        </>
      )}
    </Link>
  );
}
