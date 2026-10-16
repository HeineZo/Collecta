import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { ARTWORK_FILTERS, type ArtworkFilter } from "../models/ArtworkFilter";
import { useDebouncedValue } from "./useDebouncedValue";

const DEFAULT_FILTERS: ArtworkFilter[] = ["isHighlight"];
const SEARCH_DEBOUNCE_MS = 400;

type SetSearchParams = ReturnType<typeof useSearchParams>[1];

function replaceSearchParam(setSearchParams: SetSearchParams, key: string, value: string) {
  setSearchParams(
    (params) => {
      params.set(key, value);
      return params;
    },
    { replace: true },
  );
}

export function useArtworkSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filtersParam = searchParams.get("filters");
  const searchQuery = searchParams.get("q") ?? "";

  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearchInput = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  useEffect(() => {
    if (debouncedSearchInput !== searchQuery) replaceSearchParam(setSearchParams, "q", debouncedSearchInput);
  }, [debouncedSearchInput, searchQuery, setSearchParams]);

  const filters =
    filtersParam === null
      ? DEFAULT_FILTERS
      : ARTWORK_FILTERS.filter((filter) => filtersParam.split(",").includes(filter));

  return {
    searchInput,
    setSearchInput,
    searchQuery,
    filters,
    setFilters: (newFilters: ArtworkFilter[]) => replaceSearchParam(setSearchParams, "filters", newFilters.join(",")),
  };
}
