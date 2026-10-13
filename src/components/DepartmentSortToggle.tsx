import { ToggleButton, ToggleButtonGroup } from "@heroui/react";
import type { DepartmentSortOrder } from "../models/DepartmentSortOrder";

interface DepartmentSortToggleProps {
  value: DepartmentSortOrder;
  onChange: (sortOrder: DepartmentSortOrder) => void;
}

export function DepartmentSortToggle({ value, onChange }: DepartmentSortToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label="Sort departments"
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => onChange([...keys][0] as DepartmentSortOrder)}
    >
      <ToggleButton id="most-works">Most works</ToggleButton>
      <ToggleButton id="alphabetical">A–Z</ToggleButton>
    </ToggleButtonGroup>
  );
}
