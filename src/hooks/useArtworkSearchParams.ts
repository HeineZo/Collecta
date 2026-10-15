import { useSearchParams } from "react-router";
import { ARTWORK_FILTERS, type ArtworkFilter } from "../models/ArtworkFilter";

const DEFAULT_FILTERS: ArtworkFilter[] = ["isHighlight"];

export function useArtworkSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtersParam = searchParams.get("filters");

  const filters =
    filtersParam === null
      ? DEFAULT_FILTERS
      : ARTWORK_FILTERS.filter((filter) => filtersParam.split(",").includes(filter));

  const update = (key: string, value: string) =>
    setSearchParams(
      (params) => {
        params.set(key, value);
        return params;
      },
      { replace: true },
    );

  return {
    searchQuery: searchParams.get("q") ?? "",
    setSearchQuery: (query: string) => update("q", query),
    filters,
    setFilters: (newFilters: ArtworkFilter[]) => update("filters", newFilters.join(",")),
  };
}
