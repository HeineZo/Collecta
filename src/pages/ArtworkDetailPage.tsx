import { useParams } from "react-router";
import { AppLayout } from "../components/layout/AppLayout";
import { ArtworkDetailView } from "../components/artwork/ArtworkDetailView";
import { ErrorState } from "../components/common/ErrorState";
import { PageBreadcrumbs } from "../components/layout/PageBreadcrumbs";
import { useArtwork } from "../hooks/useArtwork";

export function ArtworkDetailPage() {
  const { departmentId, artworkId } = useParams();
  const artworkQuery = useArtwork(Number(artworkId));
  const artwork = artworkQuery.data;

  return (
    <AppLayout title={artwork?.title}>
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
