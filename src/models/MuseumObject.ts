import type { ObjectTag } from "./ObjectTag";

export interface MuseumObject {
  objectID: number;
  title: string;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  isHighlight: boolean;
  GalleryNumber: string;
  department: string;
  culture: string;
  objectDate: string;
  period: string;
  medium: string;
  classification: string;
  dimensions: string;
  accessionNumber: string;
  creditLine: string;
  tags: ObjectTag[] | null;
  objectURL: string;
}
