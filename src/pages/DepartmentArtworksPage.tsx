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
import { formatNumber } from "../lib/formatNumber";

export function DepartmentArtworksPage() {
  const departmentId = Number(useParams().departmentId);
  const { searchInput, setSearchInput, searchQuery, filters, setFilters } = useArtworkSearchParams();

  const department = useDepartmentSummary(departmentId);
  const artworks = useDepartmentArtworks(departmentId, searchQuery, filters);
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
          department.totalWorks !== undefined && department.onViewCount !== undefined
            ? `${formatNumber(department.totalWorks)} works · ${formatNumber(department.onViewCount)} on view`
            : undefined
        }
        search={
          <SearchBar
            label={`Search in ${department.name ?? "this department"}`}
            value={searchInput}
            onChange={setSearchInput}
          />
        }
        filters={<ArtworkFilters value={filters} onChange={setFilters} />}
      />

      {/* At least a screen tall so few results never scroll the docked controls away while typing. */}
      <section aria-label="Artworks" className="department-artworks__results mt-10 min-h-svh pb-20 md:mt-16 md:pb-8">
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
      </section>
    </AppLayout>
  );
}
