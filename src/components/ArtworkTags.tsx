import { Chip } from "@heroui/react";
import type { ObjectTag } from "../models/ObjectTag";
import { InfoSection } from "./InfoSection";

export function ArtworkTags({ tags }: { tags: ObjectTag[] | null }) {
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
