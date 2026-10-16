import { Button, Chip, Dropdown } from "@heroui/react";
import { Eye, ImageIcon, SlidersHorizontal, Star } from "lucide-react";
import type { ArtworkFilter } from "../models/ArtworkFilter";

interface ArtworkFiltersProps {
  value: ArtworkFilter[];
  onChange: (filters: ArtworkFilter[]) => void;
}

export function ArtworkFilters({ value, onChange }: ArtworkFiltersProps) {
  return (
    <Dropdown>
      <Button
        variant="tertiary"
        aria-label={value.length > 0 ? `Filters, ${value.length} active` : "Filters"}
        className="artwork-filters shrink-0 [--button-fg:var(--default-foreground)]"
      >
        <SlidersHorizontal aria-hidden className="size-4" />
        Filters
        {value.length > 0 && (
          <Chip aria-hidden size="sm" color="accent" variant="primary">
            {value.length}
          </Chip>
        )}
      </Button>
      <Dropdown.Popover placement="bottom end" className="min-w-56">
        <Dropdown.Menu
          aria-label="Filter artworks"
          selectionMode="multiple"
          selectedKeys={value}
          onSelectionChange={(keys) => onChange([...keys] as ArtworkFilter[])}
        >
          <Dropdown.Item id="isHighlight" textValue="Highlights">
            <Star aria-hidden className="size-4" />
            Highlights
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="isOnView" textValue="On view">
            <Eye aria-hidden className="size-4" />
            On view
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
          <Dropdown.Item id="hasImages" textValue="With images">
            <ImageIcon aria-hidden className="size-4" />
            With images
            <Dropdown.ItemIndicator />
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
