import useSWR from "swr";
import { fetchDepartmentHighlightId } from "../api/departmentsApi";
import { useArtwork } from "./useArtwork";

// Cover of a department card: its first highlighted work with an image.
export function useDepartmentCover(departmentId: number | undefined) {
  const { data: highlightId } = useSWR(
    departmentId === undefined ? null : ["department-highlight", departmentId],
    ([, id]) => fetchDepartmentHighlightId(id),
  );
  const { data: highlight } = useArtwork(highlightId);
  return { highlight, coverUrl: highlight?.primaryImageSmall };
}
