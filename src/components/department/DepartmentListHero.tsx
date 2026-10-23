import { type ReactNode, useCallback, useState } from "react";
import type { DepartmentWithTotal } from "../../models/DepartmentWithTotal";
import { DepartmentCoverPreloader } from "./DepartmentCoverPreloader";
import { HeroCollage } from "../common/HeroCollage";
import { ImageTrail } from "../common/ImageTrail";
import { RotatingDepartmentTitle } from "./RotatingDepartmentTitle";

interface DepartmentListHeroProps {
  departments: DepartmentWithTotal[] | undefined;
  departmentNames: string[] | undefined;
  search: ReactNode;
}

export function DepartmentListHero({ departments, departmentNames, search }: DepartmentListHeroProps) {
  const [coverUrls, setCoverUrls] = useState<string[]>([]);
  const addCoverUrl = useCallback(
    (coverUrl: string) => setCoverUrls((current) => (current.includes(coverUrl) ? current : [...current, coverUrl])),
    [],
  );
  return (
    <ImageTrail
      imageUrls={coverUrls}
      className="department-list-hero -mx-3 flex min-h-[70svh] flex-col items-center justify-center px-6 py-16 text-center md:-mx-6 md:min-h-[78svh]"
    >
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-[radial-gradient(var(--border)_1.2px,transparent_1.2px)] bg-size-[22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_80%)]"
      />
      {departments?.map((department) => (
        <DepartmentCoverPreloader key={department.departmentId} departmentId={department.departmentId} onReady={addCoverUrl} />
      ))}
      <HeroCollage imageUrls={coverUrls} />

      <div className="relative z-20 flex w-full flex-col items-center gap-5">
        <div
          aria-hidden
          className="absolute -inset-x-6 -inset-y-4 -z-10 bg-background/30 backdrop-blur-sm [mask-image:radial-gradient(ellipse_closest-side,black_40%,transparent)]"
        />
        <p className="text-xs uppercase tracking-[0.24em] text-muted md:text-sm">The Metropolitan Museum of Art</p>
        <RotatingDepartmentTitle departmentNames={departmentNames} />
        <p className="max-w-md text-base text-muted md:text-lg">
          {departmentNames ? `${departmentNames.length} departments to explore` : "Every department of the Met"}
        </p>
        <div className="mt-4 w-full max-w-md">{search}</div>
      </div>
    </ImageTrail>
  );
}
