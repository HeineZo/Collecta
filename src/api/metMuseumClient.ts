import { withRequestSlot } from "./requestQueue";

const API_BASE_URL = "https://collectionapi.metmuseum.org/public/collection";

export async function fetchJson<T>(path: string): Promise<T> {
  return withRequestSlot(async () => {
    const response = await fetch(`${API_BASE_URL}${path}`);
    if (!response.ok) throw new Error(`Met Museum API error ${response.status} on ${path}`);
    return response.json() as Promise<T>;
  });
}
