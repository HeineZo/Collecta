import { useEffect, useEffectEvent } from "react";
import { useDepartmentCover } from "../hooks/useDepartmentCover";

interface DepartmentCoverPreloaderProps {
  departmentId: number;
  // Called once the cover is downloaded, so it can be shown without an empty frame.
  onReady: (coverUrl: string) => void;
}

// Renders nothing: downloads a department's cover in the background. Departments without one never report.
export function DepartmentCoverPreloader({ departmentId, onReady }: DepartmentCoverPreloaderProps) {
  const { coverUrl } = useDepartmentCover(departmentId);
  const reportReady = useEffectEvent(onReady);

  useEffect(() => {
    if (!coverUrl) return;
    const image = new Image();
    image.onload = () => reportReady(coverUrl);
    image.src = coverUrl;
    return () => {
      image.onload = null;
    };
  }, [coverUrl]);

  return null;
}
