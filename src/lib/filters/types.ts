export type FilterType = "tag" | "option" | "price" | "collection";

export type FilterValue = {
  type: FilterType;
  key: string;
  value: string;
  label: string;
};

export type PriceRange = {
  min?: number;
  max?: number;
};

export type ActiveFilters = {
  tags: string[];
  options: Record<string, string[]>; // option name -> values
  price?: PriceRange;
  collections: string[];
};

export type FilterOption = {
  value: string;
  label: string;
  count?: number;
};

export type FilterGroup = {
  id: string;
  label: string;
  type: FilterType;
  options: FilterOption[];
  isOpen?: boolean;
};

