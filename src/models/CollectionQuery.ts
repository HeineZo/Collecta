// Filters of the v1.1 search endpoint; `dateBegin`/`dateEnd` keep works whose whole dating falls inside the range.
export interface CollectionQuery {
  q?: string;
  departmentId?: number;
  isHighlight?: boolean;
  isOnView?: boolean;
  hasImages?: boolean;
  dateBegin?: number;
  dateEnd?: number;
}
