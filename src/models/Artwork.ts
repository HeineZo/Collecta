import type { ArtworkTag } from "./ArtworkTag";

export interface Artwork {
  objectID: number;
  title: string;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  isHighlight: boolean;
  GalleryNumber: string;
  department: string;
  culture: string;
  country: string;
  objectDate: string;
  objectEndDate: number;
  period: string;
  medium: string;
  classification: string;
  dimensions: string;
  accessionNumber: string;
  creditLine: string;
  tags: ArtworkTag[] | null;
  objectURL: string;
}
