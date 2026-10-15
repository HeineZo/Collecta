import { Label, ListBox, Select } from "@heroui/react";
import type { Department } from "../models/Department";

const ALL_DEPARTMENTS = "all";

interface DepartmentSelectProps {
  departments: Department[];
  // Null for all departments.
  value: number | null;
  onChange: (departmentId: number | null) => void;
  className?: string;
}

export function DepartmentSelect({ departments, value, onChange, className = "" }: DepartmentSelectProps) {
  return (
    <Select
      className={`department-select w-full ${className}`}
      value={value ?? ALL_DEPARTMENTS}
      onChange={(key) => key !== null && onChange(key === ALL_DEPARTMENTS ? null : Number(key))}
    >
      <Label>Department</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id={ALL_DEPARTMENTS} textValue="All departments">
            All departments
            <ListBox.ItemIndicator />
          </ListBox.Item>
          {departments.map((department) => (
            <ListBox.Item key={department.departmentId} id={department.departmentId} textValue={department.displayName}>
              {department.displayName}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
