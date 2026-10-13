import { Breadcrumbs, Button, ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { Skeleton } from "boneyard-js/react";
import { Star } from "lucide-react";
import { type ReactNode, useState, useSyncExternalStore } from "react";
import { useParams } from "react-router";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { fetchDepartments, fetchDepartmentTotal, searchDepartmentObjects } from "../api/departmentsApi";
import { AppLayout } from "../components/AppLayout";
import { ArtworkCard } from "../components/ArtworkCard";
import { ErrorState } from "../components/ErrorState";
import { SearchBar } from "../components/SearchBar";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import type { ArtworkFilter } from "../models/ArtworkFilter";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 400;
const SKELETON_IMAGE_RATIOS = ["2 / 3", "4 / 5", "5 / 4", "4 / 5", "3 / 2", "2 / 3", "3 / 4", "1 / 1"];

const numberFormat = new Intl.NumberFormat("en-US");

export function DepartmentArtworksPage() {
  const departmentId = Number(useParams().departmentId);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebouncedValue(searchQuery, SEARCH_DEBOUNCE_MS);
  const [filters, setFilters] = useState<ArtworkFilter[]>(["isHighlight"]);

  const departmentsQuery = useSWR("departments", fetchDepartments);
  const departmentName = departmentsQuery.data?.find((department) => department.departmentId === departmentId)?.displayName;
  const totalWorksQuery = useSWR(["department-total", departmentId], () => fetchDepartmentTotal(departmentId));
  const onViewQuery = useSWR(["department-on-view", departmentId], () =>
    searchDepartmentObjects(departmentId, { filters: ["isOnView"], limit: 1 }),
  );
  const totalWorks = totalWorksQuery.data;
  const onView = onViewQuery.data;

  const artworksQuery = useSWRInfinite(
    (pageIndex) => ["department-artworks", departmentId, debouncedSearchQuery, filters, pageIndex] as const,
    ([, , query, activeFilters, pageIndex]) =>
      searchDepartmentObjects(departmentId, {
        searchQuery: query,
        filters: activeFilters,
        offset: pageIndex * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
    { revalidateFirstPage: false },
  );
  const pages = artworksQuery.data;
  const objectIds = pages?.flatMap((page) => page.objectIDs ?? []) ?? [];
  const resultCount = pages?.[0].total ?? 0;
  const isLoadingMore = artworksQuery.isLoading || (pages !== undefined && pages.length < artworksQuery.size);

  const queries = [departmentsQuery, totalWorksQuery, onViewQuery, artworksQuery];
  const hasError = queries.some((query) => query.error);
  const retry = () => queries.forEach((query) => void query.mutate());

  return (
    <AppLayout>
      <Breadcrumbs className="department-artworks__breadcrumbs">
        <Breadcrumbs.Item href="/">Departments</Breadcrumbs.Item>
        <Breadcrumbs.Item>{departmentName}</Breadcrumbs.Item>
      </Breadcrumbs>

      <section className="department-artworks__hero mt-6 flex flex-col gap-3 md:mt-10">
        <h1 className="min-h-[1lh] text-[42px] leading-[1.02] tracking-[-0.035em] md:text-[64px]">{departmentName}</h1>
        <p className="min-h-[1lh] text-[15px] text-muted md:text-[17px]">
          {totalWorks !== undefined &&
            onView &&
            `${numberFormat.format(totalWorks)} works · ${numberFormat.format(onView.total)} on view`}
        </p>
      </section>

      <section className="department-artworks__controls mt-6 flex flex-wrap items-center gap-4 md:mt-9">
        <SearchBar
          label={`Search in ${departmentName ?? "this department"}`}
          value={searchQuery}
          onChange={setSearchQuery}
          className="flex-[1_1_320px] md:max-w-[420px]"
        />
        <ToggleButtonGroup
          aria-label="Filter artworks"
          selectionMode="multiple"
          isDetached
          selectedKeys={filters}
          onSelectionChange={(keys) => setFilters([...keys] as ArtworkFilter[])}
        >
          <ToggleButton id="isHighlight">
            <Star aria-hidden className="size-3.5" />
            Highlights
          </ToggleButton>
          <ToggleButton id="isOnView">On view</ToggleButton>
          <ToggleButton id="hasImages">With images</ToggleButton>
        </ToggleButtonGroup>
        <p aria-live="polite" className="text-sm text-muted md:ml-auto">
          {pages && `${numberFormat.format(resultCount)} works`}
        </p>
      </section>

      <section aria-label="Artworks" className="department-artworks__results mt-6 md:mt-8">
        {hasError ? (
          <ErrorState message="The Met collection could not be reached." onRetry={retry} />
        ) : (
          <Skeleton name="artwork-grid" loading={!pages} fixture={<ArtworkGridFixture />} select="viewport">
            {pages &&
              (objectIds.length > 0 ? (
                <MasonryGrid
                  items={objectIds.map((objectId) => (
                    <ArtworkCard key={objectId} objectId={objectId} />
                  ))}
                />
              ) : (
                <p className="department-artworks__empty text-muted">No artwork matches these filters.</p>
              ))}
          </Skeleton>
        )}
        {objectIds.length < resultCount && (
          <div className="department-artworks__more mt-4 flex justify-center">
            <Button
              variant="outline"
              isPending={isLoadingMore}
              onPress={() => void artworksQuery.setSize(artworksQuery.size + 1)}
            >
              Load more
            </Button>
          </div>
        )}
      </section>
    </AppLayout>
  );
}

function ArtworkGridFixture() {
  return (
    <MasonryGrid
      items={SKELETON_IMAGE_RATIOS.map((aspectRatio, index) => (
        <div key={index} className="mb-5 md:mb-7">
          <div className="rounded-[20px]" style={{ aspectRatio }} />
          <div className="mt-3 h-4 w-4/5 rounded-full" />
          <div className="mt-2 h-3.5 w-1/2 rounded-full" />
        </div>
      ))}
    />
  );
}

function MasonryGrid({ items }: { items: ReactNode[] }) {
  const columnCount = useColumnCount();
  const columns = Array.from({ length: columnCount }, (_, column) =>
    items.filter((_, index) => index % columnCount === column),
  );
  return (
    <div className="department-artworks__grid flex items-start gap-3 md:gap-5">
      {columns.map((column, index) => (
        <div key={index} className="department-artworks__column flex min-w-0 flex-1 flex-col">
          {column}
        </div>
      ))}
    </div>
  );
}

// Same breakpoints as Tailwind's md (48rem) and lg (64rem).
function useColumnCount() {
  return useSyncExternalStore(subscribeToResize, () =>
    window.matchMedia("(min-width: 64rem)").matches ? 4 : window.matchMedia("(min-width: 48rem)").matches ? 3 : 2,
  );
}

function subscribeToResize(onResize: () => void) {
  window.addEventListener("resize", onResize);
  return () => window.removeEventListener("resize", onResize);
}
