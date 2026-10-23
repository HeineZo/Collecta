import { useParams } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { ArtworkFilters } from "../components/ArtworkFilters";
import { ArtworkGrid } from "../components/ArtworkGrid";
import { DepartmentArtworksHero } from "../components/DepartmentArtworksHero";
import { ErrorState } from "../components/ErrorState";
import { LoadMoreButton } from "../components/LoadMoreButton";
import { ResultCount } from "../components/ResultCount";
import { SearchBar } from "../components/SearchBar";
import { useArtworkSearchParams } from "../hooks/useArtworkSearchParams";
import { useDepartmentArtworks } from "../hooks/useDepartmentArtworks";
import { useDepartmentSummary } from "../hooks/useDepartmentSummary";
import { useScrollIntoViewOnChange } from "../hooks/useScrollIntoViewOnChange";
import { formatNumber } from "../lib/formatNumber";

export function DepartmentArtworksPage() {
  const departmentId = Number(useParams().departmentId);
  const { searchInput, setSearchInput, searchQuery, filters, setFilters } = useArtworkSearchParams();

  const department = useDepartmentSummary(departmentId);
  const artworks = useDepartmentArtworks(departmentId, searchQuery, filters);
  const resultsRef = useScrollIntoViewOnChange<HTMLElement>(`${searchQuery}|${filters.join(",")}`);
  const retry = () => {
    department.retry();
    artworks.retry();
  };

  return (
    <AppLayout isDark>
      <DepartmentArtworksHero
        departmentId={departmentId}
        title={department.name}
        description={
          department.name && department.totalWorks !== undefined && department.onViewCount !== undefined
            ? `${formatNumber(department.totalWorks)} works · ${formatNumber(department.onViewCount)} on view`
            : undefined
        }
        search={
          <SearchBar
            label={`Search in ${department.name ?? "this department"}`}
            value={searchInput}
            onChange={setSearchInput}
            size="lg"
          />
        }
        filters={<ArtworkFilters value={filters} onChange={setFilters} />}
      />

      <section
        ref={resultsRef}
        aria-label="Artworks"
        className="department-artworks__results mt-10 scroll-mt-24 min-h-svh pb-20 md:mt-16 md:pb-8"
      >
        {department.isUnknown ? (
          <p className="department-artworks__not-found text-muted">This department does not exist.</p>
        ) : (
          <>
            <ResultCount count={artworks.objectIds && artworks.resultCount} noun="works" className="mb-6 md:mb-8" />
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
          </>
        )}
      </section>
    </AppLayout>
  );
}
