import type { Artwork } from "../models/Artwork";
import type { Department } from "../models/Department";

const DEPARTMENTS: Department[] = [
  { departmentId: 10, displayName: "Egyptian Art" },
  { departmentId: 11, displayName: "European Paintings" },
  { departmentId: 13, displayName: "Greek and Roman Art" },
];

function artwork(fields: Pick<Artwork, "objectID" | "title" | "department"> & Partial<Artwork>): Artwork {
  return {
    primaryImage: "",
    primaryImageSmall: "",
    additionalImages: [],
    isHighlight: false,
    GalleryNumber: "",
    culture: "",
    country: "",
    objectDate: "",
    objectEndDate: 0,
    period: "",
    medium: "",
    classification: "",
    dimensions: "",
    accessionNumber: "",
    creditLine: "",
    tags: null,
    objectURL: `https://www.metmuseum.org/art/collection/search/${fields.objectID}`,
    ...fields,
  };
}

const withImage = (objectID: number) => ({
  primaryImage: `https://images.metmuseum.org/original/${objectID}.jpg`,
  primaryImageSmall: `https://images.metmuseum.org/web-large/${objectID}.jpg`,
});

const ARTWORKS_BY_DEPARTMENT: Record<number, Artwork[]> = {
  10: [
    artwork({ objectID: 201, title: "Seated Statue of Hatshepsut", department: "Egyptian Art", isHighlight: true, GalleryNumber: "115", ...withImage(201) }),
    artwork({ objectID: 202, title: "Scarab", department: "Egyptian Art", ...withImage(202) }),
  ],
  11: [
    artwork({
      objectID: 101,
      title: "Wheat Field with Cypresses",
      department: "European Paintings",
      isHighlight: true,
      GalleryNumber: "822",
      objectDate: "1889",
      medium: "Oil on canvas",
      classification: "Paintings",
      accessionNumber: "1993.132",
      ...withImage(101),
    }),
    artwork({ objectID: 102, title: "The Harvesters", department: "European Paintings", isHighlight: true, ...withImage(102) }),
    artwork({ objectID: 103, title: "Study of a Tree", department: "European Paintings" }),
  ],
  13: [artwork({ objectID: 301, title: "Marble Head", department: "Greek and Roman Art" })],
};

const ARTWORKS = Object.values(ARTWORKS_BY_DEPARTMENT).flat();

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

export async function fakeMetFetch(input: RequestInfo | URL): Promise<Response> {
  const url = new URL(String(input));
  const path = url.pathname.replace("/public/collection", "");

  if (path === "/v1/departments") return json({ departments: DEPARTMENTS });

  const objectId = path.match(/^\/v1\/objects\/(\d+)$/)?.[1];
  if (objectId) {
    const found = ARTWORKS.find((candidate) => candidate.objectID === Number(objectId));
    return found ? json(found) : json({ message: "Not a valid object" }, 404);
  }

  if (path === "/v1.1/search") {
    const params = url.searchParams;
    const departmentId = params.get("departmentId");
    const query = params.get("q") ?? "*";
    const matches = (departmentId ? (ARTWORKS_BY_DEPARTMENT[Number(departmentId)] ?? []) : ARTWORKS).filter(
      (candidate) =>
        (params.get("isHighlight") !== "true" || candidate.isHighlight) &&
        (params.get("isOnView") !== "true" || candidate.GalleryNumber) &&
        (params.get("hasImages") !== "true" || candidate.primaryImage) &&
        (query === "*" || candidate.title.toLowerCase().includes(query.toLowerCase())),
    );
    const offset = Number(params.get("offset") ?? 0);
    const limit = Number(params.get("limit") ?? matches.length);
    const objectIDs = matches.slice(offset, offset + limit).map((candidate) => candidate.objectID);
    return json({ total: matches.length, objectIDs: objectIDs.length > 0 ? objectIDs : null });
  }

  throw new Error(`Unexpected request in tests: ${url}`);
}
