import type { MuseumObject } from "../models/MuseumObject";
import { fetchJson } from "./metMuseumClient";

export function fetchMuseumObject(objectId: number): Promise<MuseumObject> {
  return fetchJson<MuseumObject>(`/v1/objects/${objectId}`);
}
