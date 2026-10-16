import useSWR from "swr";
import { fetchDepartmentHighlightId } from "../api/departmentsApi";
import { useMuseumObject } from "./useMuseumObject";

// Cover of a department card: its first highlighted work with an image.
export function useDepartmentCover(departmentId: number | undefined) {
  const { data: highlightId } = useSWR(
    departmentId === undefined ? null : ["department-highlight", departmentId],
    ([, id]) => fetchDepartmentHighlightId(id),
  );
  const { data: highlight } = useMuseumObject(highlightId);
  return {
    highlight,
    coverUrl: highlight?.primaryImageSmall,
    isCoverMissing: highlightId === null || (highlight !== undefined && !highlight.primaryImageSmall),
  };
}
