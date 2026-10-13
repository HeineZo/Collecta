import type { Department } from "./Department";

export interface DepartmentWithTotal extends Department {
  totalWorks: number;
}
