import { AppLayout } from "../components/AppLayout";
import { CollectionKeyFigures } from "../components/CollectionKeyFigures";
import { CollectionPeriodsChart } from "../components/CollectionPeriodsChart";
import { DepartmentInsights } from "../components/DepartmentInsights";
import { DepartmentSelect } from "../components/DepartmentSelect";
import { DepartmentTreemap } from "../components/DepartmentTreemap";
import { ErrorState } from "../components/ErrorState";
import { PageHeader } from "../components/PageHeader";
import { useCollectionOverview } from "../hooks/useCollectionOverview";
import { useDepartmentsWithTotals } from "../hooks/useDepartmentsWithTotals";
import { useSelectedDepartmentParam } from "../hooks/useSelectedDepartmentParam";
import { staleClass } from "../lib/staleClass";

export function InsightsPage() {
  const { departmentId, setDepartmentId } = useSelectedDepartmentParam();
  const departments = useDepartmentsWithTotals();
  const selectedDepartment = departments.departments?.find((department) => department.departmentId === departmentId);
  const selectedId = departments.departments ? (selectedDepartment?.departmentId ?? null) : departmentId;
  const keyFigures = useCollectionOverview(selectedId);
  const retry = () => {
    departments.retry();
    keyFigures.retry();
  };

  return (
    <AppLayout>
      <section className="insights__hero flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
        <PageHeader title="Insights" description="How the Met collection is spread across time and departments." />
        {departments.departments && (
          <DepartmentSelect
            departments={departments.departments}
            value={selectedId}
            onChange={setDepartmentId}
            className="md:max-w-[300px]"
          />
        )}
      </section>

      <section aria-label="Charts" className="insights__charts mt-8 flex flex-col gap-3 md:mt-12 md:gap-4">
        {departments.hasError || keyFigures.hasError ? (
          <ErrorState message="The Met collection could not be reached." onRetry={retry} />
        ) : (
          <>
            <div className={staleClass(keyFigures.isRefreshing)}>
              <CollectionKeyFigures overview={keyFigures.overview} departmentId={selectedId ?? undefined} />
            </div>
            {selectedDepartment ? (
              <DepartmentInsights departmentId={selectedDepartment.departmentId} />
            ) : (
              <>
                <CollectionPeriodsChart />
                {departments.departments && <DepartmentTreemap departments={departments.departments} />}
              </>
            )}
          </>
        )}
      </section>
    </AppLayout>
  );
}
