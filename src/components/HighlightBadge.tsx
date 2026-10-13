import { Chip } from "@heroui/react";
import { Star } from "lucide-react";

export function HighlightBadge() {
  return (
    <Chip className="highlight-badge bg-(--highlight-background) text-(--highlight)">
      <Star aria-hidden fill="currentColor" className="size-3.5" />
      Highlight
    </Chip>
  );
}
