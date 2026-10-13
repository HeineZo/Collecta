import type { MuseumObject } from "../models/MuseumObject";
import { InfoSection } from "./InfoSection";

export function ArtworkFacts({ artwork }: { artwork: MuseumObject }) {
  const facts = [
    ["Period", artwork.period],
    ["Medium", artwork.medium],
    ["Classification", artwork.classification],
    // The Met lists every measurement on its own line; the first one is the overall size.
    ["Dimensions", artwork.dimensions.split(/\r?\n/)[0]],
    ["Accession no.", artwork.accessionNumber],
    ["Credit", artwork.creditLine],
  ].filter(([, value]) => value);
  if (facts.length === 0) return null;

  return (
    <InfoSection title="Details" className="artwork-facts">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-3xl bg-surface p-5 md:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:p-6">
        {facts.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-1">
            <dt className="text-[13px] text-muted">{label}</dt>
            <dd className="text-[15px] md:text-base">{value}</dd>
          </div>
        ))}
      </dl>
    </InfoSection>
  );
}
