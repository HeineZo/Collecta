import { useNavigate } from "react-router";
import { formatNumber } from "../../lib/formatNumber";
import { pluralize } from "../../lib/pluralize";
import type { DepartmentWithTotal } from "../../models/DepartmentWithTotal";
import { MonoTileTreemap } from "../ui/mono-tile-treemap";

export function DepartmentTreemap({ departments }: { departments: DepartmentWithTotal[] }) {
  const navigate = useNavigate();
  return (
    <MonoTileTreemap
      className="department-treemap"
      title="Weight of each department"
      summary={`${departments.length} ${pluralize(departments.length, "department")}`}
      tiles={departments.map((department) => ({
        id: department.departmentId,
        name: department.displayName,
        value: department.totalWorks,
      }))}
      formatValue={formatNumber}
      onTileClick={(tile) => navigate(`/departments/${tile.id}`)}
    />
  );
}
