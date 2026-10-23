import { MapPin } from "lucide-react";
import type { ArtworkLocation } from "../../models/ArtworkLocation";
import { Map as BaseMap, MapMarker, MarkerContent } from "../ui/map";

const ORIGIN_ZOOM = 4;

export function ArtworkOriginMap({ location }: { location: ArtworkLocation }) {
  return (
    <div className="artwork-origin-map relative h-[200px] overflow-hidden rounded-3xl md:h-[240px]">
      <BaseMap center={[location.longitude, location.latitude]} zoom={ORIGIN_ZOOM} interactive={false}>
        <MapMarker longitude={location.longitude} latitude={location.latitude}>
          <MarkerContent className="cursor-default">
            <span className="artwork-origin-map__pin relative block size-4 rounded-full bg-accent shadow-[0_0_0_10px_color-mix(in_srgb,var(--accent)_18%,transparent),0_0_0_22px_color-mix(in_srgb,var(--accent)_8%,transparent)]">
              <span aria-hidden className="absolute inset-0 animate-echo rounded-full bg-accent motion-reduce:hidden" />
              <span
                aria-hidden
                className="absolute inset-0 animate-echo rounded-full bg-accent [animation-delay:1.2s] motion-reduce:hidden"
              />
            </span>
          </MarkerContent>
        </MapMarker>
      </BaseMap>
      <span className="artwork-origin-map__label absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3.5 py-1.5 text-sm text-white backdrop-blur-md">
        <MapPin aria-hidden className="size-4" strokeWidth={1.8} />
        {location.label}
      </span>
    </div>
  );
}
