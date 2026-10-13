import { useState } from "react";
import { useParams } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { ArtworkFilters } from "../components/ArtworkFilters";
import { ArtworkGrid } from "../components/ArtworkGrid";
import { ErrorState } from "../components/ErrorState";
import { LoadMoreButton } from "../components/LoadMoreButton";
import { PageBreadcrumbs } from "../components/PageBreadcrumbs";
import { PageHeader } from "../components/PageHeader";
import { SearchBar } from "../components/SearchBar";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useDepartmentArtworks } from "../hooks/useDepartmentArtworks";
import { useDepartmentSummary } from "../hooks/useDepartmentSummary";
import { formatNumber } from "../lib/formatNumber";
import type { ArtworkFilter } from "../models/ArtworkFilter";

const SEARCH_DEBOUNCE_MS = 400;

export function DepartmentArtworksPage() {
  const departmentId = Number(useParams().departmentId);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const [filters, setFilters] = useState<ArtworkFilter[]>(["isHighlight"]);

  const department = useDepartmentSummary(departmentId);
  const artworks = useDepartmentArtworks(departmentId, debouncedSearchQuery, filters);
  const retry = () => {
    department.retry();
    artworks.retry();
  };

  return (
    <AppLayout>
      <PageBreadcrumbs links={[{ label: "Departments", href: "/" }, { label: department.name }]} />

      <PageHeader
        title={department.name}
        description={
          department.totalWorks !== undefined && department.onViewCount !== undefined
            ? `${formatNumber(department.totalWorks)} works · ${formatNumber(department.onViewCount)} on view`
            : undefined
        }
      />

      <section className="department-artworks__controls mt-6 flex flex-wrap items-center gap-4 md:mt-9">
        <SearchBar
          label={`Search in ${department.name ?? "this department"}`}
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-[1_1_320px] md:max-w-[420px]"
        />
        <ArtworkFilters value={filters} onChange={setFilters} />
        <p aria-live="polite" className="text-sm text-muted md:ml-auto">
          {artworks.objectIds && `${formatNumber(artworks.resultCount)} works`}
        </p>
      </section>

      <section aria-label="Artworks" className="department-artworks__results mt-6 md:mt-8">
        {department.hasError || artworks.hasError ? (
          <ErrorState message="The Met collection could not be reached." onRetry={retry} />
        ) : (
          <ArtworkGrid objectIds={artworks.objectIds} emptyMessage="No artwork matches these filters." />
        )}
        {artworks.hasMore && (
          <LoadMoreButton
            onLoadMore={artworks.loadMore}
            isLoading={artworks.isLoadingMore}
            autoLoad={artworks.canAutoLoad}
          />
        )}
      </section>
    </AppLayout>
  );
}
