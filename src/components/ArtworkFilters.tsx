import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import { Star } from "lucide-react";
import type { ArtworkFilter } from "../models/ArtworkFilter";

interface ArtworkFiltersProps {
  value: ArtworkFilter[];
  onChange: (filters: ArtworkFilter[]) => void;
}

export function ArtworkFilters({ value, onChange }: ArtworkFiltersProps) {
  return (
    <ToggleButtonGroup
      aria-label="Filter artworks"
      selectionMode="multiple"
      isDetached
      selectedKeys={value}
      onSelectionChange={(keys) => onChange([...keys] as ArtworkFilter[])}
    >
      <ToggleButton id="isHighlight">
        <Star aria-hidden className="size-3.5" />
        Highlights
      </ToggleButton>
      <ToggleButton id="isOnView">On view</ToggleButton>
      <ToggleButton id="hasImages">With images</ToggleButton>
    </ToggleButtonGroup>
  );
}
