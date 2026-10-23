import { Chip } from "@heroui/react";
import type { ArtworkTag } from "../../models/ArtworkTag";
import { InfoSection } from "../common/InfoSection";

export function ArtworkTags({ tags }: { tags: ArtworkTag[] | null }) {
  if (!tags?.length) return null;

  return (
    <InfoSection title="Tags" className="artwork-tags">
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag.term}>
            <Chip>{tag.term}</Chip>
          </li>
        ))}
      </ul>
    </InfoSection>
  );
}
