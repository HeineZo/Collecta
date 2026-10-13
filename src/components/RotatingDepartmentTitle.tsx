import Scritto from "@scritto/react";
import { useMemo } from "react";
import { useRotatingValue } from "../hooks/useRotatingValue";

const ROTATION_MS = 3000;
const NAME_MAX_LENGTH = 16;
const TRANSITION = { duration: 550 };

export function RotatingDepartmentTitle({
  departmentNames,
}: {
  departmentNames: string[] | undefined;
}) {
  const shortNames = useMemo(
    () => departmentNames?.filter((name) => name.length <= NAME_MAX_LENGTH),
    [departmentNames],
  );
  const departmentName =
    useRotatingValue(shortNames, ROTATION_MS) ?? "Egyptian Art";

  return (
    <h1 className="rotating-department-title text-[44px] font-light leading-[1.02] tracking-[-0.035em] md:text-[76px]">
      Jump into
      <br />
      <Scritto
        value={departmentName}
        transition={TRANSITION}
        className="block whitespace-nowrap font-medium"
      />
    </h1>
  );
}
