export interface ArtworkLocation {
  label: string;
  longitude: number;
  latitude: number;
  basis: "country" | "culture";
  basisValue: string;
}
