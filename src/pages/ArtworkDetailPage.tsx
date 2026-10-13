import { useParams } from "react-router";
import { AppLayout } from "../components/AppLayout";
import { ArtworkDetailView } from "../components/ArtworkDetailView";
import { ErrorState } from "../components/ErrorState";
import { PageBreadcrumbs } from "../components/PageBreadcrumbs";
import { useMuseumObject } from "../hooks/useMuseumObject";

export function ArtworkDetailPage() {
  const { departmentId, objectId } = useParams();
  const artworkQuery = useMuseumObject(Number(objectId));
  const artwork = artworkQuery.data;

  return (
    <AppLayout>
      <PageBreadcrumbs
        links={[
          { label: "Departments", href: "/" },
          { label: artwork?.department, href: `/departments/${departmentId}` },
          { label: artwork?.title },
        ]}
      />

      {artworkQuery.error ? (
        <ErrorState
          message="This artwork could not be loaded from the Met collection."
          onRetry={() => void artworkQuery.mutate()}
        />
      ) : (
        <ArtworkDetailView artwork={artwork} />
      )}
    </AppLayout>
  );
}
